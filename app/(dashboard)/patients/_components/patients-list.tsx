"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResponsiveRecords } from "@/components/ui/responsive-records";
import {
  ColorBadge,
  ConfirmDialog,
  DateRangeFilter,
  EmptyState,
  ErrorState,
  InitialsAvatar,
  Pagination,
  SearchInput,
  SelectField,
  TableSkeleton,
  formatDate,
} from "@/components/ui/tracker-shared";
import { useUrlFilters } from "@/hooks/use-url-filters";
import {
  patientListOptions,
  useDeletePatient,
  useDoctorOptions,
} from "@/hooks/use-tracker";
import { conditions, sortOptions } from "@/lib/constants";
import type { Patient } from "@/lib/tracker-types";
import PatientFormDialog from "./patient-form-dialog";

export default function PatientsList({ doctorId }: { doctorId?: string }) {
  const { filters, update, clear, active } = useUrlFilters();
  const query = useQuery(patientListOptions(filters, doctorId));
  const doctors = useDoctorOptions(!doctorId);
  const client = useQueryClient();
  const [adding, setAdding] = useState(false);
  const totalPages = query.data?.meta.totalPages ?? 0;
  useEffect(() => {
    if (!query.isPlaceholderData && filters.page < totalPages)
      void client.prefetchQuery(
        patientListOptions({ ...filters, page: filters.page + 1 }, doctorId),
      );
    if (
      !query.isPlaceholderData &&
      query.data &&
      filters.page > Math.max(1, totalPages)
    )
      update({ page: Math.max(1, totalPages) });
  }, [
    client,
    filters,
    totalPages,
    doctorId,
    query.isPlaceholderData,
    query.data,
    update,
  ]);

  return (
    <section
      className="overflow-hidden rounded-xl border bg-card shadow-sm"
      aria-label={doctorId ? "Doctor patients" : "Patient directory"}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h2 className="font-semibold">
            {doctorId ? "Patients under care" : "Patient directory"}
          </h2>
          <p role="status" className="mt-1 text-xs text-muted-foreground">
            {query.isFetching
              ? "Updating patients…"
              : `${query.data?.meta.total ?? 0} patient records`}
          </p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <Plus className="size-4" />
          Add Patient
        </Button>
      </div>
      <div className="flex flex-wrap items-end gap-3 px-4 py-3">
        <div className="w-full sm:w-80">
          <SearchInput
            label="Search patients, phone…"
            value={filters.search}
            onChange={(search) => update({ search })}
          />
        </div>
        <div className="flex max-w-full flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Condition
          </span>
          <DataTableFacetedFilter
            title="Condition"
            value={filters.condition ? [filters.condition] : []}
            onValueChange={(values) => update({ condition: values[0] ?? "" })}
            options={conditions.map((value) => ({ value, label: value }))}
            singleSelect
          />
        </div>
        {!doctorId && (
          <div className="flex max-w-full flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Assigned doctor
            </span>
            <DataTableFacetedFilter
              title="Assigned doctor"
              disabled={doctors.isPending || doctors.isError}
              value={filters.doctorId ? [filters.doctorId] : []}
              onValueChange={(values) => update({ doctorId: values[0] ?? "" })}
              singleSelect
              options={[
                ...(!doctors.data?.data.some(
                  (doctor) => doctor.id === filters.doctorId,
                ) && filters.doctorId
                  ? [{ value: filters.doctorId, label: "Selected doctor" }]
                  : []),
                ...(doctors.data?.data.map((doctor) => ({
                  value: doctor.id,
                  label: doctor.name,
                })) ?? []),
              ]}
            />
          </div>
        )}
        <DateRangeFilter
          from={filters.from}
          to={filters.to}
          onChange={update}
        />
        <SelectField
          label="Sort by"
          value={filters.sort}
          onChange={(value) => update({ sort: value as typeof filters.sort })}
          options={[
            ...sortOptions,
            { value: "age_asc", label: "Age: youngest first" },
            { value: "age_desc", label: "Age: oldest first" },
          ]}
        />
        {active && (
          <Button
            variant="ghost"
            className="justify-self-start"
            onClick={clear}
          >
            Clear filters
          </Button>
        )}
      </div>
      {!doctorId && doctors.isError && (
        <div className="px-5 pb-4 text-sm text-destructive" role="alert">
          Doctor filter could not load.{" "}
          <Button variant="link" onClick={() => void doctors.refetch()}>
            Retry
          </Button>
        </div>
      )}
      {query.isPending ? (
        <TableSkeleton />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : !query.data.data.length ? (
        <EmptyState
          title={
            active ? "No matching patients" : "Ready for your first patient"
          }
          description={
            active
              ? "Try another search or clear your filters."
              : "Keep care organized by adding a patient record."
          }
          action={
            active ? (
              <Button variant="outline" onClick={clear}>
                Clear filters
              </Button>
            ) : (
              <Button onClick={() => setAdding(true)}>
                <Plus className="size-4" />
                Add Patient
              </Button>
            )
          }
        />
      ) : (
        <div aria-busy={query.isFetching}>
          <ResponsiveRecords
            headers={[
              "Patient",
              "Age / gender",
              "Phone",
              "Condition",
              ...(!doctorId ? ["Assigned doctor"] : []),
              "Joined",
              "Actions",
            ]}
            rows={query.data.data.map((patient) => (
              <PatientRow
                key={patient.id}
                patient={patient}
                doctorId={doctorId}
              />
            ))}
            cards={query.data.data.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                doctorId={doctorId}
              />
            ))}
          />
        </div>
      )}
      {query.data && !query.isError && (
        <Pagination
          meta={query.data.meta}
          page={filters.page}
          limit={filters.limit}
          onChange={update}
          busy={query.isPlaceholderData}
        />
      )}
      {adding && (
        <PatientFormDialog
          doctorId={doctorId}
          onClose={() => setAdding(false)}
        />
      )}
    </section>
  );
}

