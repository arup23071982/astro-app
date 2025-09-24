import { SES } from '@aws-sdk/client-ses';

export class EmailService {
  private ses: SES | null = null;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION || 'us-east-1';
    
    this.fromEmail = process.env.AWS_SES_FROM_EMAIL || 'noreply@jaiguruastroremedy.com';
    this.fromName = process.env.AWS_SES_FROM_NAME || 'Jai Guru Astro Remedy';

    if (accessKeyId && secretAccessKey) {
      this.ses = new SES({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey
        }
      });
    } else {
      console.warn('AWS SES credentials not found. Email functionality will be disabled.');
    }
  }

  async sendEmail(params: {
    to: string;
    subject: string;
    htmlBody: string;
    textBody?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.ses) {
      console.log(`Email would be sent to ${params.to}: ${params.subject}`);
      console.log('Body:', params.htmlBody);
      return { 
        success: true, 
        messageId: 'dev-mode-' + Date.now(),
        error: 'Development mode - Email not actually sent'
      };
    }

    try {
      const command = {
        Source: `${this.fromName} <${this.fromEmail}>`,
        Destination: {
          ToAddresses: [params.to]
        },
        Message: {
          Subject: {
            Data: params.subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: params.htmlBody,
              Charset: 'UTF-8'
            },
            Text: params.textBody ? {
              Data: params.textBody,
              Charset: 'UTF-8'
            } : undefined
          }
        }
      };

      const result = await this.ses.sendEmail(command);
      
      return {
        success: true,
        messageId: result.MessageId
      };
    } catch (error: any) {
      console.error('AWS SES email error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email'
      };
    }
  }

  async sendWelcomeEmail(email: string, fullName: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #ffffff; }
            .footer { padding: 20px; background: #f8f9fa; text-align: center; color: #666; }
            .neon-text { color: #ff6b35; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌟 Welcome to Jai Guru Astro Remedy!</h1>
            </div>
            <div class="content">
                <h2>Namaste ${fullName}!</h2>
                <p>Thank you for joining our astrological family. We're excited to guide you on your spiritual journey.</p>
                
                <h3>What's Available for You:</h3>
                <ul>
                    <li>🔮 <strong>Personal Consultations</strong> - Video, Audio, Chat & In-Person</li>
                    <li>📚 <strong>Astrology Courses</strong> - Learn from Expert Astrologer Arup Shastri</li>
                    <li>🏡 <strong>Home Tuition</strong> - One-to-one and Group Learning</li>
                    <li>🛍️ <strong>Remedial Products</strong> - Gemstones, Yantras, Books & More</li>
                </ul>
                
                <p>Your account is now active and ready to use. Start your journey by booking your first consultation.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'https://jaiguruastroremedy.com'}/consultations/book" 
                       style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                        Book Your First Consultation
                    </a>
                </div>
            </div>
            <div class="footer">
                <p>🙏 Thank you for choosing Jai Guru Astro Remedy</p>
                <p>For support, contact us at support@jaiguruastroremedy.com</p>
            </div>
        </div>
    </body>
    </html>`;

    const textBody = `Welcome to Jai Guru Astro Remedy!

Namaste ${fullName}!

Thank you for joining our astrological family. We're excited to guide you on your spiritual journey.

What's Available:
- Personal Consultations (Video, Audio, Chat & In-Person)
- Astrology Courses by Expert Astrologer Arup Shastri  
- Home Tuition (One-to-one and Group Learning)
- Remedial Products (Gemstones, Yantras, Books & More)

Your account is now active. Start by booking your first consultation.

Thank you for choosing Jai Guru Astro Remedy!
Support: support@jaiguruastroremedy.com`;

    return this.sendEmail({
      to: email,
      subject: '🌟 Welcome to Jai Guru Astro Remedy - Your Spiritual Journey Begins!',
      htmlBody,
      textBody
    });
  }

  async sendBookingConfirmationEmail(email: string, fullName: string, details: {
    bookingId: string;
    consultationType: string;
    dateTime: string;
    astrologer: string;
    amount: number;
    meetingLink?: string;
    paymentId: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #ffffff; }
            .booking-details { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .footer { padding: 20px; background: #f8f9fa; text-align: center; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Consultation Booking Confirmed!</h1>
            </div>
            <div class="content">
                <h2>Dear ${fullName},</h2>
                <p>Your consultation booking has been confirmed. We look forward to providing you with insightful guidance.</p>
                
                <div class="booking-details">
                    <h3>📋 Booking Details:</h3>
                    <p><strong>Booking ID:</strong> ${details.bookingId}</p>
                    <p><strong>Consultation Type:</strong> ${details.consultationType}</p>
                    <p><strong>Date & Time:</strong> ${details.dateTime}</p>
                    <p><strong>Astrologer:</strong> ${details.astrologer}</p>
                    <p><strong>Amount Paid:</strong> ₹${details.amount}</p>
                    <p><strong>Payment ID:</strong> ${details.paymentId}</p>
                    ${details.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${details.meetingLink}">${details.meetingLink}</a></p>` : ''}
                </div>
                
                <h3>📝 Preparation Guidelines:</h3>
                <ul>
                    <li>Have your birth details ready (Date, Time, Place of Birth)</li>
                    <li>Prepare specific questions you want to ask</li>
                    <li>Ensure stable internet connection for video/audio sessions</li>
                    <li>Join 5 minutes before the scheduled time</li>
                </ul>
                
                <p>You will receive a reminder 24 hours and 1 hour before your consultation.</p>
            </div>
            <div class="footer">
                <p>🙏 Thank you for choosing Jai Guru Astro Remedy</p>
                <p>For support, contact us at support@jaiguruastroremedy.com</p>
            </div>
        </div>
    </body>
    </html>`;

    return this.sendEmail({
      to: email,
      subject: `✅ Consultation Confirmed - ${details.consultationType} on ${details.dateTime}`,
      htmlBody
    });
  }

  async sendPaymentReceiptEmail(email: string, fullName: string, details: {
    transactionId: string;
    amount: number;
    items: Array<{ name: string; price: number; quantity: number }>;
    paymentMethod: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const itemsHtml = details.items.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    const subtotal = details.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = Math.round(subtotal * 0.18);

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #ffffff; }
            .receipt { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .footer { padding: 20px; background: #f8f9fa; text-align: center; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧾 Payment Receipt</h1>
            </div>
            <div class="content">
                <h2>Dear ${fullName},</h2>
                <p>Thank you for your purchase! Your payment has been processed successfully.</p>
                
                <div class="receipt">
                    <h3>💰 Payment Details:</h3>
                    <p><strong>Transaction ID:</strong> ${details.transactionId}</p>
                    <p><strong>Payment Method:</strong> ${details.paymentMethod}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                    
                    <table class="items-table">
                        <thead>
                            <tr style="background: #e9ecef;">
                                <th style="padding: 10px; text-align: left;">Item</th>
                                <th style="padding: 10px; text-align: right;">Price</th>
                                <th style="padding: 10px; text-align: center;">Qty</th>
                                <th style="padding: 10px; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                            <tr style="background: #f8f9fa;">
                                <td colspan="3" style="padding: 10px; font-weight: bold;">Subtotal:</td>
                                <td style="padding: 10px; text-align: right; font-weight: bold;">₹${subtotal}</td>
                            </tr>
                            <tr style="background: #f8f9fa;">
                                <td colspan="3" style="padding: 10px;">GST (18%):</td>
                                <td style="padding: 10px; text-align: right;">₹${gst}</td>
                            </tr>
                            <tr style="background: #ff6b35; color: white;">
                                <td colspan="3" style="padding: 10px; font-weight: bold;">Final Total:</td>
                                <td style="padding: 10px; text-align: right; font-weight: bold;">₹${details.amount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <p>Your order will be processed shortly. You'll receive updates on your order status.</p>
            </div>
            <div class="footer">
                <p>🙏 Thank you for choosing Jai Guru Astro Remedy</p>
                <p>For support, contact us at support@jaiguruastroremedy.com</p>
            </div>
        </div>
    </body>
    </html>`;

    return this.sendEmail({
      to: email,
      subject: `🧾 Payment Receipt - Transaction ${details.transactionId}`,
      htmlBody
    });
  }

  async sendConsultationReminderEmail(email: string, fullName: string, details: {
    consultationType: string;
    dateTime: string;
    astrologer: string;
    meetingLink?: string;
    reminderType: '24hours' | '1hour';
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const timeframe = details.reminderType === '24hours' ? '24 hours' : '1 hour';
    
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #ffffff; }
            .reminder-box { background: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .footer { padding: 20px; background: #f8f9fa; text-align: center; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⏰ Consultation Reminder</h1>
            </div>
            <div class="content">
                <h2>Dear ${fullName},</h2>
                <p>This is a friendly reminder that your consultation is scheduled in <strong>${timeframe}</strong>.</p>
                
                <div class="reminder-box">
                    <h3>📅 Session Details:</h3>
                    <p><strong>Type:</strong> ${details.consultationType}</p>
                    <p><strong>Date & Time:</strong> ${details.dateTime}</p>
                    <p><strong>Astrologer:</strong> ${details.astrologer}</p>
                    ${details.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${details.meetingLink}">${details.meetingLink}</a></p>` : ''}
                </div>
                
                <h3>📝 Before Your Session:</h3>
                <ul>
                    <li>Have your birth details ready (Date, Time, Place of Birth)</li>
                    <li>Prepare your questions in advance</li>
                    <li>Ensure stable internet connection</li>
                    <li>Find a quiet, private space for the session</li>
                    <li>Join 5 minutes early</li>
                </ul>
                
                ${details.reminderType === '1hour' ? 
                  '<p style="color: #dc3545; font-weight: bold;">⚠️ Your session starts in 1 hour! Please be ready to join.</p>' : 
                  '<p>We look forward to providing you with insightful guidance tomorrow.</p>'
                }
            </div>
            <div class="footer">
                <p>🙏 Thank you for choosing Jai Guru Astro Remedy</p>
                <p>For support, contact us at support@jaiguruastroremedy.com</p>
            </div>
        </div>
    </body>
    </html>`;

    return this.sendEmail({
      to: email,
      subject: `⏰ Consultation Reminder - ${timeframe} to go!`,
      htmlBody
    });
  }

  async sendCourseEnrollmentEmail(email: string, fullName: string, details: {
    courseName: string;
    startDate: string;
    duration: string;
    courseId: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #ffffff; }
            .course-box { background: #e7f3ff; border: 2px solid #007bff; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .footer { padding: 20px; background: #f8f9fa; text-align: center; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📚 Course Enrollment Confirmed!</h1>
            </div>
            <div class="content">
                <h2>Dear ${fullName},</h2>
                <p>Congratulations! You have successfully enrolled in our astrology course. Your learning journey begins soon!</p>
                
                <div class="course-box">
                    <h3>📖 Course Details:</h3>
                    <p><strong>Course:</strong> ${details.courseName}</p>
                    <p><strong>Start Date:</strong> ${details.startDate}</p>
                    <p><strong>Duration:</strong> ${details.duration}</p>
                    <p><strong>Course ID:</strong> ${details.courseId}</p>
                </div>
                
                <h3>🎯 What to Expect:</h3>
                <ul>
                    <li>Comprehensive study materials and resources</li>
                    <li>Expert guidance from Astrologer Arup Shastri</li>
                    <li>Practical exercises and assignments</li>
                    <li>Certificate upon successful completion</li>
                    <li>Lifetime access to course materials</li>
                </ul>
                
                <h3>📋 Next Steps:</h3>
                <ul>
                    <li>You'll receive course access details 1 day before start date</li>
                    <li>Prepare a notebook for taking notes</li>
                    <li>Join our student WhatsApp group for updates</li>
                </ul>
                
                <p>We're excited to have you on this transformative learning journey!</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'https://jaiguruastroremedy.com'}/courses/my-learning" 
                       style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                        View My Courses
                    </a>
                </div>
            </div>
            <div class="footer">
                <p>🙏 Thank you for choosing Jai Guru Astro Remedy</p>
                <p>For support, contact us at support@jaiguruastroremedy.com</p>
            </div>
        </div>
    </body>
    </html>`;

    return this.sendEmail({
      to: email,
      subject: `📚 Course Enrollment Confirmed - ${details.courseName}`,
      htmlBody
    });
  }

  isConfigured(): boolean {
    return this.ses !== null;
  }
}

export const emailService = new EmailService();