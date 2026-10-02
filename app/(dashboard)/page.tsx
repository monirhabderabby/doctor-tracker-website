import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartColumn, ChartLine } from "lucide-react";
import EmptySection from "./_components/empty-section";

const Page = () => {
  return (
    <div className="space-y-5 p-5 md:p-0">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {["Total Doctors", "Total Patients"].map((title) => (
          <Card key={title}>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">{title}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">—</p>
              <p className="mt-2 text-sm text-muted-foreground">No data available yet.</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <EmptySection title="Doctor Overview" description="Doctor statistics will appear here." icon={ChartColumn} />
        <EmptySection title="Patient Overview" description="Patient trends will appear here." icon={ChartLine} />
      </div>
    </div>
  );
};

export default Page;
