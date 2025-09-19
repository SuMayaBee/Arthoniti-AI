/** biome-ignore-all lint/performance/useTopLevelRegex: <explanation> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
/** biome-ignore-all lint/complexity/noVoid: <explanation> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
/** biome-ignore-all lint/style/useBlockStatements: <explanation> */
/** biome-ignore-all lint/style/useTemplate: <explanation> */
/** biome-ignore-all lint/style/noMagicNumbers: <explanation> */
"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
// Per-page DashboardLayout removed so this page renders inside app/dashboard/layout.tsx
import WebsiteHistory from "@/components/history/WebsiteHistory";
import MagicStickIcon from "@/components/icons/MagicStickIcon";
import UpperArrowMdIcon from "@/components/icons/UpperArrowMdIcon";
import MobileHeader from "@/components/nav/MobileHeader";
import PageHeader from "@/components/page-header";
import GeneratingLoader from "@/components/ui/generating-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/use-profile";
import apiClient from "@/lib/api/client";
import { useWebsiteBuilderStore } from "@/store/website-builder";

export default function WebsiteBuilderPage() {
  const router = useRouter();
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState<
    "website-generate" | "previous-history" | "deployed-website"
  >("website-generate");
  const [prompt, setPrompt] = useState("");
  const isPromptEmpty = prompt.trim().length === 0;
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showEnhancedBadge, setShowEnhancedBadge] = useState(false);
  const enhanceBadgeTimeout = useRef<number | null>(null);
  const {
    isRequestInProgress,
    generateRequestId,
    setCreateProjectLoading,
    setEnhancePromptLoading,
  } = useWebsiteBuilderStore();

  // Derive a lightweight title/description from the prompt
  const deriveMetaFromPrompt = (p: string) => {
    const cleaned = p.trim().replace(/\s+/g, " ");
    // Title: up to 8 words or up to first punctuation
    const firstSentence = cleaned.split(/[.!?]/)[0];
    const words = firstSentence.split(" ");
    const title = words.slice(0, 8).join(" ") || "Website Project";
    // Description: clamp to ~160 chars
    const description =
      cleaned.length > 160 ? cleaned.slice(0, 157) + "..." : cleaned;
    return { title, description };
  };

  const handleCreateProject = async () => {
    if (isPromptEmpty) return;

    // Prevent duplicate requests
    if (isRequestInProgress("createProject")) {
      return;
    }

    const requestId = generateRequestId();

    try {
      setIsCreating(true);
      setCreateProjectLoading(true, requestId);
      // Local generating loader (mobile overlay + desktop contained)

      const { title, description } = deriveMetaFromPrompt(prompt);
      const messages = [{ role: "user", content: prompt }];
      const payload = {
        title,
        description,
        prompt,
        files: {} as Record<string, any>,
        messages,
        thumbnail: "",
        status: "active",
        user_id: String(profile?.id ?? ""),
      };

      const { data } = await apiClient.post(
        "/website-builder/projects",
        payload
      );

      // After project creation, just navigate to the project page.
      // The website editor page will handle ai-chat + code generation automatically.
      if (data?.id) {
        const projectId = data.id;
        router.push(`/website/${projectId}`);
        toast.success("Project created");
      } else {
        toast.error("Project created but no ID returned");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsCreating(false);
      setCreateProjectLoading(false);
    }
  };

  const handleEnhance = async () => {
    if (isPromptEmpty) return;

    // Prevent duplicate requests
    if (isRequestInProgress("enhancePrompt")) {
      return;
    }

    const requestId = generateRequestId();

    try {
      setIsEnhancing(true);
      setEnhancePromptLoading(true, requestId);

      // Log the outgoing request payload (uses current textarea value)
      const { data } = await apiClient.post("/website-builder/enhance-prompt", {
        prompt,
      });

      // Expected success shape: { enhancedPrompt: string }
      if (data?.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        toast.success("Prompt enhanced");
        // Show transient "Enhanced" badge
        setShowEnhancedBadge(true);
        if (enhanceBadgeTimeout.current) {
          clearTimeout(enhanceBadgeTimeout.current);
        }
        enhanceBadgeTimeout.current = window.setTimeout(() => {
          setShowEnhancedBadge(false);
        }, 2000);
      }
    } catch (err: any) {
      toast.error((err as Error).message);
    } finally {
      setIsEnhancing(false);
      setEnhancePromptLoading(false);
    }
  };

  const suggestedQuestions = [
    "Create a modern SaaS landing page with a hero, features, pricing, and FAQ",
    "Generate a portfolio website with About, Projects, and Contact pages",
    "Build a restaurant site with menu, reservations, and location sections",
    "E-commerce homepage with featured products, categories, and CTA",
    "Consulting website with services, case studies, and lead capture",
    "Agency site with testimonials, process, and contact form",
  ];

  return (
    <div className="relative flex min-h-full w-full flex-col">
      {/* Full-screen overlay only on mobile/tablet; desktop uses contained loader */}
      {isCreating && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <GeneratingLoader isVisible variant="full" />
        </div>
      )}

      {/* Mobile header (hidden on lg+), sits above tabs */}
      <MobileHeader
        className="relative z-[10000] bg-white"
        showBorder
        title="Website Generate"
      />
      {/* Tabs header (same design as other generators) at the very top */}
      <Tabs
        onValueChange={(v) =>
          setActiveTab(v as "website-generate" | "previous-history")
        }
        value={activeTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="website-generate">Generate Website</TabsTrigger>
          <TabsTrigger value="previous-history">Previous History</TabsTrigger>
          {/* <TabsTrigger value="deployed-website">Deployed Websites</TabsTrigger> */}
        </TabsList>

        <TabsContent value="website-generate">
          {/* Hide content while creating and show desktop-contained loader */}
          <div className={isCreating ? "hidden" : ""}>
            <PageHeader
              description="Describe your website and I’ll generate a complete site with on-brand copy, SEO-friendly structure, and modern UI sections. Include details like industry, audience, tone, pages (e.g., Home, About, Services, Contact), and any assets or brand guidelines."
              title="What website should we build?"
            />
            {/* Input Section */}
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="w-full">
                {/* Input Field */}
                <div className="relative mt-14 mb-8">
                  <div className="rainbow-gradient-border rotating-gradient-border rounded-[42px] p-[2px]">
                    <div className="rounded-[40px] bg-white">
                      <div className="relative p-0">
                        {showEnhancedBadge && (
                          <span className="-top-3 fade-in slide-in-from-top-1 absolute right-4 animate-in select-none rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700 text-xs shadow-sm">
                            Enhanced
                          </span>
                        )}
                        <Textarea
                          className="h-52 flex-1 resize-none rounded-[40px] border-0 bg-transparent pr-28 pb-16 text-gray-800 text-lg placeholder-gray-500 focus:outline-none focus-visible:outline-none"
                          onChange={(e) => setPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (isCreating || isEnhancing) return;
                              if (prompt.trim()) {
                                void handleCreateProject();
                              }
                            }
                          }}
                          placeholder="Describe your website requirements (industry, goals, pages, style, colors, tone)"
                          rows={3}
                          value={prompt}
                        />
                        <div className="absolute right-5 bottom-3 flex items-center gap-2">
                          <button
                            aria-label={
                              isEnhancing ? "Enhancing..." : "Enhance prompt"
                            }
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 p-3 text-primary-600 hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isPromptEmpty || isEnhancing}
                            onClick={handleEnhance}
                          >
                            {isEnhancing ? (
                              <span className="block h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                            ) : (
                              <MagicStickIcon
                                color="text-primary-600"
                                size={24}
                              />
                            )}
                          </button>
                          {/* TODO: Implement asset attachments for website generator */}
                          {/* <button className="h-8 px-4 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 flex items-center gap-2">
                            <PaperClipTiltIcon size={16} color="text-white" />
                            Attach assets
                          </button> */}
                          <button
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={
                              isPromptEmpty || isEnhancing || isCreating
                            }
                            onClick={handleCreateProject}
                          >
                            <UpperArrowMdIcon color="text-white" size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggested Prompts */}
                <div className="space-y-4">
                  {/* <div className="flex flex-wrap justify-center gap-3">
                    {suggestedQuestions.slice(0, 3).map((question, index) => (
                      <button
                        className="rounded-full border border-gray-200 bg-white px-3 py-2 text-gray-700 text-sm shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_16px_rgba(0,0,0,0.06)] transition-colors hover:border-primary-300 hover:text-primary-600 md:text-base lg:px-6 lg:py-3"
                        key={index}
                        onClick={() => setPrompt(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div> */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        className="rounded-full border border-gray-200 bg-white px-6 py-3 text-gray-700 shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_16px_rgba(0,0,0,0.06)] transition-colors hover:border-primary-300 hover:text-primary-600"
                        key={index}
                        onClick={() => setPrompt(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Desktop-contained loader mirrors history loader layout */}
          {isCreating ? (
            <div className="hidden lg:block">
              <GeneratingLoader isVisible variant="contained" />
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="previous-history">
          <div className="pt-2">
            <WebsiteHistory />
          </div>
        </TabsContent>

        <TabsContent value="deployed-website">
          <div className="w-full py-10 text-center text-gray-600">
            Your deployed websites will appear here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
