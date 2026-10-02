"use client";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AuthUser } from "@/hooks/use-auth";
import { Menu } from "lucide-react";
import { useState } from "react";
import Sidebar from "./sidebar";

interface Props {
  cu: AuthUser;
}

const MobileSidebar = ({ cu }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className="md:hidden" aria-label="Open navigation">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-60 md:hidden" aria-describedby={undefined}>
        <SheetTitle className="sr-only">Doctor Tracker navigation</SheetTitle>
        <Sidebar cu={cu} onNavigationLink={setOpen} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
