"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { deleteCookie } from "@/lib/utils";
import { toast as sonnerToast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import ProfileCircleIcon from "@/components/icons/ProfileCircleIcon";
import BarChartBuildingsIcon from "@/components/icons/BarChartBuildingsIcon";
import KeyTagIcon from "@/components/icons/KeyTagIcon";
import BellRingingIcon from "@/components/icons/BellRingingIcon";
import ChatBubbleSparkIcon from "@/components/icons/ChatBubbleSparkIcon";
import ShieldLockIcon from "@/components/icons/ShieldLockIcon";
import DocumentTextIcon from "@/components/icons/DocumentTextIcon";
import LogOutIcon from "@/components/icons/LogOutIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: ProfileCircleIcon, href: "/dashboard/settings/profile" },
    { id: "business", label: "Business", icon: BarChartBuildingsIcon, href: "/dashboard/settings/business" },
    { id: "password", label: "Password", icon: KeyTagIcon, href: "/dashboard/settings/password" },
    { id: "notifications", label: "Notifications", icon: BellRingingIcon, href: "/dashboard/settings/notifications" },
    { id: "support", label: "Support", icon: ChatBubbleSparkIcon, href: "/dashboard/settings/support" },
    { id: "privacy", label: "Privacy Policies", icon: ShieldLockIcon, href: "/dashboard/settings/privacy-policies" },
    { id: "terms", label: "Terms of Us", icon: DocumentTextIcon, href: "/dashboard/settings/terms-of-us" },
    { id: "logout", label: "Log Out", icon: LogOutIcon, isLogout: true },
  ];

  const handleLogout = () => {
    try {
      // Delete the access token cookie
      deleteCookie("access_token");
      
      // Clear auth store
      useAuthStore.getState().signout();
      
      // Show success message
      sonnerToast.success("Logged out successfully!");
      
      // Redirect to signin page
      router.push("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      sonnerToast.error("Failed to logout. Please try again.");
    }
  };

  // Check if we're on the main settings page (mobile navigation)
  const isMainSettingsPage = pathname === "/dashboard/settings" || pathname === "/dashboard/settings/";
  const showMobileNavigation = isMobile && isMainSettingsPage;

  // Mobile Navigation Component
  const MobileSettingsNavigation = () => (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <h1 
          className="text-gray-900"
          style={{
            fontSize: 24,
            fontFamily: "var(--font-open-sans), sans-serif",
            fontWeight: 600,
            lineHeight: "32px",
          }}
        >
          Settings
        </h1>
      </div>

      {/* Navigation List */}
      <div className="px-4 py-6">
        <div className="space-y-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={tab.isLogout ? handleLogout : undefined}
              className={`w-full flex items-center justify-between px-4 py-5 rounded-xl transition-all duration-200 text-left active:scale-[0.98] ${
                tab.isLogout
                  ? "text-red-600 hover:bg-red-50 active:bg-red-100"
                  : "text-gray-700 hover:bg-gray-50 active:bg-gray-100 border border-gray-100 hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              {tab.isLogout ? (
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                    <tab.icon
                      size={20}
                      color="text-red-600"
                    />
                  </div>
                  <span 
                    className="font-medium" 
                    style={{ 
                      fontSize: 16, 
                      fontFamily: "var(--font-open-sans), sans-serif",
                      fontWeight: 500,
                      lineHeight: "24px",
                      color: "#DC2626",
                    }}
                  >
                    {tab.label}
                  </span>
                </div>
              ) : (
                <Link href={tab.href || "#"} className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                      <tab.icon
                        size={20}
                        color="text-gray-600"
                      />
                    </div>
                    <span 
                      className="font-medium" 
                      style={{ 
                        fontSize: 16, 
                        fontFamily: "var(--font-open-sans), sans-serif",
                        fontWeight: 500,
                        lineHeight: "24px",
                        color: "#1F2937",
                      }}
                    >
                      {tab.label}
                    </span>
                  </div>
                  <ChevronRightIcon
                    size={20}
                    color="text-gray-400"
                  />
                </Link>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <div className="w-56 h-auto min-h-[90vh] overflow-y-auto border-r border-gray-200 pr-4 py-5 pl-0">
      <div className="space-y-2">
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={tab.isLogout ? handleLogout : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
              pathname === tab.href
                ? "bg-purple-50 text-purple-700 border-none"
                : tab.isLogout
                ? "text-red-600 hover:bg-red-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.isLogout ? (
              <>
                <tab.icon
                  size={20}
                  color="text-red-600"
                />
                <span 
                  className="font-medium" 
                  style={{ 
                    fontSize: 16, 
                    fontFamily: "var(--font-open-sans), sans-serif",
                    fontWeight: 400,
                    lineHeight: "24px",
                    color: "#DC2626",
                  }}
                >
                  {tab.label}
                </span>
              </>
            ) : (
              <Link href={tab.href || "#"} className="w-full flex items-center gap-3">
                <tab.icon
                  size={20}
                  color={pathname === tab.href ? "text-purple-700" : "text-gray-600"}
                />
                <span 
                  className="font-medium" 
                  style={{ 
                    fontSize: 16, 
                    fontFamily: "var(--font-open-sans), sans-serif",
                    fontWeight: 400,
                    lineHeight: "24px",
                    color: pathname === tab.href ? "#7C3AED" : "#515A65",
                  }}
                >
                  {tab.label}
                </span>
              </Link>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // Render mobile navigation or desktop layout
  if (showMobileNavigation) {
    return <MobileSettingsNavigation />;
  }

  // Desktop Layout
  return (
    <div className="flex h-full min-h-[60vh]">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 md:p-5 h-auto min-h-[90vh] overflow-y-auto">
        {/* Mobile Back Button for Individual Setting Pages */}
        {isMobile && !isMainSettingsPage && (
          <div className="mb-6 border-b border-gray-200 pb-4">
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 -ml-2 rounded-lg hover:bg-gray-50"
            >
              <ChevronRightIcon
                size={20}
                color="text-gray-600"
                className="rotate-180"
              />
              <span 
                style={{
                  fontSize: 16,
                  fontFamily: "var(--font-open-sans), sans-serif",
                  fontWeight: 500,
                  lineHeight: "24px",
                }}
              >
                Back to Settings
              </span>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
