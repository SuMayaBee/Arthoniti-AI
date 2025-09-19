"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import PitchDeckHistory from "@/components/history/PitchDeckHistory";
import MobileHeader from "@/components/nav/MobileHeader";
// UI dialogs/icons removed from this page to avoid unused-import lint warnings
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  type GenerateUnifiedRequest,
  type GenerateUnifiedResponse,
  generatePresentationUnified,
} from "@/lib/api/presentation";
import { processImageUrl } from "@/lib/utils";
import {
  type PitchDeckForm,
  pitchDeckSchema,
} from "@/lib/validation/pitch-deck";

export default function PitchDeckPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] =
    useState<GenerateUnifiedResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"pitch-deck" | "previous-history">(
    "pitch-deck"
  );

  const form = useForm<PitchDeckForm>({
    resolver: async (data, context, options) => {
      // Custom validation - only validate required fields
      const errors: Record<string, any> = {};
      
      // Validate slideCount
      if (!data.slideCount || data.slideCount.trim() === "") {
        errors.slideCount = { message: "Please select number of slides" };
      } else {
        const n = parseInt(data.slideCount, 10);
        if (isNaN(n) || n < 3 || n > 20) {
          errors.slideCount = { message: "Slides must be between 3 and 20" };
        }
      }
      
      // Validate prompt
      if (!data.prompt || data.prompt.trim().length < 10) {
        errors.prompt = { message: "Prompt must be at least 10 characters" };
      }
      
      // Return validation result
      return {
        values: Object.keys(errors).length === 0 ? data : {},
        errors,
      };
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      slideCount: "3",
      color: "#FF5E3A",
      prompt: "",
      companyName: "",
      websiteUrl: "",
      industry: "",
      oneLinePitch: "",
      problemSolving: "",
      uniqueSolution: "",
      targetAudience: "",
      businessModel: "",
      revenuePlan: "",
      competitors: "",
      vision: "",
      language: "",
      tone: "",
      generateImages: false,
    },
  });

  function getUserIdFromToken(): number | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/access_token=([^;]+)/);
    if (!match) return null;
    const token = match[1];
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const rawId = payload?.user_id;
      const numericId =
        typeof rawId === "number"
          ? rawId
          : typeof rawId === "string"
            ? Number.parseInt(rawId, 10)
            : Number.NaN;
      return Number.isFinite(numericId) ? numericId : null;
    } catch {
      return null;
    }
  }

  const colors = [
    { name: "red", value: "#FF5E3A" },
    { name: "brightMagenta", value: "#FF00FF" },
    { name: "brightYellow", value: "#FFFF00" },
    { name: "redOrange", value: "#FF4500" },
    { name: "darkBlue", value: "#1C274C" },
    { name: "hotPink", value: "#FF69B4" },
    { name: "purple", value: "#9E32DD" },
    { name: "teal", value: "#008080" },
    { name: "lightPurple", value: "#E6E6FA" },
    { name: "brown", value: "#8B4513" },
  ];

  const onSubmit = async (data: PitchDeckForm) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsGenerating(true);
    let navigated = false;
    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("User not authenticated");

      const parsedSlides = Number.parseInt(data.slideCount || "3", 10);
      const slides_count = Math.min(
        20,
        Math.max(3, Number.isNaN(parsedSlides) ? 3 : parsedSlides)
      );

      const prompt = data.prompt || "";

      const normalizedWebsites = (data.websiteUrl || "")
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
        .map((url) =>
          url.startsWith("http://") || url.startsWith("https://")
            ? url
            : `https://${url}`
        )
        .join(",");

      const requestPayload: GenerateUnifiedRequest = {
        slides_count,
        prompt: prompt.trim(),
        color_theme: (data.color || "#FF5E3A").trim(),
        website_urls: normalizedWebsites,
        industry_sector: (data.industry || "").trim(),
        one_line_pitch: (data.oneLinePitch || "").trim(),
        problem_solving: (data.problemSolving || "").trim(),
        unique_solution: (data.uniqueSolution || "").trim(),
        target_audience: (data.targetAudience || "").trim(),
        business_model: (data.businessModel || "").trim(),
        revenue_plan: (data.revenuePlan || "").trim(),
        competitors: (data.competitors || "").trim(),
        vision: (data.vision || "").trim(),
        language: (data.language || "").trim(),
        tone: (data.tone || "").trim(),
        generate_images: !!(data.generateImages),
        user_id: userId,
      };

      if (typeof window !== "undefined") {
        console.log("📤 Unified payload:", requestPayload);
      }
      const response = (await generatePresentationUnified(
        requestPayload as GenerateUnifiedRequest
      )) as GenerateUnifiedResponse;

      if (!response.success) {
        throw new Error(response.error || "Failed to generate presentation");
      }
      toast.success("Pitch deck generated successfully!");

      try {
        if (typeof window !== "undefined") {
          const deckId =
            response.presentation_id ?? response.database_id ?? Date.now();
          localStorage.setItem(
            `presentation_xml:${deckId}`,
            response.presentation_xml || ""
          );
          
          // If images were requested but not generated, trigger auto-generation
          if (data.generateImages && (!response.generated_images || response.generated_images.length === 0)) {
            localStorage.setItem(
              `auto_generate_images:${deckId}`,
              "true"
            );
          }
          
          navigated = true;
          router.push(`/dashboard/pitch-deck/${deckId}`);
          return;
        }
      } catch {}
    } catch (err: unknown) {
      console.error("Failed to generate pitch deck:", err);
      // try to coerce known error shapes without using `any`
      let detailMsg: string | undefined;
      try {
        const maybeErr = err as {
          response?: { data?: { detail?: unknown; message?: string } };
          message?: string;
        };
        const detail = maybeErr.response?.data?.detail;
        if (Array.isArray(detail)) {
          detailMsg = detail
            .map((d) => {
              if (!d) return;
              if (typeof d === "string") return d;
              if (typeof d === "object")
                return (
                  (d as any)?.msg || (d as any)?.message || JSON.stringify(d)
                );
              return;
            })
            .filter(Boolean)
            .join("; ");
        } else if (typeof detail === "string") {
          detailMsg = detail;
        } else {
          detailMsg = maybeErr.response?.data?.message ?? maybeErr.message;
        }
      } catch {
        detailMsg = undefined;
      }
      toast.error(detailMsg ?? "Failed to generate pitch deck");
    } finally {
      // Local generating overlay/contained loader only
      if (!navigated) {
        setIsGenerating(false);
      }
      setIsSubmitting(false);
      setGenerationResult(null);
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
        title="Pitch Deck"
      />
      <div className="">
        <Tabs
          onValueChange={(value) =>
            setActiveTab(value as "pitch-deck" | "previous-history")
          }
          value={activeTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="pitch-deck">Pitch Deck</TabsTrigger>
            <TabsTrigger value="previous-history">Previous History</TabsTrigger>
          </TabsList>

          <TabsContent value="pitch-deck">
            <div className="w-full">
              {!isGenerating &&
                (generationResult ? (
                  <div className="space-y-6">
                    <h2 className="font-semibold text-2xl text-gray-900">
                      Generated Pitch Deck
                    </h2>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      {/* First Slide Preview from generated XML */}
                      {(() => {
                        try {
                          const xml = (generationResult.presentation_xml || "")
                            .replace(/^```[a-zA-Z]*\n?/i, "")
                            .replace(/```\s*$/, "");
                          const sectionMatch =
                            xml.match(
                              /<SECTION\b[^>]*>[\s\S]*?<\/SECTION>/i
                            )?.[0] || "";
                          if (!sectionMatch) return null;
                          const doc = new DOMParser().parseFromString(
                            `<ROOT>${sectionMatch}</ROOT>`,
                            "application/xml"
                          );
                          if (
                            doc.getElementsByTagName("parsererror").length > 0
                          )
                            return null;
                          const sec = doc.getElementsByTagName("SECTION")[0];
                          if (!sec) return null;
                          const title =
                            sec.getElementsByTagName("H1")[0]?.textContent ||
                            undefined;
                          const subtitle =
                            sec.getElementsByTagName("H2")[0]?.textContent ||
                            undefined;
                          const paragraphs = Array.from(
                            sec.getElementsByTagName("P")
                          )
                            .map((n) => (n.textContent || "").trim())
                            .filter(Boolean);
                          const img = sec.getElementsByTagName("IMG")[0];
                          const src = img?.getAttribute("src") || undefined;
                          const imageUrl = src
                            ? processImageUrl(src)
                            : undefined;
                          const bulletsParent =
                            sec.getElementsByTagName("BULLETS")[0];
                          const bullets = bulletsParent
                            ? Array.from(
                                bulletsParent.getElementsByTagName("DIV")
                              ).map((div) => ({
                                title:
                                  div.getElementsByTagName("H3")[0]
                                    ?.textContent || undefined,
                                text:
                                  div.getElementsByTagName("P")[0]
                                    ?.textContent || undefined,
                              }))
                            : [];
                          return (
                            <div className="mb-6 rounded-lg bg-gray-50 p-3">
                              <div
                                className="relative rounded-xl bg-white p-5 shadow"
                                style={{
                                  height: 260,
                                  background:
                                    "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
                                }}
                              >
                                {imageUrl ? (
                                  <div className="grid h-full grid-cols-2 items-start gap-4">
                                    <div className="order-1 h-full w-full overflow-hidden rounded-lg border border-slate-200">
                                      <Image
                                        alt={title ? title : "slide visual"}
                                        className="h-full w-full object-cover"
                                        height={520}
                                        src={imageUrl}
                                        width={800}
                                      />
                                    </div>
                                    <div className="order-2 flex h-full min-h-0 flex-col overflow-hidden">
                                      {title && (
                                        <h4 className="mb-1 font-semibold text-sm tracking-tight">
                                          {title}
                                        </h4>
                                      )}
                                      <div className="pr-1 text-[11px] leading-5">
                                        {(() => {
                                          const parts: string[] = [];
                                          if (subtitle) parts.push(subtitle);
                                          parts.push(...paragraphs);
                                          parts.push(
                                            ...bullets
                                              .map((b) =>
                                                [b.title, b.text]
                                                  .filter(Boolean)
                                                  .join(": ")
                                              )
                                              .filter(Boolean)
                                          );
                                          const combined = parts
                                            .join(" ")
                                            .replace(/\s+/g, " ")
                                            .trim();
                                          const allWords =
                                            combined.split(/\s+/);
                                          const limited = allWords
                                            .slice(0, 15)
                                            .join(" ");
                                          const truncated =
                                            allWords.length > 15;
                                          return (
                                            <p>
                                              {limited}
                                              {truncated ? "" : ""}
                                            </p>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid h-full grid-cols-1 gap-2">
                                    <div className="flex h-full min-h-0 flex-col overflow-hidden">
                                      {title && (
                                        <h4 className="mb-1 font-semibold text-sm tracking-tight">
                                          {title}
                                        </h4>
                                      )}
                                      <div className="pr-1 text-[11px] leading-5">
                                        {(() => {
                                          const parts: string[] = [];
                                          if (subtitle) parts.push(subtitle);
                                          parts.push(...paragraphs);
                                          parts.push(
                                            ...bullets
                                              .map((b) =>
                                                [b.title, b.text]
                                                  .filter(Boolean)
                                                  .join(": ")
                                              )
                                              .filter(Boolean)
                                          );
                                          const combined = parts
                                            .join(" ")
                                            .replace(/\s+/g, " ")
                                            .trim();
                                          const allWords =
                                            combined.split(/\s+/);
                                          const limited = allWords
                                            .slice(0, 15)
                                            .join(" ");
                                          const truncated =
                                            allWords.length > 15;
                                          return (
                                            <p>
                                              {limited}
                                              {truncated ? "" : ""}
                                            </p>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        } catch {
                          return null;
                        }
                      })()}
                      {generationResult.generated_images &&
                        generationResult.generated_images.length > 0 && (
                          <div className="mb-6">
                            <p className="mb-3 text-gray-500 text-sm">
                              Generated Images
                            </p>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                              {generationResult.generated_images.map(
                                (img, idx) => (
                                  <div
                                    className="relative h-40 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                                    key={img ?? idx}
                                  >
                                    <Image
                                      alt={`Slide ${idx + 1}`}
                                      className="h-full w-full object-cover"
                                      height={220}
                                      src={img}
                                      width={400}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      <div className="flex items-center justify-between">
                        <div className="text-gray-500 text-sm">
                          {generationResult.context_sources_used?.length ? (
                            <span>
                              Sources:{" "}
                              {generationResult.context_sources_used.join(", ")}
                            </span>
                          ) : (
                            <span>No external sources used</span>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <Button
                            className="rounded-full border-primary-500 px-6 py-3 text-primary-500 hover:bg-primary-50"
                            onClick={() => setGenerationResult(null)}
                            variant="outline"
                          >
                            Generate Another
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="font-semibold text-2xl text-gray-900">
                      Create Your Pitch Deck
                    </h2>

                    <Form {...form}>
                      <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                      >
                        <div className="w-full md:w-1/2">
                          <FormField
                            control={form.control}
                            name="slideCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold text-lg">
                                  Number of Slides
                                </FormLabel>
                                <Select
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12 px-[30px] py-3 text-lg">
                                      <SelectValue placeholder="Select number of slides" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from(
                                      { length: 18 },
                                      (_, i) => i + 3
                                    ).map((num) => (
                                      <SelectItem
                                        key={num}
                                        value={num.toString()}
                                      >
                                        {num} {num === 1 ? "slide" : "slides"}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="color"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Color</FormLabel>
                              <div className="mt-2 flex flex-wrap gap-3">
                                {colors.map((color) => (
                                  <button
                                    className={`h-8 w-8 rounded-full border-2 transition-all duration-200 ${
                                      field.value === color.value
                                        ? "scale-110 border-primary-500"
                                        : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    key={color.name}
                                    onClick={() => field.onChange(color.value)}
                                    style={{ backgroundColor: color.value }}
                                    type="button"
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="prompt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Main Topic / Prompt
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  className="min-h-[100px] px-[30px] py-3 text-lg"
                                  placeholder="Describe the main topic for your presentation (min 10 characters)"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Company Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 px-[30px] py-3 text-lg"
                                  placeholder="Enter your company name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="websiteUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Website URL
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 px-[30px] py-3 text-lg"
                                  placeholder="https://yourcompany.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="industry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Industry
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 px-[30px] py-3 text-lg"
                                  placeholder="e.g., Technology, Healthcare, Finance"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="oneLinePitch"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                One-Line Pitch
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 px-[30px] py-3 text-lg"
                                  placeholder="Brief description of your business"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="problemSolving"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Problem You're Solving
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  className="min-h-[120px] px-[30px] py-3 text-lg"
                                  placeholder="Describe the problem your product/service solves..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="uniqueSolution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Your Unique Solution
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  className="min-h-[120px] px-[30px] py-3 text-lg"
                                  placeholder="Describe your unique solution..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="targetAudience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Target Audience
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 px-[30px] py-3 text-lg"
                                  placeholder="Who is your target market?"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Business Model
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  className="min-h-[120px] px-[30px] py-3 text-lg"
                                  placeholder="How do you make money?"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="revenuePlan"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Revenue Plan
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  className="min-h-[120px] px-[30px] py-3 text-lg"
                                  placeholder="Your revenue projections and plans..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="competitors"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Competitors
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 px-[30px] py-3 text-lg"
                                  placeholder="Who are your main competitors?"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="vision"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Vision
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 px-[30px] py-3 text-lg"
                                  placeholder="Your long-term vision"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="language"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Language
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 px-[30px] py-3 text-lg"
                                  placeholder="e.g., English"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Tone
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 px-[30px] py-3 text-lg"
                                  placeholder="e.g., Professional, Casual, Persuasive"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="generateImages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-lg">
                                Generate AI images for slides
                              </FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                  <span className="text-gray-600 text-sm">
                                    Toggle to auto-generate relevant images
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          className="flex w-full items-center justify-center gap-3 rounded-full bg-primary-600 font-medium text-lg text-white hover:bg-primary-700"
                          disabled={isGenerating}
                          style={{
                            paddingTop: "16px",
                            paddingBottom: "16px",
                            paddingLeft: "24px",
                            paddingRight: "24px",
                          }}
                          type="submit"
                        >
                          Generate Pitch Deck
                        </Button>
                      </form>
                    </Form>
                  </div>
                ))}
              {/* Desktop-contained loader mirrors history loader layout */}
              {isGenerating ? (
                <div className="hidden lg:block">
                  <GeneratingLoader isVisible variant="contained" />
                </div>
              ) : null}
            </div>
          </TabsContent>

          <TabsContent value="previous-history">
            <PitchDeckHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
