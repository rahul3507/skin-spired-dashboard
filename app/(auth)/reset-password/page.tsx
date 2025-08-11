"use client";

import type React from "react";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import logo from "@/public/banner.png";

import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/feature/authAPI";

export default function CreatePasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const token = localStorage.getItem("accessToken");

  const [resetPassword] = useResetPasswordMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to update password
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.newPassword,
      }).unwrap();

      if (res?.success === true) {
        router.push("/signin");
      }

      if (res?.success === false) {
        setErrors({ submit: res?.message || "Failed to update password" });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={logo}
          alt="Tennis player on blue court"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="flex items-center mb-8">
              <Link
                href="/signin"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-3" />
                <span className="text-lg font-semibold">Create Password</span>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    placeholder="New password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.newPassword ? "border-red-500 ring-red-200" : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-2 ml-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.confirmPassword
                        ? "border-red-500 ring-red-200"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2 ml-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm text-center">
                  {errors.submit}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Back to{" "}
                <Link
                  href="/signin"
                  className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
