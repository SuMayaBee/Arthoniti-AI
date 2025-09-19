"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import BusinessNameGeneratorIcon from "@/components/icons/BusinessNameGeneratorIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import DocumentGeneratorIcon from "@/components/icons/DocumentGeneratorIcon";
import LogoGeneratorIcon from "@/components/icons/LogoGeneratorIcon";
import PitchDeckIcon from "@/components/icons/PitchDeckIcon";
import VideoGeneratorIcon from "@/components/icons/VideoGeneratorIcon";
import WebsiteGeneratorIcon from "@/components/icons/WebsiteGeneratorIcon";
import PageHeader from "@/components/page-header";

export default function DashboardPage() {
  const router = useRouter();

  const tools = [
    {
      title: "Generate Logo",
      icon: LogoGeneratorIcon,
      href: "/dashboard/logo-generator",
    },
    {
      title: "Generate Business Name",
      icon: BusinessNameGeneratorIcon,
      href: "/dashboard/business-name-generator",
    },
    {
      title: "Generate Pitch Deck",
      icon: PitchDeckIcon,
      href: "/dashboard/pitch-deck",
    },
    {
      title: "Generate Document",
      icon: DocumentGeneratorIcon,
      href: "/dashboard/document-generator",
    },
    {
      title: "Generate Video",
      icon: VideoGeneratorIcon,
      href: "/dashboard/short-video-generator",
    },
    {
      title: "Generate Website",
      icon: WebsiteGeneratorIcon,
      href: "/dashboard/website-builder",
    },
  ];

  // Helper to render compact pill chips on mobile
  const renderChip = (tool: (typeof tools)[number], label?: string) => (
    <Link className="group" href={tool.href} key={`chip-${tool.title}`}>
      <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 shadow-sm transition-colors duration-300 hover:bg-primary-50">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
          <tool.icon color="text-primary-500" size={18} />
        </div>
        <span className="font-normal text-gray-800 text-sm">
          {label ?? tool.title.replace(/\s*Generate$/, "")}
        </span>
      </div>
    </Link>
  );

  return (
    <div className="flex min-h-[95dvh] w-full flex-col">
      <PageHeader
        description={
          <>
            <span className="sm:hidden">
              Manage everything you’ve created in one place
            </span>
            <span className="hidden sm:inline">
              {
                "Manage everything you've created in one place logos, business names, pitch decks, documents, and websites. Start something new, edit existing projects, or track your progress at a glance. Your business-building toolkit is just one click away."
              }
            </span>
          </>
        }
        title="Welcome to Your AI Workspace"
      />
      {/* Mobile chips layout (as per image) */}
      <div className="relative z-10 mt-12 flex w-full flex-1 flex-col items-center sm:hidden">
        {(() => {
          const findTool = (q: string) =>
            tools.find((t) => t.title.toLowerCase().includes(q))!;
          const bn = findTool("business name");
          const logo = findTool("logo");
          const video = findTool("video");
          const website = findTool("website");
          const document = findTool("document");
          const pitch = findTool("pitch deck");

          return (
            <div className="flex w-full flex-col items-center space-y-4">
              {/* Row 1 */}
              <div className="flex justify-center">
                {renderChip(bn, "Business Name")}
              </div>
              {/* Row 2 */}
              <div className="flex flex-wrap justify-center gap-3">
                {renderChip(logo, "Logo")}
                {renderChip(video, "Video")}
                {renderChip(website, "Website")}
              </div>
              {/* Row 3 */}
              <div className="flex flex-wrap justify-center gap-3">
                {renderChip(document, "Document")}
                {renderChip(pitch, "Pitch Deck")}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Tools Grid (visible on sm and up) */}
      <div className="relative z-10 mt-12 hidden w-full flex-1 flex-col items-center sm:flex">
        <div className="mb-12 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link className="group" href={tool.href} key={tool.title}>
              <div className="relative">
                {/* Rainbow gradient border wrapper - only visible on hover */}
                <div className="-inset-0.5 rainbow-gradient-border-card absolute rounded-2xl opacity-0 transition-all delay-75 duration-1200 ease-in-out group-hover:opacity-100" />

                {/* Main card */}
                <div className="relative flex h-full flex-col items-center justify-center rounded-2xl border border-primary-100 bg-theme-500 p-8 shadow-md transition-all delay-150 duration-1200 ease-in-out hover:border-none hover:shadow-xl group-hover:bg-gradient-to-br group-hover:from-purple-100 group-hover:to-purple-500">
                  <div className="mb-3 flex h-12 w-16 items-center justify-center rounded-lg bg-primary-50 px-5 py-3">
                    <tool.icon color="text-primary-500" size={40} />
                  </div>
                  <h3 className="font-semibold text-base text-gray-800 transition-all delay-150 duration-1200 ease-in-out group-hover:text-white">
                    {tool.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ask Me Anything Input - pinned to bottom with dynamic gap above */}
      <div className="z-10 mt-auto flex w-full items-end">
        <div className="relative w-full">
          <div className="rainbow-gradient-border rotating-gradient-border rounded-full p-[2px]">
            <input
              className="h-[72px] w-full cursor-pointer rounded-full bg-white px-5 py-5 text-gray-800 placeholder-gray-500 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => router.push("/chat")}
              onFocus={() => router.push("/chat")}
              placeholder="Ask me anything"
              readOnly
              type="text"
            />
          </div>
          <button
            className="-translate-y-1/2 absolute top-1/2 right-2 flex h-12 w-12 transform items-center justify-center rounded-full bg-primary-500 text-white transition-all duration-300 hover:bg-primary-600"
            onClick={() => router.push("/chat")}
            type="button"
          >
            <ChevronRightIcon color="text-white" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
