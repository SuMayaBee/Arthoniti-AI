"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useId, useRef, useState } from "react";
import BusinessNameGeneratorIcon from "@/components/icons/BusinessNameGeneratorIcon";
import ChatIcon from "@/components/icons/ChatIcon";
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
import DashboardFloatingPillButton from "@/components/ui/DashboardFloatingPillButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
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
        title: "Generate Website",
        icon: WebsiteGeneratorIcon,
        href: "/dashboard/website-builder",
      },
      {
        title: "Generate Document",
        icon: DocumentGeneratorIcon,
        href: "/dashboard/document-generator",
      },
      {
        title: "Generate Logo",
        icon: LogoGeneratorIcon,
        href: "/dashboard/logo-generator",
      },
      {
        title: "Generate Video",
        icon: VideoGeneratorIcon,
        href: "/dashboard/short-video-generator",
      },
      {
        title: "Generate Business Name",
        icon: BusinessNameGeneratorIcon,
        href: "/dashboard/business-name-generator",
      },
      {
        title: "Generate Pitch Deck",
        icon: PitchDeckIcon,
        href: "/dashboard/pitch-deck",
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

  const { profile, fetchProfile } = useProfileStore();

  useEffect(() => {
    // Only run on client side to avoid SSR API calls
    if (typeof window === "undefined") {
      return;
    }

    // Only fetch if we don't have profile data
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  return (
    <Sidebar
      className="flex h-full flex-col border-none bg-white"
      collapsible="none"
    >
      <SidebarHeader className="bg-white">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              alt="Scalebuild.ai Logo"
              className="h-[42px] w-[42px] rounded-full"
              height={42}
              src="/logo.png"
              width={42}
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
            type="button"
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
      <SidebarContent className="flex-1 gap-0 overflow-auto bg-white">
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
                      className={
                        "group flex h-10 w-full items-center gap-3 rounded-[100px] px-3 transition-all duration-200" +
                        (pathname === item.href ||
                        (item.href !== "/dashboard" &&
                          pathname.startsWith(item.href))
                          ? "!bg-primary-50 font-medium text-primary-700"
                          : "text-gray-700 hover:bg-primary-50 hover:text-primary-700")
                      }
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
                        <item.icon
                          className="h-6 w-6"
                          color="text-primary-500"
                          size={24}
                        />
                        <span
                          className="py-1"
                          style={{
                            fontSize: 16,
                            fontFamily: "var(--font-open-sans), sans-serif",
                            fontWeight: 400,
                            lineHeight: "24px",
                            color: "#515A65",
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

      <SidebarFooter className="flex-none gap-0 bg-white p-2">
        {/* Settings and FAQ Section */}
        <div className="mb-3">
          <SidebarMenu className="space-y-0">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={
                  "group flex h-10 w-full items-center gap-3 rounded-[100px] px-3 transition-all duration-200" +
                  (pathname === "/dashboard/settings" ||
                  pathname.startsWith("/dashboard/settings/")
                    ? "!bg-primary-50 font-medium text-primary-700"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-700")
                }
                isActive={
                  pathname === "/dashboard/settings" ||
                  pathname.startsWith("/dashboard/settings/")
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
                      color: "#515A65",
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
                className={
                  "group flex h-10 w-full items-center gap-3 rounded-[100px] px-3 transition-all duration-200" +
                  (pathname === "/dashboard/faq"
                    ? "!bg-primary-50 font-medium text-primary-700"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-700")
                }
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
                      color: "#515A65",
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

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const hamburgerBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileSidebarRef = useRef<HTMLDivElement | null>(null);

  const mobileSidebarId = useId();

  // close on ESC and lock body scroll when drawer open
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMobileSidebarOpen(false);
    }
    if (isMobileSidebarOpen) {
      document.body.classList.add("overflow-hidden");
      window.addEventListener("keydown", onKey);
      // focus the drawer container for accessibility
      setTimeout(() => mobileSidebarRef.current?.focus(), 120);
    } else {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
      // return focus to hamburger button when closing
      setTimeout(() => hamburgerBtnRef.current?.focus(), 120);
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
    };
  }, [isMobileSidebarOpen]);

  // Close mobile sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileSidebarOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="w-full bg-white p-0 lg:px-5 lg:py-5">
        <div className="mx-auto grid w-full grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
          {/* Sidebar column: make sidebar sticky so it mimics the previous fixed position */}
          <div className="sticky top-5 hidden self-start lg:block">
            <div className="h-auto w-full overflow-hidden border-[#CED5DE] border-[0.5px] p-2 shadow-lg lg:h-[calc(100vh-40px)] lg:rounded-[20px]">
              <AppSidebar />
            </div>
          </div>

          {/* Main content area with rounded border and gradient header */}
          <div className="w-full bg-white shadow-lg lg:rounded-[20px]">
            {/* Mobile header: logo + breadcrumb + menu (mobile only) */}
            <div className="lg:hidden">
              <DashboardFloatingPillButton
                aria-controls={mobileSidebarId}
                aria-expanded={isMobileSidebarOpen}
                buttonRef={hamburgerBtnRef}
                onClick={() => setIsMobileSidebarOpen(true)}
              />
            </div>

            {/* Content area */}
            <div className="min-h-screen p-5 lg:min-h-[calc(100vh-40px)]">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer - Always rendered but controlled by transform */}
      <div className="lg:hidden">
        {/* Overlay */}
        <div
          aria-label="Close sidebar"
          className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${
            isMobileSidebarOpen
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={handleOverlayClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsMobileSidebarOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
        />

        {/* Mobile Sidebar */}
        <div
          aria-label="Mobile navigation"
          aria-modal="true"
          className={`fixed inset-y-0 left-0 z-[101] w-[280px] max-w-[80vw] bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          id={mobileSidebarId}
          role="dialog"
        >
          <div
            className="h-full overflow-hidden outline-none"
            ref={mobileSidebarRef}
            tabIndex={-1}
          >
            <div className="h-full overflow-auto">
              <AppSidebar />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
