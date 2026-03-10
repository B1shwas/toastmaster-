import { z } from "zod";

export const addMemberSchema = z.object({
  memberName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes"
    )
    .transform((val) => val.trim()),
  memberEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .transform((val) => val.toLowerCase().trim()),
  toastmasterId: z
    .string()
    .regex(/^[A-Z]{2}-\d+$/, "Invalid format (e.g. PN-67598269)")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;

export const clubSettingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Club name must be at least 3 characters")
    .max(100, "Club name must be less than 100 characters"),
  description: z
    .string()
    .trim()
    .max(255, "Description must be less than 255 characters")
    .optional(),
  district: z
    .string()
    .trim()
    .max(100, "District must be less than 100 characters")
    .optional(),
  area: z
    .string()
    .trim()
    .max(100, "Area must be less than 100 characters")
    .optional(),
  division: z
    .string()
    .trim()
    .max(100, "Division must be less than 100 characters")
    .optional(),
  meetingFrequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"], {
    message: "Please select a valid meeting frequency",
  }),
  charterDate: z.string().optional(),
});

export type ClubSettingsInput = z.infer<typeof clubSettingsSchema>;

export const createClubSchema = z.object({
  name: z
    .string()
    .min(3, "Club name must be at least 3 characters")
    .max(100, "Club name must be less than 100 characters"),
  description: z
    .string()
    .max(255, "Description must be less than 255 characters")
    .default(""),
  district: z
    .string()
    .max(100, "District must be less than 100 characters")
    .default(""),
  area: z
    .string()
    .max(100, "Area must be less than 100 characters")
    .default(""),
  division: z
    .string()
    .max(100, "Division must be less than 100 characters")
    .default(""),
  meetingFrequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"], {
    message: "Please select a valid meeting frequency",
  }),
  charterDate: z.string().optional(),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;

export const joinClubSchema = z.object({
  clubCode: z
    .string()
    .min(1, "Club code is required")
    .max(20, "Club code must be less than 20 characters")
    .transform((val) => val.toUpperCase().trim()),
});

export type JoinClubInput = z.infer<typeof joinClubSchema>;
