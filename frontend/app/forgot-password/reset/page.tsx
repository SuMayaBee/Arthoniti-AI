'use client';

import { useState } from 'react';
import MobileForgotPasswordReset from '@/components/forgot-password/MobileForgotPasswordReset';
import { EyeIcon } from '@/components/icons/EyeIcon';
import EyeSlashIcon from '@/components/icons/EyeSlashIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset password data:', formData);
    // Handle reset password logic here
  };

  return (
    <>
      {/* Mobile-only layout */}
      <MobileForgotPasswordReset />

      {/* Desktop/Tablet layout */}
      <div className="hidden min-h-screen items-center justify-center bg-[#F5EBFC] p-4 lg:flex">
        {/* Main Card */}
        <div className="w-full max-w-6xl overflow-hidden rounded-[64px] border border-white bg-[#fff]/30 bg-opacity-30 backdrop-blur-xl backdrop-filter">
          <div className="flex min-h-[80vh]">
            {/* Left Section - Reset My Password */}
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
                    Reset My
                    <br />
                    Password
                  </h1>
                  <p className="text-gray-700 text-lg">
                    Provide New Strong Password
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Reset Password Form */}
            <div className="flex w-1/2 flex-col justify-center bg-transparent p-12">
              <div className="mx-auto w-full max-w-md">
                {/* Form Header */}
                <div className="mb-8 text-center">
                  <h2 className="mb-2 font-bold text-3xl text-gray-900">
                    Reset Your Password
                  </h2>
                  <p className="text-gray-600">
                    Please Reset your password with a strong word
                  </p>
                </div>

                {/* Reset Password Form */}
                <form className="space-y-6" onSubmit={handleResetPassword}>
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
                        className="h-12 w-full border-none px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500"
                        id="password"
                        onChange={(e) =>
                          handleInputChange('password', e.target.value)
                        }
                        placeholder="***********"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                      />
                      <button
                        className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                      </button>
                    </div>
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
                        className="h-12 w-full border-none px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500"
                        id="confirmPassword"
                        onChange={(e) =>
                          handleInputChange('confirmPassword', e.target.value)
                        }
                        placeholder="***********"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
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

                  {/* Reset Button */}
                  <Button
                    className="h-12 w-full bg-purple-600 px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-purple-700"
                    type="submit"
                  >
                    Reset
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
