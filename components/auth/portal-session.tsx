"use client";

import { Button } from "@/components/ui/button";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

export default function PortalSession({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const logout = useLogout();

  if (auth.isPending) {
    return <div role="status" className="flex items-center justify-center gap-2 p-8"><Loader2 className="animate-spin" />Loading your session...</div>;
  }

  if (auth.isError) {
    return (
      <div className="space-y-4 p-8">
        <p role="alert">{getApiErrorMessage(auth.error)}</p>
        <Button onClick={() => void auth.refetch()} disabled={auth.isFetching}>Try again</Button>
      </div>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
        <span className="font-semibold">Doctor Tracker</span>
        <div className="flex items-center gap-4">
          <span>{auth.data.name}</span>
          <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
            {logout.isPending && <Loader2 className="animate-spin" />}Logout
          </Button>
        </div>
      </header>
      {children}
    </>
  );
}
