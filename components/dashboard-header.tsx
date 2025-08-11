"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetUserProfileQuery } from "@/redux/feature/userAPI";
import { useGetNotificationCountQuery } from "@/redux/feature/notificationAPI";

export default function DashboardHeader() {
  const pathname = usePathname();
  const { data: userProfile } = useGetUserProfileQuery("");

  const { data } = useGetNotificationCountQuery();

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
    <header className="w-[98%] mx-auto sticky top-0 z-20 flex h-[72px] items-center justify-between bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 px-4 text-white rounded md:px-6 my-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-white md:hidden" />
        <div>
          <h1 className="text-2xl font-medium">
            Welcome, {userProfile?.data?.name}
          </h1>
          <p className="text-sm opacity-80">Have a nice day</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/notifications" className="relative text-white">
            {data?.data ? (
              <span
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white"
                aria-label={`${data.data} new notifications`}
              >
                {data.data}
              </span>
            ) : (
              <span
                className="absolute -right-1 -top-1 flex h-2 w-2 rounded-full bg-red-500"
                aria-hidden="true"
              />
            )}
            <Bell className="h-6 w-6" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/setting/personal-information">
            <Avatar>
              <AvatarImage
                src={
                  process.env.NEXT_PUBLIC_IMAGE_URL + userProfile?.data?.image
                }
                alt={userProfile?.name}
              />
              <AvatarFallback>{userProfile?.name}</AvatarFallback>
            </Avatar>
          </Link>
          <span className="hidden md:inline">{userProfile?.data?.name} </span>
        </div>
      </div>
    </header>
  );
}
