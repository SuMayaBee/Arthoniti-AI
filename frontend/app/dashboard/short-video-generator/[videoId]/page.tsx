"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import HistoryLoader from "@/components/history-loader";
import VideoCameraIcon from "@/components/icons/VideoCameraIcon";
import DesktopHeader from "@/components/nav/DesktopHeader";
import MobileHeader from "@/components/nav/MobileHeader";
import { Button } from "@/components/ui/button";
import { CustomVideoPlayer } from "@/components/ui/custom-video-player";
import { getVideoById, type VideoResponse } from "@/lib/api/video";

export default function VideoDetailsPage({
  params,
}: {
  params: { videoId: string };
}) {
  const router = useRouter();
  const { videoId } = params;
  const [video, setVideo] = useState<VideoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const videoData = await getVideoById(Number.parseInt(videoId));
        setVideo(videoData);
      } catch (error: any) {
        console.error("Error fetching video:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch video"
        );
        toast.error("Failed to fetch video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleBack = () => {
    router.push("/dashboard/short-video-generator");
  };

  const handleDownload = async () => {
    if (!video) return;

    try {
      const response = await fetch(video.video_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const fileName = `${video.prompt.replace(/[^a-zA-Z0-9]/g, "_")}_video.mp4`;
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download video:", error);
      toast.error("Failed to download video");
    }
  };

  const handleGenerateAgain = () => {
    router.push("/dashboard/short-video-generator");
  };

  const headerTitle = "Short Video";

  if (loading) {
    return (
      <div className="w-full">
        <DesktopHeader />
        <MobileHeader className="mb-2" showBorder title={headerTitle} />
        <div className="lg:hidden">
          <HistoryLoader />
        </div>
        <div className="hidden lg:block">
          <div className="px-8 py-10">
            <HistoryLoader />
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="w-full">
        <DesktopHeader />
        <MobileHeader className="mb-2" showBorder title={headerTitle} />
        <div className="flex min-h-[calc(100svh-72px)] items-center justify-center lg:min-h-[calc(100svh-56px)]">
          <div className="text-center">
            <div className="mb-4 text-red-500">Failed to load video</div>
            <Button
              onClick={() => router.push("/dashboard/short-video-generator")}
            >
              Back to Video Generator
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <DesktopHeader />
      <MobileHeader className="mb-2" showBorder title={headerTitle} />
      <div className="relative flex min-h-[84vh] w-full flex-col lg:min-h-[83vh]">
        <div className="flex w-full flex-1 flex-col items-center justify-center p-8">
          <h1 className="mb-2 font-bold text-3xl text-gray-900">
            Your AI-Generated Video is Ready!
          </h1>
          <p className="mb-8 text-gray-600 text-lg">
            Watch it, download, or fine-tune it.
          </p>
          <div className="flex w-full max-w-4xl flex-col items-center justify-center text-center">
            <div
              className={`relative mb-8 flex w-full ${video.aspect_ratio === "9:16" ? "max-w-[280px]" : "max-w-2xl"} flex-col gap-5`}
            >
              <CustomVideoPlayer
                className={
                  video.aspect_ratio === "9:16"
                    ? "h-[500px] w-[280px]"
                    : "aspect-video w-full"
                }
                poster="/placeholder.jpg"
                src={video.video_url}
              />
              <Button
                className="mb-12 flex w-full items-center justify-center gap-2 rounded-full border-primary-500 px-8 py-4 text-gray-900 hover:bg-primary-50"
                onClick={handleDownload}
                variant="outline"
              >
                <VideoCameraIcon color="#1C274C" size={20} />
                Download Video
              </Button>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-auto flex w-full justify-center">
          <Button
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 font-semibold text-lg text-white transition-colors duration-200 hover:bg-primary-600"
            onClick={handleGenerateAgain}
            style={{
              paddingTop: "16px",
              paddingBottom: "16px",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <VideoCameraIcon color="white" size={20} />
            <span className="font-medium text-base">Generate Again</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
