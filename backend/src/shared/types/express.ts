import { Role as PrismaRole } from "@prisma/client";
declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      sessionId: string;
      uploadFolder:string;
      jwtPayload: any;
      currentCachedSession: any;
      user: {
        otpVerified: boolean;
        email: string;
        name: string;
        userId?: string;
      };
      organizationId?: string;
      organizationRole?: PrismaRole;
      organizationName:string;
    }
  }
}
