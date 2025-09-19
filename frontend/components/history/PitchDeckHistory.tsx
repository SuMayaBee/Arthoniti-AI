"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StarIcon } from "@/components/icons/star-icon";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { processImageUrl } from "@/lib/utils";
import {
  getPresentationsForUser,
  deletePresentation,
  type PresentationSummary,
} from "@/lib/api/presentation";
import HistoryLoader from "@/components/history-loader";

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
        ? parseInt(rawId, 10)
        : NaN;
    return Number.isFinite(numericId) ? numericId : null;
  } catch {
    return null;
  }
}

export default function PitchDeckHistory() {
  const router = useRouter();
  const [previousPitchDecks, setPreviousPitchDecks] = useState<PresentationSummary[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isDeletingPresentation, setIsDeletingPresentation] = useState(false);
  const [presentationToDelete, setPresentationToDelete] = useState<PresentationSummary | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;
      setIsLoadingHistory(true);
      try {
        const items = await getPresentationsForUser(userId);
        setPreviousPitchDecks(items || []);
      } catch (e: any) {
        console.error("Failed to load presentations history", e);
        toast.error(e?.response?.data?.message || e.message || "Failed to load presentations history");
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  const handlePitchDeckClick = (pitchDeckId: string) => {
    router.push(`/dashboard/pitch-deck/${pitchDeckId}`);
  };

  const processFirstSlide = (item: PresentationSummary) => {
    type SlideBlock = {
      layout: string;
      title?: string;
      subtitle?: string;
      paragraphs: string[];
      bullets: { title?: string; text?: string }[];
      cycle: { title?: string; text?: string }[];
      imageUrl?: string;
    };
    try {
      const slides: any = (item as any)?.content?.slides;
      let xml = "";
      if (typeof slides === "string") {
        xml = String(slides)
          .replace(/^```[a-zA-Z]*\n?/i, "")
          .replace(/```\s*$/, "");
      } else if (Array.isArray(slides) && slides[0]?.xml) {
        xml = String(slides[0].xml);
      }
      if (!xml && typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem(`presentation_xml:${item.id}`);
          if (cached) {
            xml = String(cached)
              .replace(/^```[a-zA-Z]*\n?/i, "")
              .replace(/```\s*$/, "");
          }
        } catch {}
      }
      if (!xml) return null as SlideBlock | null;
      const sectionMatch = xml.match(/<SECTION\b[^>]*>[\s\S]*?<\/SECTION>/i)?.[0] || "";
      if (!sectionMatch) return null;
      const doc = new DOMParser().parseFromString(`<ROOT>${sectionMatch}</ROOT>`, "application/xml");
      if (doc.getElementsByTagName("parsererror").length > 0) return null;
      const sec = doc.getElementsByTagName("SECTION")[0];
      if (!sec) return null;
      let layout = "vertical";
      const layoutAttr = sec.getAttribute("layout");
      if (layoutAttr) layout = layoutAttr;
      const slide: SlideBlock = { layout, paragraphs: [], bullets: [], cycle: [] };
      slide.title = sec.getElementsByTagName("H1")[0]?.textContent || undefined;
      slide.subtitle = sec.getElementsByTagName("H2")[0]?.textContent || undefined;
      slide.paragraphs = Array.from(sec.getElementsByTagName("P")).map((n) => (n.textContent || "").trim()).filter(Boolean);
      const img = sec.getElementsByTagName("IMG")[0];
      const src = img?.getAttribute("src") || undefined;
      if (src) slide.imageUrl = processImageUrl(src);
      const bulletsParent = sec.getElementsByTagName("BULLETS")[0];
      if (bulletsParent) {
        const items = Array.from(bulletsParent.getElementsByTagName("DIV"));
        slide.bullets = items.map((div) => ({
          title: div.getElementsByTagName("H3")[0]?.textContent || undefined,
          text: div.getElementsByTagName("P")[0]?.textContent || undefined,
        }));
      }
      const cycleParent = sec.getElementsByTagName("CYCLE")[0];
      if (cycleParent) {
        const items = Array.from(cycleParent.getElementsByTagName("DIV"));
        slide.cycle = items.map((div) => ({
          title: div.getElementsByTagName("H3")[0]?.textContent || undefined,
          text: div.getElementsByTagName("P")[0]?.textContent || undefined,
        }));
      }
      return slide;
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6 relative">
      {isLoadingHistory ? (
        <HistoryLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previousPitchDecks.length === 0 && (
            <div className="col-span-full text-center text-gray-600 py-8">No previous presentations yet.</div>
          )}
          {previousPitchDecks.map((item) => {
            const id = item.id;
            const createdAt = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "";
            const firstSlide = processFirstSlide(item);
            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="bg-gray-50 rounded-lg p-3 mb-4 min-h-[200px]">
                  <div
                    className="bg-white shadow rounded-xl p-5 relative"
                    style={{ height: 220, background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)" }}
                  >
                    {firstSlide ? (
                      firstSlide.imageUrl ? (
                        <div className="grid grid-cols-2 gap-4 items-start h-full">
                          <div className="order-1 w-full h-full rounded-lg overflow-hidden border border-slate-200">
                            <img src={firstSlide.imageUrl} alt="slide visual" className="w-full h-full object-cover" />
                          </div>
                          <div className="order-2 h-full min-h-0 flex flex-col overflow-hidden">
                            {firstSlide.title && (
                              <h4 className="text-sm font-semibold tracking-tight mb-1">{firstSlide.title}</h4>
                            )}
                            <div className="text-[11px] leading-5 pr-1">
                              {(() => {
                                const parts: string[] = [];
                                if (firstSlide.subtitle) parts.push(firstSlide.subtitle);
                                parts.push(...firstSlide.paragraphs);
                                parts.push(
                                  ...firstSlide.bullets
                                    .map((b) => [b.title, b.text].filter(Boolean).join(": "))
                                    .filter(Boolean)
                                );
                                const combined = parts.join(" ").replace(/\s+/g, " ").trim();
                                const allWords = combined.split(/\s+/);
                                const limited = allWords.slice(0, 15).join(" ");
                                const truncated = allWords.length > 15;
                                return (
                                  <p>
                                    {limited}
                                    {truncated ? "…" : ""}
                                  </p>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2 h-full">
                          <div className="h-full min-h-0 flex flex-col overflow-hidden">
                            {firstSlide.title && (
                              <h4 className="text-sm font-semibold tracking-tight mb-1">{firstSlide.title}</h4>
                            )}
                            <div className="text-[11px] leading-5 pr-1">
                              {(() => {
                                const parts: string[] = [];
                                if (firstSlide.subtitle) parts.push(firstSlide.subtitle);
                                parts.push(...firstSlide.paragraphs);
                                parts.push(
                                  ...firstSlide.bullets
                                    .map((b) => [b.title, b.text].filter(Boolean).join(": "))
                                    .filter(Boolean)
                                );
                                const combined = parts.join(" ").replace(/\s+/g, " ").trim();
                                const allWords = combined.split(/\s+/);
                                const limited = allWords.slice(0, 15).join(" ");
                                const truncated = allWords.length > 15;
                                return (
                                  <p>
                                    {limited}
                                    {truncated ? "…" : ""}
                                  </p>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="grid grid-cols-1 gap-2 h-full">
                        <div className="h-full min-h-0 flex flex-col overflow-hidden">
                          <h4 className="text-sm font-semibold tracking-tight mb-1 line-clamp-1">{item.title || "Pitch Deck"}</h4>
                          <p className="text-[11px] leading-5 pr-1 text-gray-600">Preview unavailable for this deck.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{createdAt}</span>
                  <button className="ml-2 p-2 rounded-full border border-gray-200 hover:bg-gray-50">
                    <StarIcon />
                  </button>
                </div>

                <div className="flex gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 px-6 py-3 rounded-full border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => setPresentationToDelete(item)}
                        disabled={isDeletingPresentation}
                      >
                        {isDeletingPresentation ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Presentation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{item.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            if (!presentationToDelete) return;
                            setIsDeletingPresentation(true);
                            try {
                              await deletePresentation(presentationToDelete.id);
                              setPreviousPitchDecks((prev) => prev.filter((p) => p.id !== presentationToDelete.id));
                              toast.success("Presentation deleted successfully!");
                            } catch (error: any) {
                              console.error("Failed to delete presentation:", error);
                              toast.error(
                                error?.response?.data?.message || error.message || "Failed to delete presentation"
                              );
                            } finally {
                              setIsDeletingPresentation(false);
                              setPresentationToDelete(null);
                            }
                          }}
                          disabled={isDeletingPresentation}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeletingPresentation ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    onClick={() => handlePitchDeckClick(String(id))}
                    variant="outline"
                    className="flex-1 px-6 py-3 rounded-full border-primary-500 text-primary-500 hover:bg-primary-50"
                  >
                    View
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
