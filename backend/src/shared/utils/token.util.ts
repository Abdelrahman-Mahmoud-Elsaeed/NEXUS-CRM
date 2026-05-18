import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../config/env";


export type JwtPayload = {
  userId: string;
  sessionId:string;
  otpVerified:boolean;
  email:string;
  name:string
};

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};


export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};