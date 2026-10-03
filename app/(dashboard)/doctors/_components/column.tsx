"use client";

import type { Doctor } from "@/hooks/use-doctors";
import type { ColumnDef } from "@tanstack/react-table";
import DoctorRowAction from "./doctor-row-action";
import Link from "next/link";
import {
  InitialsAvatar,
  ColorBadge,
  formatDate,
} from "@/components/ui/tracker-shared";

export type DoctorRow = Doctor;

export const doctorColumnLabels: Record<string, string> = {
  name: "Doctor",
  specialization: "Specialization",
  hospital: "Hospital",
  phone: "Phone",
  email: "Email",
  patientCount: "Patients",
  createdAt: "Joined",
};

export const doctorsColumns: ColumnDef<DoctorRow>[] = [
  {
    accessorKey: "name",
    size: 260,
    header: "Doctor",
    cell: ({ row }) => (
      <Link
        href={`/doctors/${encodeURIComponent(row.original.id)}`}
        className="flex items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-ring"
      >
        <InitialsAvatar name={row.original.name} />
        <span className="min-w-0">
          <span className="block font-semibold hover:text-primary">
            {row.original.name}
          </span>
          <span className="mt-1 block break-all text-xs text-muted-foreground">
            {row.original.email}
          </span>
        </span>
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "specialization",
    size: 170,
    header: "Specialization",
    cell: ({ row }) => <ColorBadge>{row.original.specialization}</ColorBadge>,
  },
  {
    accessorKey: "hospital",
    size: 170,
    header: "Hospital",
  },
  {
    accessorKey: "phone",
    size: 145,
    header: "Phone",
    cell: ({ row }) => (
      <span className="break-words tabular-nums text-xs">
        {row.original.phone}
      </span>
    ),
  },
  {
    accessorKey: "patientCount",
    size: 90,
    header: "Patients",
    cell: ({ row }) => (
      <ColorBadge tone="blue">{row.original.patientCount}</ColorBadge>
    ),
  },
  {
    accessorKey: "createdAt",
    size: 120,
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    size: 70,
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => <DoctorRowAction data={row.original} />,
  },
];
