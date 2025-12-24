/**
 * OTP Service
 * Handles OTP generation, storage, and validation
 */

const { getDatabase } = require('../database');
const { smsService } = require('./sms.service');

interface OtpRecord {
  id: number;
  roll_number: string;
  mobile_number: string;
  otp: string;
  is_used: number;
  expires_at: Date;
  created_at: Date;
}

interface OtpResult {
  success: boolean;
  message?: string;
  error?: string;
  otp?: string;
}

class OtpService {
  private otpLength: number;
  private expiryMinutes: number;
  private rateLimitPerHour: number;

  constructor() {
    this.otpLength = parseInt(process.env.OTP_LENGTH || '6', 10);
    this.expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
    this.rateLimitPerHour = parseInt(process.env.OTP_RATE_LIMIT_PER_HOUR || '5', 10);
  }

  /**
   * Generate random OTP
   * @returns string - 6-digit OTP
   */
  generateOtp(): string {
    const min = Math.pow(10, this.otpLength - 1);
    const max = Math.pow(10, this.otpLength) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  /**
   * Check rate limit for OTP requests
   * @param rollNumber - Student roll number
   * @param mobileNumber - Mobile number
   * @returns Promise<boolean> - true if within limit
   */
  async checkRateLimit(rollNumber: string, mobileNumber: string): Promise<boolean> {
    try {
      const db = getDatabase('vmcTest');
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const [results] = await db.query(
        `SELECT COUNT(*) as count FROM student_otp 
         WHERE roll_number = ? AND mobile_number = ? 
         AND created_at > ? AND is_used = 0`,
        [rollNumber, mobileNumber, oneHourAgo]
      );

      const count = (results as any[])[0]?.count || 0;
      return count < this.rateLimitPerHour;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return false; // Fail closed for security
    }
  }

  /**
   * Store OTP in database
   * @param rollNumber - Student roll number
   * @param mobileNumber - Mobile number
   * @param otp - OTP value
   * @returns Promise<boolean>
   */
  async storeOtp(rollNumber: string, mobileNumber: string, otp: string): Promise<boolean> {
    try {
      const db = getDatabase('vmcTest');
      const expiresAt = new Date(Date.now() + this.expiryMinutes * 60 * 1000);

      await db.query(
        `INSERT INTO student_otp (roll_number, mobile_number, otp, expires_at, is_used) 
         VALUES (?, ?, ?, ?, 0)`,
        [rollNumber, mobileNumber, otp, expiresAt]
      );

      return true;
    } catch (error) {
      console.error('Store OTP error:', error);
      return false;
    }
  }

  /**
   * Send OTP to mobile number
   * @param rollNumber - Student roll number
   * @param mobileNumber - Mobile number
   * @returns Promise<OtpResult>
   */
  async sendOtp(rollNumber: string, mobileNumber: string): Promise<OtpResult> {
    try {
      // Validate mobile number
      if (!smsService?.isValidMobileNumber(mobileNumber)) {
        console.log('Invalid mobile number format');
        return {
          success: false,
          error: 'Invalid mobile number format',
        };
      }

      // Check rate limit
      const withinLimit = await this.checkRateLimit(rollNumber, mobileNumber);
      if (!withinLimit) {
        return {
          success: false,
          error: `Too many OTP requests. Please try again after some time.`,
        };
      }

      // Generate OTP
      const otp = this.generateOtp();

      // Store OTP in database
      const stored = await this.storeOtp(rollNumber, mobileNumber, otp);
      if (!stored) {
        return {
          success: false,
          error: 'Failed to store OTP',
        };
      }

      // Send SMS
      const smsResult = await smsService.sendOtp(mobileNumber, otp);
      if (!smsResult.success) {
        return {
          success: false,
          error: smsResult.error || 'Failed to send SMS',
        };
      }

      return {
        success: true,
        message: 'OTP sent successfully',
        // DO NOT return OTP in production - only for testing
        ...(process.env.NODE_ENV === 'development' && { otp }),
      };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP',
      };
    }
  }

  /**
   * Verify OTP
   * @param rollNumber - Student roll number
   * @param mobileNumber - Mobile number
   * @param otp - OTP to verify
   * @returns Promise<OtpResult>
   */
  async verifyOtp(rollNumber: string, mobileNumber: string, otp: string): Promise<OtpResult> {
    try {
      const db = getDatabase('vmcTest');
      const now = new Date();

      // Find valid, unused OTP
      const [results] = await db.query(
        `SELECT id, otp, expires_at FROM student_otp 
         WHERE roll_number = ? AND mobile_number = ? 
         AND is_used = 0 AND expires_at > ? 
         ORDER BY created_at DESC LIMIT 1`,
        [rollNumber, mobileNumber, now]
      );

      const records = results as OtpRecord[];
      if (!records || records.length === 0) {
        return {
          success: false,
          error: 'OTP not found or expired',
        };
      }

      const otpRecord = records[0];

      // Verify OTP
      if (otpRecord.otp !== otp) {
        return {
          success: false,
          error: 'OTP does not match',
        };
      }

      // Mark OTP as used
      await db.query(
        `UPDATE student_otp SET is_used = 1 WHERE id = ?`,
        [otpRecord.id]
      );

      return {
        success: true,
        message: 'OTP verified successfully',
      };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify OTP',
      };
    }
  }

  /**
   * Cleanup expired OTPs (can be called periodically)
   */
  async cleanupExpiredOtps(): Promise<void> {
    try {
      const db = getDatabase('vmcTest');
      await db.query(
        `DELETE FROM student_otp WHERE expires_at < NOW() OR is_used = 1`
      );
    } catch (error) {
      console.error('Cleanup expired OTPs error:', error);
    }
  }
}

const otpService = new OtpService();
export default otpService;
module.exports = otpService;

