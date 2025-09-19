"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SettingsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    // On desktop, redirect to profile settings by default
    // On mobile, stay on this page to show navigation menu
    if (!isMobile) {
      router.push("/dashboard/settings/profile");
    }
  }, [router, isMobile]);

  // On mobile, the layout will handle rendering the navigation menu
  // On desktop, this will redirect, so we don't need to render anything
  return null;
}
