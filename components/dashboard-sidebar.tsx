"use client";

import type React from "react";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Settings,
  Notebook,
  BookAIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import LogoutModal from "./logout-modal";
import { useState } from "react";

import logo from "@/public/tenis.jpg";
import { logout } from "@/service/authService";

export default function DashboardSidebar() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    // Perform logout actions here (clear tokens, etc.)
    // Redirect to login page

    await logout();

    localStorage.removeItem("accessToken");

    router.push("/signin");
  };

  if (
    pathname === "/signin" ||
    pathname === "/create-account" ||
    pathname === "/forget-password" ||
    pathname === "/verify-password" ||
    pathname === "/verify-otp" ||
    pathname === "/reset-password"
  ) {
    return null;
  }

  return (
    <>
      <div className="!bg-[#F2F6FF] md:!bg-[#F2F6FF]">
        <Sidebar className="border-r-0 border-transparent fixed left-0 h-full z-30 !bg-[#F2F6FF] md:!bg-transparent">
          <SidebarContent>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-6"
            >
              <Image
                src={logo}
                alt="logo"
                width={140}
                height={140}
                className="h-20 w-20 rounded-md object-cover"
              />
            </Link>

            <SidebarMenu className="px-6 space-y-6">
              <NavItem
                href="/"
                icon={LayoutDashboard}
                label="Dashboard"
                active={pathname === "/"}
              />
              <NavItem
                href="/users"
                icon={Users}
                label="Users"
                active={pathname === "/users" || pathname.startsWith("/users")}
              />
              <NavItem
                href="/bookingList"
                icon={Notebook}
                label="Booking List"
                active={
                  pathname === "/bookingList" ||
                  pathname.startsWith("/bookingList")
                }
              />

              <NavItem
                href="/court"
                icon={BookAIcon}
                label="Court"
                active={pathname === "/court" || pathname.startsWith("/court")}
              />

              <NavItem
                href="/setting"
                icon={Settings}
                label="Setting"
                active={
                  pathname === "/setting" || pathname.startsWith("/setting/")
                }
              />
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-6">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex w-full items-center gap-3  px-4 py-3"
            >
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.4 7.56023C9.71 3.96023 11.56 2.49023 15.61 2.49023H15.74C20.21 2.49023 22 4.28023 22 8.75023V15.2702C22 19.7402 20.21 21.5302 15.74 21.5302H15.61C11.59 21.5302 9.74 20.0802 9.41 16.5402"
                  stroke="#4F3E19"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5 12H4.12"
                  stroke="#4F3E19"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.35 8.65039L3 12.0004L6.35 15.3504"
                  stroke="#4F3E19"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="text-primary text-lg font-semibold">
                Log out
              </span>
            </button>
          </SidebarFooter>
        </Sidebar>
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      </div>
    </>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}

function NavItem({ href, icon: Icon, label, active }: NavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 px-4 !py-5 transition-colors rounded-full",
            active
              ? "bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-white"
              : "hover:bg-gradient-to-br hover:from-blue-600 hover:via-blue-500 hover:to-teal-400 hover:text-white"
          )}
        >
          <Icon size={18} />
          <span className={`text-lg ${active ? "text-secondary" : ""}`}>
            {label}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
