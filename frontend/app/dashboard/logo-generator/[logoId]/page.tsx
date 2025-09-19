"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import HistoryLoader from "@/components/history-loader";
import DownloadIcon from "@/components/icons/DownloadIcon";
import { GenerateIcon } from "@/components/icons/generate-icon";
import RemoveBgIcon from "@/components/icons/RemoveBgIcon";
import DesktopHeader from "@/components/nav/DesktopHeader";
import MobileHeader from "@/components/nav/MobileHeader";
// BackButton is rendered by DesktopHeader
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getLogoById,
  type LogoResponse,
  removeLogoBackground,
} from "@/lib/api/logo";

type LogoDetailsPageProps = {
  params: { logoId: string };
};

export default function LogoDetailsPage({ params }: LogoDetailsPageProps) {
  const router = useRouter();
  const { logoId } = params;
  const [showNoBg, setShowNoBg] = useState(false);
  const [logo, setLogo] = useState<LogoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const hasRemovedBg = showNoBg || Boolean(logo?.remove_bg_logo_image_url);

  // Fetch logo data on component mount
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLoading(true);
        setError(null);
        const logoData = await getLogoById(Number.parseInt(logoId, 10));
        setLogo(logoData);
      } catch (err: unknown) {
        const fetchError = err as Error;
        setError(fetchError.message || "Failed to load logo");
        toast.error("Failed to load logo");
      } finally {
        setLoading(false);
      }
    };

    if (logoId) {
      fetchLogo();
    }
  }, [logoId]);

  const handleRemoveBg = async () => {
    if (!logo) {
      return;
    }

    try {
      setIsRemoving(true);

      const response = await removeLogoBackground(logo.id);

      if (response.success) {
        // Update the logo state with the new remove_bg_logo_image_url
        setLogo((prev) =>
          prev
            ? {
                ...prev,
                remove_bg_logo_image_url: response.remove_bg_logo_image_url,
              }
            : null
        );

        setShowNoBg(true);
        toast.success("Background removed successfully!");
      } else {
        toast.error(response.error || "Failed to remove background");
      }
    } catch (removeBgError: unknown) {
      const errorObj = removeBgError as Error;
      toast.error(errorObj.message || "Failed to remove background");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleDownload = async (logoUrl?: string, fileName?: string) => {
    if (!logoUrl) {
      return;
    }

    try {
      // Fetch the image as blob
      const response = await fetch(logoUrl);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName || `logo-${logoId}`}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Silent error handling for download
    }
  };

  const handleGenerateAgain = () => {
    // Navigate to the logo generation form
    router.push("/dashboard/logo-generator");
  };

  return (
    <div className="w-full">
      {/* Header with Back Button */}
      <DesktopHeader />
      <MobileHeader className="mb-2" showBorder={true} title="Logo Details" />

      {/* Loading state: same behavior as generator pages */}
      {loading ? (
        <>
          {/* Mobile/tablet: full height under header */}
          <div className="lg:hidden">
            <HistoryLoader />
          </div>
          {/* Desktop: contained loader */}
          <div className="hidden lg:block">
            <div className="px-8 py-10">
              <HistoryLoader />
            </div>
          </div>
        </>
      ) : (
        <div className="relative flex min-h-[84vh] w-full flex-col lg:min-h-[83vh]">
          {/* Content Area */}
          <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
            <div className="flex w-full flex-col items-center justify-center text-center">
              {/* Loading is handled by global loader overlay */}

              {/* Error State */}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center">
                  <h1 className="mb-4 font-semibold text-2xl text-red-600">
                    Failed to Load Logo
                  </h1>
                  <p className="mb-6 text-gray-600">{error}</p>
                  <Button
                    className="bg-primary-500 hover:bg-primary-600"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Logo Content */}
              {logo && !loading && (
                <>
                  <h1 className="my-8 font-semibold text-4xl text-gray-900">
                    {showNoBg
                      ? "Background Remove Successful"
                      : "Your Logo is Ready!"}
                  </h1>

                  {/* Logo Display */}
                  {hasRemovedBg || isRemoving ? (
                    // Two images side-by-side across all viewports (including loading state)
                    <div className="mb-8 grid grid-cols-2 place-items-center gap-4 sm:gap-6 lg:gap-6 xl:gap-8">
                      {/* Original Logo */}
                      <div className="flex w-full max-w-[420px] flex-col items-center">
                        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl shadow-lg xl:aspect-auto xl:h-[360px] xl:w-[360px]">
                          <Image
                            alt={`Original Logo ${logo.logo_title}`}
                            className="rounded-xl"
                            fill
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-logo.png";
                            }}
                            src={logo.logo_image_url}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <Button
                          className="flex w-full items-center justify-center gap-1 rounded-full border-primary-500 px-6 py-3 text-gray-900 hover:bg-primary-50 xl:w-[360px]"
                          onClick={() =>
                            handleDownload(logo.logo_image_url, logo.logo_title)
                          }
                          variant="outline"
                        >
                          <DownloadIcon className="h-5 w-5" color="#1C274C" />
                          <span className="text-base">Download Logo</span>
                        </Button>
                      </div>

                      {/* Background Removed Logo or Skeleton */}
                      <div className="flex w-full max-w-[420px] flex-col items-center">
                        {isRemoving ? (
                          // Show skeleton while removing background
                          <>
                            <div className="mb-4 aspect-square w-full overflow-hidden rounded-xl shadow-lg xl:aspect-auto xl:h-[360px] xl:w-[360px]">
                              <Skeleton className="h-full w-full rounded-xl" />
                            </div>
                            <Skeleton className="h-[48px] w-full rounded-full xl:w-[360px]" />
                          </>
                        ) : (
                          // Show actual background removed logo
                          <>
                            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl shadow-lg xl:aspect-auto xl:h-[360px] xl:w-[360px]">
                              <Image
                                alt={`Background Removed Logo ${logo.logo_title}`}
                                className="rounded-xl"
                                fill
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder-logo.svg";
                                }}
                                src={logo.remove_bg_logo_image_url}
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                            <Button
                              className="flex w-full items-center justify-center gap-1 rounded-full border-primary-500 px-6 py-3 text-gray-900 hover:bg-primary-50 xl:w-[360px]"
                              onClick={() =>
                                handleDownload(
                                  logo.remove_bg_logo_image_url,
                                  `${logo.logo_title}_no_bg`
                                )
                              }
                              variant="outline"
                            >
                              <DownloadIcon
                                className="h-5 w-5"
                                color="#1C274C"
                              />
                              <span className="text-base">Download Logo</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Single logo: full width before lg, centered fixed size on lg+
                    <div className="mb-8 w-full">
                      <div className="relative mx-auto aspect-square w-full max-w-none overflow-hidden rounded-xl shadow-lg lg:aspect-auto lg:h-[360px] lg:w-[360px]">
                        <Image
                          alt={`Generated Logo ${logo.logo_title}`}
                          className="rounded-xl"
                          fill
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-logo.png";
                          }}
                          src={logo.logo_image_url}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!(
                    isRemoving ||
                    showNoBg ||
                    logo.remove_bg_logo_image_url
                  ) && (
                    <div className="mb-12 flex gap-4">
                      <Button
                        className="flex items-center gap-2 rounded-full border-primary-500 px-6 py-3 text-gray-900 hover:bg-primary-50"
                        onClick={handleRemoveBg}
                        variant="outline"
                      >
                        <RemoveBgIcon className="h-5 w-5" color="#1C274C" />
                        Remove BG
                      </Button>
                      <Button
                        className="flex items-center gap-2 rounded-full border-primary-500 px-6 py-3 text-gray-900 hover:bg-primary-50"
                        onClick={() =>
                          handleDownload(logo.logo_image_url, logo.logo_title)
                        }
                        variant="outline"
                      >
                        <DownloadIcon className="h-5 w-5" color="#1C274C" />
                        Download
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Generate Again Button - stick to bottom when content is short, follow when long */}
            <div className="mx-auto mt-auto flex w-full justify-center">
              <Button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-500 text-white transition-colors duration-200 hover:bg-primary-600"
                onClick={handleGenerateAgain}
              >
                <GenerateIcon size={24} />
                <span className="font-medium text-base">Generate Again</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
