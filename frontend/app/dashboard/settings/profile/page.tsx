"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast as sonnerToast } from "sonner";
import { useProfileStore } from "@/store/profile";

export default function ProfileSettingsPage() {
  const { profile, loading, error, fetchProfile, updateProfile, uploadImage } = useProfileStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Fetch profile on component mount
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    // Update form data when profile is loaded
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      await sonnerToast.promise(
        updateProfile({ name: formData.name, email: formData.email }),
        {
          loading: "Updating profile...",
          success: "Profile updated!",
          error: (err: any) =>
            err?.response?.data?.message ||
            err?.response?.data?.detail ||
            err?.message ||
            "Failed to update profile",
        }
      );
    } catch (error) {
      // Error is already handled by the toast
    }
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await sonnerToast.promise(
        uploadImage(file),
        {
          loading: "Uploading image...",
          success: "Image uploaded successfully!",
          error: (err: any) =>
            err?.response?.data?.message ||
            err?.response?.data?.detail ||
            err?.message ||
            "Failed to upload image",
        }
      );
    } catch (error) {
      // Error is already handled by the toast
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading profile: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <Button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-5 py-3"
        >
          Update
        </Button>
      </div>

      {/* Profile Picture Section */}
      <div className="mb-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={profile?.image_url || "/placeholder-user.jpg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-user.jpg";
              }}
            />
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              onClick={handlePickImage}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
              disabled={loading}
            >
              Upload new image
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              At least 800x800 px recommended. JPG or PNG and GIF is allowed
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
            disabled
          />
        </div>

        {/* Add Email Button */}
        {/* <Button
          variant="outline"
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          + Add Email Address
        </Button> */}
      </div>
    </div>
  );
}