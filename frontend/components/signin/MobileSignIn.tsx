'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast as sonnerToast } from 'sonner';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { signin } from '@/lib/api/auth';
import { setCookie } from '@/lib/utils';
import { type SigninForm, signinSchema } from '@/lib/validation/auth';
import { useAuthStore } from '@/store/auth';

export default function MobileSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleSignIn = async (values: SigninForm) => {
    setIsLoading(true);
    try {
      const response = await signin({
        email: values.email,
        password: values.password,
      });

      if (!(response && response.access_token)) {
        throw new Error('Invalid response from server');
      }

      if (values.rememberMe === true) {
        setCookie('access_token', response.access_token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          secure: true,
          sameSite: 'strict',
        });
      } else {
        setCookie('access_token', response.access_token, {
          secure: true,
          sameSite: 'strict',
        });
      }

      useAuthStore.getState().setAuthenticated(true);
      sonnerToast.success('Signed in successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to sign in';
      sonnerToast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
  };

  return (
    <div className="block lg:hidden">
      <div className="relative flex h-screen w-full items-center overflow-hidden border-white border-r bg-[#fff]/30 px-5 backdrop-blur-lg backdrop-filter-none">
        {/* Gradient Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 h-1/5 w-1/5 rounded-full bg-[#FFD200] blur-3xl" />
          <div className="absolute top-0 left-36 h-1/5 w-1/5 rounded-full bg-[#FF5E3A] blur-3xl" />
          <div className="absolute top-0 left-60 h-1/5 w-1/5 rounded-full bg-[#A44EFF] blur-3xl" />
          <div className="absolute top-0 right-0 h-1/5 w-1/12 rounded-full bg-[#00D977] blur-3xl" />
          <div className="-right-12 absolute top-0 h-1/5 w-1/5 rounded-full bg-[#00CFFF] blur-3xl" />
        </div>

        {/* Content */}
        <div className="mx-auto w-full max-w-md">
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-start font-bold text-3xl text-gray-900">
              Log in to your account
            </h2>
            <p className="text-start text-gray-600">
              Let's sign in to your account
            </p>
          </div>

          {/* Log In Form */}
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSignIn)}
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

            {/* Password */}
            <div>
              <label
                className="mb-2 block font-medium text-base text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  aria-describedby={
                    form.formState.errors.password
                      ? 'password-error'
                      : undefined
                  }
                  aria-invalid={Boolean(form.formState.errors.password)}
                  autoComplete="current-password"
                  id="password"
                  placeholder="***********"
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('password')}
                  className={`h-12 w-full px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                    form.formState.errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" color="currentColor" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="mt-1 text-base text-red-500" id="password-error">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={form.watch('rememberMe') ?? false}
                  className="pointer-events-auto relative z-30 h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                  id="rememberMe"
                  onCheckedChange={(checked) => {
                    form.setValue('rememberMe', checked === true);
                  }}
                  type="button"
                />
                <label className="text-base text-gray-900" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <Link
                className="font-normal text-base text-primary-500 hover:text-purple-700"
                href="/forgot-password"
              >
                Forgot Password
              </Link>
            </div>

            {/* Log In Button */}
            <Button
              className="h-12 w-full bg-primary-500 px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-purple-700"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Signing in...' : 'Log in'}
            </Button>

            {/* Separator */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-gray-300 border-t" />
              <span className="px-4 text-base text-gray-900">or</span>
              <div className="flex-1 border-gray-300 border-t" />
            </div>

            {/* Google Sign In Button */}
            <Button
              className="flex h-12 w-full cursor-not-allowed items-center justify-center space-x-3 border border-gray-300 bg-gray-100 px-5 py-3 font-medium text-gray-400 transition-all duration-200"
              disabled={true}
              onClick={handleGoogleSignIn}
              type="button"
              variant="outline"
            >
              <span className="flex items-center gap-2">
                <span>Sign in with Google (Coming Soon)</span>
              </span>
            </Button>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-base text-gray-900">
                Dont't have an account?{' '}
                <Link
                  className="font-normal text-primary-500 hover:text-primary-700"
                  href="/signup"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
