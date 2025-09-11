import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Log validation errors for debugging
      console.error("Validation failed:", result.error.issues);

      // Return a single error message for better frontend compatibility
      const errorMessage = result.error.issues.map((issue) => issue.message).join(", ");
      return res.status(400).json({
        error: errorMessage,
      });
    }

    // ✅ Replace body with parsed data (so it's clean & safe)
    req.body = result.data;

    // ✅ Continue to next middleware/controller
    next();
  };
