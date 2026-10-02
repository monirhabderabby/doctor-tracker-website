import { Stethoscope } from "lucide-react";
import EmptySection from "../_components/empty-section";

const Page = () => {
  return (
    <div className="space-y-5 p-5 md:p-0">
      <h2 className="text-2xl font-semibold">Doctors</h2>
      <EmptySection title="Doctors List" description="The doctors list will appear here." icon={Stethoscope} />
    </div>
  );
};

export default Page;
