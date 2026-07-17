import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    fullName: z.string().min(7, "Name must be at least 7 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    toastmasterId: z
      .string()
      .regex(/^[A-Z]{2}-\d{8}$/, "Enter a valid Member ID (e.g. PN-67598269)"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// profile API response schema
export const profileSchema = z.object({
  user_id: z.string(),
  user_email: z.string().email(),
  user_full_name: z.string(),
  user_introduction: z.string().nullable().optional(),
  user_member_id: z.string().nullable().optional(),
  user_phone: z.string().nullable().optional(),
  member_of: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  admin_of: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  owned_clubs: z
    .array(z.object({ id: z.string(), name: z.string(), clubCode: z.string() }))
    .optional(),
});
export type ProfileData = z.infer<typeof profileSchema>;

export const updateProfileSchema = z.object({
  fullName: z.string().min(7, "Name must be at least 7 characters"),
  email: z.string().email("Please enter a valid email address"),
  introduction: z.string().max(500, "Introduction must be under 500 characters").optional().or(z.literal("")),
  toastmasterId: z
    .string()
    .regex(/^[A-Z]{2}-\d{8}$/, "Enter a valid Member ID (e.g. PN-67598269)")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(11, "Phone number must be under 10 characters")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((val) => val.newPassword === val.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
