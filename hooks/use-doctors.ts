"use client";

import { api } from "@/lib/api";
import { CreateDoctorValues } from "@/schemas/doctors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Doctor extends CreateDoctorValues {
  id: string;
  patientCount: number;
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
    mutationFn: async ({ id, values }: { id: string; values: CreateDoctorValues }) => {
      const response = await api.patch<{ success: true; data: Doctor }>(
        `/doctors/${encodeURIComponent(id)}`,
        values,
      );
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorsQueryKey });
    },
  });
}

export const doctorsQueryKey = ["doctors"] as const;

export function useDoctors(page: number) {
  return useQuery({
    queryKey: [...doctorsQueryKey, { page }],
    queryFn: async ({ signal }) => {
      const response = await api.get<DoctorsResponse>("/doctors", {
        params: { page, limit: 10, sort: "newest" },
        signal,
      });
      return response.data;
    },
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-doctor"],
    mutationFn: async (values: CreateDoctorValues) => {
      const response = await api.post<{ success: true; data: Doctor }>("/doctors", values);
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorsQueryKey });
    },
  });
}
