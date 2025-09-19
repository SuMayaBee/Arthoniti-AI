'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast as sonnerToast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateResetToken } from '@/lib/api/auth';
import {
  type ValidateTokenForm,
  validateTokenSchema,
} from '@/lib/validation/auth';

export default function MobileForgotPasswordCode() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const userEmail = searchParams.get('email') || 'your email';

  const form = useForm<ValidateTokenForm>({
    resolver: zodResolver(validateTokenSchema),
    defaultValues: { token: '' },
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    setCanResend(true);
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 3) {
      const el = document.getElementById(`m-otp-${index + 1}`);
      el?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`m-otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length !== 4) {
      sonnerToast.error('Please enter a 4-digit code');
      return;
    }
    setIsLoading(true);
    try {
      const response = await validateResetToken({ token });
      if (response.valid) {
        sonnerToast.success('Code verified successfully!');
        router.push(`/reset-password?token=${token}`);
      } else {
        sonnerToast.error(response.message || 'Invalid code');
      }
    } catch (error: any) {
      sonnerToast.error(
        error?.response?.data?.message || error?.message || 'Failed to verify code'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setResendTimer(30);
    setCanResend(false);
    // TODO: integrate resend API when available
    // keep console for now to match desktop behavior
    // eslint-disable-next-line no-console
    console.log('Resending code...');
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
            <h2 className="mb-2 text-start font-bold text-3xl text-gray-900">Forgot My Password</h2>
            <p className="text-start text-gray-600">
              We've sent an OTP code to your email,{' '}
              <span className="font-medium text-orange-500">{userEmail}</span>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleVerify}>
            {/* OTP Inputs */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" htmlFor="otp">
                Enter OTP Here
              </label>
              <div className="flex w-full justify-center space-x-4">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`m-otp-${index}`}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    placeholder=""
                    type="text"
                    value={digit}
                    className="h-[56px] w-full rounded-[100px] border text-center text-xl font-semibold focus:border-transparent focus:ring-1 focus:ring-purple-500"
                  />
                ))}
              </div>
            </div>

            {/* Resend */}
            <div className="flex justify-end">
              <div className="text-sm text-gray-600">
                {resendTimer > 0 ? (
                  <span>Resend Code in {resendTimer}S</span>
                ) : (
                  <button
                    className="font-medium text-purple-600 hover:text-purple-700"
                    onClick={handleResend}
                    type="button"
                  >
                    Resend
                  </button>
                )}
              </div>
            </div>

            {/* Verify Button */}
            <Button
              className="h-12 w-full bg-purple-600 px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-purple-700"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember Your Password?{' '}
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
