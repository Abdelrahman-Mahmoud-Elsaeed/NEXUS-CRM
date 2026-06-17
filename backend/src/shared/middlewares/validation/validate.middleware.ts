import { Request, Response, NextFunction } from "express";
import { ZodError, type ZodTypeAny } from "zod";

export const validate = (schema: ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const parsed = await schema.parseAsync(req);
      const data = parsed as Record<string, any>;

      req.body = data.body || {};
      req.params = data.params || {};
      if (data.query) {
        Object.keys(req.query).forEach((key) => delete req.query[key]);
        Object.assign(req.query, data.query);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          reason: "VALIDATION_ERROR",
          msg: "Request validation failed.",
          errors: {
            formErrors: error.format()._errors,
            fieldErrors: error.flatten().fieldErrors,
          },
        });
      }

      return next(error);
    }
  };
};