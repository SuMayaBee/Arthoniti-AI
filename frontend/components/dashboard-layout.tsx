"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import {
  LiChart as BarChart3,
  LiBuildings as Building2,
  LiChatRoundCall as ChatIconLi,
  LiAltArrowRight as ChevronRight,
  LiAltArrowUp as ChevronUp,
  LiCard as CreditCard,
  LiCrown as Crown,
  LiGallery as FileImage,
  LiDocument as FileText,
  LiGift as Gift,
  LiEarth as Globe,
  LiQuestionCircle as HelpCircle,
  LiHome as LayoutDashboard,
  LiLogout2 as LogOut,
  LiPalette as Palette,
  LiDocument as PresentationChart,
  LiMagnifer as Search,
  LiSettings as Settings,
  LiShieldStar as Shield,
  LiStars as Sparkles,
  LiUser as User,
  LiVideoFrame as Video,
  LiFlashlight as Zap,
} from "solar-icon-react/li";
import BusinessNameGeneratorIcon from "@/components/icons/BusinessNameGeneratorIcon";
import ChatIcon from "@/components/icons/ChatIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import DocumentGeneratorIcon from "@/components/icons/DocumentGeneratorIcon";
import FAQIcon from "@/components/icons/FAQIcon";
import FavouriteIcon from "@/components/icons/FavouriteIcon";
import LogoGeneratorIcon from "@/components/icons/LogoGeneratorIcon";
import OverviewIcon from "@/components/icons/OverviewIcon";
import PitchDeckIcon from "@/components/icons/PitchDeckIcon";
import ReferralIcon from "@/components/icons/ReferralIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";
import SubscriptionIcon from "@/components/icons/SubscriptionIcon";
import VideoGeneratorIcon from "@/components/icons/VideoGeneratorIcon";
import WebsiteGeneratorIcon from "@/components/icons/WebsiteGeneratorIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeaderIcon, SidebarIcon } from "@/components/ui/icon-registry";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profile";

const navigation = [
  {
    title: "",
    items: [{ title: "Overview", icon: OverviewIcon, href: "/dashboard" }],
  },
  {
    title: "AI Tools",
    items: [
      {
        title: "Logo Generate",
        icon: LogoGeneratorIcon,
        href: "/dashboard/logo-generator",
      },
      {
        title: "Business Name Generate",
        icon: BusinessNameGeneratorIcon,
        href: "/dashboard/business-name-generator",
      },
      {
        title: "Pitch Deck Generate",
        icon: PitchDeckIcon,
        href: "/dashboard/pitch-deck",
      },
      {
        title: "Document Generate",
        icon: DocumentGeneratorIcon,
        href: "/dashboard/document-generator",
      },
      {
        title: "Video Generate",
        icon: VideoGeneratorIcon,
        href: "/dashboard/short-video-generator",
      },
      {
        title: "Website Generate",
        icon: WebsiteGeneratorIcon,
        href: "/dashboard/website-builder",
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        title: "Subscriptions",
        icon: SubscriptionIcon,
        href: "/dashboard/subscriptions",
      },
      // { title: "Business Analytics", icon: "analytics", href: "/analytics" },
      {
        title: "Refer & Earn",
        icon: ReferralIcon,
        href: "/dashboard/referrals",
      },
      {
        title: "Favourite",
        icon: FavouriteIcon,
        href: "/dashboard/favourites",
      },
    ],
  },
];

