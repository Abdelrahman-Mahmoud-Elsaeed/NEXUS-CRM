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
              return res.status(400).json({
                success: false,
                statusCode: 400,
                reason: "FILE_TOO_LARGE",
                msg: "File size exceeds the allowed limit.",
              });

            case "LIMIT_UNEXPECTED_FILE":
              return res.status(400).json({
                success: false,
                statusCode: 400,
                reason: "INVALID_FORM_FIELD_NAME",
                msg: `Invalid field name. Expected '${fieldName}'.`,
              });

            default:
              return res.status(400).json({
                success: false,
                statusCode: 400,
                reason: "UPLOAD_PARSE_ERROR",
                msg: `Upload error: ${error.code}`,
              });
          }
        }

        return res.status(500).json({
          success: false,
          statusCode: 500,
          reason: "FILE_PARSING_FAILED",
          msg: "Failed to process uploaded file.",
        });
      }

      return next();
    });
  };
};