"use client";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import {
  ChartSkeleton,
  ErrorState,
  PageHeader,
} from "@/components/ui/tracker-shared";
import { useDashboardSummary } from "@/hooks/use-tracker";
import {
  Activity,
  ArrowUpRight,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const TimelineChart = dynamic(() => import("./timeline-chart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const DoctorLoadChart = dynamic(() => import("./doctor-load-chart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const ConditionsChart = dynamic(() => import("./conditions-chart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

export default function DashboardOverview() {
  const summary = useDashboardSummary();
  const data = summary.data;
  return (
    <div className="mx-auto  space-y-7">
      <PageHeader
        title="Care at a glance"
        description="A clear picture of your people, growth, and care network."
        action={
          <Button asChild variant="outline">
            <Link href="/doctors">
              View doctors
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        }
      />
      {summary.isPending ? (
        <div
          role="status"
          aria-label="Loading summary"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-xl border bg-card p-5"
            >
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="mt-6 h-9 w-1/3 rounded bg-muted" />
              <div className="mt-4 h-3 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : summary.isError ? (
        <div className="rounded-xl border bg-card">
          <ErrorState
            error={summary.error}
            retry={() => void summary.refetch()}
          />
        </div>
      ) : (
        data && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total doctors"
              value={data.totalDoctors.toLocaleString()}
              description={`${data.newDoctorsLast7Days} joined in the last 7 days`}
              icon={Stethoscope}
            />
            <StatCard
              title="Total patients"
              value={data.totalPatients.toLocaleString()}
              description={`${data.newPatientsLast7Days} added in the last 7 days`}
              icon={Users}
            />
            <StatCard
              title="Patients per doctor"
              value={data.avgPatientsPerDoctor.toLocaleString(undefined, {
                maximumFractionDigits: 1,
              })}
              description="Average across your care network"
              icon={Activity}
            />
            <StatCard
              title="New this week"
              value={(
                data.newDoctorsLast7Days + data.newPatientsLast7Days
              ).toLocaleString()}
              description={`${data.newDoctorsLast7Days} doctors · ${data.newPatientsLast7Days} patients`}
              icon={UserPlus}
            />
          </div>
        )
      )}
      <div className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <TimelineChart />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="min-w-0 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
          <DoctorLoadChart />
        </div>
        <div className="min-w-0 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
          <ConditionsChart />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Registration trends are grouped in Asia/Dhaka time.
      </p>
    </div>
  );
}
