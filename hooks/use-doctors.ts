"use client";

import {
  createDoctor,
  updateDoctor,
  fetchDoctorsList,
} from "@/lib/tracker-api";
import { queryKeys } from "@/lib/query-keys";
import { CreateDoctorValues } from "@/schemas/doctors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Doctor extends CreateDoctorValues {
  id: string;
  patientCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorsResponse {
  success: true;
  data: Doctor[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-doctor"],
    mutationFn: updateDoctor,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorsQueryKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}

export const doctorsQueryKey = ["doctors"] as const;

export function useDoctors(page: number) {
  return useQuery({
    queryKey: [...doctorsQueryKey, { page }],
    queryFn: ({ signal }) =>
      fetchDoctorsList({ page, limit: 10, sort: "newest" }, signal),
    staleTime: 30_000,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-doctor"],
    mutationFn: createDoctor,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorsQueryKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}
