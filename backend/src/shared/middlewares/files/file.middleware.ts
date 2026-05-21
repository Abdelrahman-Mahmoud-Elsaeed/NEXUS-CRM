import { Request, Response, NextFunction } from "express";
import { file } from "zod";


export const setUploadFolder = (folder: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.uploadFolder = folder;
    next();
  };
};


export const requireFile = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      reason: "NO_FILE_PROVIDED",
    });
    return;
  }
  next();
};