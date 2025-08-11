"use client";

import type React from "react";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitSuccess(true);

      // In a real app, you would redirect to dashboard or home page after successful login
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Invalid credentials. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='w-full min-h-screen flex flex-col md:flex-row items-center justify-center p-4 md:p-8'>
      <div className='container mx-auto flex flex-col md:flex-row items-center'>
        {/* Logo Section */}
        <div className='hidden w-full md:w-1/2 md:flex items-center justify-center p-8'>
          <Link href='/' className='max-w-xs'>
            <Image
              src='/logo.svg'
              alt='DesignDoc Logo'
              width={300}
              height={150}
              className='mb-2'
            />
          </Link>
        </div>

        {/* Form Section */}
        <div className='w-full md:w-1/2 max-w-md'>
          <div className='text-center mb-6'>
            <h1 className='text-[32px] font-bold text-primary mb-2'>
              Forget Your Password
            </h1>
            <p className='text-primary text-lg'>
              Welcome back! Select method to log in
            </p>
          </div>

          {submitSuccess ? (
            <div className='bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6'>
              Sign in successful! Redirecting to your dashboard...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-primary text-lg font-medium mb-1'
                >
                  Email
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='Enter your email'
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border placeholder:text-primary ${
                    errors.name ? "border-red-500" : "border-slate-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && (
                  <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
                )}
              </div>

              {errors.submit && (
                <p className='text-red-500 text-sm'>{errors.submit}</p>
              )}

              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out'
              >
                {isSubmitting ? "Signing In..." : "Sign In Now"}
              </button>
            </form>
          )}

          <div className='text-center mt-6'>
            <p className='text-slate-600'>
              Back to {"  "}
              <Link
                href='/signin'
                className='text-blue-600 font-medium hover:underline'
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
