'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast as sonnerToast } from 'sonner';
import { EyeIcon } from '@/components/icons/EyeIcon';
import EyeSlashIcon from '@/components/icons/EyeSlashIcon';
import GoogleIcon from '@/components/icons/GoogleIcon';
import MobileSignUp from '@/components/signup/MobileSignUp';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { signup } from '@/lib/api/auth';
import { type SignupForm, signupSchema } from '@/lib/validation/auth';
import { useAuthStore } from '@/store/auth';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const handleSignUp = async (values: SignupForm) => {
    setIsLoading(true);
    try {
      const user = await signup({
        email: values.email,
        password: values.password,
        name: values.fullname,
      });

      // Store user data in auth store (but no token since signup doesn't return one)
      useAuthStore
        .getState()
        .setUser({ id: user.id, email: user.email, is_active: user.is_active });

      // Show success (desktop only to avoid duplicate with MobileSignUp)
      if (!isMobile) {
        sonnerToast.success(
          'Account created successfully! Please sign in to continue.'
        );
      }

      // Redirect to signin page since signup doesn't provide a token
      router.push('/signin');
    } catch (_err: unknown) {
      // Error toasts are handled globally by axios interceptor in lib/api/client.ts
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // TODO: Integrate Google sign-up
  };

  return (
    <>
      {/* Mobile-only layout */}
      <MobileSignUp />

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
                    Start Your Journey
                    <br />
                    with Us !
                  </h1>
                  <p className="text-gray-700 text-lg">
                    Just register to join with us
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Sign-up Form */}
            <div className="flex w-1/2 flex-col justify-center bg-transparent p-12">
              <div className="mx-auto w-full max-w-md">
                {/* Form Header */}
                <div className="mb-8 text-center">
                  <h2 className="mb-2 font-bold text-3xl text-gray-900">
                    Get Started Now
                  </h2>
                  <p className="text-gray-600">Let's create your account</p>
                </div>

                {/* Sign-up Form */}
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(handleSignUp)}
                >
                  {/* Full Name */}
                  <div>
                    <label
                      className="mb-2 block font-medium text-gray-900 text-sm"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <Input
                      id="fullName"
                      placeholder="Enter your name here..."
                      type="text"
                      {...form.register('fullname')}
                      className={`h-12 w-full border-none px-5 py-3 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                        form.formState.errors.fullname
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                    />
                    {form.formState.errors.fullname && (
                      <p className="mt-1 text-red-500 text-sm">
                        {form.formState.errors.fullname.message}
                      </p>
                    )}
                  </div>

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
                        placeholder="*********"
                        type={showPassword ? 'text' : 'password'}
                        {...form.register('password')}
                        className={`h-12 w-full border-none px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                          form.formState.errors.password
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                      />
                      <button
                        className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {form.formState.errors.password && (
                      <p className="mt-1 text-red-500 text-sm">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      className="mb-2 block font-medium text-gray-900 text-sm"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        placeholder="*********"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...form.register('confirmPassword')}
                        className="h-12 w-full border-none px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500"
                      />
                      <button
                        className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        type="button"
                      >
                        {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={form.watch('agreeToTerms')}
                      className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                      id="terms"
                      onCheckedChange={(checked) =>
                        form.setValue('agreeToTerms', Boolean(checked))
                      }
                    />
                    <label className="text-gray-700 text-sm" htmlFor="terms">
                      I agree to{' '}
                      <Link
                        className="font-medium text-purple-600 hover:text-purple-700"
                        href="/terms"
                      >
                        Term & Condition
                      </Link>
                    </label>
                  </div>

                  {/* Sign Up Button */}
                  <Button
                    className="h-12 w-full bg-purple-600 px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-purple-700"
                    disabled={isLoading || !form.watch('agreeToTerms')}
                    type="submit"
                  >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </Button>

                  {/* Separator */}
                  <div className="my-6 flex items-center">
                    <div className="flex-1 border-gray-300 border-t" />
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-gray-300 border-t" />
                  </div>

                  {/* Google Sign Up Button */}
                  <Button
                    className="flex h-12 w-full cursor-not-allowed items-center justify-center space-x-3 border border-gray-300 bg-gray-100 px-5 py-3 font-medium text-gray-400 transition-all duration-200"
                    disabled={true}
                    onClick={handleGoogleSignUp}
                    type="button"
                    variant="outline"
                  >
                    <span className="flex items-center gap-2">
                      <GoogleIcon />
                      <span>Sign up with Google (Coming Soon)</span>
                    </span>
                  </Button>

                  {/* Sign In Link */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                      Already have an account?{' '}
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
