import { Resend } from 'resend';
import { RESEND_API_KEY } from '../env';
import { otpTemplate } from "./templates/otp.template";
import { resetPasswordTemplate } from "./templates/reset-password.template";

const resend = new Resend(RESEND_API_KEY);



class EmailService {
  async sendOtp(email: string, name: string | null, otp: string ) {
    return resend.emails.send({
      from: "NEXUS CRM <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email",
      html: otpTemplate(name, otp),
    });
  }

  async sendResetPassword(email: string, name: string | null , token: string) {
    return resend.emails.send({
      from: "NEXUS CRM <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: resetPasswordTemplate(name, token),
    });
  }
}


export const emailService = new EmailService();