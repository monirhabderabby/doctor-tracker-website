"use client";

import {
  flexRender,
  type ColumnDef,
  type Table as TableInstance,
} from "@tanstack/react-table";
import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: TableInstance<TData>;
  emptyMessage?: ReactNode;
  bordered?: boolean;
}

export function DataTable<TData, TValue>({
  table,
  emptyMessage = "No results.",
  bordered = true,
}: DataTableProps<TData, TValue>) {
  return (
    <div>
      <div
        className={
          bordered
            ? "overflow-hidden rounded-lg border"
            : "overflow-hidden border-y"
        }
      >
        <Table className="table-fixed">
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: `${(header.getSize() / table.getTotalSize()) * 100}%`,
                      }}
                      className="h-12 whitespace-normal px-3 text-xs text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-3 py-4 whitespace-normal break-words"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={Math.max(table.getVisibleLeafColumns().length, 1)}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
