import crypto from 'crypto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface PhonePeConfig {
  merchantId: string;
  saltKey: string;
  saltIndex: string;
  hostUrl: string;
}

export interface PaymentRequest {
  amount: number; // in paisa (100 = ₹1)
  merchantOrderId: string;
  merchantUserId: string;
  redirectUrl: string;
  callbackUrl: string;
  mobileNumber?: string;
  paymentInstrument?: {
    type: 'UPI_COLLECT' | 'UPI_INTENT' | 'UPI_QR' | 'CARD' | 'NET_BANKING' | 'PAY_PAGE';
    targetApp?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: 'PENDING' | 'COMPLETED' | 'FAILED';
    responseCode: string;
    paymentInstrument: {
      type: string;
      utr?: string;
    };
  };
}

export class PhonePePaymentService {
  private config: PhonePeConfig;

  constructor() {
    this.config = {
      merchantId: process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT',
      saltKey: process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
      saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
      hostUrl: process.env.PHONEPE_HOST_URL || 'https://api-preprod.phonepe.com/apis/hermes/pg/v1'
    };
  }

  private generateChecksum(payload: string, endpoint: string): string {
    const string = payload + endpoint + this.config.saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    return sha256 + '###' + this.config.saltIndex;
  }

  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const merchantTransactionId = paymentRequest.merchantOrderId || uuidv4();
      
      const payload = {
        merchantId: this.config.merchantId,
        merchantTransactionId,
        merchantUserId: paymentRequest.merchantUserId,
        amount: paymentRequest.amount,
        redirectUrl: paymentRequest.redirectUrl,
        redirectMode: 'POST',
        callbackUrl: paymentRequest.callbackUrl,
        mobileNumber: paymentRequest.mobileNumber,
        paymentInstrument: paymentRequest.paymentInstrument || {
          type: 'PAY_PAGE'
        }
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
      const endpoint = '/pg/v1/pay';
      const checksum = this.generateChecksum(base64Payload, endpoint);

      const response = await axios.post(
        `${this.config.hostUrl}${endpoint}`,
        {
          request: base64Payload
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'accept': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return {
          success: true,
          code: response.data.code,
          message: response.data.message,
          data: {
            ...response.data.data,
            merchantTransactionId,
            paymentUrl: response.data.data.instrumentResponse.redirectInfo.url
          }
        };
      } else {
        return {
          success: false,
          code: response.data.code,
          message: response.data.message
        };
      }
    } catch (error: any) {
      console.error('PhonePe payment creation error:', error);
      return {
        success: false,
        code: 'PAYMENT_ERROR',
        message: error.response?.data?.message || 'Payment initiation failed'
      };
    }
  }

  async verifyPayment(merchantTransactionId: string): Promise<PaymentResponse> {
    try {
      const endpoint = `/pg/v1/status/${this.config.merchantId}/${merchantTransactionId}`;
      const checksum = this.generateChecksum('', endpoint);

      const response = await axios.get(
        `${this.config.hostUrl}${endpoint}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': this.config.merchantId,
            'accept': 'application/json'
          }
        }
      );

      return {
        success: response.data.success,
        code: response.data.code,
        message: response.data.message,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('PhonePe payment verification error:', error);
      return {
        success: false,
        code: 'VERIFICATION_ERROR',
        message: error.response?.data?.message || 'Payment verification failed'
      };
    }
  }

  async processWebhook(payload: any, checksum: string): Promise<boolean> {
    try {
      // Verify webhook signature
      const expectedChecksum = crypto
        .createHash('sha256')
        .update(JSON.stringify(payload) + this.config.saltKey)
        .digest('hex') + '###' + this.config.saltIndex;

      if (checksum !== expectedChecksum) {
        console.error('Invalid webhook checksum');
        return false;
      }

      // Process webhook data
      console.log('PhonePe webhook received:', payload);
      return true;
    } catch (error) {
      console.error('PhonePe webhook processing error:', error);
      return false;
    }
  }
}

export const phonePeService = new PhonePePaymentService();