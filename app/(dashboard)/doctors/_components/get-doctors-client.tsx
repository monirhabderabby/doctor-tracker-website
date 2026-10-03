import { doctorListOptions } from "@/hooks/use-tracker";
import { fetchDoctorsList } from "@/lib/tracker-api";
import type { ListFilters } from "@/schemas/filters.schema";

type DoctorsQueryOptions = Partial<ListFilters> & {
  page: number;
  query?: string;
};

export function doctorsQueryOptions(options: DoctorsQueryOptions) {
  const { query, ...params } = options;
  return doctorListOptions({
    limit: 20,
    sort: "newest",
    ...params,
    search: params.search ?? query ?? "",
  });
}

export async function fetchDoctors(
  options: DoctorsQueryOptions,
  signal?: AbortSignal,
) {
  const { query, ...params } = options;
  return fetchDoctorsList(
    {
      limit: 20,
      sort: "newest",
      ...params,
      search: params.search ?? query?.trim(),
    },
    signal,
  );
}
