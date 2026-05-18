import { Request, Response, NextFunction } from "express"

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(" Error:", err)

  const statusCode = err.statusCode || 500

  return res.status(statusCode).json({
    success: false,
    reason: err.reason || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}