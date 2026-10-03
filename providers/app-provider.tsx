"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

const AppProvider = ({ children }: Props) => {
  // Create a client
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <NextTopLoader showSpinner={false} color="#0d9488" />
      <Toaster richColors position="top-center" closeButton duration={3000} />
    </>
  );
};

export default AppProvider;
