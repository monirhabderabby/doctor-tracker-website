"use client";

import { memo, useEffect, useId, useState, type ReactNode } from "react";
import {
  Search,
  Users,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import { format, parseISO, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination as PaginationNav,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ListResponse } from "@/lib/tracker-types";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Care workspace
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
export const InitialsAvatar = memo(function InitialsAvatar({
  name,
  large = false,
  compact = false,
}: {
  name: string;
  large?: boolean;
  compact?: boolean;
}) {
  const palette = [
    "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  ];
  const hash = Array.from(name).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl font-semibold",
        large ? "size-20 text-2xl" : compact ? "size-8 text-xs" : "size-10 text-sm",
        palette[hash % palette.length],
      )}
    >
      {name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase()}
    </span>
  );
});
export function ColorBadge({
  children,
  tone = "teal",
}: {
  children: ReactNode;
  tone?: "teal" | "blue" | "violet";
}) {
  const styles = {
    teal: "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
    blue: "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    violet:
      "bg-violet-50 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  };
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-md px-2 py-1 text-xs font-medium break-words",
        styles[tone],
      )}
    >
      {children}
    </span>
  );
}
export function SelectField({
  label,
  options,
  className,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: { value: string; label: string }[];
  className?: string;
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div
      className={cn("flex w-fit max-w-full min-w-0 flex-col gap-2", className)}
    >
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Select
        value={String(value) || "__all__"}
        onValueChange={(next) => onChange(next === "__all__" ? "" : next)}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className="h-10! w-fit max-w-full min-w-0 bg-card px-3 shadow-xs"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          {options.map((option) => (
            <SelectItem
              key={option.value || "__all__"}
              value={option.value || "__all__"}
              className="py-2.5 px-3"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
export function SearchInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return <DebouncedSearch value={value} onChange={onChange} label={label} />;
}
function DebouncedSearch({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const [text, setText] = useState(value);
  const [source, setSource] = useState(value);
  if (source !== value) {
    setSource(value);
    setText(value);
  }
  useEffect(() => {
    if (text.trim() === value) return;
    const timeout = setTimeout(() => onChange(text.trim()), 400);
    return () => clearTimeout(timeout);
  }, [text, value, onChange]);
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-muted-foreground">
      Search
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3 z-10 size-4"
        />
        <Input
          aria-label={label}
          value={text}
          maxLength={200}
          placeholder={label}
          onChange={(event) => setText(event.target.value)}
          className="h-10 rounded-lg bg-card pl-9 shadow-xs"
        />
      </div>
    </label>
  );
}
export function DateRangeFilter({
  from,
  to,
  onChange,
}: {
  from: string;
  to: string;
  onChange: (values: { from?: string; to?: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const id = useId();
  const label = from
    ? `${format(parseISO(from), "dd MMM yyyy")}${to ? ` – ${format(parseISO(to), "dd MMM yyyy")}` : " onward"}`
    : to
      ? `Until ${format(parseISO(to), "dd MMM yyyy")}`
      : "All dates";
  return (
    <div className="flex w-fit max-w-full min-w-0 flex-col gap-2">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        Created date
      </label>
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (next)
            setRange({
              from: from ? parseISO(from) : undefined,
              to: to ? parseISO(to) : undefined,
            });
          setOpen(next);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "h-10 w-fit max-w-full min-w-0 justify-start gap-2 bg-card px-3 text-left font-normal shadow-xs",
              !from && !to && "text-muted-foreground",
            )}
          >
            <CalendarDays className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto max-w-[calc(100vw-2rem)] rounded-xl p-0"
        >
          <div className="flex gap-2 border-b p-3">
            {[7, 30].map((days) => (
              <Button
                key={days}
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  const today = parseISO(
                    new Intl.DateTimeFormat("en-CA", {
                      timeZone: "Asia/Dhaka",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }).format(new Date()),
                  );
                  setRange({ from: subDays(today, days - 1), to: today });
                }}
              >
                Last {days} days
              </Button>
            ))}
          </div>
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            defaultMonth={range?.from ?? range?.to}
            numberOfMonths={1}
            className="p-3 [--cell-size:2.25rem]"
          />
          <div className="flex items-center justify-between gap-3 border-t p-3">
            <Button
              variant="ghost"
              className="h-9"
              onClick={() => {
                onChange({ from: "", to: "" });
                setOpen(false);
              }}
            >
              Clear dates
            </Button>
            <Button
              disabled={!range?.from}
              className="h-9 px-4"
              onClick={() => {
                onChange({
                  from: range?.from ? format(range.from, "yyyy-MM-dd") : "",
                  to: range?.to ? format(range.to, "yyyy-MM-dd") : "",
                });
                setOpen(false);
              }}
            >
              Apply range
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
export function EmptyState({
  title = "No records yet",
  description = "Add your first record to get started.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
      <span className="rounded-2xl bg-primary/10 p-4 text-primary">
        <Users className="size-6" />
      </span>
      <p className="font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
export function ErrorState({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 px-4 py-10 text-center"
    >
      <AlertCircle className="size-6 text-destructive" />
      <p className="text-sm">{getApiErrorMessage(error)}</p>
      <Button variant="outline" onClick={retry}>
        Try again
      </Button>
    </div>
  );
}
export function TableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading records"
      className="space-y-3 rounded-xl border bg-card p-5"
    >
      <span className="sr-only">Loading records</span>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex gap-4 border-b py-3">
          <div className="size-10 animate-pulse rounded-xl bg-muted" />
          <div className="flex-1 space-y-3">
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
export function ChartSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading chart"
      className="h-72 animate-pulse rounded-xl bg-muted/60"
    >
      <span className="sr-only">Loading chart</span>
    </div>
  );
}
export function Pagination({
  meta,
  page,
  limit,
  onChange,
  busy = false,
  summary,
}: {
  meta: ListResponse<unknown>["meta"];
  page: number;
  limit: number;
  onChange: (values: { page?: number; limit?: 10 | 20 | 50 }) => void;
  busy?: boolean;
  summary?: ReactNode;
}) {
  const pages = Array.from(
    new Set([1, page - 1, page, page + 1, meta.totalPages]),
  )
    .filter((value) => value > 0 && value <= meta.totalPages)
    .sort((a, b) => a - b);
  const start = meta.total ? Math.min((page - 1) * limit + 1, meta.total) : 0;
  return (
    <div className="flex flex-col gap-4 border-t px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground" role="status">
        {summary ?? (
          <>
            Showing{" "}
            <span className="font-medium text-foreground">
              {start}–{Math.min(page * limit, meta.total)}
            </span>{" "}
            of <span className="font-medium text-foreground">{meta.total}</span>
          </>
        )}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={String(limit)}
            onValueChange={(value) =>
              onChange({ limit: Number(value) as 10 | 20 | 50 })
            }
          >
            <SelectTrigger
              aria-label="Rows per page"
              className="h-10! w-20 bg-card"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {[10, 20, 50].map((value) => (
                <SelectItem key={value} value={String(value)} className="py-2">
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <PaginationNav className="mx-0 w-auto" aria-label="Pagination">
          <PaginationContent className="gap-2">
            <PaginationItem>
              <Button
                variant="outline"
                className="size-10 p-0"
                aria-label="Previous page"
                disabled={page <= 1 || busy}
                onClick={() => onChange({ page: page - 1 })}
              >
                <ArrowLeft className="size-4" />
              </Button>
            </PaginationItem>
            {pages.map((value, index) => (
              <PaginationItem
                key={value}
                className={cn(
                  "items-center gap-2",
                  value === page ? "flex" : "hidden sm:flex",
                )}
              >
                {index > 0 && value - pages[index - 1] > 1 && (
                  <PaginationEllipsis className="hidden size-10 sm:flex" />
                )}
                <Button
                  className="size-10 p-0 font-medium"
                  variant={page === value ? "default" : "outline"}
                  aria-label={`Page ${value}`}
                  aria-current={page === value ? "page" : undefined}
                  disabled={busy}
                  onClick={() => onChange({ page: value })}
                >
                  {value}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                variant="outline"
                className="size-10 p-0"
                aria-label="Next page"
                disabled={page >= meta.totalPages || busy}
                onClick={() => onChange({ page: page + 1 })}
              >
                <ArrowRight className="size-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </PaginationNav>
      </div>
    </div>
  );
}
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  pending,
  title,
  description,
  error,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pending: boolean;
  title: string;
  description: string;
  error?: unknown;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !pending) onClose();
      }}
    >
      <DialogContent
        showCloseButton={!pending}
        className="w-[calc(100%-2rem)] rounded-xl"
        onEscapeKeyDown={(event) => {
          if (pending) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {Boolean(error) && (
          <p role="alert" className="text-sm text-destructive">
            {getApiErrorMessage(error)}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export function formatDate(value?: string) {
  return value
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date(value))
    : "—";
}
