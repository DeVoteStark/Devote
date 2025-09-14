import crypto from "crypto";

export class VerificationUtils {
  /**
   * Generate a 6-digit verification code
   */
  static generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Hash verification code for secure storage
   */
  static hashVerificationCode(code: string): string {
    return crypto.createHash("sha256").update(code).digest("hex");
  }

  /**
   * Verify if code matches the hashed version
   */
  static verifyCode(inputCode: string, hashedCode: string): boolean {
    const hashedInput = this.hashVerificationCode(inputCode);
    return hashedInput === hashedCode;
  }

  /**
   * Check if verification code has expired (5 hours)
   */
  static isCodeExpired(expirationDate: Date): boolean {
    return new Date() > expirationDate;
  }

  /**
   * Get expiration date (5 hours from now)
   */
  static getExpirationDate(): Date {
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 5);
    return expirationTime;
  }

  /**
   * Check rate limiting for email sending (max 1 email per hour)
   */
  static canSendEmail(lastSent: Date | null): boolean {
    if (!lastSent) return true;
    
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    return lastSent < oneHourAgo;
  }

  /**
   * Check if user has exceeded verification attempts (max 5 attempts)
   */
  static hasExceededAttempts(attempts: number): boolean {
    return attempts >= 5;
  }

  /**
   * Generate verification email template
   */
  static generateVerificationEmail(code: string, userName: string) {
    const subject = "Email Verification - Devote App";
    
    const text = `
Hello ${userName},

Welcome to Devote App! To complete your registration, please use the verification code below:

Verification Code: ${code}

This code will expire in 5 hours. If you didn't create an account, please ignore this email.

Best regards,
Devote Team
    `;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f7cf1d; color: #000; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .code-box { background-color: #fff; border: 2px solid #f7cf1d; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
    .code { font-size: 32px; font-weight: bold; color: #333; letter-spacing: 2px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
    .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Welcome to Devote App!</h1>
  </div>
  <div class="content">
    <h2>Hello ${userName},</h2>
    <p>Thank you for creating an account with Devote App. To complete your registration, please use the verification code below:</p>
    
    <div class="code-box">
      <div class="code">${code}</div>
    </div>
    
    <div class="warning">
      <strong>⚠️ Important:</strong> This verification code will expire in 5 hours.
    </div>
    
    <p>If you didn't create this account, please ignore this email and no account will be created.</p>
    
    <p>For security reasons, never share your verification code with anyone.</p>
  </div>
  <div class="footer">
    <p>Best regards,<br>The Devote Team</p>
  </div>
</body>
</html>
    `;

    return { subject, text, html };
  }
}