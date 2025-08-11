"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGetAboutUsQuery } from "@/redux/feature/settingAPI";
import Loading from "@/components/Loading";

export default function AboutUsPage() {
  const { data, isLoading } = useGetAboutUsQuery("");

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 w-full">
        <main className="w-full p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/setting"
                className="inline-flex items-center text-primary hover:text-teal-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="text-xl font-semibold">About Us</span>
              </Link>
              <Link
                href="/setting/about-us/edit"
                className="inline-flex items-center text-primary hover:text-teal-700 border border-[#760C2A] rounded-md px-4 py-1.5"
              >
                <span className="text-xl font-semibold">Edit</span>
              </Link>
            </div>

            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-semibold mb-4">About Us</h2>

              <p className="mb-4">{data?.data[0]?.description}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
