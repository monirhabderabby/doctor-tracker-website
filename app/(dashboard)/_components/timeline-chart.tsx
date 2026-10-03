"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTimeline } from "@/hooks/use-tracker";
import type { TimelineRange } from "@/lib/tracker-types";
import {
  ChartSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/tracker-shared";
import { cn } from "@/lib/utils";

export default function TimelineChart() {
  const [range, setRange] = useState<TimelineRange>("7d");
  const query = useTimeline(range);
  return (
    <section aria-label="Registration timeline">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Growing your care network</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            New doctor and patient registrations over time
          </p>
        </div>
        <div
          className="flex rounded-lg bg-muted p-1"
          role="group"
          aria-label="Timeline range"
        >
          {(["7d", "30d", "12m"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={range === value}
              onClick={() => setRange(value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                range === value
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {value === "7d"
                ? "7 days"
                : value === "30d"
                  ? "30 days"
                  : "12 months"}
            </button>
          ))}
        </div>
      </div>
      {query.isPending ? (
        <ChartSkeleton />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : !query.data.data.some((point) => point.doctors || point.patients) ? (
        <EmptyState
          title="Your growth story starts here"
          description="New registrations will appear in this timeline."
        />
      ) : (
        <>
          <p className="sr-only">
            {query.data.data.reduce((sum, point) => sum + point.doctors, 0)}{" "}
            doctors and{" "}
            {query.data.data.reduce((sum, point) => sum + point.patients, 0)}{" "}
            patients registered during this range.
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={query.data.data}
                accessibilityLayer
                margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
              >
                <defs>
                  <linearGradient id="patient-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity={0.25} />
                    <stop
                      offset="100%"
                      stopColor="#0d9488"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                  <linearGradient id="doctor-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop
                      offset="100%"
                      stopColor="#3b82f6"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="3 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={30}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value) =>
                    range === "12m" ? String(value) : String(value).slice(5)
                  }
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                />
                <Area
                  type="monotone"
                  dataKey="patients"
                  name="Patients"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  fill="url(#patient-fill)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="doctors"
                  name="Doctors"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#doctor-fill)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
