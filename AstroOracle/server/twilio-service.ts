import twilio from 'twilio';

export class TwilioService {
  private client: any = null;
  private fromNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';

    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
    } else {
      console.warn('Twilio credentials not found. SMS functionality will be disabled.');
    }
  }

  async sendSMS(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.client) {
      console.log(`SMS would be sent to ${to}: ${message}`);
      return { 
        success: true, 
        messageId: 'dev-mode-' + Date.now(),
        error: 'Development mode - SMS not actually sent'
      };
    }

    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: to
      });

      return {
        success: true,
        messageId: result.sid
      };
    } catch (error: any) {
      console.error('Twilio SMS error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS'
      };
    }
  }

  async sendOTP(phoneNumber: string, countryCode: string, otp: string, purpose: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const fullNumber = `${countryCode}${phoneNumber}`;
    
    let message: string;
    switch (purpose) {
      case 'registration':
        message = `Welcome to Jai Guru Astro Remedy! Your registration OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`;
        break;
      case 'login':
        message = `Your Jai Guru Astro Remedy login OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`;
        break;
      case 'mobile_change':
        message = `Your mobile number change OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`;
        break;
      case 'recovery':
        message = `Your account recovery OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`;
        break;
      default:
        message = `Your Jai Guru Astro Remedy verification code is: ${otp}. Valid for 10 minutes.`;
    }

    return this.sendSMS(fullNumber, message);
  }

  async sendBookingConfirmation(phoneNumber: string, countryCode: string, details: {
    bookingId: string;
    consultationType: string;
    dateTime: string;
    astrologer: string;
    amount: number;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const fullNumber = `${countryCode}${phoneNumber}`;
    const message = `🌟 Booking Confirmed! 
ID: ${details.bookingId}
Type: ${details.consultationType}
Date: ${details.dateTime}
Astrologer: ${details.astrologer}
Amount: ₹${details.amount}
Thank you for choosing Jai Guru Astro Remedy!`;

    return this.sendSMS(fullNumber, message);
  }

  async sendPaymentConfirmation(phoneNumber: string, countryCode: string, details: {
    transactionId: string;
    amount: number;
    items: string[];
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const fullNumber = `${countryCode}${phoneNumber}`;
    const itemsList = details.items.slice(0, 2).join(', ') + (details.items.length > 2 ? ' +more' : '');
    
    const message = `💰 Payment Successful!
Transaction ID: ${details.transactionId}
Amount: ₹${details.amount}
Items: ${itemsList}
Thank you for your purchase at Jai Guru Astro Remedy!`;

    return this.sendSMS(fullNumber, message);
  }

  async sendConsultationReminder(phoneNumber: string, countryCode: string, details: {
    consultationType: string;
    dateTime: string;
    astrologer: string;
    meetingLink?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const fullNumber = `${countryCode}${phoneNumber}`;
    let message = `⏰ Consultation Reminder
Type: ${details.consultationType}
Date: ${details.dateTime}
Astrologer: ${details.astrologer}`;

    if (details.meetingLink) {
      message += `\nJoin: ${details.meetingLink}`;
    }

    message += '\nPrepare your questions. See you soon!';

    return this.sendSMS(fullNumber, message);
  }

  async sendCourseEnrollmentConfirmation(phoneNumber: string, countryCode: string, details: {
    courseName: string;
    startDate: string;
    duration: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const fullNumber = `${countryCode}${phoneNumber}`;
    const message = `📚 Course Enrollment Confirmed!
Course: ${details.courseName}
Start Date: ${details.startDate}
Duration: ${details.duration}
Welcome to your learning journey with Jai Guru Astro Remedy!`;

    return this.sendSMS(fullNumber, message);
  }

  isConfigured(): boolean {
    return this.client !== null;
  }
}

export const twilioService = new TwilioService();