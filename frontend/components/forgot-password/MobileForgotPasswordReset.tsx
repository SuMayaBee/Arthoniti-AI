"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon } from "@/components/icons/EyeIcon";
import EyeSlashIcon from "@/components/icons/EyeSlashIcon";

export default function MobileForgotPasswordReset() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: integrate API once available
      // keep parity with desktop page which logs for now
      // eslint-disable-next-line no-console
      console.log("Reset password data:", formData);
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
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-start font-bold text-3xl text-gray-900">Reset Your Password</h2>
            <p className="text-start text-gray-600">Please Reset your password with a strong word</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleReset}>
            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" htmlFor="m-password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="m-password"
                  placeholder="***********"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="h-12 w-full border-none px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500"
                />
                <button
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((s) => !s)}
                  type="button"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" htmlFor="m-confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="m-confirmPassword"
                  placeholder="***********"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="h-12 w-full border-none px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500"
                />
                <button
                  aria-label="Toggle confirm password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  type="button"
                >
                  {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <Button
              className="h-12 w-full bg-purple-600 px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-purple-700"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Resetting..." : "Reset"}
            </Button>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember Your Password?{" "}
                <Link className="font-medium text-purple-600 hover:text-purple-700" href="/signin">
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
