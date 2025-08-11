"use client";

import type React from "react";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

import logos from "@/public/banner.png";
import { useForgetPasswordMutation } from "@/redux/feature/authAPI";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [forget] = useForgetPasswordMutation();

  const router = useRouter();
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSuccess(true);

      // await forget(email);

      const res = await forget({
        email,
      }).unwrap();

      if (res.success === true) {
        router.push("/verify-otp?email=" + email);
      }
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Tennis player image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <Image
            src={logos}
            alt="Tennis player on blue court"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right side - Success message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  OTP Sent!
                </h2>
                <p className="text-gray-600">
                  We've sent a verification code to {email}. Please check your
                  email and follow the instructions.
                </p>
              </div>
              <Button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                }}
                variant="outline"
                className="w-full"
              >
                Send Another Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Tennis player image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={logos}
          alt="Tennis player on blue court"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side - Forgot password form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            {/* Header */}
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto mr-3 hover:bg-transparent"
                asChild
              >
                <Link href="/sign-in">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Forget Password
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`pl-10 h-12 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500 ${
                    error ? "border-red-500" : ""
                  }`}
                />
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>

            {/* Back to sign in */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
