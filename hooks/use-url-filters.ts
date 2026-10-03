"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { filtersSchema, type ListFilters } from "@/schemas/filters.schema";

export function useUrlFilters(kind: "doctors" | "patients" = "patients") {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.toString();
  const filters = useMemo(() => {
    const parsed = filtersSchema.parse(
      Object.fromEntries(new URLSearchParams(query).entries()),
    );
    if (kind === "doctors" && parsed.sort.startsWith("age_"))
      parsed.sort = "newest";
    if (parsed.from && parsed.to && parsed.from > parsed.to) parsed.to = "";
    return parsed;
  }, [query, kind]);
  const update = useCallback(
    (changes: Partial<ListFilters>, reset = false) => {
      // Read the latest URL so quick filter changes cannot overwrite one another.
      const params = reset
        ? new URLSearchParams()
        : new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(changes)) {
        if (value === "" || value === undefined) params.delete(key);
        else params.set(key, String(value));
      }
      if (!("page" in changes)) params.delete("page");
      const query = params.toString();
      window.history.pushState(
        null,
        "",
        `${pathname}${query ? `?${query}` : ""}`,
      );
    },
    [pathname],
  );
  const clear = useCallback(() => update({}, true), [update]);
  const active = Boolean(
    filters.search ||
    filters.specialization ||
    filters.condition ||
    filters.doctorId ||
    filters.from ||
    filters.to ||
    filters.sort !== "newest",
  );
  return { filters, update, clear, active };
}