function PatientActions({
  patient,
  doctorId,
}: {
  patient: Patient;
  doctorId?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const mutation = useDeletePatient();
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${patient.name}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onCloseAutoFocus={(event) => {
            if (editing || deleting) event.preventDefault();
          }}
        >
          <DropdownMenuItem onSelect={() => setEditing(true)}>
            <Pencil className="size-4" />
            Edit patient
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onSelect={() => {
              mutation.reset();
              setDeleting(true);
            }}
          >
            <Trash2 className="size-4" />
            Delete patient
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {editing && (
        <PatientFormDialog
          patient={patient}
          doctorId={doctorId}
          onClose={() => setEditing(false)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          open
          onClose={() => setDeleting(false)}
          title={`Delete ${patient.name}?`}
          description="This permanently deletes the patient record. This action cannot be undone."
          pending={mutation.isPending}
          error={mutation.error}
          onConfirm={() =>
            mutation.mutate(
              { id: patient.id, doctorId },
              {
                onSuccess: () => {
                  toast.success("Patient deleted successfully");
                  setDeleting(false);
                },
              },
            )
          }
        />
      )}
    </>
  );
}

function GenderBadge({ gender }: { gender: Patient["gender"] }) {
  return (
    <ColorBadge
      tone={
        gender === "FEMALE" ? "violet" : gender === "MALE" ? "blue" : "teal"
      }
    >
      {gender.charAt(0) + gender.slice(1).toLowerCase()}
    </ColorBadge>
  );
}
const PatientRow = memo(function PatientRow({
  patient,
  doctorId,
}: {
  patient: Patient;
  doctorId?: string;
}) {
  return (
    <tr className="transition-colors hover:bg-muted/40">
      <td className="break-words px-3 py-2">
        <div className="flex items-center gap-2">
          <InitialsAvatar name={patient.name} compact />
          <span className="font-semibold">{patient.name}</span>
        </div>
      </td>
      <td className="px-3 py-2">
        <p className="text-xs tabular-nums">{patient.age} years</p>
        <GenderBadge gender={patient.gender} />
      </td>
      <td className="break-words px-3 py-2 text-xs tabular-nums">
        {patient.phone}
      </td>
      <td className="px-3 py-2">
        <ColorBadge>{patient.condition}</ColorBadge>
      </td>
      {!doctorId && (
        <td className="break-words px-3 py-2">
          {patient.doctor ? (
            <Link
              className="rounded hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
              href={`/doctors/${encodeURIComponent(patient.doctorId)}`}
            >
              <span className="block font-medium">{patient.doctor.name}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {patient.doctor.specialization}
              </span>
            </Link>
          ) : (
            "Unassigned"
          )}
        </td>
      )}
      <td className="px-3 py-2 text-xs text-muted-foreground">
        {formatDate(patient.createdAt)}
      </td>
      <td className="px-3 py-2">
        <PatientActions patient={patient} doctorId={doctorId} />
      </td>
    </tr>
  );
});
const PatientCard = memo(function PatientCard({
  patient,
  doctorId,
}: {
  patient: Patient;
  doctorId?: string;
}) {
  return (
    <article className="min-w-0 space-y-4 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <InitialsAvatar name={patient.name} />
          <div className="min-w-0">
            <p className="break-words font-semibold">{patient.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {patient.age} years · {patient.phone}
            </p>
          </div>
        </div>
        <PatientActions patient={patient} doctorId={doctorId} />
      </div>
      <div className="flex flex-wrap gap-2">
        <ColorBadge>{patient.condition}</ColorBadge>
        <GenderBadge gender={patient.gender} />
      </div>
      {!doctorId && patient.doctor && (
        <Link
          href={`/doctors/${encodeURIComponent(patient.doctorId)}`}
          className="block break-words text-sm hover:text-primary"
        >
          {patient.doctor.name}
          <span className="ml-2 text-xs text-muted-foreground">
            {patient.doctor.specialization}
          </span>
        </Link>
      )}
      <p className="border-t pt-3 text-xs text-muted-foreground">
        Joined {formatDate(patient.createdAt)}
      </p>
    </article>
  );
});
