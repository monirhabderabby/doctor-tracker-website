"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDoctorLoad } from "@/hooks/use-tracker";
import {
  ChartSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/tracker-shared";

export default function DoctorLoadChart() {
  const query = useDoctorLoad();
  return (
    <section aria-label="Patients per doctor">
      <h2 className="font-semibold">Patients per doctor</h2>
      <p className="mb-6 mt-1 text-xs text-muted-foreground">
        Top 10 doctors by patients under care
      </p>
      {query.isPending ? (
        <ChartSkeleton />
      ) : query.isError ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : !query.data.length ? (
        <EmptyState
          title="Care connections are on the way"
          description="Assign patients to doctors to see your network’s workload."
        />
      ) : (
        <>
          <ul className="sr-only">
            {query.data.map((doctor) => (
              <li key={doctor.doctorId}>
                {doctor.name}: {doctor.patientCount} patients
              </li>
            ))}
          </ul>
          <div
            className="w-full"
            style={{ height: Math.max(280, query.data.length * 38) }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={query.data}
                layout="vertical"
                accessibilityLayer
                margin={{ left: 0, right: 20 }}
              >
                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="3 4"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value) =>
                    String(value).length > 17
                      ? `${String(value).slice(0, 16)}…`
                      : String(value)
                  }
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--card)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Bar
                  dataKey="patientCount"
                  name="Patients"
                  fill="#0d9488"
                  radius={[0, 5, 5, 0]}
                  maxBarSize={20}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
