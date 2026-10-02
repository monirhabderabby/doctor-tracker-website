"use client";

import { api, getApiErrorMessage } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export const authQueryKey = ["auth", "me"] as const;

export function useAuth() {
  return useQuery({
    queryKey: authQueryKey,
    queryFn: async ({ signal }) => {
      const response = await api.get<{ success: true; data: AuthUser }>("/auth/me", { signal });
      return response.data.data;
    },
    retry: false,
    staleTime: 60_000,
    refetchOnMount: "always",
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
