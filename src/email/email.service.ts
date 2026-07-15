import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendVerificationEmail(email: string, token: string) {
    const appUrl = this.configService.get<string>('APP_URL');
    const verficationUrl = `${appUrl}/api/auth/verify-email?token=${token}`;
    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e5e7eb;">
      <h1 style="font-size: 24px; color: #111827; margin-bottom: 16px;">Verify your email address</h1>
      <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 24px;">
        Thanks for signing up. Please confirm your email address by clicking the button below.
      </p>

      <a
        href="${verficationUrl}"
        style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 16px; font-weight: 600;"
      >
        Verify Email
      </a>

      <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 24px;">
        If the button does not work, copy and paste this link into your browser:
      </p>

      <p style="word-break: break-all; font-size: 14px; color: #2563eb;">
        ${verficationUrl}
      </p>
    </div>
  </div>
`;

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'verify email',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const appUrl = this.configService.get<string>('APP_URL');
    const resetUrl = `${appUrl}/api/auth/reset-password?token=${token}`;

    const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e5e7eb;">
        <h1 style="font-size: 24px; color: #111827; margin-bottom: 16px;">Reset your password</h1>
        <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 24px;">
          We received a request to reset your password. Click the button below to create a new one.
        </p>

        <a
          href="${resetUrl}"
          style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 16px; font-weight: 600;"
        >
          Reset Password
        </a>

        <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 24px;">
          If the button does not work, copy and paste this link into your browser:
        </p>

        <p style="word-break: break-all; font-size: 14px; color: #2563eb;">
          ${resetUrl}
        </p>
      </div>
    </div>
  `;

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html,
    });
  }
}
