"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CustomVideoPlayer } from "@/components/ui/custom-video-player";
import { getAllVideosForUser, deleteVideo, type VideoResponse } from "@/lib/api/video";
import HistoryLoader from "@/components/history-loader";

function getUserIdFromToken(): number | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || null;
  } catch {
    return null;
  }
}

export default function ShortVideoHistory() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  useEffect(() => {
    const loadUserVideos = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;
      setIsLoading(true);
      try {
        const vids = await getAllVideosForUser(userId);
        setVideos(vids);
      } catch (error) {
        console.error("Error loading user videos:", error);
        toast.error("Failed to load video history");
      } finally {
        setIsLoading(false);
      }
    };
    loadUserVideos();
  }, []);

  const handleDeleteVideo = async (videoId: number) => {
    setDeletingIds((p) => [...p, videoId]);
    try {
      await deleteVideo(videoId);
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      toast.success("Video deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete video:", error);
      toast.error(error?.response?.data?.message || error.message || "Failed to delete video");
    } finally {
      setDeletingIds((p) => p.filter((id) => id !== videoId));
    }
  };

  if (isLoading) {
    return <HistoryLoader />;
  }

  if (!isLoading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 mb-4">No videos generated yet</div>
          <Button disabled className="bg-primary-500 hover:bg-primary-600">Generate Your First Video</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm w-full flex flex-col">
          <div className="mb-4 w-full">
            <CustomVideoPlayer src={video.video_url} poster="/placeholder.jpg" className="aspect-video w-full" />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{video.prompt}</h3>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm mb-3 w-full">
            <span className="text-gray-600">
              <span className="text-gray-700 font-semibold">Generated</span>{" "}
              <span className="text-primary-600 font-medium">
                {new Date(video.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-600 rounded-full"
              onClick={() => handleDeleteVideo(video.id)}
              disabled={deletingIds.includes(video.id)}
            >
              {deletingIds.includes(video.id) ? "Deleting..." : "Delete"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-primary-600 border-primary-600 hover:bg-primary-50 hover:text-primary-600 rounded-full"
              onClick={() => router.push(`/dashboard/short-video-generator/${video.id}`)}
            >
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
