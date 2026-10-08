// src/lib/validators.ts
import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Enter your email or phone"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().max(100).optional(),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
    username: z.string().max(30).optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type SignupFormValues = z.infer<typeof signupSchema>;

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().max(100).optional(),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  username: z.string().max(30).optional(),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Choose a password different from your current one",
    path: ["newPassword"],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;


export const forgotPasswordSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your email or phone"),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ticketSchema = z.object({
  category: z.enum(["BOOKING", "PAYMENT", "ACCOUNT", "OTHER"]),
  subject: z.string().trim().min(1, "Enter a subject").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Please describe the problem in at least 10 characters")
    .max(2000),
  bookingId: z.string().optional(),
});
export type TicketFormValues = z.infer<typeof ticketSchema>;
