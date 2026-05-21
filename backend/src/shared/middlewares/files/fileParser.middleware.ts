import { Request, Response, NextFunction } from "express";
import multer, { MulterError } from "multer";

const memoryStorage = multer.memoryStorage();

interface UploadOptions {
  fieldName?: string;
  maxSizeInBytes?: number;
}

export const parseUploadedFile = (options: UploadOptions = {}) => {
  const fieldName = options.fieldName || "document";
  const maxSize = options.maxSizeInBytes || 10 * 1024 * 1024;

  const multerInstance = multer({
    storage: memoryStorage,
    limits: { fileSize: maxSize },
  }).single(fieldName);

  return (req: Request, res: Response, next: NextFunction): void => {
    multerInstance(req, res, (error: any) => {
      if (error) {
        if (error instanceof MulterError) {
          switch (error.code) {
            case "LIMIT_FILE_SIZE":
              res.status(400).json({
                success: false,
                reason: "FILE_TOO_LARGE",
              });
              return;
            case "LIMIT_UNEXPECTED_FILE":
              res.status(400).json({
                success: false,
                reason: `INVALID_FORM_FIELD_NAME: Expecting '${fieldName}'`,
              });
              return;
            default:
              res.status(400).json({
                success: false,
                reason: `UPLOAD_PARSE_ERROR_${error.code}`,
              });
              return;
          }
        }

        res.status(500).json({
          success: false,
          reason: "FILE_PARSING_FAILED",
        });
        return;
      }

      return next();
    });
  };
};