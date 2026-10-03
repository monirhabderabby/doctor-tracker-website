import { z } from "zod";

export const createDoctorSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters"),
  specialization: z.string().trim().min(2, "Specialization is required"),
  hospital: z.string().trim().min(2, "Hospital is required"),
  phone: z.string().trim().regex(/^\+?[\d\s-]{7,15}$/, "Enter a valid phone number"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export type CreateDoctorValues = z.infer<typeof createDoctorSchema>;
