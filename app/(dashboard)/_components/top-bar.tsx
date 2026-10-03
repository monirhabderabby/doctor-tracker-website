"use client";

import { ThemeToggle } from "@/components/ui/custom/theme-toggle";
import { AuthUser } from "@/hooks/use-auth";
import MobileSidebar from "./mobile-sidebar";

interface Props {
  cu: AuthUser;
}

const Topbar = ({ cu }: Props) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-3 min-w-0">
        <MobileSidebar cu={cu} />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">
            Your care network, connected
          </p>
          <p className="text-xs text-muted-foreground truncate">
            Welcome back, {cu.name}
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
};

export default Topbar;
