import type { Metadata } from "next";
import { Activity, ShieldCheck, Users } from "lucide-react";
import Logo from "@/components/Logo";
import LoginForm from "./_components/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section
        className="relative hidden flex-col justify-between overflow-hidden bg-teal-950 p-8 text-white sm:p-12 lg:flex lg:p-16"
        aria-label="Doctor Tracker introduction"
      >
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 size-96 rounded-full bg-teal-500/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-20 size-96 rounded-full bg-blue-500/15 blur-3xl"
        />
        <Logo className="relative text-xl" size={40} />
        <div className="relative my-12 max-w-lg lg:my-20">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
            Better connected care
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Care for people.
            <br />
            <span className="text-teal-300">We’ll keep you connected.</span>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-teal-100/75">
            A thoughtful workspace for managing your doctors, patients, and the
            connections that make great care possible.
          </p>
          <div className="mt-8 hidden gap-4 lg:grid">
            {[
              { icon: Users, text: "Your entire care network, in one place" },
              {
                icon: Activity,
                text: "Clear insights into a growing practice",
              },
              { icon: ShieldCheck, text: "Secure access for your team" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 text-sm text-teal-100/80"
              >
                <span className="rounded-lg border border-white/10 bg-white/5 p-2">
                  <Icon className="size-4 text-teal-300" aria-hidden="true" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>
        <p className="relative hidden text-xs text-teal-100/50 lg:block">
          Built around people. Designed for clarity.
        </p>
      </section>
      <section
        className="flex items-center justify-center bg-card px-6 py-12 sm:px-12 lg:p-16"
        aria-label="Sign in"
      >
        <div className="w-full max-w-sm">
          <span className="hidden lg:block">
            <Logo size={44} showText={false} />
          </span>
          <span className="lg:hidden">
            <Logo size={36} />
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight">
            Welcome back
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Sign in to your Doctor Tracker workspace.
          </p>
          <div className="mt-5">
            <LoginForm />
          </div>
          <p className="mt-4 border-t pt-6 text-center text-xs text-muted-foreground">
            Need access? Contact your workspace administrator.
          </p>
        </div>
      </section>
    </main>
  );
}
