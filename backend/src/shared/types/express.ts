import { User } from "@prisma-client";

declare global {
  namespace Express {
    interface Request {
      sessionId: string;
      jwtPayload: any;
      currentCachedSession: any;
      user: {
        otpVerified: boolean;
        email: string;
        name: string;
        userId?: string;
      };
    }
  }
}
