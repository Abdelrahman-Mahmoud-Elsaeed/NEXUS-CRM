import bcrypt from "bcrypt";
import { prisma } from "@config/db/prisma";
import { createUserQuery } from "@queries/auth/auth.queries";
import { userWithOrganizationsInclude } from "@queries/auth/auth.include";
import { CacheService } from "@/shared/services/cache.service";
import { emailService } from "@config/email/email.service";
import { ForgetPasswordResult, LoginRequestDto, LoginServiceResult, mapUser, RegisterRequistDto, RegisterServiceResult, RequestOtpResult, ResetPasswordResult, VerifyEmailResult } from "./auth.dto";
import { consumeResetToken, generateOtp, generateResetToken, hashToken, storeOtp, storeResetToken, verifyOtp } from "./auth.util";

export class AuthService {
  async register(data: RegisterRequistDto): Promise<RegisterServiceResult> {
    const hashed = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      return {
        success: false,
        reason: "EMAIL_IS_USED",
      };
    }

    const result = await prisma.user.create(createUserQuery(data, hashed));

    const OTP = generateOtp();
    console.log(OTP)
    await storeOtp(`email_verify:${result.id}`, OTP, 5 * 60);

    await emailService.sendOtp(result.email, result.name, OTP);

    return {
      success: true,
      data: mapUser(result),
    };
  }

  async login(data: LoginRequestDto): Promise<LoginServiceResult> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: userWithOrganizationsInclude,
    });

    if (!user) {
      return { success: false, reason: "INVALID_CREDENTIALS" };
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      return { success: false, reason: "INVALID_CREDENTIALS" };
    }
    if (!user.isVerified) {
      const OTP = generateOtp();
      console.log(OTP)
      await storeOtp(`email_verify:${user.id}`, OTP, 5 * 60);

      await emailService.sendOtp(user.email, user.name, OTP);
    }


    return {
      success: true,
      data: mapUser(user),
    };
  }

  async requestPasswordReset(email: string): Promise<ForgetPasswordResult> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, reason: "USER_NOT_FOUND" };
    }

    const token = generateResetToken();
    await storeResetToken(user.id, token, 60 * 15);

    await emailService.sendResetPassword(user.email, user.name, token);

    return { success: true, data: undefined };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ResetPasswordResult> {
    const userId = await consumeResetToken(token);

    if (!userId) {
      return { success: false, reason: "INVALID_TOKEN" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        passwordHistory: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return { success: false, reason: "USER_NOT_FOUND" };
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      return { success: false, reason: "PASSWORD_REUSE_NOT_ALLOWED" };
    }

    for (const old of user.passwordHistory) {
      const isReused = await bcrypt.compare(newPassword, old.password);
      if (isReused) {
        return { success: false, reason: "PASSWORD_REUSE_NOT_ALLOWED" };
      }
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          passwordHistory: {
            create: { password: hashedPassword },
          },
        },
      }),
    ]);

    return { success: true, data: undefined };
  }

  async verifyEmail(userId: string, OTP: string): Promise<VerifyEmailResult> {
    const otpResult = await verifyOtp(`email_verify:${userId}`, OTP);

    if (!otpResult.success) {
      return {
        success: false,
        reason: otpResult.reason as
          | "INVALID_OTP"
          | "OTP_EXPIRED"
          | "USER_ALREADY_VERIFIED",
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    await CacheService.delete(`email_verify:${userId}`);

    return { success: true, data: undefined };
  }

  async requestEmailVerificationOTP(
    userId: string,
    email: string,
    name: string | null,
  ): Promise<RequestOtpResult> {
    const OTP = generateOtp();
    console.log(OTP);

    await storeOtp(`email_verify:${userId}`, OTP, 5 * 60);

    await emailService.sendOtp(email, name, OTP);
    return { success: true, data: undefined };
  }

  async verifyPasswordResetToken(token: string) {
    const hashed = hashToken(token);
    const key = `password_reset:${hashed}`;
    
    const userId = await CacheService.get(key); 
    
    if (!userId) {
      return { 
        success: false, 
        reason: "INVALID_TOKEN" 
      };
    }

    return { success: true };
  }
}
