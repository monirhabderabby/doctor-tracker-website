import { Stethoscope, Users } from "lucide-react";
import EmptySection from "../../_components/empty-section";

const Page = async ({ params }: PageProps<"/doctors/[id]">) => {
  const { id } = await params;

  return (
    <div className="space-y-5 p-5 md:p-0">
      <div>
        <h2 className="text-2xl font-semibold">Doctor Details</h2>
        <p className="text-sm text-muted-foreground break-all">Doctor ID: {id}</p>
      </div>
      <EmptySection title="Doctor Information" description="Doctor details will appear here." icon={Stethoscope} />
      <EmptySection title="Doctor's Patients" description="This doctor's patients will appear here." icon={Users} />
    </div>
  );
};

export default Page;
