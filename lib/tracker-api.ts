import { api } from "./api";
import type { Doctor, DoctorsResponse } from "@/hooks/use-doctors";
import type { CreateDoctorValues } from "@/schemas/doctor.schema";
import type { ListFilters } from "@/schemas/filters.schema";
import type { PatientValues } from "@/schemas/patient.schema";
import type {
  ListResponse,
  Patient,
  DashboardSummary,
  Timeline,
  TimelineRange,
  DoctorLoad,
  ConditionDistribution,
} from "./tracker-types";

const pathId = (id: string) => encodeURIComponent(id);
function paramsFor(params: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== undefined,
    ),
  );
}
export async function fetchDoctorsList(
  params: Omit<Partial<ListFilters>, "limit"> & { limit?: number },
  signal?: AbortSignal,
) {
  return (
    await api.get<DoctorsResponse>("/doctors", {
      params: paramsFor(params),
      signal,
    })
  ).data;
}
export async function createDoctor(values: CreateDoctorValues) {
  return (await api.post<{ data: Doctor }>("/doctors", values)).data.data;
}
export async function fetchDoctorSpecializations(signal?: AbortSignal) {
  // The API has no distinct endpoint, so collect values across every page.
  const values = new Map<
    string,
    { label: string; value: string; count: number }
  >();
  let page = 1;
  let totalPages = 1;
  do {
    const response = await fetchDoctorsList(
      { page, limit: 100, sort: "oldest" },
      signal,
    );
    for (const doctor of response.data) {
      const label = doctor.specialization.trim();
      if (!label) continue;
      const key = label.toLowerCase();
      const existing = values.get(key);
      if (existing) existing.count += 1;
      else values.set(key, { label, value: label, count: 1 });
    }
    totalPages = response.meta.totalPages;
    page += 1;
  } while (page <= totalPages);
  return Array.from(values.values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}
export async function updateDoctor({
  id,
  values,
}: {
  id: string;
  values: CreateDoctorValues;
}) {
  return (await api.patch<{ data: Doctor }>(`/doctors/${pathId(id)}`, values))
    .data.data;
}
export async function fetchDoctor(id: string, signal?: AbortSignal) {
  return (await api.get<{ data: Doctor }>(`/doctors/${pathId(id)}`, { signal }))
    .data.data;
}
export async function deleteDoctor(id: string) {
  await api.delete(`/doctors/${pathId(id)}`);
}
export async function fetchPatients(
  params: Partial<ListFilters>,
  doctorId?: string,
  signal?: AbortSignal,
) {
  const path = doctorId ? `/doctors/${pathId(doctorId)}/patients` : "/patients";
  return (
    await api.get<ListResponse<Patient>>(path, {
      params: paramsFor(params),
      signal,
    })
  ).data;
}
export async function savePatient({
  id,
  values,
  doctorId,
}: {
  id?: string;
  values: PatientValues;
  doctorId?: string;
}) {
  if (id)
    return (
      await api.patch<{ data: Patient }>(`/patients/${pathId(id)}`, values)
    ).data.data;
  const { doctorId: assignedDoctor, ...body } = values;
  const path = doctorId ? `/doctors/${pathId(doctorId)}/patients` : "/patients";
  return (
    await api.post<{ data: Patient }>(
      path,
      doctorId ? body : { ...body, doctorId: assignedDoctor },
    )
  ).data.data;
}
export async function deletePatient({
  id,
  doctorId,
}: {
  id: string;
  doctorId?: string;
}) {
  const path = doctorId
    ? `/doctors/${pathId(doctorId)}/patients/${pathId(id)}`
    : `/patients/${pathId(id)}`;
  await api.delete(path);
}
export async function fetchSummary(signal?: AbortSignal) {
  return (
    await api.get<{ data: DashboardSummary }>("/dashboard/summary", { signal })
  ).data.data;
}
export async function fetchTimeline(
  range: TimelineRange,
  signal?: AbortSignal,
) {
  return (
    await api.get<{ data: Timeline }>("/dashboard/timeline", {
      params: { range },
      signal,
    })
  ).data.data;
}
export async function fetchDoctorLoad(signal?: AbortSignal) {
  return (
    await api.get<{ data: DoctorLoad[] }>("/dashboard/patients-per-doctor", {
      params: { limit: 10 },
      signal,
    })
  ).data.data;
}
export async function fetchConditions(signal?: AbortSignal) {
  return (
    await api.get<{ data: ConditionDistribution }>("/dashboard/conditions", {
      signal,
    })
  ).data.data;
}
