"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { Button } from "./button";

export function DataTablePagination<TData>({
  table,
  disabled = false,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: {
  table: Table<TData>;
  disabled?: boolean;
  pageSizeOptions?: number[];
}) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getRowCount();
  const pageCount = table.getPageCount();
  const visibleRows = table.getRowModel().rows.length;
  const start = visibleRows ? pageIndex * pageSize + 1 : 0;
  const end = visibleRows
    ? Math.min(pageIndex * pageSize + visibleRows, totalRows)
    : 0;
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
      <div className="flex-1 text-sm text-muted-foreground">
        {start}–{end} of {totalRows}
      </div>
      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
        {pageSizeOptions.length > 1 ? (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              className="h-8 w-17.5 rounded-md border bg-background px-2"
              aria-label="Rows per page"
              disabled={disabled}
              value={`${table.getState().pagination.pageSize}`}
              onChange={(event) => {
                table.setPageSize(Number(event.target.value));
              }}
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <span className="text-muted-foreground">{pageSize} per page</span>
        )}
        <div className="flex w-25 items-center justify-center text-sm font-medium">
          Page {pageCount ? pageIndex + 1 : 0} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={disabled || !table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={disabled || !table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={disabled || !table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={disabled || !table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

