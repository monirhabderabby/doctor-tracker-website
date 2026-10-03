"use client";

import Logo from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AlertModal from "@/components/ui/custom/alert-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthUser, useLogout } from "@/hooks/use-auth";
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Doctors", icon: Stethoscope, href: "/doctors" },
  { label: "Patients", icon: Users, href: "/patients" },
];

interface Props {
  cu: AuthUser;
  onNavigationLink?: (state: boolean) => void;
}

const Sidebar = ({ cu, onNavigationLink }: Props) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const logout = useLogout();

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-50 w-60 border-r bg-background">
        <div className="flex h-full flex-col">
          <div className="flex h-24 items-center border-b px-5">
            <div className="flex items-center">
              <Link
                href="/"
                onClick={() => onNavigationLink?.(false)}
                className="text-base focus-visible:outline-2 focus-visible:outline-ring rounded-lg"
              >
                <Logo size={32} />
              </Link>
            </div>
          </div>

          <nav
            aria-label="Main navigation"
            className="flex-1 overflow-auto p-3"
          >
            <ul className="space-y-2">
              {routes.map((route) => {
                const Icon = route.icon;
                const isActive =
                  route.href === "/"
                    ? pathname === "/"
                    : pathname === route.href ||
                      pathname.startsWith(`${route.href}/`);

                return (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      onClick={() => onNavigationLink?.(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-md px-3 text-[14px] py-2 ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{route.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t p-3 hover:bg-gray-50 dark:hover:bg-white/5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open user menu"
                  className="flex items-center justify-between gap-1 w-full cursor-pointer"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-8.75 w-8.75">
                      <AvatarFallback>
                        {cu.name.charAt(0).toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col items-start min-w-0">
                      <span
                        className="text-[14px] truncate w-36 text-left"
                        title={cu.name}
                      >
                        {cu.name}
                      </span>
                      <span
                        className="text-[12px] truncate w-36 text-left"
                        title={cu.email}
                      >
                        {cu.email}
                      </span>
                    </span>
                  </span>
                  <ChevronRight className="shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" className="w-40">
                <DropdownMenuItem
                  onSelect={() => setOpen(true)}
                  disabled={logout.isPending}
                >
                  <LogOut /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <AlertModal
        isOpen={open}
        onClose={() => {
          if (!logout.isPending) setOpen(false);
        }}
        onConfirm={() => logout.mutate()}
        loading={logout.isPending}
        title="Are you sure you want to log out?"
        message="You will be signed out of your account and need to log in again to continue."
      />
    </>
  );
};

export default Sidebar;
