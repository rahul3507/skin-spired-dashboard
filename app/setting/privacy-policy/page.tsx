"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGetPrivacyPolicyQuery } from "@/redux/feature/settingAPI";
import Loading from "@/components/Loading";

export default function PrivacyPolicyPage() {
  const { data: privacyPolicy, isLoading } = useGetPrivacyPolicyQuery("");

  const privacy = privacyPolicy?.data[0]?.description;

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent text-primary">
      <div className="flex-1 w-full">
        <main className="w-full p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/setting"
                className="inline-flex items-center text-primary hover:text-teal-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="text-xl font-semibold">Privacy Policy</span>
              </Link>

              <Link
                href="/setting/privacy-policy/edit"
                className="inline-flex items-center text-primary hover:text-teal-700 border border-primary rounded-md px-4 py-1.5"
              >
                <span className="text-xl font-semibold">Edit</span>
              </Link>
            </div>

            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>
            </div>

            <div>
              <p className="mb-4">{privacy}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
