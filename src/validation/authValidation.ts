import { z } from "zod";


//signup schema validation
export const signupSchema = z
  .object({
    fullname: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must not exceed 50 characters")
      .regex(/^[A-Za-z\s]+$/, "Name must only contain letters and spaces"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // shows error under confirmPassword
  });

  // Login schema validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});