import {UAParser} from "ua-parser-js";
import { Request, Response } from "express";

const getClientIp = (req: Request) => {
  return (
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown"
  );
};

export const getSessionMeta = async (req: Request) => {
  const parser = new UAParser(req.headers["user-agent"]);

  const ua = parser.getResult();

  return {
    ip: getClientIp(req),
    browser: ua.browser.name || "unknown",
    os: ua.os.name || "unknown",
    device: ua.device.type || "desktop",
    geo: "unknown",
  };
};

export const setRefreshCookie = (res: Response, sessionId: string) => {
  res.cookie("sid", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshCookie = (
  res: Response
) => {
  res.clearCookie("sid", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
};