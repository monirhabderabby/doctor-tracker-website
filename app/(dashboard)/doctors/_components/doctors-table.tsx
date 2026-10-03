"use client";

import { useEffect, useState, memo } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";
import { useDoctorSpecializations } from "@/hooks/use-tracker";
import {
  ColorBadge,
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
import { sortOptions } from "@/lib/constants";
import { doctorsColumns, doctorColumnLabels, type DoctorRow } from "./column";
import { doctorsQueryOptions } from "./get-doctors-client";
import DoctorRowAction from "./doctor-row-action";

const emptyDoctors: DoctorRow[] = [];

export default function DoctorsTable() {
  "use no memo";
  const { filters, update, clear, active } = useUrlFilters("doctors");
  const query = useQuery(doctorsQueryOptions(filters));
  const specializations = useDoctorSpecializations();
  const client = useQueryClient();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table v8 exposes a mutable table instance.
  const table = useReactTable({
    data: query.data?.data ?? emptyDoctors,
    columns: doctorsColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
    manualFiltering: true,
    enableSorting: false,
    rowCount: query.data?.meta.total ?? 0,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      pagination: { pageIndex: filters.page - 1, pageSize: filters.limit },
      columnVisibility,
    },
  });
  const totalPages = query.data?.meta.totalPages ?? 0;
  const placeholder = query.isPlaceholderData;
  useEffect(() => {
    if (!placeholder && filters.page < totalPages)
      void client.prefetchQuery(
        doctorsQueryOptions({ ...filters, page: filters.page + 1 }),
      );
    if (!placeholder && query.data && filters.page > Math.max(1, totalPages))
      update({ page: Math.max(1, totalPages) });
  }, [client, filters, totalPages, placeholder, query.data, update]);

  return (
    <section
      className="overflow-hidden rounded-xl border bg-card shadow-sm"
      aria-label="Doctors directory"
    >
      <div className="flex flex-wrap items-end gap-4 p-5">
        <div className="w-full sm:w-80">
          <SearchInput
            label="Search doctors, hospitals…"
            value={filters.search}
            onChange={(search) => update({ search })}
          />
        </div>
        <div className="flex max-w-full flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Specialization
          </span>
          <DataTableFacetedFilter
            title="Specialization"
            options={specializations.data ?? []}
            value={filters.specialization ? [filters.specialization] : []}
            onValueChange={(values) =>
              update({ specialization: values[0] ?? "" })
            }
            singleSelect
            disabled={specializations.isPending || specializations.isError}
          />
        </div>
        <DateRangeFilter
          from={filters.from}
          to={filters.to}
          onChange={update}
        />
        <SelectField
          label="Sort by"
          value={filters.sort}
          onChange={(value) => update({ sort: value as typeof filters.sort })}
          options={sortOptions}
        />
        <div className="ml-auto flex items-center gap-2">
          {active && (
            <Button variant="ghost" size="sm" onClick={clear}>
              Clear filters
            </Button>
          )}
          <span className="hidden lg:block">
            <DataTableViewOptions table={table} labels={doctorColumnLabels} />
          </span>
        </div>
      </div>
      {specializations.isError && (
        <div role="alert" className="px-5 pb-3 text-sm text-destructive">
          Unable to load specializations.{" "}
          <Button variant="link" onClick={() => void specializations.refetch()}>
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
            active ? "No matching doctors" : "Your care network starts here"
          }
          description={
            active
              ? "Try another search or clear your filters."
              : "Use Add Doctor to introduce your first doctor."
          }
          action={
            active ? (
              <Button variant="outline" onClick={clear}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div aria-busy={query.isFetching}>
          <div className="hidden lg:block">
            <DataTable
              table={table}
              columns={doctorsColumns}
              bordered={false}
            />
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:hidden">
            {query.data.data.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      )}
      {query.data && !query.isError && (
        <Pagination
          meta={query.data.meta}
          page={filters.page}
          limit={filters.limit}
          onChange={update}
          busy={query.isPlaceholderData}
          summary={
            query.isFetching
              ? "Updating directory…"
              : `${query.data.meta.total} doctors in your network`
          }
        />
      )}
    </section>
  );
}

const DoctorCard = memo(function DoctorCard({ doctor }: { doctor: DoctorRow }) {
  return (
    <article className="min-w-0 space-y-4 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/doctors/${encodeURIComponent(doctor.id)}`}
          className="flex min-w-0 items-center gap-3 rounded focus-visible:outline-2 focus-visible:outline-ring"
        >
          <InitialsAvatar name={doctor.name} />
          <span className="min-w-0">
            <span className="block font-semibold break-words">
              {doctor.name}
            </span>
            <span className="block break-all text-xs text-muted-foreground">
              {doctor.email}
            </span>
          </span>
        </Link>
        <DoctorRowAction data={doctor} />
      </div>
      <ColorBadge>{doctor.specialization}</ColorBadge>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Hospital</dt>
          <dd className="mt-1 break-words">{doctor.hospital}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Phone</dt>
          <dd className="mt-1 break-words">{doctor.phone}</dd>
        </div>
      </dl>
      <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
        <span>{doctor.patientCount} patients</span>
        <span>{formatDate(doctor.createdAt)}</span>
      </div>
    </article>
  );
});
