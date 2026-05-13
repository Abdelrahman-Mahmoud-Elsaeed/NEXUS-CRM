import bcrypt from "bcrypt";
import { prisma } from "@config/db/prisma";
import { createUserQuery } from "@queries/auth/auth.queries";
import { mapUser } from "@/modules/auth/dto/User.mapper";
import { LoginRequestDto, LoginResult } from "./dto/LoginDto";
import { RegisterRequistDto, RegisterResponseDto } from "./dto/RegisterDto";
import { userWithOrganizationsInclude } from "@queries/auth/auth.include";
import {
  ForgetPasswordResult,
  ResetPasswordResult,
} from "./dto/ForgetPasswordDto";
import { redis } from "@config/db/redis";
import crypto from "crypto";
import { RequestOtpResult, VerifyEmailResult } from "./dto/VerifyEmailDto";
import { emailService } from "@config/email/email.service";
import { User } from "@/shared/generated/client/client";
import { generateOtp, storeOtp, verifyOtp } from "./security/otp.util";
import {
  consumeResetToken,
  generateResetToken,
  storeResetToken,
} from "./security/password-reset.util";

export class AuthService {
  async register(data: RegisterRequistDto): Promise<RegisterResponseDto> {
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

    await storeOtp(`email_verify:${result.id}`, OTP, 5 * 60);

    await emailService.sendOtp(result.email, result.name, OTP);
    console.log(OTP);
    return {
      success: true,
      data: mapUser(result),
    };
  }

  async login(data: LoginRequestDto): Promise<LoginResult> {
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

    return { success: true };
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

    const sessionKeys = await redis.keys(`refresh_token:${userId}:*`);

    if (sessionKeys.length > 0) {
      await redis.del(sessionKeys);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          passwordHistory: {
            create: {
              password: hashedPassword,
            },
          },
        },
      }),
    ]);

    return { success: true };
  }

  async verifyEmail(user: User, OTP: string): Promise<VerifyEmailResult> {
    if (user.isVerified) {
      return {
        success: false,
        reason: "USER_ALREADY_VERIFIED",
      };
    }

    const otpResult = await verifyOtp(`email_verify:${user.id}`, OTP);

    if (!otpResult.success) {
      return {
        success: false,
        reason: otpResult.reason as  "INVALID_OTP" | "OTP_EXPIRED" | "USER_ALREADY_VERIFIED"
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await redis.del(`email_verify:${user.id}`);

    return { success: true };
  }

  async requestEmailVerificationOTP(user: User): Promise<RequestOtpResult> {
    if (!user) {
      return {
        success: false,
        reason: "USER_NOT_FOUND",
      };
    }

    const OTP = generateOtp();

    await storeOtp(`email_verify:${user.id}`, OTP, 5 * 60);

    await emailService.sendOtp(user.email, user.name, OTP);
    console.log(OTP);
    return { success: true };
  }
}

// Controller is doing too much

// Your controller:

// creates session
// generates tokens
// stores redis session
// sends cookies

// 👉 This should be moved to a SessionService

// ✔ Better separation:

// AuthController → AuthService → SessionService → Redis

// 3. Duplicate OTP logic

// You repeat:

// OTP generation
// hashing
// redis set
// email send

// 👉 Should be extracted:

// generateOtp()
// storeOtp()
// sendOtp()
