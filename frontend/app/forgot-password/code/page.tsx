'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import MobileForgotPasswordCode from '@/components/forgot-password/MobileForgotPasswordCode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateResetToken } from '@/lib/api/auth';
import {
  type ValidateTokenForm,
  validateTokenSchema,
} from '@/lib/validation/auth';

export default function ForgotPasswordCodePage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get email from URL parameters
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const userEmail = searchParams.get('email') || 'your email';

  const form = useForm<ValidateTokenForm>({
    resolver: zodResolver(validateTokenSchema),
    defaultValues: {
      token: '',
    },
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    setCanResend(true);
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');

    if (token.length !== 4) {
      toast.error('Please enter a 4-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await validateResetToken({ token });

      if (response.valid) {
        toast.success('Code verified successfully!');
        // Navigate to reset password page with the token
        router.push(`/reset-password?token=${token}`);
      } else {
        toast.error(response.message || 'Invalid code');
      }
    } catch (error: any) {
      console.error('Token validation error:', error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to verify code'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    setResendTimer(30);
    setCanResend(false);
    console.log('Resending code...');
    // Handle resend logic here
  };

  return (
    <>
      {/* Mobile-only layout */}
      <MobileForgotPasswordCode />

      {/* Desktop/Tablet layout */}
      <div className="hidden min-h-screen items-center justify-center bg-[#F5EBFC] p-4 lg:flex">
        {/* Main Card */}
        <div className="w-full max-w-6xl overflow-hidden rounded-[64px] border border-white bg-[#fff]/30 bg-opacity-30 backdrop-blur-xl backdrop-filter">
          <div className="flex min-h-[80vh]">
            {/* Left Section - We Send You Code */}
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
                <div className="text-center">
                  <h1 className="mb-4 font-bold text-4xl text-gray-900 leading-tight">
                    We Send You Code
                  </h1>
                  <p className="text-gray-700 text-lg">
                    Enter your verification code and then verify. You are good
                    to go
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - OTP Verification Form */}
            <div className="flex w-1/2 flex-col justify-center bg-transparent p-12">
              <div className="mx-auto w-full max-w-md">
                {/* Form Header */}
                <div className="mb-8 text-center">
                  <h2 className="mb-2 font-bold text-3xl text-gray-900">
                    Forgot My Password
                  </h2>
                  <p className="text-gray-600">
                    We've sent an OTP code to your email,{' '}
                    <span className="font-medium text-orange-500">
                      {userEmail}
                    </span>
                  </p>
                </div>

                {/* OTP Verification Form */}
                <form className="space-y-6" onSubmit={handleVerifyCode}>
                  {/* OTP Input */}
                  <div>
                    <label
                      className="mb-2 block font-medium text-gray-900 text-sm"
                      htmlFor="otp"
                    >
                      Enter OTP Here
                    </label>
                    <div className="flex w-full justify-center space-x-4">
                      {otp.map((digit, index) => (
                        <Input
                          className="h-[56px] w-full rounded-[100px] border text-center font-semibold text-xl focus:border-transparent focus:ring-1 focus:ring-purple-500"
                          id={`otp-${index}`}
                          key={index}
                          maxLength={1}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          placeholder=""
                          type="text"
                          value={digit}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resend Code */}
                  <div className="flex justify-end">
                    <div className="text-gray-600 text-sm">
                      {resendTimer > 0 ? (
                        <span>Resend Code in {resendTimer}S</span>
                      ) : (
                        <button
                          className="font-medium text-purple-600 hover:text-purple-700"
                          onClick={handleResendCode}
                          type="button"
                        >
                          Resend
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Verify Code Button */}
                  <Button
                    className="h-12 w-full bg-purple-600 px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-purple-700"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
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
