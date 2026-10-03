import { api } from "./api";
import type { AuthUser } from "@/hooks/use-auth";
import type { LoginSchemaValues } from "@/schemas/auth/login";

export async function login(values: LoginSchemaValues) {
  const response = await api.post<{ success: true; data: AuthUser }>(
    "/auth/login",
    values,
  );
  return response.data.data;
}
