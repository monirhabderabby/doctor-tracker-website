"use client";

import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchDoctorsList,
  fetchDoctorSpecializations,
  fetchDoctor,
  deleteDoctor,
  fetchPatients,
  savePatient,
  deletePatient,
  fetchSummary,
  fetchTimeline,
  fetchDoctorLoad,
  fetchConditions,
} from "@/lib/tracker-api";
import { queryKeys } from "@/lib/query-keys";
import type { ListFilters } from "@/schemas/filters.schema";
import type { TimelineRange } from "@/lib/tracker-types";

export function doctorListOptions(params: Partial<ListFilters>) {
  return queryOptions({
    queryKey: queryKeys.doctors.list(params),
    queryFn: ({ signal }) => fetchDoctorsList(params, signal),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
export function patientListOptions(
  params: Partial<ListFilters>,
  doctorId?: string,
) {
  return queryOptions({
    queryKey: doctorId
      ? queryKeys.doctors.patients(doctorId, params)
      : queryKeys.patients.list(params),
    queryFn: ({ signal }) => fetchPatients(params, doctorId, signal),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
export function useDoctor(id: string) {
  return useQuery({
    queryKey: queryKeys.doctors.detail(id),
    queryFn: ({ signal }) => fetchDoctor(id, signal),
    staleTime: 30_000,
    retry: false,
  });
}
export function useDoctorOptions(enabled = true) {
  return useQuery({
    queryKey: queryKeys.doctors.options,
    queryFn: ({ signal }) =>
      fetchDoctorsList({ page: 1, limit: 100, sort: "name_asc" }, signal),
    staleTime: 60_000,
    enabled,
  });
}
export function useDeleteDoctor() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.doctors.all });
      void client.invalidateQueries({ queryKey: queryKeys.patients.all });
      void client.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}
export function useDoctorSpecializations() {
  return useQuery({
    queryKey: queryKeys.doctors.specializations,
    queryFn: ({ signal }) => fetchDoctorSpecializations(signal),
    staleTime: 30_000,
  });
}
export function useSavePatient() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: savePatient,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.patients.all });
      void client.invalidateQueries({ queryKey: queryKeys.doctors.all });
      void client.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}
export function useDeletePatient() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.patients.all });
      void client.invalidateQueries({ queryKey: queryKeys.doctors.all });
      void client.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}
export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary,
    queryFn: ({ signal }) => fetchSummary(signal),
    staleTime: 60_000,
  });
}
export function useTimeline(range: TimelineRange) {
  return useQuery({
    queryKey: queryKeys.dashboard.timeline(range),
    queryFn: ({ signal }) => fetchTimeline(range, signal),
    staleTime: 60_000,
  });
}
export function useDoctorLoad() {
  return useQuery({
    queryKey: queryKeys.dashboard.doctorLoad,
    queryFn: ({ signal }) => fetchDoctorLoad(signal),
    staleTime: 60_000,
  });
}
export function useConditions() {
  return useQuery({
    queryKey: queryKeys.dashboard.conditions,
    queryFn: ({ signal }) => fetchConditions(signal),
    staleTime: 60_000,
  });
}
