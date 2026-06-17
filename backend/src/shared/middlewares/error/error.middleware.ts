import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err);

  const statusCode = err?.statusCode || 500;
  const reason = err?.reason || "INTERNAL_SERVER_ERROR";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    reason,
    msg:
      err?.msg ||
      "Something went wrong. Please try again later.",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
}