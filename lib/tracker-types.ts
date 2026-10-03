import type { Doctor } from "@/hooks/use-doctors";
import type { PatientValues } from "@/schemas/patient.schema";

export interface Patient extends PatientValues {
  id: string;
  createdAt: string;
  updatedAt: string;
  doctor?: Pick<Doctor, "id" | "name" | "specialization" | "hospital">;
}
export interface ListResponse<T> {
  success: true;
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
export interface DashboardSummary {
  totalDoctors: number;
  totalPatients: number;
  newDoctorsLast7Days: number;
  newPatientsLast7Days: number;
  avgPatientsPerDoctor: number;
}
export type TimelineRange = "7d" | "30d" | "12m";
export interface Timeline {
  range: TimelineRange;
  data: { date: string; doctors: number; patients: number }[];
}
export interface DoctorLoad {
  doctorId: string;
  name: string;
  specialization: string;
  patientCount: number;
}
export interface ConditionDistribution {
  total: number;
  data: { condition: string; count: number }[];
}
