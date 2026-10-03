import { TableSkeleton } from "@/components/ui/tracker-shared";
import type { Metadata } from "next";
import { Suspense } from "react";
import DoctorProfile from "./_components/doctor-profile";

export const metadata: Metadata = { title: "Doctor details" };

const Page = async ({ params }: PageProps<"/doctors/[id]">) => {
  const { id } = await params;

  return (
    <div className="mx-auto">
      <Suspense fallback={<TableSkeleton />}>
        <DoctorProfile id={id} />
      </Suspense>
    </div>
  );
};

export default Page;
