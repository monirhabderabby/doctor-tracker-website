import { doctorsQueryKey, type DoctorsResponse } from "@/hooks/use-doctors";
import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

interface DoctorsQueryOptions {
  page: number;
  query: string;
}

export function doctorsQueryOptions(options: DoctorsQueryOptions) {
  return queryOptions({
    queryKey: [...doctorsQueryKey, options.query, options.page],
    queryFn: ({ signal }) => fetchDoctors(options, signal),
    retry: false,
  });
}

export async function fetchDoctors(
  { page, query }: DoctorsQueryOptions,
  signal?: AbortSignal,
): Promise<DoctorsResponse> {
  const response = await api.get<DoctorsResponse>("/doctors", {
    params: { page, limit: 20, search: query.trim() || undefined, sort: "newest" },
    signal,
  });
  return response.data;
}
