import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    // ✅ Replace body with parsed data (so it's clean & safe)
    req.body = result.data;

    // ✅ Continue to next middleware/controller
    next();
  };
