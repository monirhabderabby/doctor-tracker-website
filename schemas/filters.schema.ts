import { z } from "zod";

const date = z.iso.date().catch("");
export const filtersSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  limit: z.coerce
    .number()
    .pipe(z.union([z.literal(10), z.literal(20), z.literal(50)]))
    .catch(10),
  search: z.string().trim().max(200).catch(""),
  specialization: z.string().trim().max(100).catch(""),
  condition: z.string().trim().max(100).catch(""),
  doctorId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .catch(""),
  from: date,
  to: date,
  sort: z
    .enum(["newest", "oldest", "name_asc", "name_desc", "age_asc", "age_desc"])
    .catch("newest"),
});
export type ListFilters = z.infer<typeof filtersSchema>;
