import { PageHeader, TableSkeleton } from "@/components/ui/tracker-shared";
import type { Metadata } from "next";
import { Suspense } from "react";
import PatientsList from "./_components/patients-list";

export const metadata: Metadata = { title: "Patients" };

const Page = () => {
  return (
    <div className="mx-auto  space-y-7">
      <PageHeader
        title="Patients"
        description="Every patient, every care connection, in one place."
      />
      <Suspense fallback={<TableSkeleton />}>
        <PatientsList />
      </Suspense>
    </div>
  );
};

export default Page;
