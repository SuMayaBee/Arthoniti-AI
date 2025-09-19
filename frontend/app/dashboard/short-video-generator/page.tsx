"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ShortVideoHistory from "@/components/history/ShortVideoHistory";
import { GenerateIcon } from "@/components/icons/generate-icon";
import MobileIcon from "@/components/icons/MobileIcon";
import MobileWideIcon from "@/components/icons/MobileWideIcon";
import MobileHeader from "@/components/nav/MobileHeader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GeneratingLoader from "@/components/ui/generating-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { generateVideo } from "@/lib/api/video";
import {
  type ShortVideoForm,
  shortVideoSchema,
} from "@/lib/validation/short-video";

// removed aspect ratios and durations: backend only needs prompt

// moved to lib/validation/short-video.ts

// Pre-compile regex for better performance
const ACCESS_TOKEN_REGEX = /access_token=([^;]+)/;

// Utility to extract user_id from JWT in access_token cookie
function getUserIdFromToken(): number | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(ACCESS_TOKEN_REGEX);
  if (!match) {
    return null;
  }
  const token = match[1];
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || null;
  } catch {
    return null;
  }
}

export default function ShortVideoGeneratorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "video-generate" | "previous-history"
  >("video-generate");
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<ShortVideoForm>({
    resolver: zodResolver(shortVideoSchema),
    defaultValues: {
      prompt: "",
      aspect_ratio: "9:16",
      duration: 8, // Fixed 8 seconds duration
      resolution: "720p",
      generate_audio: true,
      negative_prompt: "",
    },
  });

  // History is now encapsulated in ShortVideoHistory component

  const onSubmit = async (values: ShortVideoForm) => {
    setIsGenerating(true);

    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await generateVideo({
        user_id: userId,
        prompt: values.prompt,
        aspect_ratio: values.aspect_ratio,
        duration: values.duration,
        resolution: values.resolution,
        generate_audio: values.generate_audio,
        negative_prompt: values.negative_prompt || "",
      });

      toast.success("Video generated successfully!");
      router.push(`/dashboard/short-video-generator/${response.id}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate video";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative w-full max-w-none">
      {/* Full-screen overlay only on mobile/tablet; desktop uses contained loader */}
      {isGenerating && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <GeneratingLoader isVisible variant="full" />
        </div>
      )}

      {/* Mobile header (hidden on lg+), sits above tabs */}
      <MobileHeader
        className="relative z-[10000] bg-white"
        showBorder
        title="Video Generate"
      />
      <div>
        <Tabs
          onValueChange={(value) =>
            setActiveTab(value as "video-generate" | "previous-history")
          }
          value={activeTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="video-generate">Video Generate</TabsTrigger>
            <TabsTrigger value="previous-history">Previous History</TabsTrigger>
          </TabsList>

          <TabsContent value="video-generate">
            {/* Match /logo-generator/[logoId] layout: full-height section with bottom action */}
            <div
              className={`relative flex min-h-[calc(100vh-180px)] w-full flex-col justify-between ${isGenerating ? "hidden" : ""}`}
            >
              {/* Content Area */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-2 font-bold text-3xl text-gray-900">
                    Create Stunning Videos with AI
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Tell us your idea, and AI will generate your video.
                  </p>
                </div>

                <Form {...form}>
                  <form
                    className="space-y-8"
                    id="short-video-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div className="flex flex-col gap-6">
                      {/* Prompt */}
                      <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="font-semibold text-lg">
                              Prompt *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                className="min-h-[120px] resize-none text-lg"
                                placeholder="Describe the video you want to generate..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Negative Prompt */}
                      <FormField
                        control={form.control}
                        name="negative_prompt"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="font-semibold text-lg">
                              Negative Prompt
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                className="min-h-[100px] resize-none text-lg"
                                placeholder="What to exclude from the video..."
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Aspect Ratio */}
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="aspect_ratio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-3 block font-medium text-base text-gray-900">
                                Video Ratio
                              </FormLabel>
                              <FormControl>
                                <div className="flex flex-wrap gap-5">
                                  {[
                                    { value: "9:16", label: "9:16" },
                                    { value: "16:9", label: "16:9" },
                                  ].map((ratio) => (
                                    <button
                                      className={`flex items-center gap-2 rounded-full border-[0.5px] border-neutral-200 px-6 py-3 transition-all ${
                                        field.value === ratio.value
                                          ? "!border-primary-500 bg-primary-50 text-primary-700"
                                          : "bg-white hover:border-primary-300"
                                      }`}
                                      key={ratio.value}
                                      onClick={() =>
                                        field.onChange(ratio.value)
                                      }
                                      type="button"
                                    >
                                      {ratio.value === "16:9" ? (
                                        <MobileWideIcon />
                                      ) : (
                                        <MobileIcon />
                                      )}
                                      {ratio.label}
                                    </button>
                                  ))}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Duration */}
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-3 block font-medium text-base text-gray-900">
                                Video Duration
                              </FormLabel>
                              <button
                                className={`flex items-center gap-2 rounded-full border-[0.5px] border-neutral-200 px-6 py-3 transition-all ${
                                  field.value === 8
                                    ? "!border-primary-500 bg-primary-50 text-primary-700"
                                    : "bg-white hover:border-primary-300"
                                }`}
                                onClick={() => field.onChange(8)}
                                type="button"
                              >
                                <span>8 seconds</span>
                              </button>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Resolution */}
                      <FormField
                        control={form.control}
                        name="resolution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mb-3 block font-medium text-base text-gray-900">
                              Resolution
                            </FormLabel>
                            <div className="flex flex-wrap gap-5">
                              {["480p", "720p"].map((res) => (
                                <button
                                  className={`flex items-center gap-2 rounded-full border-[0.5px] border-neutral-200 px-6 py-3 transition-all ${
                                    field.value === res
                                      ? "!border-primary-500 bg-primary-50 text-primary-700"
                                      : "bg-white hover:border-primary-300"
                                  }`}
                                  key={res}
                                  onClick={() => field.onChange(res)}
                                  type="button"
                                >
                                  <span>{res}</span>
                                </button>
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Audio */}
                      <FormField
                        control={form.control}
                        name="generate_audio"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <button
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                  field.value ? "bg-primary-500" : "bg-gray-200"
                                }`}
                                onClick={() => field.onChange(!field.value)}
                                type="button"
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    field.value
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-semibold text-lg">
                                Audio
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </div>
              {/* Bottom fixed action area */}
              <div className="mt-8 flex w-full justify-center">
                <Button
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 text-white transition-colors duration-200 hover:bg-primary-600"
                  disabled={isGenerating}
                  form="short-video-form"
                  style={{
                    paddingTop: "16px",
                    paddingBottom: "16px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                  }}
                  type="submit"
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    <GenerateIcon size={24} />
                  </div>
                  <span className="font-medium text-base">Generate Video</span>
                </Button>
              </div>
            </div>
            {/* Desktop-contained loader mirrors history loader layout */}
            {isGenerating ? (
              <div className="hidden lg:block">
                <GeneratingLoader isVisible variant="contained" />
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="previous-history">
            <ShortVideoHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
