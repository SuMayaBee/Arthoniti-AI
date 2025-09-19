"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GenerationLoader from "@/components/generation-loader";
import HistoryLoader from "@/components/history-loader";
import ArrowTurnRightIcon from "@/components/icons/ArrowTurnRightIcon";
import CopyIcon from "@/components/icons/CopyIcon";
import { GenerateIcon } from "@/components/icons/generate-icon";
import DesktopHeader from "@/components/nav/DesktopHeader";
import MobileHeader from "@/components/nav/MobileHeader";
import { Button } from "@/components/ui/button";
import { getBusinessGenerationById } from "@/lib/api/business-generation";

export default function BusinessNameDetailsPage({
  params,
}: {
  params: { businessNameId: string };
}) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [nameTone, setNameTone] = useState("");
  const [industry, setIndustry] = useState("");
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const idNum = Number(params.businessNameId);
        if (Number.isNaN(idNum)) {
          throw new Error("Invalid generation ID");
        }
        const data = await getBusinessGenerationById(idNum);
        setNameTone(data.name_tone);
        setIndustry(data.industry);
        setGeneratedNames(data.generated_names || []);
        setCreatedAt(data.created_at);
      } catch (err: any) {
        console.error("Failed to load generation:", err);
        const msg =
          err?.response?.data?.message || err.message || "Failed to load data";
        setErrorMessage(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [params.businessNameId]);

  const copyToClipboard = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      toast.success(`${name} copied to clipboard!`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const toggleFavorite = (index: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(index)) {
      newFavorites.delete(index);
    } else {
      newFavorites.add(index);
    }
    setFavorites(newFavorites);
  };

  const handleGenerateAgain = () => {
    router.push("/dashboard/business-name-generator");
  };

  return (
    <div className="w-full">
      {/* Desktop header with Back Button and divider */}
      <DesktopHeader />
      {/* Mobile header */}
      <MobileHeader className="mb-2" showBorder={true} title="Business Names" />

      {/* Loading state: same behavior as logo details page */}
      {isLoading ? (
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
        <div className="relative flex min-h-[calc(84vh)] w-full flex-col lg:min-h-[calc(83vh)]">
          {/* Content Area */}
          <div className="scrollbar-hide w-full flex-1 overflow-y-auto">
            {/* Header */}
            <div className="mt-5 hidden space-y-4 lg:block">
              <h1 className="font-bold text-3xl text-gray-900">
                Here Are Some Name Ideas We've Generated For You
              </h1>
              <p className="text-gray-600">
                (Tip: Click any name to copy it, or save your favorites!)
              </p>
            </div>

            {/* Generation Parameters */}
            <div className="space-y-2 rounded-lg p-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="text-gray-600">
                  Style:{" "}
                  <span className="font-medium text-primary-600">
                    {nameTone || "-"}
                  </span>
                </div>
                <span className="text-gray-600">
                  Industry:{" "}
                  <span className="font-medium text-primary-600">
                    {industry || "-"}
                  </span>
                </span>
              </div>
            </div>

            {/* Generated Names */}
            <div className="space-y-5">
              {generatedNames.length === 0 ? (
                <div className="text-gray-500">
                  {errorMessage || "No names found for this generation."}
                </div>
              ) : (
                generatedNames.map((name, index) => (
                  <div className="flex items-center gap-6" key={index}>
                    {/* Left chip (Name N) */}
                    <div
                      className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-[100px] border border-gray-200 bg-white font-medium text-gray-900 transition-colors hover:border-primary-300"
                      onClick={() => copyToClipboard(name)}
                    >
                      Name {index + 1}
                    </div>

                    {/* Arrow */}
                    <div className="text-primary-500">
                      <ArrowTurnRightIcon color="#9E32DD" />
                    </div>

                    {/* Right chip (Generated name + inline copy on the right) */}
                    <div className="flex-1">
                      <button
                        className="group flex h-12 w-full items-center justify-center rounded-[100px] border border-gray-200 bg-white px-3 font-medium text-gray-900 transition-colors hover:border-primary-300"
                        onClick={() => copyToClipboard(name)}
                      >
                        <span className="pointer-events-none">{name}</span>
                        <span className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-[10px] transition-colors">
                          <CopyIcon color="#9E32DD" />
                        </span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom action - stick to bottom when content is short */}
          <div className="mx-auto mt-auto flex w-full justify-center pt-6">
            <Button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-500 text-white transition-colors duration-200 hover:bg-primary-600"
              onClick={handleGenerateAgain}
            >
              <GenerateIcon color="#FFFFFF" />
              <span className="font-medium text-base">Generate Again</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
