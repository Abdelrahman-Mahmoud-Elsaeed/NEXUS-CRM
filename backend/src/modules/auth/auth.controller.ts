import { AuthService } from "./auth.service";

import { SessionService } from "@modules/session/session.service";
import { getSessionMeta, setRefreshCookie } from "../session/session.utils";
import { Request, Response } from "express";
import { LoginResult, RegisterResult } from "./auth.dto";

const authService = new AuthService();
const sessionService = new SessionService();

export class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    const meta = await getSessionMeta(req);
    const session = await sessionService.create(result.data, meta);
    setRefreshCookie(res, session.sessionId);
    const responsePayload: RegisterResult = {
      success: true,
      data: {
        user: result.data,
        tokens: {
          accessToken: session.accessToken,
        },
      },
    };

    return res.status(201).json(responsePayload);
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);

    if (!result.success) {
      return res.status(401).json(result);
    }
    const meta = await getSessionMeta(req);
    const session = await sessionService.create(result.data, meta);

    setRefreshCookie(res, session.sessionId);

    const response: LoginResult = {
      success: true,
      data: {
        user: result.data,
        tokens: {
          accessToken: session.accessToken,
        },
      },
    };

    return res.status(200).json(response);
  }

  async requestPasswordReset(req: Request, res: Response) {
    const result = await authService.requestPasswordReset(req.body.email);

    return res.json(result);
  }

  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  }

  async verifyEmail(req: Request, res: Response) {
    const { OTP } = req.body;
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        reason: "UNAUTHORIZED",
      });
    }

    const result = await authService.verifyEmail(userId, OTP);

    if (!result.success) {
      return res.status(400).json(result);
    }

    const updatedSession = await sessionService.verifySessionOtp(
      userId,
      req.sessionId,
    );

    setRefreshCookie(res, updatedSession.sessionId);

    return res.status(200).json({
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
    const user = req.user;
    if (!user.userId) {
      return res.status(401).json({
        success: false,
        reason: "UNAUTHORIZED",
      });
    }
    const result = await authService.requestEmailVerificationOTP(
      user.userId,
      user.email,
      name,
    );
    return res.json(result);
  }

  async verifyAccessToken(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        reason: "UNAUTHORIZED",
        message: "User session not found.",
      });
    }

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
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  }
}
