import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
}

const EmptySection = ({ title, description, icon: Icon }: Props) => {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md border border-dashed p-6 text-center text-muted-foreground">
          <Icon className="h-8 w-8" aria-hidden="true" />
          <p className="text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptySection;
