import { AuthService } from "./auth.service";

import { SessionService } from "@modules/session/session.service";
import { getSessionMeta, setRefreshCookie } from "../session/session.utils";
import { Request, Response } from "express";

const authService = new AuthService();
const sessionService = new SessionService();

export class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg
      });
    }

    const meta = await getSessionMeta(req);

    const session = await sessionService.create(result.data!, meta);
    setRefreshCookie(res, session.sessionId);

    return res.status(result.statusCode).json({
      success: true,
      data: {
        user: result.data!,
        tokens: {
          accessToken: session.accessToken,
        },
      },
    });
  }

  async registerInvited(req: Request, res: Response): Promise<void> {
    const serviceResult = await authService.registerInvitedUser(req.body);

    if (!serviceResult.success) {
      res.status(serviceResult.statusCode).json({
        success: false,
        reason: serviceResult.reason,
        msg: serviceResult.msg
      });
      return;
    }

    const meta = await getSessionMeta(req);
    const session = await sessionService.create(serviceResult.data!, meta);
    setRefreshCookie(res, session.sessionId);

    res.status(serviceResult.statusCode).json({
      success: true,
      data: {
        user: serviceResult.data,
        tokens: {
          accessToken: session.accessToken,
        },
      },
    });
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);

    if (!result.success) {
      if (result.reason === "EMAIL_NOT_VERIFIED") {
        const meta = await getSessionMeta(req);

        const session = await sessionService.create(result.data!, meta);

        setRefreshCookie(res, session.sessionId);

        return res.status(result.statusCode).json({
          success: false,
          statusCode: result.statusCode,
          reason: "EMAIL_NOT_VERIFIED",
          data: {
            user: result.data,
            tokens: {
              accessToken: session.accessToken,
            },
            isVerified: false,
          },
        });
      }

      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg
      });
    }

    const meta = await getSessionMeta(req);
    const session = await sessionService.create(result.data!, meta);

    setRefreshCookie(res, session.sessionId);

    return res.status(result.statusCode).json({
      success: true,
      data: {
        user: result.data,
        tokens: {
          accessToken: session.accessToken,
        },
      },
    });
  }

  async requestPasswordReset(req: Request, res: Response) {
    const result = await authService.requestPasswordReset(req.body.email);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg
      });
    }

    return res.status(result.statusCode).json({
      success: true,
    });
  }

  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg

      });
    }

    return res.status(result.statusCode).json({
      success: true,
    });
  }

  async verifyEmail(req: Request, res: Response) {
    const { OTP } = req.body;
    const userId = req.user?.userId;

    const result = await authService.verifyEmail(userId!, OTP);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg

      });
    }

    const updatedSession = await sessionService.verifySessionOtp(
      userId!,
      req.sessionId,
    );

    setRefreshCookie(res, updatedSession.sessionId);

    return res.status(result.statusCode).json({
      success: true,
      data: {
        tokens: {
          accessToken: updatedSession.accessToken,
        },
      },
    });
  }

  async requestEmailOTP(req: Request, res: Response) {
    const { name } = req.body || {};
    const userId = req.user?.userId;
    const email = req.user?.email;

    const result = await authService.requestEmailVerificationOTP(
      userId!,
      email,
      name,
    );

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg

      });
    }

    return res.status(result.statusCode).json({
      success: true,
    });
  }

  async verifyAccessToken(req: Request, res: Response) {
    const user = req.user;
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.userId,
          email: user.email,
          isVerified: user.otpVerified,
          name: user.name,
        },
      },
    });
  }

  async verifyPasswordResetToken(req: Request, res: Response) {
    const token = req.params.token as string;
    const result = await authService.verifyPasswordResetToken(token);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        reason: result.reason,
        msg: result.msg
      });
    }

    return res.status(result.statusCode).json({
      success: true,
    });
  }
}
