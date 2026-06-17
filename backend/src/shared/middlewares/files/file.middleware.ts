import { Request, Response, NextFunction } from "express";

export const setUploadFolder = (folder: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.uploadFolder = folder;
    next();
  };
};

export const requireFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      reason: "NO_FILE_PROVIDED",
      msg: "No file was uploaded. Please attach a file and try again.",
    });
  }

  next();
};