'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import MobileForgotPassword from '@/components/forgot-password/MobileForgotPassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { forgotPassword } from '@/lib/api/auth';
import {
  type ForgotPasswordForm,
  forgotPasswordSchema,
} from '@/lib/validation/auth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleForgotPassword = async (values: ForgotPasswordForm) => {
    setIsLoading(true);
    // no global loader; rely on button disabled state and toasts

    try {
      // Call forgot password endpoint (handles both token generation and email sending)
      await forgotPassword({
        email: values.email,
      });

      // Show success
      if (!isMobile) {
        toast.success('Password reset email sent successfully!');
      }

      // Navigate to code verification page with email parameter
      router.push(
        `/forgot-password/code?email=${encodeURIComponent(values.email)}`
      );
    } catch (_err: unknown) {
      // Errors are handled by axios interceptor in lib/api/client.ts
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Mobile-only layout */}
      <MobileForgotPassword />

      {/* Desktop/Tablet layout */}
      <div className="hidden min-h-screen items-center justify-center bg-[#F5EBFC] p-4 lg:flex">
        {/* Main Card */}
        <div className="w-full max-w-6xl overflow-hidden rounded-[64px] border border-white bg-[#fff]/30 bg-opacity-30 backdrop-blur-xl backdrop-filter">
          <div className="flex min-h-[80vh] w-full">
            {/* Left Section - Write Your Email */}
            <div className="relative w-1/2 overflow-hidden rounded-[64px] border-white border-r bg-[#fff]/30 bg-opacity-100 backdrop-blur-md backdrop-filter-none">
              {/* Gradient Blobs */}
              <div className="absolute inset-0">
                <div className="-left-6 absolute top-0 h-1/5 w-56 rounded-full bg-[#FFD200] opacity-80 blur-3xl" />
                <div className="absolute top-0 left-24 h-1/5 w-56 rounded-full bg-[#FF5E3A] opacity-80 blur-3xl" />
                <div className="absolute top-0 left-44 h-1/5 w-56 rounded-full bg-[#A44EFF] opacity-80 blur-3xl" />
                <div className="absolute top-0 right-12 h-1/5 w-56 rounded-full bg-[#00D977] opacity-80 blur-3xl" />
                <div className="-right-12 absolute top-0 h-1/5 w-56 rounded-full bg-[#00CFFF] opacity-80 blur-3xl" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-center p-12">
                <div className="text-left">
                  <h1 className="mb-4 font-bold text-4xl text-gray-900 leading-tight">
                    Write Your Email
                  </h1>
                  <p className="text-gray-700 text-lg">
                    We will send you a verification code to your email.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Forgot My Password Form */}
            <div className="flex w-1/2 flex-col justify-center bg-transparent p-12">
              <div className="mx-auto w-full max-w-md">
                {/* Form Header */}
                <div className="mb-8 text-center">
                  <h2 className="mb-2 font-bold text-3xl text-gray-900">
                    Forgot My Password
                  </h2>
                  <p className="text-gray-600">
                    Provide the email address we will send you a verification
                    code
                  </p>
                </div>

                {/* Forgot Password Form */}
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(handleForgotPassword)}
                >
                  {/* Email */}
                  <div>
                    <label
                      className="mb-2 block font-medium text-gray-900 text-sm"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      placeholder="example@gmail.com"
                      type="email"
                      {...form.register('email')}
                      className={`h-12 w-full border-none px-5 py-3 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                        form.formState.errors.email
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                    />
                    {form.formState.errors.email && (
                      <p className="mt-1 text-red-500 text-sm">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Send Code Button */}
                  <Button
                    className="h-12 w-full bg-purple-600 px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-purple-700"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? 'Sending...' : 'Send Code'}
                  </Button>

                  {/* Sign In Link */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                      Remember Your Password?{' '}
                      <Link
                        className="font-medium text-purple-600 hover:text-purple-700"
                        href="/signin"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
