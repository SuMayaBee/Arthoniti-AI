/** biome-ignore-all lint/complexity/useOptionalChain: <explanation> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
/** biome-ignore-all lint/style/noMagicNumbers: <explanation> */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast as sonnerToast } from 'sonner';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import MobileSignIn from '@/components/signin/MobileSignIn';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { signin } from '@/lib/api/auth';
import { setCookie } from '@/lib/utils';
import { type SigninForm, signinSchema } from '@/lib/validation/auth';
import { useAuthStore } from '@/store/auth';

export default function SignInPage() {
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
    // no global loader, rely on button disabled state and toasts

    try {
      const response = await signin({
        email: values.email,
        password: values.password,
      });

      // Ensure we have a valid response and access token
      if (!(response && response.access_token)) {
        throw new Error('Invalid response from server');
      }

      // Store the access token in a cookie
      if (values.rememberMe === true) {
        // If "Remember Me" is checked, set cookie for 7 days
        setCookie('access_token', response.access_token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          secure: true,
          sameSite: 'strict',
        });
      } else {
        // If "Remember Me" is not checked, set session cookie (expires when browser closes)
        setCookie('access_token', response.access_token, {
          secure: true,
          sameSite: 'strict',
          // No expires property = session cookie
        });
      }

      // Update auth store
      useAuthStore.getState().setAuthenticated(true);

      // Show success
      sonnerToast.success('Signed in successfully!');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to sign in';

      // Show error
      sonnerToast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
    // Handle Google sign in logic here
  };

  return (
    <>
      {/* Mobile-only layout */}
      <MobileSignIn />

      {/* Desktop/Tablet layout */}
      <div className="hidden min-h-screen items-center justify-center bg-[#F5EBFC] p-4 lg:flex">
        {/* Main Card */}
        <div className="w-full max-w-6xl overflow-hidden rounded-[64px] border border-white bg-[#fff]/30 bg-opacity-30 backdrop-blur-xl backdrop-filter">
          <div className="flex">
            {/* Left Section - Welcome/Marketing */}
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
                    Welcome Back!
                  </h1>
                  <p className="text-gray-700 text-lg">
                    Please Sign In, We are waiting for you chief!
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Log In Form */}
            <div className="flex w-1/2 flex-col justify-center bg-transparent p-12">
              <div className="mx-auto w-full max-w-md">
                {/* Form Header */}
                <div className="mb-8 text-center">
                  <h2 className="mb-2 font-bold text-3xl text-gray-900">
                    Log in to your account
                  </h2>
                  <p className="text-gray-600">Let's sign in to your account</p>
                </div>

                {/* Log In Form */}
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(handleSignIn)}
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

                  {/* Password */}
                  <div>
                    <label
                      className="mb-2 block font-medium text-gray-900 text-sm"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        placeholder="***********"
                        type={showPassword ? 'text' : 'password'}
                        {...form.register('password')}
                        className={`h-12 w-full border-none px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                          form.formState.errors.password
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                      />
                      <button
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                        className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? (
                          <EyeOffIcon
                            className="h-5 w-5"
                            color="currentColor"
                          />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {form.formState.errors.password && (
                      <p className="mt-1 text-red-500 text-sm">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Remember Me and Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={form.watch('rememberMe') ?? false}
                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        id="rememberMe"
                        onCheckedChange={(checked) => {
                          form.setValue('rememberMe', checked === true);
                        }}
                      />
                      <label
                        className="text-gray-700 text-sm"
                        htmlFor="rememberMe"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      className="font-medium text-purple-600 text-sm hover:text-purple-700"
                      href="/forgot-password"
                    >
                      Forgot Password
                    </Link>
                  </div>

                  {/* Log In Button */}
                  <Button
                    className="h-12 w-full bg-purple-600 px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-purple-700"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? 'Signing in...' : 'Log in'}
                  </Button>

                  {/* Separator */}
                  <div className="my-6 flex items-center">
                    <div className="flex-1 border-gray-300 border-t" />
                    <span className="px-4 text-gray-500 text-sm">or</span>
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
                    <p className="text-gray-600 text-sm">
                      Create an account{' '}
                      <Link
                        className="font-medium text-purple-600 hover:text-purple-700"
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
        </div>
      </div>
    </>
  );
}
