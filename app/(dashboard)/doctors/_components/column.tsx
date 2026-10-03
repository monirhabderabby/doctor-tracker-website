"use client";

import type { Doctor } from "@/hooks/use-doctors";
import type { ColumnDef } from "@tanstack/react-table";
import DoctorRowAction from "./doctor-row-action";

export type DoctorRow = Doctor;

export const doctorColumnLabels: Record<string, string> = {
  name: "Doctor",
  specialization: "Specialization",
  hospital: "Hospital",
  phone: "Phone",
  email: "Email",
  patientCount: "Patients",
};

export const doctorsColumns: ColumnDef<DoctorRow>[] = [
  {
    accessorKey: "name",
    header: "Doctor",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
  },
  {
    accessorKey: "hospital",
    header: "Hospital",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="whitespace-nowrap tabular-nums">{row.original.phone}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "patientCount",
    header: "Patients",
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => <DoctorRowAction data={row.original} />,
  },
];
