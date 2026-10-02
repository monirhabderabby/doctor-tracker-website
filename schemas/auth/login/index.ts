import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(1, "A password is required to log in."),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;
