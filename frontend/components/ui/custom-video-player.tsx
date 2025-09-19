"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import PauseIcon from "@/components/icons/PauseIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import SpeakerWaveIcon from "@/components/icons/SpeakerWaveIcon";

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  aspectRatio?: string;
}

export function CustomVideoPlayer({
  src,
  poster,
  className = "",
  aspectRatio = "16:9",
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    video.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isPortrait = aspectRatio === "9:16";

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-black shadow-lg ${className}`}
    >
      {/* Video Element */}
      <video
        className="h-full w-full"
        onClick={togglePlay}
        poster={poster}
        ref={videoRef}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Custom Controls Overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
        {/* Top Controls */}
        <div className="flex justify-end">
          {/* Volume Control */}
          <div className="pointer-events-auto relative">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white bg-opacity-20 transition-all hover:bg-opacity-30"
              onClick={() => setShowVolume(!showVolume)}
            >
              <SpeakerWaveIcon color="white" size={16} />
            </button>

            {showVolume && (
              <div className="pointer-events-auto absolute top-10 right-0 rounded-lg bg-black bg-opacity-80 p-2">
                <input
                  className="h-2 w-20 cursor-pointer appearance-none rounded-lg bg-gray-600"
                  max="1"
                  min="0"
                  onChange={(e) => {
                    const newVolume = Number.parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (videoRef.current) {
                      videoRef.current.volume = newVolume;
                    }
                  }}
                  step="0.1"
                  type="range"
                  value={volume}
                />
              </div>
            )}
          </div>
        </div>

        {/* Center Play/Pause Button */}
        <div className="flex items-center justify-center">
          <button
            className={`${isPortrait ? "h-20 w-20" : "h-16 w-16"} pointer-events-auto flex items-center justify-center rounded-full bg-white bg-opacity-20 transition-all hover:bg-opacity-30`}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <PauseIcon color="white" size={isPortrait ? 40 : 32} />
            ) : (
              <PlayIcon
                className="ml-1"
                color="white"
                size={isPortrait ? 40 : 32}
              />
            )}
          </button>
        </div>

        {/* Bottom Progress Bar */}
        <div className="pointer-events-auto">
          {/* Progress Bar */}
          <div
            className="h-1 w-full cursor-pointer rounded-full bg-white bg-opacity-30"
            onClick={handleSeek}
          >
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Time Display */}
          <div className="mt-2 flex items-center justify-between">
            <div className="rounded-full bg-gray-800 bg-opacity-80 px-2 py-1 text-white text-xs">
              {formatTime(currentTime)}
            </div>
            <div className="rounded-full bg-gray-800 bg-opacity-80 px-2 py-1 text-white text-xs">
              {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
