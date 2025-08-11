"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import logo from "@/public/banner.png";
import { useVerifyEmailMutation } from "@/redux/feature/authAPI";
import { useRouter } from "next/navigation";

export default function VerifyOTP() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const [verify] = useVerifyEmailMutation();

  const emailFromQuery =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("email")
      : null;

  // console.log(emailFromQuery);

  // Handle input change and auto-focus to next input
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If pasting multiple digits, distribute them
      const digits = value.split("").slice(0, otp.length);
      const newOtp = [...otp];

      digits.forEach((digit, i) => {
        if (index + i < otp.length) {
          newOtp[index + i] = digit;
        }
      });

      setOtp(newOtp);

      // Focus on the appropriate input after pasting
      const nextIndex = Math.min(index + digits.length, otp.length - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Normal single digit input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus to next input if current input is filled
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace key
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus on previous input when backspace is pressed on an empty input
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const otpValue = otp.join("");

    // Validate OTP
    if (otpValue.length !== 6 || !/^\d+$/.test(otpValue)) {
      toast.error("Please enter a valid OTP");
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const res = await verify({
        email: emailFromQuery,
        oneTimeCode: Number(otpValue),
      }).unwrap();

      if (res.success === true) {
        localStorage.setItem("accessToken", res.data.accessToken);
        router.push("/reset-password");
      }

      if (res?.success === false) {
        toast.error("The OTP you entered is incorrect or has expired");
        return;
      }

      toast.success("OTP verified successfully!");
      // Handle success - redirect or update state
    } catch (error) {
      toast.error("The OTP you entered is incorrect or has expired");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setResendDisabled(true);
    setCountdown(30);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("OTP Resent");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error("Please try again later");
    }
  };

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Tennis player image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={logo}
          alt="Tennis player sitting on court"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back button */}
          <Link
            href="/signin"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Sign In
          </Link>

          {/* Form card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Verify Email
              </h1>
              <p className="text-gray-600 text-sm">
                Please enter the OTP we have sent to your email
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="h-12 w-12 text-center text-lg font-semibold text-black border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                    autoFocus={index === 0}
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
                disabled={isSubmitting || otp.some((digit) => !digit)}
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  {"Didn't receive the OTP? "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendDisabled}
                    className="text-blue-500 hover:text-blue-600 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendDisabled ? `Resend (${countdown}s)` : "Resend"}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
