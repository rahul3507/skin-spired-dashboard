"use client";

import type React from "react";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and privacy policy";
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

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        password: "",
        agreeToTerms: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Failed to submit form. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSocialLogin = (provider: string) => {
    // Implement social login logic here
  };

  return (
    <main className='w-full min-h-screen bg-white flex flex-col md:flex-row items-center justify-center p-4 md:p-8'>
      <div className='container mx-auto  flex flex-col md:flex-row items-center'>
        {/* <div className='w-full flex flex-col md:flex-row items-center justify-between'> */}
        {/* Logo Section */}
        <div className='hidden w-full md:w-1/2 md:flex items-center justify-start p-8 '>
          <Link href='/' className='max-w-xs'>
            <Image
              src='/logo.svg'
              alt='DesignDoc Logo'
              width={300}
              height={300}
              className='mb-2'
            />
          </Link>
        </div>

        {/* Form Section */}
        <div className='w-full md:w-1/2 max-w-md'>
          <div className='text-center mb-6'>
            <h1 className='text-[32px] font-bold text-primary mb-2'>
              Create an Account
            </h1>
            <p className='text-primary text-lg'>
              Sign up Now and unlock exclusive access!
            </p>
          </div>

          {submitSuccess ? (
            <div className='bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6'>
              Account created successfully! Please check your email to verify
              your account.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-primary text-lg font-medium mb-1'
                >
                  Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='Full name...'
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.name ? "border-red-500" : "border-slate-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-primary`}
                />
                {errors.name && (
                  <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-primary text-lg font-medium mb-1'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='Enter your email'
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.email ? "border-red-500" : "border-slate-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-primary`}
                />
                {errors.email && (
                  <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-primary text-lg font-medium mb-1'
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? "text" : "password"}
                    id='password'
                    name='password'
                    placeholder='Enter your password...'
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.password ? "border-red-500" : "border-slate-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-primary`}
                  />
                  <button
                    type='button'
                    onClick={togglePasswordVisibility}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500'
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
                )}
              </div>

              <div className='flex items-start'>
                <div className='flex items-center h-5'>
                  <input
                    type='checkbox'
                    id='agreeToTerms'
                    name='agreeToTerms'
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className='w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 placeholder:text-primary'
                  />
                </div>
                <label
                  htmlFor='agreeToTerms'
                  className='ml-2 text-lg text-primary'
                >
                  I agree to the{" "}
                  <Link href='/terms' className='text-teal-600 hover:underline'>
                    Terms
                  </Link>{" "}
                  &{" "}
                  <Link
                    href='/privacy'
                    className='text-teal-600 hover:underline'
                  >
                    Privacy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.agreeToTerms}
                </p>
              )}

              {errors.submit && (
                <p className='text-red-500 text-sm'>{errors.submit}</p>
              )}

              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-[#F99F04] hover:bg-[#f99f04bd] text-[#FAFAFA] text-lg font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out'
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              <div className='relative flex items-center justify-center mt-6 mb-6'>
                <div className='border-t border-slate-300 absolute w-full'></div>
                <div className='bg-white px-4 text-sm text-slate-500 relative'>
                  or
                </div>
              </div>

              <button
                type='button'
                onClick={() => handleSocialLogin("Google")}
                className='w-full flex items-center justify-center gap-2 border border-slate-300 text-lg text-primary font-medium py-3 px-4 rounded-md hover:bg-slate-50 transition duration-200 ease-in-out mb-3'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                >
                  <path
                    fill='#4285F4'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='#34A853'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='#EA4335'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                Continue with Google
              </button>

              <button
                type='button'
                onClick={() => handleSocialLogin("Facebook")}
                className='w-full flex items-center justify-center gap-2 border border-slate-300 text-lg text-primary font-medium py-3 px-4 rounded-md hover:bg-slate-50 transition duration-200 ease-in-out'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                >
                  <path
                    fill='#1877F2'
                    d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
                  />
                </svg>
                Continue with Facebook
              </button>
            </form>
          )}

          <div className='text-center mt-6'>
            <p className='text-primary text-lg'>
              I have an account?{" "}
              <Link
                href='/signin'
                className='text-primary text-lg font-medium hover:underline'
              >
                Sign In Now
              </Link>
            </p>
          </div>
        </div>
        {/* </div> */}
      </div>
    </main>
  );
}
