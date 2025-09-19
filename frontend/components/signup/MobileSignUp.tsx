"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast as sonnerToast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { EyeIcon } from "@/components/icons/EyeIcon";
import EyeSlashIcon from "@/components/icons/EyeSlashIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { signup } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth";
import { signupSchema, type SignupForm } from "@/lib/validation/auth";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MobileSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
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

      useAuthStore
        .getState()
        .setUser({ id: user.id, email: user.email, is_active: user.is_active });

      if (isMobile) {
        sonnerToast.success(
          "Account created successfully! Please sign in to continue."
        );
      }

      router.push("/signin");
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
              Get Started Now
            </h2>
            <p className="text-start text-gray-600">Let's create your account</p>
          </div>

          {/* Sign-up Form */}
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSignUp)}>
            {/* Full Name */}
            <div>
              <label
                className="mb-2 block font-medium text-base text-gray-900"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                placeholder="Enter your name here..."
                type="text"
                {...form.register("fullname")}
                className={`h-12 w-full px-5 py-3 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                  form.formState.errors.fullname
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {form.formState.errors.fullname && (
                <p className="mt-1 text-base text-red-500">
                  {form.formState.errors.fullname.message}
                </p>
              )}
            </div>

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
                  form.formState.errors.email ? "email-error" : undefined
                }
                aria-invalid={Boolean(form.formState.errors.email)}
                autoComplete="email"
                id="email"
                placeholder="example@gmail.com"
                type="email"
                {...form.register("email")}
                className={`h-12 w-full px-5 py-3 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                  form.formState.errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : ""
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
                    form.formState.errors.password ? "password-error" : undefined
                  }
                  aria-invalid={Boolean(form.formState.errors.password)}
                  autoComplete="new-password"
                  id="password"
                  placeholder="*********"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  className={`h-12 w-full px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                    form.formState.errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="mt-1 text-base text-red-500" id="password-error">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="mb-2 block font-medium text-base text-gray-900"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  autoComplete="new-password"
                  id="confirmPassword"
                  placeholder="*********"
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("confirmPassword")}
                  className="h-12 w-full px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500"
                />
                <button
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  type="button"
                >
                  {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-3">
              <Checkbox
                id="terms"
                checked={form.watch("agreeToTerms") ?? false}
                onCheckedChange={(checked) =>
                  form.setValue("agreeToTerms", checked === true)
                }
                className="text-purple-600 border-purple-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="terms" className="text-base text-gray-900">
                I agree to
                <span className="px-1" />
                <Link
                  href="/terms"
                  className="font-medium text-primary-500 hover:text-purple-700"
                >
                  Term & Condition
                </Link>
              </label>
            </div>

            {/* Submit */}
            <Button
              className="h-12 w-full bg-primary-500 px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-purple-700 disabled:cursor-not-allowed"
              disabled={isLoading || !form.watch("agreeToTerms")}
              type="submit"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>

            {/* OR */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>

            {/* Google */}
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

            {/* Sign In link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-base">
                Already have an account?{" "}
                <Link
                  className="font-medium text-primary-500 hover:text-purple-700"
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
