/**
 * SMS Service
 * Handles SMS sending via external API
 */

interface SmsConfig {
  apiUrl: string;
  apiUser: string;
  apiKey: string;
  senderId: string;
}

interface SmsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class SmsService {
  private config: SmsConfig;

  constructor() {
    this.config = {
      apiUrl: process.env.SMS_API_URL || 'http://foxxsms.net/sms//submitsms.jsp',
      apiUser: process.env.SMS_API_USER || 'VMCINF1',
      apiKey: process.env.SMS_API_KEY || 'df9e61553eXX',
      senderId: process.env.SMS_SENDER_ID || 'VMCINF',
    };
  }

  /**
   * Send OTP SMS to mobile number
   * @param mobileNumber - Mobile number (10 digits, without country code)
   * @param otp - 6-digit OTP
   * @returns Promise<SmsResponse>
   */
  async sendOtp(mobileNumber: string, otp: string): Promise<SmsResponse> {
    try {
      // Remove country code if present, ensure 10 digits
      const cleanMobile = mobileNumber.replace(/^91/, '').replace(/^\+91/, '');
      
      if (cleanMobile.length !== 10) {
        return {
          success: false,
          error: 'Invalid mobile number format',
        };
      }

      // Add country code
      const phoneWithCountryCode = `91${cleanMobile}`;
      
      // Create message template
      const message = `Dear Student, Your Login OTP is ${otp} Team VMC`;
      const encodedMessage = encodeURIComponent(message);

      // Build SMS API URL
      const url = `${this.config.apiUrl}?user=${this.config.apiUser}&key=${this.config.apiKey}&mobile=${phoneWithCountryCode}&message=${encodedMessage}&senderid=${this.config.senderId}&accusage=1`;

      // Send SMS via HTTP GET request
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`SMS API returned status ${response.status}`);
      }

      const responseText = await response.text();

      // In development/test mode, log the OTP instead of sending
      if (process.env.NODE_ENV === 'development' || process.env.SMS_MOCK === 'true') {
        console.log(`[SMS MOCK] OTP for ${phoneWithCountryCode}: ${otp}`);
        console.log(`[SMS MOCK] Message: ${message}`);
        return {
          success: true,
          message: 'OTP sent successfully (mocked)',
        };
      }

      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error: any) {
      console.error('SMS sending error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS',
      };
    }
  }

  /**
   * Validate mobile number format
   * @param mobileNumber - Mobile number to validate
   * @returns boolean
   */
  isValidMobileNumber(mobileNumber: string): boolean {
    const cleanMobile = mobileNumber.replace(/^91/, '').replace(/^\+91/, '');
    return /^[6-9]\d{9}$/.test(cleanMobile); // Indian mobile number format
  }
}

const smsService = new SmsService();
export default smsService;
module.exports = smsService;

