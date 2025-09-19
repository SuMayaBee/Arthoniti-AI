"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordForm } from "@/lib/validation/auth";
import { resetPassword } from "@/lib/api/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon } from "@/components/icons/EyeIcon";
import EyeSlashIcon from "@/components/icons/EyeSlashIcon";

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (
      typeof document !== "undefined" &&
      document.cookie.includes("access_token=")
    ) {
      router.replace("/dashboard");
    }
    if (!token) {
      toast.error("Invalid reset link. Please request a new password reset.");
      router.push("/forgot-password");
    }
  }, [router, token]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }
    setLoading(true);
    try {
      const response = await resetPassword({
        token: token,
        new_password: data.password,
      });
      
      toast.success(response.message || "Password updated successfully!");
      router.push("/signin");
    } catch (err: any) {
      console.log("Reset password error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#F5EBFC] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Invalid reset link. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EBFC] flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="w-full max-w-6xl bg-[#fff]/30 backdrop-filter backdrop-blur-xl bg-opacity-30 rounded-[64px] overflow-hidden border border-white">
        <div className="flex">
          {/* Left Section - Reset My Password */}
          <div className="w-1/2 relative overflow-hidden rounded-[64px] bg-[#fff]/30 backdrop-filter-none backdrop-blur-md bg-opacity-100 border-r border-white">
            {/* Gradient Blobs */}
            <div className="absolute inset-0">
              <div className="absolute top-0 -left-6 w-56 h-48 bg-[#FFD200] rounded-full blur-3xl opacity-80"></div>
              <div className="absolute top-0 left-24 w-56 h-48 bg-[#FF5E3A] rounded-full blur-3xl opacity-80"></div>
              <div className="absolute top-0 left-44 w-56 h-48 bg-[#A44EFF] rounded-full blur-3xl opacity-80"></div>
              <div className="absolute top-0 right-12 w-56 h-48 bg-[#00D977] rounded-full blur-3xl opacity-80"></div>
              <div className="absolute top-0 -right-12 w-56 h-48 bg-[#00CFFF] rounded-full blur-3xl opacity-80"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center p-12">
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  Reset My<br />Password
                </h1>
                <p className="text-lg text-gray-700">
                  Provide New Strong Password
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Reset Password Form */}
          <div className="w-1/2 bg-transparent p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Reset Your Password
                </h2>
                <p className="text-gray-600">
                  Please Reset your password with a strong word
                </p>
              </div>

              {/* Reset Password Form */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="***********"
                      {...form.register("password")}
                      className="w-full h-12 px-5 py-3 pr-12 border-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="***********"
                      {...form.register("confirmPassword")}
                      className="w-full h-12 px-5 py-3 pr-12 border-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Reset Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200"
                >
                  {loading ? "Updating Password..." : "Reset"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5EBFC] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
