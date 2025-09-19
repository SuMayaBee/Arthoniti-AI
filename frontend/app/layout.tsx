import type { Metadata } from "next";
import "./globals.css";
import { Toaster as SonnerToaster } from "sonner";
import localFont from "next/font/local";
import GlobalLoaderPortal from "@/components/GlobalLoaderPortal";

const openSans = localFont({
  src: [
    {
      path: "../public/fonts/OpenSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/OpenSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/OpenSans-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/OpenSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-sans",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Hyperscaler - Generative Business Intelligence with AI",
  description: "Created by ScaleBuild.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.variable} suppressHydrationWarning>
        {children}
        <SonnerToaster position="top-center" richColors theme="light" />
        <GlobalLoaderPortal />
      </body>
    </html>
  );
}

