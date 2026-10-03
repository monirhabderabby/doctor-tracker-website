"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  Mail,
  Pencil,
  Phone,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ColorBadge,
  EmptyState,
  ErrorState,
  InitialsAvatar,
  TableSkeleton,
  formatDate,
} from "@/components/ui/tracker-shared";
import { useDoctor } from "@/hooks/use-tracker";
import AddDoctorModal from "../../_components/add-doctor-modal";
import DeleteDoctorDialog from "../../_components/delete-doctor-dialog";
import PatientsList from "../../../patients/_components/patients-list";

export default function DoctorProfile({ id }: { id: string }) {
  const query = useDoctor(id);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  if (query.isPending) return <TableSkeleton />;
  if (query.isError) {
    if (
      !/^[0-9a-fA-F]{24}$/.test(id) ||
      (axios.isAxiosError(query.error) && query.error.response?.status === 404)
    )
      return (
        <EmptyState
          title="Doctor not found"
          description="This doctor may have been removed or the link is incorrect."
          action={
            <Button asChild>
              <Link href="/doctors">Back to doctors</Link>
            </Button>
          }
        />
      );
    return (
      <ErrorState error={query.error} retry={() => void query.refetch()} />
    );
  }
  const doctor = query.data;
  return (
    <div className="space-y-7">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link href="/doctors" className="hover:text-primary">
          Doctors
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span aria-current="page" className="text-foreground">
          {doctor.name}
        </span>
      </nav>
      <section
        className="overflow-hidden rounded-xl border bg-card shadow-sm"
        aria-label="Doctor profile"
      >
        <div className="h-20 border-b bg-linear-to-r from-primary/15 via-primary/5 to-transparent" />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <InitialsAvatar name={doctor.name} large />
              <div className="min-w-0">
                <h1 className="break-words text-2xl font-semibold tracking-tight">
                  {doctor.name}
                </h1>
                <div className="mt-2">
                  <ColorBadge>{doctor.specialization}</ColorBadge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="size-4" />
                Edit doctor
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleting(true)}
                aria-label="Delete doctor"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
          <dl className="mt-7 grid gap-5 border-t pt-6 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { icon: Building2, label: "Hospital", value: doctor.hospital },
              { icon: Phone, label: "Phone", value: doctor.phone },
              { icon: Mail, label: "Email", value: doctor.email },
              {
                icon: Users,
                label: "Patients under care",
                value: String(doctor.patientCount),
              },
              {
                icon: CalendarDays,
                label: "Joined",
                value: formatDate(doctor.createdAt),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex min-w-0 gap-3">
                <Icon
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-1 break-words text-sm font-medium">
                    {value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <PatientsList doctorId={id} />
      {editing && (
        <AddDoctorModal initialData={doctor} open onOpenChange={setEditing} />
      )}
      {deleting && (
        <DeleteDoctorDialog
          doctor={doctor}
          onClose={() => setDeleting(false)}
          onDeleted={() => router.replace("/doctors")}
        />
      )}
    </div>
  );
}
