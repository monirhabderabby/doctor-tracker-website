"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";
import { CircleOff, Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { doctorColumnLabels, doctorsColumns, type DoctorRow } from "./column";
import { doctorsQueryOptions } from "./get-doctors-client";

const emptyDoctors: DoctorRow[] = [];

export default function DoctorsTable() {
  const [search, setSearch] = useState("");
  const [request, setRequest] = useState({ query: "", pageIndex: 0 });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRequest((current) =>
        current.query === search.trim()
          ? current
          : { query: search.trim(), pageIndex: 0 },
      );
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const {
    data: response,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery(
    doctorsQueryOptions({
      query: request.query,
      page: request.pageIndex + 1,
    }),
  );
  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    setRequest((current) => {
      const previous = { pageIndex: current.pageIndex, pageSize: 20 };
      const next = typeof updater === "function" ? updater(previous) : updater;
      return { ...current, pageIndex: next.pageIndex };
    });
  };

  return (
    <TableContainer
      data={isError ? emptyDoctors : (response?.data ?? emptyDoctors)}
      columns={doctorsColumns}
      totalItems={response?.meta.total ?? 0}
      pagination={{ pageIndex: request.pageIndex, pageSize: 20 }}
      onPaginationChange={onPaginationChange}
      search={search}
      onSearchChange={setSearch}
      loading={isPending}
      busy={isFetching || search.trim() !== request.query}
      error={isError ? getApiErrorMessage(error) : undefined}
      onRetry={() => {
        void refetch();
      }}
      onFirstPage={() =>
        setRequest((current) => ({ ...current, pageIndex: 0 }))
      }
    />
  );
}

interface TableContainerProps {
  data: DoctorRow[];
  columns: ColumnDef<DoctorRow>[];
  totalItems: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  search: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
  busy: boolean;
  error?: string;
  onRetry: () => void;
  onFirstPage: () => void;
}

function TableContainer({
  data,
  columns,
  totalItems,
  pagination,
  onPaginationChange,
  search,
  onSearchChange,
  loading,
  busy,
  error,
  onRetry,
  onFirstPage,
}: TableContainerProps) {
  "use no memo"; // TanStack Table v8 exposes a mutable table instance.
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // eslint-disable-next-line react-hooks/incompatible-library -- This v8 table component explicitly opts out of compiler memoization above.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
    manualFiltering: true,
    // The API owns ordering. Do not sort only the currently loaded 20 rows.
    enableSorting: false,
    rowCount: totalItems,
    onPaginationChange,
    onColumnVisibilityChange: setColumnVisibility,
    state: { pagination, columnVisibility },
  });

  const emptyMessage = loading ? (
    <div
      className="flex items-center justify-center gap-2 text-muted-foreground"
      role="status"
    >
      <Loader2 className="size-4 animate-spin" /> Loading doctors…
    </div>
  ) : error ? (
    <div className="flex flex-col items-center gap-2 py-5" role="alert">
      <CircleOff className="size-5 text-muted-foreground" />
      <p>{error}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  ) : (
    <div className="space-y-2 py-5">
      <p>
        {search.trim() ? "No doctors match your search." : "No doctors found."}
      </p>
      {pagination.pageIndex > 0 ? (
        <Button type="button" variant="outline" size="sm" onClick={onFirstPage}>
          Back to first page
        </Button>
      ) : (
        search.trim() && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange("")}
          >
            Clear search
          </Button>
        )
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-75">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-label="Search doctors"
            placeholder="Search doctors…"
            maxLength={200}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-9 pl-9 pr-9"
          />
          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} labels={doctorColumnLabels} />
      </div>
      <div aria-busy={busy}>
        <DataTable
          table={table}
          columns={columns}
          emptyMessage={emptyMessage}
        />
      </div>
      <span className="sr-only" role="status">
        {busy ? "Updating doctors…" : `${totalItems} doctors found`}
      </span>
      {!loading && !error && totalItems > 20 && (
        <DataTablePagination
          table={table}
          disabled={busy}
          pageSizeOptions={[20]}
        />
      )}
    </div>
  );
}
