import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddDoctorModal from "./_components/add-doctor-modal";
import DoctorsTable from "./_components/doctors-table";

export default function Page() {
  return (
    <div className="space-y-5 p-5 md:p-0">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold leading-none tracking-tight">
          Doctors
        </h1>
        <AddDoctorModal
          trigger={
            <Button className="h-9">
              <Plus aria-hidden="true" />
              Create Doctor
            </Button>
          }
        />
      </div>

      <DoctorsTable />
    </div>
  );
}
