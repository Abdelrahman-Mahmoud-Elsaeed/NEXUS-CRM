import bcrypt from "bcrypt";
import { prisma } from "@config/db/prisma";
import { createUserQuery } from "@queries/auth/auth.queries";
import { userWithOrganizationsInclude } from "@queries/auth/auth.include";
import { CacheService } from "@/shared/services/cache.service";
import { emailService } from "@config/email/email.service";
import {
  LoginRequestDto,
  LoginServiceResult,
  mapUser,
  RegisterInvitedRequestDto,
  RegisterInvitedServiceResult,
  RegisterRequestDto,
  RegisterServiceResult,
  RequestEmailOtpServiceResult,
  RequestPasswordResetResult,
  ResetPasswordServiceResult,
  VerifyEmailServiceResult,
  VerifyPasswordResetTokenResult,
} from "./auth.dto";
import {
  consumeResetToken,
  generateOtp,
  generateResetToken,
  hashToken,
  storeOtp,
  storeResetToken,
  verifyOtp,
} from "./auth.util";

export class AuthService {
  async register(data: RegisterRequestDto): Promise<RegisterServiceResult> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      return {
        success: false,
        statusCode: 409,
        reason: "EMAIL_IS_USED",
        msg: "This email is already registered. Please sign in or use a different email.",
      };
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const result = await prisma.user.create(createUserQuery(data, hashed));

    const OTP = generateOtp();
    console.log(OTP);
    await storeOtp(`email_verify:${result.id}`, OTP, 5 * 60);

    emailService.sendOtp(result.email, result.name, OTP);

    return {
      success: true,
      statusCode: 201,
      data: mapUser(result),
    };
  }

  async registerInvitedUser(
    data: RegisterInvitedRequestDto,
  ): Promise<RegisterInvitedServiceResult> {
    const { token, name, password } = data;

    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return {
        success: false,
        statusCode: 404,
        reason: "INVITATION_NOT_FOUND",
        msg: "This invitation is invalid or has expired.",
      };
    }

    if (invitation.isUsed) {
      return {
        success: false,
        statusCode: 409,
        reason: "INVITATION_ALREADY_USED",
        msg: "This invitation has already been used.",
      };
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      return {
        success: false,
        statusCode: 410,
        reason: "INVITATION_EXPIRED",
        msg: "This invitation has expired. Please request a new invitation.",
      };
    }

    const transactionResult = await prisma.$transaction(async (tx) => {
      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await tx.user.create({
        data: {
          email: invitation.email,
          name: name,
          password: passwordHash,
          isVerified: true,
        },
      });

      await tx.organizationUser.create({
        data: {
          userId: newUser.id,
          organizationId: invitation.organizationId,
          role: invitation.role,
        },
      });

      const personalOrg = await tx.organization.create({
        data: {
          name: `${name}'s Workspace`,
          billingPlan: "free",
        },
      });

      await tx.organizationUser.create({
        data: {
          userId: newUser.id,
          organizationId: personalOrg.id,
          role: "OWNER",
        },
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          isUsed: true,
          acceptedAt: new Date(),
        },
      });

      const fullProfile = await tx.user.findUnique({
        where: { id: newUser.id },
        include: {
          organizations: {
            include: { organization: true },
          },
        },
      });

      return mapUser(fullProfile);
    });

    return {
      success: true,
      statusCode: 201,
      data: transactionResult,
    };
  }

  async login(data: LoginRequestDto): Promise<LoginServiceResult> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: userWithOrganizationsInclude,
    });

    if (!user) {
      return {
        success: false,
        statusCode: 401,
        reason: "INVALID_CREDENTIALS",
        msg: "Invalid email or password.",
      };
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      return {
        success: false,
        statusCode: 401,
        reason: "INVALID_CREDENTIALS",
        msg: "Invalid email or password.",
      };
    }

    if (!user.isVerified) {
      const OTP = generateOtp();
      console.log(OTP);
      await storeOtp(`email_verify:${user.id}`, OTP, 5 * 60);
      emailService.sendOtp(user.email, user.name || "User", OTP);

      return {
        success: false,
        statusCode: 403,
        reason: "EMAIL_NOT_VERIFIED",
        data: mapUser(user),
      };
    }

    return {
      success: true,
      statusCode: 200,
      data: mapUser(user),
    };
  }

  async requestPasswordReset(
    email: string,
  ): Promise<RequestPasswordResetResult> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        statusCode: 404,
        reason: "USER_NOT_FOUND",
        msg: "User not found.",
      };
    }

    const token = generateResetToken();
    await storeResetToken(user.id, token, 60 * 15);

    emailService.sendResetPassword(user.email, user.name || "User", token);

    return {
      success: true,
      statusCode: 200,
      data: undefined,
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ResetPasswordServiceResult> {
    const userId = await consumeResetToken(token);

    if (!userId) {
      return {
        success: false,
        statusCode: 400,
        reason: "INVALID_TOKEN",
        msg: "Invalid or missing token.",
      };
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
      return {
        success: false,
        statusCode: 404,
        reason: "USER_NOT_FOUND",
        msg: "User not found.",
      };
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      return {
        success: false,
        statusCode: 400,
        reason: "PASSWORD_REUSE_NOT_ALLOWED",
        msg: "New password must be different from your current password.",
      };
    }

    for (const old of user.passwordHistory) {
      const isReused = await bcrypt.compare(newPassword, old.password);
      if (isReused) {
        return {
          success: false,
          statusCode: 400,
          reason: "PASSWORD_REUSE_NOT_ALLOWED",
          msg: "You cannot reuse a previously used password.",
        };
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

    return {
      success: true,
      statusCode: 200,
      data: undefined,
    };
  }

  async verifyEmail(
    userId: string,
    OTP: string,
  ): Promise<VerifyEmailServiceResult> {
    const otpResult = await verifyOtp(`email_verify:${userId}`, OTP);

    if (!otpResult.success) {
      return {
        success: false,
        statusCode: 400,
        reason: otpResult.reason,
        msg:
          otpResult.reason === "OTP_EXPIRED"
            ? "OTP has expired. Please request a new one."
            : "Invalid OTP. Please try again.",
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    await CacheService.delete(`email_verify:${userId}`);

    return {
      success: true,
      statusCode: 200,
      data: undefined,
    };
  }

  async requestEmailVerificationOTP(
    userId: string,
    email: string,
    name: string | null,
  ): Promise<RequestEmailOtpServiceResult> {
    const OTP = generateOtp();
    console.log(OTP);

    await storeOtp(`email_verify:${userId}`, OTP, 5 * 60);

    emailService.sendOtp(email, name || "User", OTP);

    return {
      success: true,
      statusCode: 200,
      data: undefined,
    };
  }

  async verifyPasswordResetToken(
    token: string,
  ): Promise<VerifyPasswordResetTokenResult> {
    const hashed = hashToken(token);
    const key = `password_reset:${hashed}`;

    const userId = await CacheService.get(key);

    if (!userId) {
      return {
        success: false,
        statusCode: 400,
        reason: "INVALID_TOKEN",
        msg: "Invalid or missing token.",
      };
    }

    return {
      success: true,
      statusCode: 200,
      data: undefined,
    };
  }
}
