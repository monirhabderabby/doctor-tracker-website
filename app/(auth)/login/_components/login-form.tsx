"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { authQueryKey, AuthUser } from "@/hooks/use-auth";
import { api, getApiErrorMessage } from "@/lib/api";
import { loginSchema, LoginSchemaValues } from "@/schemas/auth/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: LoginSchemaValues) => {
      const response = await api.post<{ success: true; data: AuthUser }>(
        "/auth/login",
        values,
      );
      return response.data.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKey, user);
      router.replace("/");
      router.refresh();
    },
  });
  const pending = mutation.isPending;

  const form = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginSchemaValues) {
    mutation.mutate(values);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 max-w-3xl mx-auto py-5"
        >
          {mutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              {getApiErrorMessage(mutation.error)}
            </p>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email here..."
                    type="email"
                    autoComplete="username"
                    disabled={pending}
                    className="h-9"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Password"
                      autoComplete="current-password"
                      disabled={pending}
                      {...field}
                      className="h-9"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full h-9" disabled={pending}>
            Login Now {pending && <Loader2 className="animate-spin" />}
          </Button>
        </form>
      </Form>
    </>
  );
}
