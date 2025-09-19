'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast as sonnerToast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { forgotPassword } from '@/lib/api/auth';
import {
  type ForgotPasswordForm,
  forgotPasswordSchema,
} from '@/lib/validation/auth';

export default function MobileForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmitForgot = async (values: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await forgotPassword({ email: values.email });
      if (isMobile) {
        sonnerToast.success('Password reset email sent successfully!');
      }
      router.push(
        `/forgot-password/code?email=${encodeURIComponent(values.email)}`
      );
    } catch (_err: unknown) {
      // Error toasts are handled globally by axios interceptor in lib/api/client.ts
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="block lg:hidden">
      <div className="relative flex h-screen w-full items-center overflow-hidden border-white border-r bg-[#fff]/30 px-5 backdrop-blur-lg backdrop-filter-none">
        {/* Gradient Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-36 h-1/5 w-1/5 rounded-full bg-[#FF5E3A] blur-3xl" />
          <div className="absolute top-0 left-60 h-1/5 w-1/5 rounded-full bg-[#A44EFF] blur-3xl" />
          <div className="absolute top-0 right-0 h-1/5 w-1/12 rounded-full bg-[#00D977] blur-3xl" />
          <div className="-right-12 absolute top-0 h-1/5 w-1/5 rounded-full bg-[#00CFFF] blur-3xl" />
          <div className="absolute top-0 h-1/5 w-1/5 rounded-full bg-[#FFD200] blur-3xl" />
        </div>

        {/* Content */}
        <div className="mx-auto w-full max-w-md">
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-start font-bold text-3xl text-gray-900">
              Forgot My Password
            </h2>
            <p className="text-start text-gray-600">
              Provide the email address we will send you a verification code
            </p>
          </div>

          {/* Forgot Password Form */}
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmitForgot)}
          >
            {/* Email */}
            <div>
              <label
                className="mb-2 block font-medium text-base text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                aria-describedby={
                  form.formState.errors.email ? 'email-error' : undefined
                }
                aria-invalid={Boolean(form.formState.errors.email)}
                autoComplete="email"
                id="email"
                placeholder="example@gmail.com"
                type="email"
                {...form.register('email')}
                className={`h-12 w-full px-5 py-3 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                  form.formState.errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-base text-red-500" id="email-error">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Send Code Button */}
            <Button
              className="h-12 w-full bg-primary-500 px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-purple-700 disabled:cursor-not-allowed"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </Button>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-base text-gray-900">
                Remember your password?{' '}
                <Link
                  className="font-normal text-primary-500 hover:text-primary-700"
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
  );
}
