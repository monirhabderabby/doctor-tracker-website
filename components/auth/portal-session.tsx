"use client";

import Sidebar from "@/app/(dashboard)/_components/sidebar";
import Topbar from "@/app/(dashboard)/_components/top-bar";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

export default function PortalSession({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (auth.isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-6 py-12">
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="w-full max-w-sm rounded-2xl border bg-card p-8 text-center shadow-sm"
        >
          <Logo size={40} className="text-lg text-card-foreground" />
          <div
            aria-hidden="true"
            className="relative mx-auto mb-6 mt-8 flex size-16 items-center justify-center"
          >
            <span className="absolute inset-0 rounded-full border-4 border-primary/10" />
            <Loader2 className="size-5 text-primary motion-safe:animate-spin" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-card-foreground">
            Preparing your workspace
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Just a moment while we load your session.
          </p>
          <div aria-hidden="true" className="mt-6 flex justify-center gap-1.5">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="size-1.5 rounded-full bg-primary/50 motion-safe:animate-pulse"
                style={{ animationDelay: `${dot * 200}ms` }}
              />
            ))}
          </div>
        </div>
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
