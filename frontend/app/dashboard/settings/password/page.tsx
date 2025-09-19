'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast as sonnerToast } from 'sonner';
import { useLoaderStore } from '@/store/loader';
import CheckIcon from '@/components/icons/CheckIcon';
import { EyeIcon } from '@/components/icons/EyeIcon';
import EyeSlashIcon from '@/components/icons/EyeSlashIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updatePassword } from '@/lib/api/auth';
import {
  type PasswordUpdateForm,
  passwordUpdateSchema,
} from '@/lib/validation/auth';

interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string) => boolean;
}

export default function PasswordSettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { show, hide } = useLoaderStore();

  const form = useForm<PasswordUpdateForm>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Password requirements with validators
  const passwordRequirements: PasswordRequirement[] = [
    {
      id: 'length',
      label: 'At least 6 characters long',
      validator: (password: string) => password.length >= 6,
    },
    {
      id: 'uppercase',
      label: 'Contains at least one uppercase letter',
      validator: (password: string) => /[A-Z]/.test(password),
    },
    {
      id: 'lowercase',
      label: 'Contains at least one lowercase letter',
      validator: (password: string) => /[a-z]/.test(password),
    },
    {
      id: 'number',
      label: 'Contains at least one number',
      validator: (password: string) => /\d/.test(password),
    },
    {
      id: 'special',
      label: 'Contains at least one special character',
      validator: (password: string) =>
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    },
  ];

  // Get current password value for real-time validation
  const newPasswordValue = form.watch('newPassword');

  // Check which requirements are met
  const getRequirementStatus = (requirement: PasswordRequirement) => {
    if (!newPasswordValue) return 'pending';
    return requirement.validator(newPasswordValue) ? 'met' : 'not-met';
  };

  // Get requirement status for styling
  const getRequirementStyles = (status: 'pending' | 'met' | 'not-met') => {
    switch (status) {
      case 'met':
        return {
          dot: 'bg-green-500',
          text: 'text-green-700',
          icon: 'text-green-500',
        };
      case 'not-met':
        return {
          dot: 'bg-red-500',
          text: 'text-red-700',
          icon: 'text-red-500',
        };
      default:
        return {
          dot: 'bg-gray-400',
          text: 'text-gray-600',
          icon: 'text-gray-400',
        };
    }
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!newPasswordValue) return { score: 0, label: '', color: 'bg-gray-200' };

    let score = 0;
    passwordRequirements.forEach((requirement) => {
      if (requirement.validator(newPasswordValue)) {
        score++;
      }
    });

    if (score === 0)
      return { score: 0, label: 'Very Weak', color: 'bg-red-500' };
    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-orange-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    if (score === 4)
      return { score: 4, label: 'Strong', color: 'bg-green-500' };
    return { score: 5, label: 'Very Strong', color: 'bg-green-600' };
  };

  const passwordStrength = getPasswordStrength();

  const handleUpdate = async (values: PasswordUpdateForm) => {
    setIsLoading(true);
    // Show global loader
    show('Updating password...');

    try {
      await updatePassword({
        password: values.newPassword,
      });

      // Show success
      sonnerToast.success('Password updated successfully!');

      // Reset form
      form.reset();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to update password';

      // Show error
      sonnerToast.error(message);
    } finally {
      setIsLoading(false);
      hide();
    }
  };

  const onSubmit = (values: PasswordUpdateForm) => {
    handleUpdate(values);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-bold text-3xl text-gray-900">Password</h1>
        <Button
          className="h-12 bg-purple-600 px-5 py-3 text-white hover:bg-purple-700"
          disabled={isLoading}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      </div>

      {/* Password Information Form */}
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="mb-6 font-semibold text-gray-900 text-xl">
          Password Settings
        </h2>

        {/* Current Password */}
        <div>
          <label
            className="mb-2 block font-medium text-gray-900 text-sm"
            htmlFor="currentPassword"
          >
            Current Password
          </label>
          <div className="relative">
            <Input
              id="currentPassword"
              placeholder="Enter your current password"
              type={showCurrentPassword ? 'text' : 'password'}
              {...form.register('currentPassword')}
              className={`h-12 w-full border border-gray-300 px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                form.formState.errors.currentPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : ''
              }`}
            />
            <button
              className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-500 hover:text-gray-700"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              type="button"
            >
              {showCurrentPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          {form.formState.errors.currentPassword && (
            <p className="mt-1 text-red-500 text-sm">
              {form.formState.errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label
            className="mb-2 block font-medium text-gray-900 text-sm"
            htmlFor="newPassword"
          >
            New Password
          </label>
          <div className="relative">
            <Input
              id="newPassword"
              placeholder="Enter your new password"
              type={showNewPassword ? 'text' : 'password'}
              {...form.register('newPassword')}
              className={`h-12 w-full border border-gray-300 px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                form.formState.errors.newPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : ''
              }`}
            />
            <button
              className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
              type="button"
            >
              {showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          {form.formState.errors.newPassword && (
            <p className="mt-1 text-red-500 text-sm">
              {form.formState.errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Password Strength Meter */}
        {newPasswordValue && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700 text-sm">
                Password Strength
              </span>
              <span
                className={`font-medium text-sm ${passwordStrength.score >= 4 ? 'text-green-600' : passwordStrength.score >= 2 ? 'text-yellow-600' : 'text-red-600'}`}
              >
                {passwordStrength.label}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Confirm New Password */}
        <div>
          <label
            className="mb-2 block font-medium text-gray-900 text-sm"
            htmlFor="confirmPassword"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              placeholder="Confirm your new password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...form.register('confirmPassword')}
              className={`h-12 w-full border border-gray-300 px-5 py-3 pr-12 focus:border-transparent focus:ring-1 focus:ring-purple-500 ${
                form.formState.errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : ''
              }`}
            />
            <button
              className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              type="button"
            >
              {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="mt-1 text-red-500 text-sm">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Password Requirements */}
        {newPasswordValue && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-medium text-gray-900 text-sm">
              Password Requirements
            </h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              {passwordRequirements.map((requirement) => (
                <li className="flex items-center gap-2" key={requirement.id}>
                  <div className="flex h-1.5 w-1.5 items-center justify-center rounded-full">
                    {getRequirementStatus(requirement) === 'met' ? (
                      <CheckIcon className="h-3 w-3" />
                    ) : (
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${getRequirementStyles(getRequirementStatus(requirement)).dot}`}
                      />
                    )}
                  </div>
                  <span
                    className={`${getRequirementStyles(getRequirementStatus(requirement)).text}`}
                  >
                    {requirement.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
