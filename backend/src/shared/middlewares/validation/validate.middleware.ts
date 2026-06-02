import { Request, Response, NextFunction } from "express";
import { ZodError, type ZodTypeAny } from "zod";

export const validate = (schema: ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync(req)) as Record<string, any>;

      req.body = parsed.body;
      req.params = parsed.params;

      if (parsed.query) {
        Object.keys(req.query).forEach((key) => delete req.query[key]);
        Object.assign(req.query, parsed.query);
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          reason: "VALIDATION_ERROR",
          errors: {
            formErrors: error.format()._errors,
            fieldErrors: error.flatten().fieldErrors,
          },
        });
        return;
      }
      return next(error);
    }
  };
};