function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { profile, loading: loadingProfile, fetchProfile } = useProfileStore();

  useEffect(() => {
    // Only run on client side to avoid SSR API calls
    if (typeof window === "undefined") return;

    // Only fetch if we don't have profile data
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  return (
    <Sidebar className="border-none bg-white" collapsible="none">
      <SidebarHeader className="bg-white">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              alt="Scalebuild.ai Logo"
              className="h-[42px] w-[42px] rounded-full"
              src="/logo.png"
            />
            <span
              className="text-gray-900"
              style={{
                fontSize: 16,
                fontFamily: "Song Myung, serif",
                fontWeight: 400,
                lineHeight: "21.6px",
                color: "#1A1A1A",
              }}
            >
              Hyperscaler
            </span>
          </div>
          <button
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[100px] bg-custom-primary-500 transition-colors hover:bg-primary-600"
            onClick={() => router.push("/chat")}
          >
            <ChatIcon color="text-white" size={24} />
          </button>
        </div>
        <div className="relative mb-1">
          <div className="-translate-y-1/2 absolute top-1/2 left-3 transform text-gray-400">
            <SearchIcon color="text-gray-400" size={24} />
          </div>
          <SidebarInput
            className="h-10 rounded-[100px] border border-gray-200 bg-gray-50 pl-10 focus:ring-2 focus:ring-primary-500"
            placeholder="Search"
            style={{
              fontSize: 16,
              fontFamily: "Open Sans, sans-serif",
              fontWeight: 400,
              lineHeight: "24px",
              color: "#515A65",
            }}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0 bg-white">
        {navigation.map((section, sectionIndex) => (
          <SidebarGroup className="mb-0" key={section.title || sectionIndex}>
            {section.title && (
              <SidebarGroupLabel className="mb-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                {section.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent className="p-0">
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "group flex h-10 w-full items-center gap-3 rounded-[100px] px-3 transition-all duration-200",
                        "data-[active=true]:!bg-primary-50 data-[active=true]:!text-primary-700",
                        pathname === item.href ||
                          (item.href !== "/dashboard" &&
                            pathname.startsWith(item.href))
                          ? "font-medium"
                          : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                      )}
                      isActive={
                        pathname === item.href ||
                        (item.href !== "/dashboard" &&
                          pathname.startsWith(item.href))
                      }
                      tooltip={item.title}
                    >
                      <Link
                        className="flex w-full items-center gap-3"
                        href={item.href}
                      >
                        {typeof item.icon === "string" ? (
                          <SidebarIcon name={item.icon as any} />
                        ) : (
                          <item.icon
                            className="h-6 w-6"
                            color="text-primary-500"
                            size={24}
                          />
                        )}
                        <span
                          className="py-1"
                          style={{
                            fontSize: 16,
                            fontFamily: "var(--font-open-sans), sans-serif",
                            fontWeight: 400,
                            lineHeight: "24px",
                          }}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-0 bg-white p-2">
        {/* Settings and FAQ Section */}
        <div className="mb-3">
          <SidebarMenu className="space-y-0">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  "group flex h-10 w-full items-center gap-3 rounded-[100px] px-3 transition-all duration-200",
                  "data-[active=true]:!bg-primary-50 data-[active=true]:!text-primary-700",
                  pathname === "/dashboard/settings" ||
                    pathname.startsWith("/dashboard/settings")
                    ? "font-medium"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                )}
                isActive={
                  pathname === "/dashboard/settings" ||
                  pathname.startsWith("/dashboard/settings")
                }
                tooltip="Settings"
              >
                <Link
                  className="flex w-full items-center gap-3"
                  href="/dashboard/settings"
                >
                  <SettingsIcon className="h-6 w-6" color="text-primary-500" />
                  <span
                    className="py-1"
                    style={{
                      fontSize: 16,
                      fontFamily: "var(--font-open-sans), sans-serif",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                  >
                    Settings
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  "group flex h-10 w-full items-center gap-3 rounded-[100px] px-3 transition-all duration-200",
                  "data-[active=true]:!bg-primary-50 data-[active=true]:!text-primary-700",
                  pathname === "/dashboard/faq"
                    ? "font-medium"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                )}
                isActive={pathname === "/dashboard/faq"}
                tooltip="FAQ"
              >
                <Link
                  className="flex w-full items-center gap-3"
                  href="/dashboard/faq"
                >
                  <FAQIcon className="h-6 w-6" color="text-primary-500" />
                  <span
                    className="py-1"
                    style={{
                      fontSize: 16,
                      fontFamily: "var(--font-open-sans), sans-serif",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                  >
                    FAQ
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        <div className="mx-0 flex h-[62px] cursor-pointer items-center gap-3 rounded-[16px] border-primary-500 border-t py-3 transition-colors hover:bg-gray-50">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.image_url || "/placeholder-user.jpg"} />
            <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
              {(profile?.name || profile?.email || "")
                .slice(0, 2)
                .toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900 text-sm">
              {profile?.name || "Guest User"}
            </p>
            <p className="truncate text-gray-500 text-xs">
              {profile?.email || "Not signed in"}
            </p>
          </div>
          {/* <ChevronRightIcon size={24} color="text-[#1C274C]" /> */}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

export function DashboardLayout({
  children,
  fullHeight = false,
}: DashboardLayoutProps) {
  const router = useRouter();
  function handleLogout() {
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    useAuthStore.getState().signout();
    router.push("/signin");
  }

  return (
    <SidebarProvider>
      <div className="flex w-full bg-white">
        {/* Sidebar with padding, border radius, and border - completely fixed */}
        <div className="fixed top-5 left-5 h-[calc(100vh-40px)] overflow-hidden rounded-[20px] border-[#CED5DE] border-[0.5px] p-2 shadow-lg">
          <AppSidebar />
        </div>
        {/* Main content area with rounded border and gradient header */}
        <div
          className={`mt-5 mr-5 mb-5 ml-[320px] w-full rounded-[20px] bg-white shadow-lg ${fullHeight ? "h-[calc(100vh-40px)]" : ""}`}
        >
          {/* Content area */}
          <div className={`p-5 ${fullHeight ? "h-full" : ""}`}>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
