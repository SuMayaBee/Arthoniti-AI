"use client";

import { useState, useEffect } from "react";
import {
  LiRefresh as Loader2,
  LiGallery as ImageIcon,
} from "solar-icon-react/li";
import { processImageUrl, isExternalUrl } from "@/lib/utils";
import Image from "next/image";

interface ImageLoaderProps {
  src?: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
}

export function ImageLoader({
  src,
  alt,
  className = "",
  onLoad,
  onError,
  placeholder,
}: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (src !== imageSrc) {
      setImageSrc(src);
      setIsLoading(true);
      setHasError(false);
      setUseFallback(false);
    }
  }, [src, imageSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    if (!useFallback) {
      // Try fallback approach
      setUseFallback(true);
      setIsLoading(true);
      setHasError(false);
    } else {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    }
  };

  if (!src && !placeholder) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
      >
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <div className="text-center">
          <ImageIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-600">Failed to load image</p>
          {src && isExternalUrl(src) && (
            <p className="text-xs text-red-500 mt-1">
              CORS issue - image blocked by browser
            </p>
          )}
        </div>
      </div>
    );
  }

  const processedSrc = src ? processImageUrl(src) : placeholder;

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading image...</p>
            {src && isExternalUrl(src) && (
              <p className="text-xs text-gray-500 mt-1">
                Loading from external source
              </p>
            )}
          </div>
        </div>
      )}
      <div className="relative">
        {useFallback ? (
          <img
            src={processedSrc || ""}
            alt={alt}
            className={`max-w-full h-auto rounded-lg shadow-md transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleLoad}
            onError={handleError}
            crossOrigin="anonymous"
          />
        ) : (
          <Image
            src={processedSrc || ""}
            alt={alt}
            width={1024}
            height={1024}
            className={`max-w-full h-auto rounded-lg shadow-md transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleLoad}
            onError={handleError}
            priority={false}
            unoptimized={true}
          />
        )}
      </div>
    </div>
  );
}
