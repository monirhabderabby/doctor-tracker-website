import { Users } from "lucide-react";
import EmptySection from "../_components/empty-section";

const Page = () => {
  return (
    <div className="space-y-5 p-5 md:p-0">
      <h2 className="text-2xl font-semibold">Patients</h2>
      <EmptySection title="Patients List" description="The patients list will appear here." icon={Users} />
    </div>
  );
};

export default Page;
