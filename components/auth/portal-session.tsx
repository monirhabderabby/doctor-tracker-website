"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/app/(dashboard)/_components/sidebar";
import Topbar from "@/app/(dashboard)/_components/top-bar";
import { getApiErrorMessage } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

export default function PortalSession({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (auth.isPending) {
    return (
      <div role="status" className="flex items-center justify-center gap-2 p-8">
        <Loader2 className="animate-spin" />
        Loading your session...
      </div>
    );
  }

  if (auth.isError) {
    return (
      <div className="space-y-4 p-8">
        <p role="alert">{getApiErrorMessage(auth.error)}</p>
        <Button onClick={() => void auth.refetch()} disabled={auth.isFetching}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="dashboard-shell flex flex-col h-screen">
      <aside className="hidden md:block">
        <Sidebar cu={auth.data} />
      </aside>
      <div className="md:ml-60 flex flex-1 flex-col h-full min-h-0 min-w-0">
        <Topbar cu={auth.data} />
        <main className="relative bg-background h-[calc(100vh-64px)] overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
