"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/feature/userAPI";

export default function PersonalInformationEditPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    image: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avater, setAvater] = useState<string | File | null>(null);

  const router = useRouter();

  const { data: userProfile, isLoading, refetch } = useGetProfileQuery("");
  const [updateProfile] = useUpdateProfileMutation();

  useEffect(() => {
    if (userProfile?.data) {
      setFormData({
        name: userProfile.data.name || "",
        phone: userProfile.data.phone || "",
        image: userProfile.data.image || "",
      });
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvater(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast.error("Name and phone are required!");
      return;
    }

    const formDataHere = new FormData();
    formDataHere.append("name", formData.name);
    formDataHere.append("phone", formData.phone);

    if (avater instanceof File) {
      formDataHere.append("image", avater);
    } else if (avater) {
      toast.error("Failed to update profile!");
    }

    try {
      const res = await updateProfile(formDataHere);

      // Debug: Log full response
      if (res?.data?.success === true) {
        toast.success("Profile updated successfully!");

        // Redirect to the desired route
        refetch();
        router.push("/setting/personal-information");
      } else {
        toast.error("Failed to update profile!");
        console.error("API Error:", res?.error);
      }
    } catch (error) {
      toast.error("Failed to update profile!");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1 w-full">
        <main className="w-full p-4 md:p-6">
          <div className="">
            <div className="mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 px-6 py-3 rounded-xl">
              <Link
                href="/setting/personal-information"
                className="inline-flex items-center text-[#E6E6E6] hover:text-[#5CE1E6]"
              >
                <ArrowLeft className="mr-2 h-6 w-6" />
                <span className="text-2xl font-semibold">
                  Personal Information Edit
                </span>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Image Section */}
                <div className="w-full md:w-64 flex flex-col items-center rounded-md p-6 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400">
                  <div
                    className="relative mb-4 cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden relative">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Image
                          src={
                            process.env.NEXT_PUBLIC_IMAGE_URL +
                            userProfile?.data?.image
                          }
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-200">
                      <Camera className="h-6 w-6 text-gray-600" />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <span className="text-base text-gray-300">Profile</span>
                  <span className="font-medium text-xl text-gray-100">
                    Admin
                  </span>
                </div>

                {/* Form Fields Section */}
                <div className="flex-1 space-y-4">
                  <div className="relative h-12 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 rounded-3xl">
                    <Label className="absolute top-1/2 -translate-y-1/2 left-4 text-lg font-medium text-primary">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00033 8.00065C9.84127 8.00065 11.3337 6.50827 11.3337 4.66732C11.3337 2.82637 9.84127 1.33398 8.00033 1.33398C6.15938 1.33398 4.66699 2.82637 4.66699 4.66732C4.66699 6.50827 6.15938 8.00065 8.00033 8.00065Z"
                          stroke="#B0B0B0"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.7268 14.6667C13.7268 12.0867 11.1601 10 8.0001 10C4.8401 10 2.27344 12.0867 2.27344 14.6667"
                          stroke="#B0B0B0"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 text-lg text-white bg-transparent pl-12"
                    />
                  </div>

                  <div className="relative h-12 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 rounded-3xl">
                    <Label className="absolute top-1/2 -translate-y-1/2 left-4 text-lg font-medium text-primary">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.333 13.6673H4.66634C2.66634 13.6673 1.33301 12.6673 1.33301 10.334V5.66732C1.33301 3.33398 2.66634 2.33398 4.66634 2.33398H11.333C13.333 2.33398 14.6663 3.33398 14.6663 5.66732V10.334C14.6663 12.6673 13.333 13.6673 11.333 13.6673Z"
                          stroke="#B0B0B0"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.3337 6L9.24699 7.66667C8.56032 8.21333 7.43366 8.21333 6.74699 7.66667L4.66699 6"
                          stroke="#B0B0B0"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-12 text-lg text-white bg-transparent pl-12"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-[#5CE1E6] hover:bg-[#5CE1E6] text-white font-semibold rounded-full px-6 py-2 transition-colors duration-300 shadow-md hover:shadow-lg flex items-center"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
