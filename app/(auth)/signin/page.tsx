"use client";

import type React from "react";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import { useLoginMutation } from "@/redux/feature/authAPI";
import { useRouter } from "next/navigation";
import { saveTokens } from "@/service/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@radix-ui/react-checkbox";
import logo from "@/public/skinSpired.jpg";
import Link from "next/link";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const [login] = useLoginMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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
      const res = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (res?.success === true) {
        localStorage.setItem("accessToken", res?.data?.accessToken);
        await saveTokens(res?.data?.accessToken);
        router.push("/");
      } else {
        setErrors({ submit: "Invalid credentials. Please try again." });
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.errorMessages?.[0]?.message ||
        error?.data?.message ||
        "An error occurred. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={logo}
          alt="Tennis player on blue court"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto mr-3"
                asChild
              >
                <a href="/">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </a>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Sign In</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 h-12 border rounded-lg focus:border-blue-500 focus:ring-blue-500 text-black ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="h-5 w-5 text-gray-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <circle cx="12" cy="16" r="1" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 h-12 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-black ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onCheckedChange={(checked: boolean) =>
                      setFormData((prev) => ({ ...prev, remember: checked }))
                    }
                    className="border-gray-300"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forget-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-500 text-center">
                  {errors.submit}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
