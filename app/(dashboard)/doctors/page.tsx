import { Button } from "@/components/ui/button";
import { PageHeader, TableSkeleton } from "@/components/ui/tracker-shared";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import AddDoctorModal from "./_components/add-doctor-modal";
import DoctorsTable from "./_components/doctors-table";

export const metadata: Metadata = { title: "Doctors" };

export default function Page() {
  return (
    <div className="mx-auto space-y-7">
      <PageHeader
        title="Doctors"
        description="The people at the heart of your care network."
        action={
          <AddDoctorModal
            trigger={
              <Button className="h-10">
                <Plus aria-hidden="true" />
                Add Doctor
              </Button>
            }
          />
        }
      />

      <Suspense fallback={<TableSkeleton />}>
        <DoctorsTable />
      </Suspense>
    </div>
  );
}
