"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageLoader } from "@/components/ui/image-loader";
import { generateImage } from "@/lib/presentation-api";
import {
  LiRefresh as Loader2,
  LiStars as Sparkles,
  LiRefresh as RefreshCw,
} from "solar-icon-react/li";
import toast from "react-hot-toast";

interface ImageGeneratorProps {
  prompt: string;
  size?: string;
  user_email?: string;
  quality?: string;
  context?: string;
  className?: string;
  onImageGenerated?: (url: string) => void;
  showGenerateButton?: boolean;
}

export function ImageGenerator({
  prompt,
  size = "1024x1024",
  user_email = "",
  quality = "hd",
  context = "",
  className = "",
  onImageGenerated,
  showGenerateButton = true,
}: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please provide a prompt for image generation");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateImage({
        prompt: prompt.trim(),
        user_email,
        size,
        quality,
        context,
      });

      if (response.success && response.url) {
        setGeneratedImageUrl(response.url);
        setHasGenerated(true);
        onImageGenerated?.(response.url);
        toast.success("Image generated successfully!");
      } else {
        throw new Error(response.error || "Failed to generate image");
      }
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedImageUrl(null);
    setHasGenerated(false);
    handleGenerateImage();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showGenerateButton && !hasGenerated && (
        <Button
          onClick={handleGenerateImage}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-full text-lg font-medium flex items-center justify-center gap-3"
          style={{ paddingTop: '16px', paddingBottom: '16px', paddingLeft: '24px', paddingRight: '24px' }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Image...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      )}

      {isGenerating && !generatedImageUrl && (
        <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-medium text-gray-700">
              Generating image...
            </p>
            <p className="text-sm text-gray-500 mt-2">{prompt}</p>
          </div>
        </div>
      )}

      {generatedImageUrl && (
        <div className="space-y-2">
          <ImageLoader
            src={generatedImageUrl}
            alt={prompt}
            className="w-full"
          />
          {showGenerateButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Image
            </Button>
          )}
        </div>
      )}

      {!generatedImageUrl && !isGenerating && !showGenerateButton && (
        <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Image will be generated automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
