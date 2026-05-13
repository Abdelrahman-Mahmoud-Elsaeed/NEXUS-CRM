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
      return res.status(400).json(result);
    }
    const session = await sessionService.create(
      result.data.id,
      getSessionMeta(req),
    );
    setRefreshCookie(res, session.sessionId);


    return res.status(201).json({
      success: true,
      data: result.data,
      tokens: {
        accessToken: session.accessToken,
      },
    });
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);

    if (!result.success) {
      return res.status(401).json(result);
    }

    const session = await sessionService.create(
      result.data.id,
      getSessionMeta(req),
    );
    setRefreshCookie(res, session.sessionId);

    return res.status(201).json({
      success: true,
      data: result.data,
      tokens: {
        accessToken: session.accessToken,
      },
    });
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

    return res.json(result);
  }

  async verifyEmail(req: Request, res: Response) {
    const { OTP } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await authService.verifyEmail(user, OTP);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  }

  async requestEmailOTP(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const result = await authService.requestEmailVerificationOTP(req.user);
    return res.json(result);
  }
}
