import type { ListFilters } from "@/schemas/filters.schema";
import type { TimelineRange } from "./tracker-types";

export const queryKeys = {
  doctors: {
    all: ["doctors"] as const,
    list: (params: Partial<ListFilters>) =>
      ["doctors", "list", params] as const,
    detail: (id: string) => ["doctors", "detail", id] as const,
    patients: (id: string, params: Partial<ListFilters>) =>
      ["patients", "doctor", id, params] as const,
    options: ["doctors", "options"] as const,
    specializations: ["doctors", "specializations"] as const,
  },
  patients: {
    all: ["patients"] as const,
    list: (params: Partial<ListFilters>) =>
      ["patients", "list", params] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    summary: ["dashboard", "summary"] as const,
    timeline: (range: TimelineRange) =>
      ["dashboard", "timeline", range] as const,
    doctorLoad: ["dashboard", "doctor-load"] as const,
    conditions: ["dashboard", "conditions"] as const,
  },
};
