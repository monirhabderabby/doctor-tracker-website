import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters"),
  age: z.number().int("Enter a whole number").min(0).max(120),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{7,15}$/, "Enter a valid phone number"),
  condition: z.string().trim().min(2, "Condition is required"),
  doctorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Select a valid doctor"),
});

export type PatientValues = z.infer<typeof patientSchema>;
