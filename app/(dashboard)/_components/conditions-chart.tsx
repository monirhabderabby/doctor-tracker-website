"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useConditions } from "@/hooks/use-tracker";
import {
  ChartSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/tracker-shared";

const colors = [
  "#0d9488",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
  "#64748b",
  "#84cc16",
  "#a3a3a3",
];

export default function ConditionsChart() {
  const query = useConditions();
  return (
    <section aria-label="Condition distribution">
      <h2 className="font-semibold">Understanding patient needs</h2>
      <p className="mb-6 mt-1 text-xs text-muted-foreground">
        A snapshot of conditions across your patients
      </p>
      {query.isPending ? (
        <ChartSkeleton />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : !query.data.total ? (
        <EmptyState
          title="A clearer picture with every patient"
          description="Patient conditions will appear here as your network grows."
        />
      ) : (
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="relative h-64 w-full min-w-0 sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart accessibilityLayer>
                <Pie
                  data={query.data.data}
                  dataKey="count"
                  nameKey="condition"
                  innerRadius="65%"
                  outerRadius="90%"
                  paddingAngle={3}
                  stroke="var(--card)"
                  strokeWidth={3}
                  isAnimationActive={false}
                >
                  {query.data.data.map((item, index) => (
                    <Cell
                      key={item.condition}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-semibold tabular-nums">
                {query.data.total.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Total patients
              </p>
            </div>
          </div>
          <ul className="w-full space-y-3 sm:w-1/2">
            {query.data.data.map((item, index) => (
              <li
                key={item.condition}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: colors[index % colors.length] }}
                  />
                  <span className="break-words text-muted-foreground">
                    {item.condition}
                  </span>
                </span>
                <span className="shrink-0 font-medium tabular-nums">
                  {item.count}{" "}
                  <span className="ml-1 text-muted-foreground">
                    ({Math.round((item.count / query.data.total) * 100)}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
