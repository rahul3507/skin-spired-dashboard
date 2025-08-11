"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit } from "lucide-react";

import { useEffect, useState } from "react";
import { useGetUserProfileQuery } from "@/redux/feature/userAPI";
import Loading from "@/components/Loading";

export default function PersonalInformationPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });

  const { data: userProfile, isLoading, refetch } = useGetUserProfileQuery("");

  useEffect(() => {
    if (userProfile) {
      setUser({
        name: userProfile?.data?.name,
        email: userProfile?.data?.email,
        phone: userProfile?.data?.phone,
        profileImage:
          process.env.NEXT_PUBLIC_IMAGE_URL + userProfile?.data?.image,
      });
    }
  }, [userProfile]);

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-background2">
      <div className="flex-1 w-full">
        <main className="w-[98%] mx-auto p-4 md:p-6 bg-[#FFFFFF] rounded-md">
          <div className="">
            <div className="w-full  mb-6 flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400">
              <Link
                href="/setting"
                className="inline-flex items-center text-white hover:text-[#2a2c2c]"
              >
                <ArrowLeft className="mr-2 h-6 w-6" />
                <span className="text-2xl font-semibold">
                  Personal Information
                </span>
              </Link>
            </div>

            <div className="rounded-md shadow">
              <div className="flex flex-col md:flex-row gap-8 mb-6">
                {/* Profile Photo Section */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 w-full md:w-64 flex flex-col items-center p-6 rounded-2xl">
                  <div className="w-32 h-32 rounded-full overflow-hidden relative mb-3">
                    <Image
                      src={user?.profileImage}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-base text-white">Profile</span>
                  <span className="font-medium text-lg text-white">Admin</span>
                </div>

                {/* User Information Section */}
                <div className="flex-1 space-y-4">
                  <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 flex gap-4 py-3 px-6 rounded-xl">
                    <div className="text-lg font-medium text-white ">Name:</div>
                    <div className="text-lg  text-white">{user?.name}</div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 flex gap-4 py-3 px-6 rounded-xl">
                    <div className="text-lg font-medium text-white">Email:</div>
                    <div className="md:col-span-2 text-lg text-white">
                      {user?.email}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 flex gap-4 py-3 px-6 rounded-xl">
                    <div className="text-lg font-medium text-white">Phone:</div>
                    <div className="md:col-span-2 text-lg text-white">
                      {user?.phone}
                    </div>
                  </div>

                  <div className="justify-self-end">
                    <Link
                      href="/setting/personal-information/edit"
                      className="flex items-center gap-2 bg-button px-5 py-2 rounded-3xl font-medium text-secondary"
                    >
                      <span>Edit Profile</span>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
