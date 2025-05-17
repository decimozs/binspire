import { z } from "zod";

export const requestAccessSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().optional(),
  reason: z
    .string()
    .min(20, "Reason must be at least 20 characters long")
    .max(500, "Reason must not exceed 500 characters."),
  role: z.enum(["admin", "collector"], {
    message: "Invalid role",
  }),
});

export const verificationSchema = z.object({
  email: z.string().min(1, "Email is required"),
});

export const signupSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    name: z.string().min(1, "Name is required"),
    role: z.enum(["admin", "collector"], {
      message: "Invalid role",
    }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    orgId: z.string().min(1, "Org id is required"),
    permission: z.enum(["viewer", "editor", "full-access"], {
      message: "Invalid permisson",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const googleSignupSchema = signupSchema.innerType().omit({
  password: true,
  confirmPassword: true,
});

export const loginSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const idParamSchema = z.object({
  id: z.string().min(1, "Id is required"),
});

export const directionsSchema = z.object({
  api_key: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
});
