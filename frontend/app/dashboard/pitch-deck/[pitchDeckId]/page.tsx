"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import GenerationLoader from "@/components/generation-loader";
import HistoryLoader from "@/components/history-loader";
import CheckIcon from "@/components/icons/CheckIcon";
import DownloadIcon from "@/components/icons/DownloadIcon";
import EditPencilLineIcon from "@/components/icons/EditPencilLineIcon";
import TrashCanIcon from "@/components/icons/TrashCanIcon";
import DesktopHeader from "@/components/nav/DesktopHeader";
import MobileHeader from "@/components/nav/MobileHeader";
import ArrowsBlocks from "@/components/pitch-deck/ArrowsBlocks";
import BulletsList from "@/components/pitch-deck/BulletsList";
import CycleBlocks from "@/components/pitch-deck/CycleBlocks";
import TimelineBlocks from "@/components/pitch-deck/TimelineBlocks";
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
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  deletePresentation,
  generatePresentationImage,
  getPresentationById,
  getPresentationImages,
  type PresentationDetail,
  updatePresentation,
} from "@/lib/api/presentation";
import { getColorWithOpacity } from "@/lib/color-utils";
import { processImageUrl } from "@/lib/utils";

// Invisible component to trigger image generation per slide
function AutoImageGenerator({
  index,
  query,
  presentationId,
  onStart,
  onDone,
  userEmail,
}: {
  index: number;
  query: string;
  presentationId: number;
  onStart: () => void;
  onDone: (url?: string) => void;
  userEmail: string;
}) {
  const runKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const runKey = `${index}|${presentationId}|${query}`;
    if (runKeyRef.current === runKey) {
      return;
    }
    runKeyRef.current = runKey;
    let cancelled = false;
    
    console.log(`🎨 AutoImageGenerator starting for slide ${index}:`, {
      query,
      presentationId,
      userEmail,
      runKey
    });
    
    async function run() {
      if (!query) {
        console.log(`❌ No query provided for slide ${index}`);
        return;
      }
      try {
        console.log(`🚀 Generating image for slide ${index}: "${query}"`);
        onStart();
        const res = await generatePresentationImage({
          prompt: query,
          presentation_id: presentationId,
          user_email: userEmail || "",
          size: "1792x1024",
          quality: "hd",
          context: "slide-image",
        });
        if (!cancelled) {
          const maybe = res as unknown as {
            success?: boolean;
            url?: string;
            error?: string;
          };
          if (maybe?.success && maybe?.url) {
            console.log(`✅ Image generated successfully for slide ${index}:`, maybe.url);
            onDone(maybe.url);
          } else {
            console.log(`❌ Image generation failed for slide ${index}:`, maybe?.error || 'Unknown error');
            onDone(undefined);
            const errMsg = maybe?.error || "Failed to generate image";
            toast.error(errMsg);
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          console.log(`💥 Image generation error for slide ${index}:`, e);
          onDone(undefined);
          const msg =
            e?.response?.data?.message ||
            e?.message ||
            "Image generation request failed";
          toast.error(msg);
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [index, query, presentationId]);
  return null;
}

export default function PitchDeckDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const pitchDeckId = params.pitchDeckId as string;

  const [presentation, setPresentation] = useState<PresentationDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedXml, setEditedXml] = useState<string>("");
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<"pptx" | "pdf" | null>(null);
  const [imageLoadingMap, setImageLoadingMap] = useState<
    Record<number, boolean>
  >({});
  const [imageUrlMap, setImageUrlMap] = useState<Record<number, string>>({});
  const [imagesListEmpty, setImagesListEmpty] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [themeColor, setThemeColor] = useState<string | null>(null);
  const [isSavingTheme, setIsSavingTheme] = useState<boolean>(false);
  const [shouldAutoGenerateImages, setShouldAutoGenerateImages] = useState<boolean>(false);
  // No external guard required; the generator component self-dedupes per key

  const themePalette: string[] = [
    "#FF5E3A", // red
    "#FF00FF", // brightMagenta
    "#FFFF00", // brightYellow
    "#FF4500", // redOrange
    "#1C274C", // darkBlue
    "#FF69B4", // hotPink
    "#9E32DD", // purple
    "#008080", // teal
    "#E6E6FA", // lightPurple
    "#8B4513", // brown
  ];

  const theme = useMemo(() => {
    const main = themeColor || "#FF5E3A";
    return {
      main,
      soft: getColorWithOpacity(main, 0.08),
      border: getColorWithOpacity(main, 0.25),
      text: main,
      subtext: getColorWithOpacity(main, 0.7),
    };
  }, [themeColor]);

  // Build beautiful slide blocks from XML (one slide per SECTION)
  type SlideBlock = {
    layout: string;
    title?: string;
    subtitle?: string;
    paragraphs: string[];
    bullets: { title?: string; text?: string }[];
    cycle: { title?: string; text?: string }[];
    arrows?: { title?: string; text?: string }[];
    timeline?: { title?: string; text?: string }[];
    imageUrl?: string;
    imageQuery?: string;
  };

  // Editing helpers – mutate parsedSlides and sync back into XML string
  function updateSlideField(slideIndex: number, patch: Partial<SlideBlock>) {
    setEditedXml((prev) => {
      const raw = (prev || "")
        .replace(/^```[a-zA-Z]*\n?/i, "")
        .replace(/```\s*$/, "");
      const sections = raw.match(/<SECTION\b[^>]*>[\s\S]*?<\/SECTION>/gi) || [];
      if (!sections[slideIndex]) return prev;
      const current = sections[slideIndex];
      const title = patch.title !== undefined ? patch.title : undefined;
      const subtitle =
        patch.subtitle !== undefined ? patch.subtitle : undefined;
      let updated = current;
      if (title !== undefined) {
        if (/<H1>[\s\S]*?<\/H1>/i.test(updated)) {
          updated = updated.replace(
            /<H1>[\s\S]*?<\/H1>/i,
            `<H1>${escapeXml(title)}</H1>`
          );
        } else {
          updated = updated.replace(
            /<SECTION(\b[^>]*)>/i,
            `<SECTION$1>\n  <H1>${escapeXml(title)}</H1>`
          );
        }
      }
      if (subtitle !== undefined) {
        if (/<H2>[\s\S]*?<\/H2>/i.test(updated)) {
          updated = updated.replace(
            /<H2>[\s\S]*?<\/H2>/i,
            `<H2>${escapeXml(subtitle)}</H2>`
          );
        } else {
          updated = updated.replace(
            /<H1>[\s\S]*?<\/H1>/i,
            (m) => `${m}\n  <H2>${escapeXml(subtitle)}</H2>`
          );
        }
      }
      const nextXml = raw.replace(current, updated);
      return nextXml;
    });
  }

  function updateParagraph(
    slideIndex: number,
    paragraphIndex: number,
    value: string
  ) {
    setEditedXml((prev) => {
      const raw = (prev || "")
        .replace(/^```[a-zA-Z]*\n?/i, "")
        .replace(/```\s*$/, "");
      const sections = raw.match(/<SECTION\b[^>]*>[\s\S]*?<\/SECTION>/gi) || [];
      const currentSection = sections[slideIndex];
      if (!currentSection) return prev;

      // Parse and only update top-level <P> children of SECTION
      const xmlToParse = `<ROOT>${currentSection}</ROOT>`;
      let doc: Document | null = null;
      try {
        doc = new DOMParser().parseFromString(xmlToParse, "application/xml");
        if (doc.getElementsByTagName("parsererror").length > 0) doc = null;
      } catch {
        doc = null;
      }
      if (!doc) return prev;
      const sec = doc.getElementsByTagName("SECTION")[0];
      if (!sec) return prev;

      const topLevelChildren = Array.from(sec.children);
      const topLevelPs = topLevelChildren.filter(
        (n) => n.tagName.toUpperCase() === "P"
      );
      const target = topLevelPs[paragraphIndex] as Element | undefined;

      if (target) {
        // Replace text content safely (DOM will handle escaping)
        while (target.firstChild) target.removeChild(target.firstChild);
        target.appendChild(doc.createTextNode(value));
      } else {
        // If the paragraph doesn't exist yet, append after H2 or at end
        const p = doc.createElement("P");
        p.appendChild(doc.createTextNode(value));
        // Find last H2 among direct children
        let inserted = false;
        for (let i = topLevelChildren.length - 1; i >= 0; i--) {
          const n = topLevelChildren[i];
          if (n.tagName.toUpperCase() === "H2") {
            if (n.nextSibling) sec.insertBefore(p, n.nextSibling);
            else sec.appendChild(p);
            inserted = true;
            break;
          }
        }
        if (!inserted) sec.appendChild(p);
      }

      const serialized = new XMLSerializer().serializeToString(sec);
      const nextXml = raw.replace(currentSection, serialized);
      return nextXml;
    });
  }

  function addParagraph(slideIndex: number) {
    setEditedXml((prev) => {
      const raw = (prev || "")
        .replace(/^```[a-zA-Z]*\n?/i, "")
        .replace(/```\s*$/, "");
      const sections = raw.match(/<SECTION\b[^>]*>[\s\S]*?<\/SECTION>/gi) || [];
      if (!sections[slideIndex]) return prev;
      const current = sections[slideIndex];
      const updated = current.replace(/<\/SECTION>/i, "  <P></P>\n</SECTION>");
      return raw.replace(current, updated);
    });
  }

  function updateBullet(
    slideIndex: number,
    bulletIndex: number,
    patch: { title?: string; text?: string }
  ) {
    setEditedXml((prev) => {
      const raw = (prev || "")
        .replace(/^```[a-zA-Z]*\n?/i, "")
        .replace(/```\s*$/, "");
      const sections = raw.match(/<SECTION\b[^>]*>[\s\S]*?<\/SECTION>/gi) || [];
      if (!sections[slideIndex]) return prev;
      let updated = sections[slideIndex];
      let bulletsBlock =
        updated.match(/<BULLETS>[\s\S]*?<\/BULLETS>/i)?.[0] || "";
      if (!bulletsBlock) {
        bulletsBlock = "<BULLETS>\n</BULLETS>";
        updated = updated.replace(
          /<\/SECTION>/i,
          `${bulletsBlock}\n</SECTION>`
        );
        bulletsBlock =
          updated.match(/<BULLETS>[\s\S]*?<\/BULLETS>/i)?.[0] || "";
      }
      const items = Array.from(
        bulletsBlock.matchAll(/<DIV>[\s\S]*?<\/DIV>/gi)
      ).map((m) => m[0]);
      const current =
        items[bulletIndex] || "<DIV>\n  <H3></H3>\n  <P></P>\n</DIV>";

      // Extract existing values so we don't erase the other field when only one is edited
      const existingTitle = current.match(/<H3>([\s\S]*?)<\/H3>/i)?.[1] ?? "";
      const existingText = current.match(/<P>([\s\S]*?)<\/P>/i)?.[1] ?? "";
      const nextTitle = escapeXml(patch.title ?? existingTitle);
      const nextText = escapeXml(patch.text ?? existingText);

      const next = current
        .replace(/<H3>[\s\S]*?<\/H3>/i, `<H3>${nextTitle}</H3>`)
        .replace(/<P>[\s\S]*?<\/P>/i, `<P>${nextText}</P>`);
      let newBullets = bulletsBlock;
      if (items[bulletIndex]) {
        newBullets = bulletsBlock.replace(current, next);
      } else {
        newBullets = bulletsBlock.replace(
          /<\/BULLETS>/i,
          `${next}\n</BULLETS>`
        );
      }
      updated = updated.replace(bulletsBlock, newBullets);
      const nextXml = raw.replace(sections[slideIndex], updated);
      return nextXml;
    });
  }

  function addBullet(slideIndex: number) {
    updateBullet(slideIndex, Number.MAX_SAFE_INTEGER, { title: "", text: "" });
  }

  function escapeXml(str: string): string {
    return (str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  const parsedSlides: SlideBlock[] = useMemo(() => {
    const slides: SlideBlock[] = [];
    const raw = (editedXml || "")
      .replace(/^```[a-zA-Z]*\n?/i, "")
      .replace(/```\s*$/, "");
    const sectionRegex = /<SECTION\b[^>]*>[\s\S]*?<\/SECTION>/gi;
    const sections = raw.match(sectionRegex) || [];
    for (const section of sections) {
      let layout = "vertical";
      const layoutMatch = section.match(/<SECTION\b[^>]*layout="([^"]+)"/i);
      if (layoutMatch) layout = layoutMatch[1];

      const xmlToParse = `<ROOT>${section}</ROOT>`;
      let doc: Document | null = null;
      try {
        doc = new DOMParser().parseFromString(xmlToParse, "application/xml");
        if (doc.getElementsByTagName("parsererror").length > 0) doc = null;
      } catch {
        doc = null;
      }

      const slide: SlideBlock = {
        layout,
        paragraphs: [],
        bullets: [],
        cycle: [],
        arrows: [],
        timeline: [],
      };
      if (doc) {
        const sec = doc.getElementsByTagName("SECTION")[0];
        if (sec) {
          slide.title =
            sec.getElementsByTagName("H1")[0]?.textContent || undefined;
          slide.subtitle =
            sec.getElementsByTagName("H2")[0]?.textContent || undefined;
          // Only include top-level P elements (exclude those inside BULLETS/CYCLE)
          slide.paragraphs = Array.from(sec.children)
            .filter((n) => n.tagName.toUpperCase() === "P")
            .map((n) => (n.textContent || "").trim())
            .filter(Boolean);
          const img = sec.getElementsByTagName("IMG")[0];
          const src = img?.getAttribute("src") || undefined;
          const qattr = img?.getAttribute("query") || undefined;
          if (src) slide.imageUrl = src;
          if (qattr) slide.imageQuery = qattr;
          const bulletsParent = sec.getElementsByTagName("BULLETS")[0];
          if (bulletsParent) {
            const items = Array.from(bulletsParent.getElementsByTagName("DIV"));
            slide.bullets = items.map((div) => ({
              title:
                div.getElementsByTagName("H3")[0]?.textContent || undefined,
              text: div.getElementsByTagName("P")[0]?.textContent || undefined,
            }));
          }
          const cycleParent = sec.getElementsByTagName("CYCLE")[0];
          if (cycleParent) {
            const items = Array.from(cycleParent.getElementsByTagName("DIV"));
            slide.cycle = items.map((div) => ({
              title:
                div.getElementsByTagName("H3")[0]?.textContent || undefined,
              text: div.getElementsByTagName("P")[0]?.textContent || undefined,
            }));
          }

          // Parse ARROWS blocks
          const arrowsParent = sec.getElementsByTagName("ARROWS")[0];
          if (arrowsParent) {
            const items = Array.from(arrowsParent.getElementsByTagName("DIV"));
            slide.arrows = items.map((div) => ({
              title:
                div.getElementsByTagName("H3")[0]?.textContent || undefined,
              text: div.getElementsByTagName("P")[0]?.textContent || undefined,
            }));
          }

          // Parse TIMELINE blocks
          const timelineParent = sec.getElementsByTagName("TIMELINE")[0];
          if (timelineParent) {
            const items = Array.from(
              timelineParent.getElementsByTagName("DIV")
            );
            slide.timeline = items.map((div) => ({
              title:
                div.getElementsByTagName("H3")[0]?.textContent || undefined,
              text: div.getElementsByTagName("P")[0]?.textContent || undefined,
            }));
          }
        }
      }
      slides.push(slide);
    }
    if (slides.length === 0 && raw.trim()) {
      slides.push({
        layout: "vertical",
        paragraphs: [raw.trim()],
        bullets: [],
        cycle: [],
        arrows: [],
        timeline: [],
      });
    }
    return slides;
  }, [editedXml]);

  // Map backend theme string to a usable CSS color
  function parseThemeToColor(theme?: string | null): string {
    if (!theme) return "#7C3AED"; // default purple
    const t = theme.trim().toLowerCase();
    if (t.startsWith("#") && (t.length === 7 || t.length === 4)) return theme;
    const map: Record<string, string> = {
      purple: "#7C3AED",
      blue: "#3B82F6",
      green: "#10B981",
      red: "#EF4444",
      orange: "#F97316",
      indigo: "#6366F1",
      pink: "#EC4899",
      teal: "#14B8A6",
      yellow: "#EAB308",
      slate: "#64748B",
    };
    return map[t] || "#7C3AED";
  }

  // Select a theme color for live preview only (no persistence)
  function handleThemeSelect(color: string) {
    setThemeColor(color);
  }

  // Persist the currently selected theme color to DB
  async function handleThemeSave() {
    if (!themeColor) return;
    try {
      setIsSavingTheme(true);
      // Persist only top-level theme as per backend contract
      const updated = await updatePresentation(String(pitchDeckId), {
        theme: themeColor,
      } as any);
      setPresentation(updated);
      const returnedTheme =
        (updated as any)?.theme ?? (updated as any)?.content?.theme;
      if (
        returnedTheme &&
        String(returnedTheme).toLowerCase() === String(themeColor).toLowerCase()
      ) {
        // Sync local preview with server-confirmed theme
        setThemeColor(parseThemeToColor(returnedTheme));
        toast.success("Theme saved");
      } else {
        // Fallback: refetch to verify if the update is eventually consistent
        try {
          const fresh = await getPresentationById(String(pitchDeckId));
          const freshTheme =
            (fresh as any)?.theme ?? (fresh as any)?.content?.theme;
          if (
            freshTheme &&
            String(freshTheme).toLowerCase() ===
              String(themeColor).toLowerCase()
          ) {
            setPresentation(fresh as any);
            setThemeColor(parseThemeToColor(freshTheme));
            toast.success("Theme saved");
            return;
          }
          const rt = freshTheme
            ? String(freshTheme)
            : returnedTheme
              ? String(returnedTheme)
              : "<none>";
          toast.error(`Theme not saved. Server returned: ${rt}`);
        } catch (re) {
          const rt = returnedTheme ? String(returnedTheme) : "<none>";
          toast.error(`Theme not saved. Server returned: ${rt}`);
        }
      }
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || e?.message || "Failed to save theme"
      );
    } finally {
      setIsSavingTheme(false);
    }
  }

  // Handlers for AutoImageGenerator
  const handleImageGenerationStart = (slideIndex: number) => {
    setImageLoadingMap(prev => ({ ...prev, [slideIndex]: true }));
  };

  const handleImageGenerationDone = (slideIndex: number, url?: string) => {
    setImageLoadingMap(prev => ({ ...prev, [slideIndex]: false }));
    if (url) {
      setImageUrlMap(prev => ({ ...prev, [slideIndex]: url }));
    }
  };

  // Function to extract IMG queries from XML and setup auto-generation
  const extractImageQueriesAndGenerate = (xml: string, emailToUse?: string) => {
    const email = emailToUse || userEmail;
    console.log('🔍 Starting image query extraction...');
    console.log('📄 XML length:', xml.length);
    console.log('👤 User email available:', !!email);
    
    if (!xml || !email) {
      console.warn('❌ Cannot extract image queries: missing XML or user email');
      return;
    }
    
    try {
      // Clean the XML first
      const cleanXml = xml.replace(/^```[a-zA-Z]*\n?/i, "").replace(/```\s*$/, "");
      console.log('🧹 Cleaned XML preview:', cleanXml.substring(0, 300) + '...');
      
      // Extract all SECTION tags
      const sectionRegex = /<SECTION\b[^>]*>[\s\S]*?<\/SECTION>/gi;
      const sections = cleanXml.match(sectionRegex) || [];
      console.log(`📑 Found ${sections.length} sections in XML`);
      
      // Extract IMG queries from each section
      const imageQueries: Array<{ index: number; query: string }> = [];
      
      sections.forEach((section, index) => {
        console.log(`🔍 Checking section ${index} for IMG tags...`);
        const imgMatch = section.match(/<IMG\b[^>]*query="([^"]+)"/i);
        if (imgMatch && imgMatch[1]) {
          const query = imgMatch[1];
          console.log(`✅ Found IMG query in section ${index}: "${query}"`);
          imageQueries.push({ index, query });
        } else {
          console.log(`ℹ️ No IMG query found in section ${index}`);
        }
      });
      
      if (imageQueries.length > 0) {
        console.log(`🎯 Found ${imageQueries.length} image queries to generate:`, imageQueries);
        setShouldAutoGenerateImages(true);
      } else {
        console.log('📭 No image queries found in the XML');
      }
    } catch (error) {
      console.error('💥 Error parsing XML for image queries:', error);
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getPresentationById(pitchDeckId);
        setPresentation(data);
        // Initialize theme color from response theme
        setThemeColor(parseThemeToColor((data as any)?.theme));
        // Initialize editable XML from content.slides which may be a string or array
        const slidesData: any = (data as any)?.content?.slides;
        let xml = "";
        if (typeof slidesData === "string") {
          xml = slidesData
            .replace(/^```[a-zA-Z]*\n?/i, "")
            .replace(/```\s*$/, "");
        } else if (Array.isArray(slidesData) && slidesData[0]?.xml) {
          xml = String(slidesData[0].xml);
        }
        setEditedXml(xml);
        // Attempt to hydrate images from backend if available
        try {
          const images = await getPresentationImages(String(pitchDeckId));
          if (Array.isArray(images) && images.length > 0) {
            setImagesListEmpty(false);
            // Determine indices of slides that contain an <IMG> tag
            const sectionRegex = /<SECTION\b[^>]*>[\s\S]*?<\/SECTION>/gi;
            const sections = (xml || "").match(sectionRegex) || [];
            const imgSlideIdxs: number[] = [];
            sections.forEach((section, idx) => {
              if (/<IMG\b[^>]*>/i.test(section)) imgSlideIdxs.push(idx);
            });
            // Map images in order to slides with IMG tags
            setImageUrlMap(() => {
              const map: Record<number, string> = {};
              let imgPtr = 0;
              for (const idx of imgSlideIdxs) {
                if (imgPtr >= images.length) break;
                const url = images[imgPtr++];
                if (url) map[idx] = processImageUrl(url);
              }
              return map;
            });
          } else {
            // If backend returns empty array, we must generate for every slide that has IMG tag
            setImagesListEmpty(true);
            // Also enable auto-generation for slides that need images
            const sectionRegex = /<SECTION\b[^>]*>[\s\S]*?<\/SECTION>/gi;
            const sections = (xml || "").match(sectionRegex) || [];
            const hasImageQueries = sections.some(section => 
              /<IMG\b[^>]*query="[^"]+"/i.test(section)
            );
            if (hasImageQueries && userEmail) {
              setShouldAutoGenerateImages(true);
            }
          }
        } catch (imgErr) {
          // Non-fatal: if fetching images fails, generation fallback will handle it per slide
          console.warn(
            "Failed to fetch presentation images; will fallback to generation."
          );
        }
        // Try to get user email from token (if embedded)
        let currentUserEmail = "";
        if (typeof document !== "undefined") {
          const token =
            document.cookie.match(/access_token=([^;]+)/)?.[1] || "";
          try {
            const payload = JSON.parse(atob(token.split(".")[1] || ""));
            if (payload?.email) {
              currentUserEmail = String(payload.email);
              setUserEmail(currentUserEmail);
            }
          } catch {}
          
          // Fallback to environment variable email if no email found in token
          if (!currentUserEmail) {
            currentUserEmail = process.env.NEXT_PUBLIC_FALLBACK_EMAIL || "fallback@example.com";
            setUserEmail(currentUserEmail);
            console.log('⚠️ Using fallback email from env for image generation:', currentUserEmail);
          }
        }
        
        // Also check for XML from localStorage (fresh creation)
        let xmlToUse = xml;
        if (typeof window !== "undefined") {
          const storedXml = localStorage.getItem(`presentation_xml:${pitchDeckId}`);
          if (storedXml) {
            console.log('� Found XML in localStorage');
            xmlToUse = storedXml;
            setEditedXml(storedXml);
          }
        }
        
        // Check if auto-generation was requested from creation page
        if (typeof document !== "undefined") {
          const autoGenFlag = localStorage.getItem(`auto_generate_images:${pitchDeckId}`);
          if (autoGenFlag === "true") {
            console.log('� Auto-generation requested from creation page');
            console.log('👤 User email:', currentUserEmail);
            console.log('📄 XML to parse:', xmlToUse ? xmlToUse.substring(0, 200) + '...' : 'No XML');
            
            if (currentUserEmail && xmlToUse) {
              extractImageQueriesAndGenerate(xmlToUse, currentUserEmail);
            } else {
              console.warn('❌ Cannot auto-generate: missing user email or XML');
            }
            localStorage.removeItem(`auto_generate_images:${pitchDeckId}`); // Clean up flag
          }
        }
      } catch (e) {
        console.error("Failed to load presentation", e);
        setPresentation(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [pitchDeckId]);

  const handleBack = () => {
    router.push("/dashboard/pitch-deck");
  };

  const handleDownload = async (format: "pptx" | "pdf") => {
    setDownloading(format);
    try {
      const slideNodes = Array.from(
        document.querySelectorAll<HTMLElement>(
          "#doc-preview, [id^=doc-preview-page-]"
        )
      );
      if (slideNodes.length === 0) {
        setDownloading(null);
        toast.error("Nothing to export");
        return;
      }

      // Ensure scroll positions are at top for consistent capture
      slideNodes.forEach((el) => (el.scrollTop = 0));

      const makeCanvas = async (el: HTMLElement) =>
        await html2canvas(el, {
          backgroundColor: "#ffffff",
          scale: window.devicePixelRatio > 1 ? 2 : 1.5,
          useCORS: true,
          allowTaint: false,
          logging: false,
          windowWidth: el.scrollWidth || undefined,
          windowHeight: el.scrollHeight || undefined,
        });

      if (format === "pdf") {
        const canvases = [] as HTMLCanvasElement[];
        for (const node of slideNodes) {
          // Add small padding to avoid clipping shadows
          canvases.push(await makeCanvas(node));
        }

        // Create PDF, fit each canvas to page while preserving aspect ratio
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "pt",
          format: "a4",
        });
        canvases.forEach((canvas, idx) => {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const imgData = canvas.toDataURL("image/jpeg", 0.92);
          const { width: cw, height: ch } = canvas;
          const pageRatio = pageWidth / pageHeight;
          const canvasRatio = cw / ch;
          let renderWidth = pageWidth;
          let renderHeight = pageHeight;
          if (canvasRatio > pageRatio) {
            renderWidth = pageWidth;
            renderHeight = pageWidth / canvasRatio;
          } else {
            renderHeight = pageHeight;
            renderWidth = pageHeight * canvasRatio;
          }
          const offsetX = (pageWidth - renderWidth) / 2;
          const offsetY = (pageHeight - renderHeight) / 2;
          if (idx > 0) pdf.addPage();
          pdf.addImage(
            imgData,
            "JPEG",
            offsetX,
            offsetY,
            renderWidth,
            renderHeight
          );
        });
        await pdf.save(`PitchDeck-${pitchDeckId}.pdf`, { returnPromise: true });
        setDownloading(null);
        return;
      }

      if (format === "pptx") {
        const PptxGen = (await import("pptxgenjs")).default as any;
        const pptx = new PptxGen();
        // Default widescreen 10x5.625in; ensure each image fills the slide
        for (const node of slideNodes) {
          const canvas = await makeCanvas(node);
          const imgData = canvas.toDataURL("image/png");
          const slide = pptx.addSlide();
          slide.addImage({ data: imgData, x: 0, y: 0, w: "100%", h: "100%" });
        }
        await pptx.writeFile({ fileName: `PitchDeck-${pitchDeckId}.pptx` });
        setDownloading(null);
        return;
      }
    } catch (e: any) {
      console.error(e);
      setDownloading(null);
      toast.error(e?.message || "Failed to export");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditingSlideIndex(0);
  };

  const handleCancel = () => {
    // Reset edit buffer from latest presentation state
    const slidesData: any = (presentation as any)?.content?.slides;
    let xml = "";
    if (typeof slidesData === "string") {
      xml = slidesData.replace(/^```[a-zA-Z]*\n?/i, "").replace(/```\s*$/, "");
    } else if (Array.isArray(slidesData) && slidesData[0]?.xml) {
      xml = String(slidesData[0].xml);
    }
    setEditedXml(xml);
    setIsEditing(false);
    setEditingSlideIndex(null);
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      // Persist to backend like other documents
      const payload = { content: { slides: editedXml } };
      const updated = await updatePresentation(
        String(pitchDeckId),
        payload as any
      );
      setPresentation(updated);
      toast.success("Saved");
      setIsEditing(false);
      setEditingSlideIndex(null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to save");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full">
      {/* Headers */}
      <DesktopHeader />
      <MobileHeader className="mb-2" showBorder={true} title="Pitch Deck" />

      {/* Loading state: same as logo details */}
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
        <div className="relative flex min-h-[84vh] w-full flex-col lg:min-h-[83vh]">
          <div className="relative flex w-full">
            {/* Left Content Area - Scrollable */}
            <div className="flex flex-1 flex-col p-0 xl:pr-14">
              {/* Download Buttons - Top Right */}
              <div className="my-5 flex justify-end gap-4 xl:mr-4">
                <Button
                  className="flex items-center gap-2 rounded-full border-primary-500 bg-white px-6 py-3 hover:bg-purple-50"
                  disabled={downloading === "pptx"}
                  onClick={() => handleDownload("pptx")}
                  variant="outline"
                >
                  <DownloadIcon color="#1C274C" size={16} />
                  {downloading === "pptx" ? "Downloading..." : "PPTX"}
                </Button>
                <Button
                  className="flex items-center gap-2 rounded-full border-primary-500 bg-white px-6 py-3 hover:bg-purple-50"
                  disabled={downloading === "pdf"}
                  onClick={() => handleDownload("pdf")}
                  variant="outline"
                >
                  <DownloadIcon color="#1C274C" size={16} />
                  {downloading === "pdf" ? "Downloading..." : "PDF"}
                </Button>
              </div>

              {/* Scrollable Area */}
              <div className="scrollbar-hide flex-1 overflow-y-auto xl:pr-4">
                <div className="scrollbar-hide h-full overflow-y-auto rounded-2xl bg-white">
                  <div className="flex justify-center">
                    <div className="mx-auto w-full max-w-screen-2xl space-y-4">
                      {/* Auto Image Generators - Invisible components for generating images */}
                      {shouldAutoGenerateImages && userEmail && (() => {
                        // Extract IMG queries from the current XML
                        const xml = editedXml || "";
                        const sectionRegex = /<SECTION\b[^>]*>[\s\S]*?<\/SECTION>/gi;
                        const sections = xml.match(sectionRegex) || [];
                        
                        const imageGenerators: React.ReactNode[] = [];
                        
                        sections.forEach((section, index) => {
                          const imgMatch = section.match(/<IMG\b[^>]*query="([^"]+)"/i);
                          if (imgMatch && imgMatch[1]) {
                            const query = imgMatch[1].trim();
                            console.log(`🖼️ Setting up auto-generation for slide ${index}: "${query}"`);
                            
                            imageGenerators.push(
                              <AutoImageGenerator
                                key={`auto-gen-${index}-${query}`}
                                index={index}
                                query={query}
                                presentationId={Number(pitchDeckId)}
                                onStart={() => handleImageGenerationStart(index)}
                                onDone={(url) => handleImageGenerationDone(index, url)}
                                userEmail={userEmail}
                              />
                            );
                          }
                        });
                        
                        if (imageGenerators.length > 0) {
                          console.log(`🚀 Auto-generating ${imageGenerators.length} images...`);
                        }
                        
                        return imageGenerators;
                      })()}
                      
                      <>
                        {isEditing
                          ? (() => {
                              const total = parsedSlides.length;
                              return parsedSlides.map((s, index) => {
                                const hasImage = !!(s.imageUrl || s.imageQuery);
                                const isImageLeft = index % 2 === 1;
                                const imgKey = index;
                                const imgUrl =
                                  imageUrlMap[imgKey] || s.imageUrl;
                                const query = s.imageQuery || "";
                                return (
                                  <div
                                    className="relative rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:p-8"
                                    key={index}
                                    style={{
                                      fontFamily:
                                        "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
                                      color: "#0f172a",
                                      background: "#ffffff",
                                    }}
                                  >
                                    {/* responsive height classes for edit mode */}
                                    <div
                                      aria-hidden
                                      className="-z-10 absolute inset-0 h-auto md:h-[calc(100vh-296px)]"
                                    />
                                    <div
                                      className="absolute top-0 right-0 left-0 h-1 rounded-t-2xl"
                                      style={{ backgroundColor: theme.main }}
                                    />
                                    {hasImage ? (
                                      <div className="grid h-full grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6">
                                        <div
                                          className={`${isImageLeft ? "order-1" : "order-2"} relative aspect-[16/10] w-full overflow-hidden rounded-xl border md:aspect-auto md:h-full`}
                                          style={{ borderColor: theme.border }}
                                        >
                                          {imgUrl ? (
                                            <Image
                                              alt="slide visual"
                                              className="h-full w-full object-cover"
                                              fill
                                              sizes="(min-width: 768px) 50vw, 100vw"
                                              src={imgUrl}
                                            />
                                          ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white">
                                              {imageLoadingMap[index] ? (
                                                <div className="text-center">
                                                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent mx-auto mb-2" />
                                                  <p className="text-xs text-gray-500">Generating image...</p>
                                                </div>
                                              ) : (
                                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <div
                                          className={`${isImageLeft ? "order-2" : "order-1"} flex h-full min-h-0 flex-col justify-center space-y-3 overflow-visible md:overflow-auto ${isImageLeft ? "pl-2" : "pr-2"}`}
                                        >
                                          {s.title !== undefined && (
                                            <div>
                                              <h1
                                                className="font-extrabold text-2xl tracking-tight outline-none focus:outline-none focus:ring-0 sm:text-3xl"
                                                contentEditable
                                                data-no-borders="true"
                                                onBlur={(e) =>
                                                  updateSlideField(index, {
                                                    title: (
                                                      e.currentTarget as HTMLElement
                                                    ).innerText,
                                                  })
                                                }
                                                style={{ color: theme.text }}
                                                suppressContentEditableWarning
                                              >
                                                {s.title || "Title"}
                                              </h1>
                                              <div
                                                className="mt-2 h-1 w-24 rounded-full"
                                                style={{
                                                  backgroundColor: theme.main,
                                                }}
                                              />
                                            </div>
                                          )}
                                          {s.subtitle !== undefined && (
                                            <>
                                              <h2
                                                className="mt-2 text-lg outline-none focus:outline-none focus:ring-0"
                                                contentEditable
                                                data-no-borders="true"
                                                onBlur={(e) =>
                                                  updateSlideField(index, {
                                                    subtitle: (
                                                      e.currentTarget as HTMLElement
                                                    ).innerText,
                                                  })
                                                }
                                                style={{ color: theme.subtext }}
                                                suppressContentEditableWarning
                                              >
                                                {s.subtitle || "Subtitle"}
                                              </h2>
                                              <div
                                                className="mt-3"
                                                style={{
                                                  borderTop: `1px dashed ${theme.border}`,
                                                }}
                                              />
                                            </>
                                          )}
                                          {s.paragraphs.map((p, i) => (
                                            <p
                                              className="rounded-md border-0 text-sm leading-6 outline-none focus:outline-none focus:ring-0"
                                              contentEditable
                                              data-no-borders="true"
                                              key={i}
                                              onBlur={(e) =>
                                                updateParagraph(
                                                  index,
                                                  i,
                                                  (
                                                    e.currentTarget as HTMLElement
                                                  ).innerText
                                                )
                                              }
                                              style={{
                                                backgroundColor: theme.soft,
                                                borderLeft: `3px solid ${theme.border}`,
                                                padding: "8px 10px",
                                                borderTop: "none",
                                                borderRight: "none",
                                                borderBottom: "none",
                                              }}
                                              suppressContentEditableWarning
                                            >
                                              {p || "Paragraph"}
                                            </p>
                                          ))}
                                          {/* Bullets */}
                                          {s.bullets.length > 0 && (
                                            <BulletsList
                                              editable={isEditing}
                                              items={s.bullets}
                                              onEdit={(i, patch) =>
                                                updateBullet(index, i, patch)
                                              }
                                              textColor={theme.text}
                                            />
                                          )}

                                          {/* Cycle blocks */}
                                          {s.cycle.length > 0 && (
                                            <CycleBlocks
                                              borderColor={theme.border}
                                              items={s.cycle}
                                              subtextColor={theme.subtext}
                                              textColor={theme.text}
                                            />
                                          )}

                                          {/* Arrows blocks */}
                                          {s.arrows && s.arrows.length > 0 && (
                                            <ArrowsBlocks
                                              items={s.arrows}
                                              mainColor={theme.main}
                                              subtextColor={theme.subtext}
                                              textColor={theme.text}
                                            />
                                          )}

                                          {/* Timeline blocks */}
                                          {s.timeline &&
                                            s.timeline.length > 0 && (
                                              <TimelineBlocks
                                                borderColor={theme.border}
                                                items={s.timeline}
                                                subtextColor={theme.subtext}
                                                textColor={theme.text}
                                              />
                                            )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 gap-4">
                                        <div className="flex h-full min-h-0 flex-col justify-center space-y-3 overflow-visible pr-2 md:overflow-auto">
                                          {s.title !== undefined && (
                                            <div>
                                              <h1
                                                className="font-extrabold text-2xl tracking-tight outline-none focus:outline-none focus:ring-0 sm:text-3xl"
                                                contentEditable
                                                data-no-borders="true"
                                                onBlur={(e) =>
                                                  updateSlideField(index, {
                                                    title: (
                                                      e.currentTarget as HTMLElement
                                                    ).innerText,
                                                  })
                                                }
                                                style={{ color: theme.text }}
                                                suppressContentEditableWarning
                                              >
                                                {s.title || "Title"}
                                              </h1>
                                              <div
                                                className="mt-2 h-1 w-24 rounded-full"
                                                style={{
                                                  backgroundColor: theme.main,
                                                }}
                                              />
                                            </div>
                                          )}
                                          {s.subtitle !== undefined && (
                                            <h2
                                              className="mt-2 text-lg outline-none focus:outline-none focus:ring-0"
                                              contentEditable
                                              data-no-borders="true"
                                              onBlur={(e) =>
                                                updateSlideField(index, {
                                                  subtitle: (
                                                    e.currentTarget as HTMLElement
                                                  ).innerText,
                                                })
                                              }
                                              style={{ color: theme.subtext }}
                                              suppressContentEditableWarning
                                            >
                                              {s.subtitle || "Subtitle"}
                                            </h2>
                                          )}
                                          {s.paragraphs.map((p, i) => (
                                            <p
                                              className="rounded-md border-0 text-sm leading-6 outline-none focus:outline-none focus:ring-0"
                                              contentEditable
                                              data-no-borders="true"
                                              key={i}
                                              onBlur={(e) =>
                                                updateParagraph(
                                                  index,
                                                  i,
                                                  (
                                                    e.currentTarget as HTMLElement
                                                  ).innerText
                                                )
                                              }
                                              style={{
                                                backgroundColor: theme.soft,
                                                borderLeft: `3px solid ${theme.border}`,
                                                padding: "8px 10px",
                                                borderTop: "none",
                                                borderRight: "none",
                                                borderBottom: "none",
                                              }}
                                              suppressContentEditableWarning
                                            >
                                              {p || "Paragraph"}
                                            </p>
                                          ))}
                                          {/* Bullets */}
                                          {s.bullets.length > 0 && (
                                            <BulletsList
                                              editable={isEditing}
                                              items={s.bullets}
                                              onEdit={(i, patch) =>
                                                updateBullet(index, i, patch)
                                              }
                                              textColor={theme.text}
                                            />
                                          )}

                                          {/* Cycle blocks */}
                                          {s.cycle.length > 0 && (
                                            <CycleBlocks
                                              borderColor={theme.border}
                                              items={s.cycle}
                                              subtextColor={theme.subtext}
                                              textColor={theme.text}
                                            />
                                          )}

                                          {/* Arrows blocks */}
                                          {s.arrows && s.arrows.length > 0 && (
                                            <ArrowsBlocks
                                              items={s.arrows}
                                              mainColor={theme.main}
                                              subtextColor={theme.subtext}
                                              textColor={theme.text}
                                            />
                                          )}

                                          {/* Timeline blocks */}
                                          {s.timeline &&
                                            s.timeline.length > 0 && (
                                              <TimelineBlocks
                                                borderColor={theme.border}
                                                items={s.timeline}
                                                subtextColor={theme.subtext}
                                                textColor={theme.text}
                                              />
                                            )}
                                        </div>
                                      </div>
                                    )}

                                    <div
                                      className="absolute right-4 bottom-4 text-xs"
                                      style={{ color: theme.subtext }}
                                    >
                                      Slide {index + 1} of {total}
                                    </div>
                                  </div>
                                );
                              });
                            })()
                          : (() => {
                              const total = parsedSlides.length;
                              return parsedSlides.map((s, index) => {
                                const hasImage = !!(s.imageUrl || s.imageQuery);
                                const isImageLeft = index % 2 === 1;
                                const imgKey = index;
                                // If images list is empty, ignore any existing src and wait for generated URL
                                const imgUrl = imagesListEmpty
                                  ? imageUrlMap[imgKey]
                                  : imageUrlMap[imgKey] || s.imageUrl;
                                const query = s.imageQuery || "";
                                return (
                                  <div
                                    className="relative h-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:h-[calc(100vh-296px)] md:p-4"
                                    id={
                                      index === 0
                                        ? "doc-preview"
                                        : `doc-preview-page-${index + 1}`
                                    }
                                    key={index}
                                    style={{
                                      fontFamily:
                                        "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
                                      color: "#0f172a",
                                      background: "#ffffff",
                                    }}
                                  >
                                    {/* responsive height classes for edit mode */}
                                    <div
                                      aria-hidden
                                      className="-z-10 absolute inset-0 h-auto md:h-[calc(100vh-296px)]"
                                    />
                                    <div
                                      className="absolute top-0 right-0 left-0 h-1 rounded-t-2xl"
                                      style={{ backgroundColor: theme.main }}
                                    />
                                    {hasImage ? (
                                      <div className="grid h-full grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6">
                                        <div
                                          className={`${isImageLeft ? "order-1" : "order-2"} relative aspect-[16/10] w-full overflow-hidden rounded-xl border md:aspect-auto md:h-full`}
                                          style={{ borderColor: theme.border }}
                                        >
                                          {imgUrl ? (
                                            <Image
                                              alt="slide visual"
                                              className="h-full w-full object-cover"
                                              fill
                                              sizes="(min-width: 768px) 50vw, 100vw"
                                              src={imgUrl}
                                            />
                                          ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white">
                                              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
                                            </div>
                                          )}
                                        </div>
                                        <div
                                          className={`${isImageLeft ? "order-2" : "order-1"} flex h-full min-h-0 flex-col justify-center space-y-3 overflow-visible md:overflow-auto ${isImageLeft ? "pl-2" : "pr-2"}`}
                                        >
                                          {s.title !== undefined && (
                                            <div>
                                              <h1
                                                className="font-extrabold text-2xl tracking-tight outline-none focus:outline-none focus:ring-0 sm:text-3xl"
                                                contentEditable
                                                data-no-borders="true"
                                                onBlur={(e) =>
                                                  updateSlideField(index, {
                                                    title: (
                                                      e.currentTarget as HTMLElement
                                                    ).innerText,
                                                  })
                                                }
                                                style={{ color: theme.text }}
                                                suppressContentEditableWarning
                                              >
                                                {s.title || "Title"}
                                              </h1>
                                              <div
                                                className="mt-2 h-1 w-24 rounded-full"
                                                style={{
                                                  backgroundColor: theme.main,
                                                }}
                                              />
                                            </div>
                                          )}
                                          {s.subtitle !== undefined && (
                                            <>
                                              <h2
                                                className="mt-2 text-lg outline-none focus:outline-none focus:ring-0"
                                                contentEditable
                                                data-no-borders="true"
                                                onBlur={(e) =>
                                                  updateSlideField(index, {
                                                    subtitle: (
                                                      e.currentTarget as HTMLElement
                                                    ).innerText,
                                                  })
                                                }
                                                style={{ color: theme.subtext }}
                                                suppressContentEditableWarning
                                              >
                                                {s.subtitle || "Subtitle"}
                                              </h2>
                                              <div
                                                className="mt-3"
                                                style={{
                                                  borderTop: `1px dashed ${theme.border}`,
                                                }}
                                              />
                                            </>
                                          )}
                                          {s.paragraphs.map((p, i) => (
                                            <p
                                              className="rounded-md border-0 text-sm leading-6 outline-none focus:outline-none focus:ring-0"
                                              contentEditable
                                              data-no-borders="true"
                                              key={i}
                                              onBlur={(e) =>
                                                updateParagraph(
                                                  index,
                                                  i,
                                                  (
                                                    e.currentTarget as HTMLElement
                                                  ).innerText
                                                )
                                              }
                                              style={{
                                                backgroundColor: theme.soft,
                                                borderLeft: `3px solid ${theme.border}`,
                                                padding: "8px 10px",
                                                borderTop: "none",
                                                borderRight: "none",
                                                borderBottom: "none",
                                              }}
                                              suppressContentEditableWarning
                                            >
                                              {p || "Paragraph"}
                                            </p>
                                          ))}
                                          {/* Bullets (dotless) */}
                                          {s.bullets.length > 0 && (
                                            <BulletsList
                                              editable={false}
                                              items={s.bullets}
                                              textColor={theme.text}
                                            />
                                          )}

                                          {/* Cycle blocks */}
                                          {s.cycle.length > 0 && (
                                            <div className="grid grid-cols-1 gap-3">
                                              {s.cycle.map((c, i) => (
                                                <div
                                                  className="rounded-lg border p-3"
                                                  key={i}
                                                  style={{
                                                    borderColor: theme.border,
                                                  }}
                                                >
                                                  {c.title && (
                                                    <div
                                                      className="font-semibold"
                                                      style={{
                                                        color: theme.text,
                                                      }}
                                                    >
                                                      {c.title}
                                                    </div>
                                                  )}
                                                  {c.text && (
                                                    <div
                                                      className="text-sm"
                                                      style={{
                                                        color: theme.subtext,
                                                      }}
                                                    >
                                                      {c.text}
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          )}

                                          {/* Arrows blocks (rendered as bullets) */}
                                          {s.arrows && s.arrows.length > 0 && (
                                            <ArrowsBlocks
                                              items={s.arrows}
                                              mainColor={theme.main}
                                              subtextColor={theme.subtext}
                                              textColor={theme.text}
                                            />
                                          )}

                                          {/* Timeline blocks (no dots) */}
                                          {s.timeline &&
                                            s.timeline.length > 0 && (
                                              <TimelineBlocks
                                                borderColor={theme.border}
                                                items={s.timeline}
                                                subtextColor={theme.subtext}
                                                textColor={theme.text}
                                              />
                                            )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 gap-4">
                                        <div className="flex h-full min-h-0 flex-col justify-center space-y-3 overflow-visible pr-2 md:overflow-auto">
                                          {s.title !== undefined && (
                                            <div>
                                              <h1
                                                className="font-extrabold text-2xl tracking-tight outline-none focus:outline-none focus:ring-0 sm:text-3xl"
                                                contentEditable
                                                data-no-borders="true"
                                                onBlur={(e) =>
                                                  updateSlideField(index, {
                                                    title: (
                                                      e.currentTarget as HTMLElement
                                                    ).innerText,
                                                  })
                                                }
                                                style={{ color: theme.text }}
                                                suppressContentEditableWarning
                                              >
                                                {s.title || "Title"}
                                              </h1>
                                              <div
                                                className="mt-2 h-1 w-24 rounded-full"
                                                style={{
                                                  backgroundColor: theme.main,
                                                }}
                                              />
                                            </div>
                                          )}
                                          {s.subtitle !== undefined && (
                                            <h2
                                              className="mt-2 text-lg outline-none focus:outline-none focus:ring-0"
                                              contentEditable
                                              data-no-borders="true"
                                              onBlur={(e) =>
                                                updateSlideField(index, {
                                                  subtitle: (
                                                    e.currentTarget as HTMLElement
                                                  ).innerText,
                                                })
                                              }
                                              style={{ color: theme.subtext }}
                                              suppressContentEditableWarning
                                            >
                                              {s.subtitle || "Subtitle"}
                                            </h2>
                                          )}
                                          {s.paragraphs.map((p, i) => (
                                            <p
                                              className="rounded-md border-0 text-sm leading-6 outline-none focus:outline-none focus:ring-0"
                                              contentEditable
                                              data-no-borders="true"
                                              key={i}
                                              onBlur={(e) =>
                                                updateParagraph(
                                                  index,
                                                  i,
                                                  (
                                                    e.currentTarget as HTMLElement
                                                  ).innerText
                                                )
                                              }
                                              style={{
                                                backgroundColor: theme.soft,
                                                borderLeft: `3px solid ${theme.border}`,
                                                padding: "8px 10px",
                                                borderTop: "none",
                                                borderRight: "none",
                                                borderBottom: "none",
                                              }}
                                              suppressContentEditableWarning
                                            >
                                              {p || "Paragraph"}
                                            </p>
                                          ))}
                                          {/* Bullets (dotless) */}
                                          {s.bullets.length > 0 && (
                                            <BulletsList
                                              editable={false}
                                              items={s.bullets}
                                              textColor={theme.text}
                                            />
                                          )}

                                          {/* Cycle blocks */}
                                          {s.cycle.length > 0 && (
                                            <div className="grid grid-cols-1 gap-3">
                                              {s.cycle.map((c, i) => (
                                                <div
                                                  className="rounded-lg border p-3"
                                                  key={i}
                                                  style={{
                                                    borderColor: theme.border,
                                                  }}
                                                >
                                                  {c.title && (
                                                    <div
                                                      className="font-semibold"
                                                      style={{
                                                        color: theme.text,
                                                      }}
                                                    >
                                                      {c.title}
                                                    </div>
                                                  )}
                                                  {c.text && (
                                                    <div
                                                      className="text-sm"
                                                      style={{
                                                        color: theme.subtext,
                                                      }}
                                                    >
                                                      {c.text}
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          )}

                                          {/* Arrows blocks (rendered as bullets) */}
                                          {s.arrows && s.arrows.length > 0 && (
                                            <ArrowsBlocks
                                              items={s.arrows}
                                              mainColor={theme.main}
                                              subtextColor={theme.subtext}
                                              textColor={theme.text}
                                            />
                                          )}

                                          {/* Timeline blocks (no dots) */}
                                          {s.timeline &&
                                            s.timeline.length > 0 && (
                                              <TimelineBlocks
                                                borderColor={theme.border}
                                                items={s.timeline}
                                                subtextColor={theme.subtext}
                                                textColor={theme.text}
                                              />
                                            )}
                                        </div>
                                      </div>
                                    )}
                                    {/* <div
                                      className="absolute right-4 bottom-0 my-1 text-xs"
                                      style={{ color: theme.subtext }}
                                    >
                                      Slide {index + 1} of {total}
                                    </div> */}
                                  </div>
                                );
                              });
                            })()}
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Action Buttons - Right Side Middle */}
            <div className="sm:-translate-y-1/2 fixed top-auto right-3 bottom-6 z-10 flex transform flex-col gap-3 sm:top-1/2 sm:right-8 sm:bottom-auto sm:gap-4">
              {/* Theme Color Selector (moved above Edit/Save) */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    aria-label="Select color theme"
                    className="h-14 w-14 rounded-full border-slate-300 shadow-lg sm:h-16 sm:w-16"
                    size="icon"
                    style={{ backgroundColor: themeColor || "#7C3AED" }}
                    variant="outline"
                  />
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-3">
                  <div className="grid grid-cols-5 gap-3">
                    {themePalette.map((c) => (
                      <button
                        aria-label={`Choose theme ${c}`}
                        className={
                          "h-8 w-8 rounded-full border shadow-sm transition" +
                          (themeColor === c
                            ? "border-slate-300 ring-2 ring-slate-400 ring-offset-2"
                            : "border-slate-200 hover:ring-1 hover:ring-slate-300")
                        }
                        key={c}
                        onClick={() => handleThemeSelect(c)}
                        style={{ backgroundColor: c }}
                        type="button"
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      className="gap-2"
                      disabled={isSavingTheme}
                      onClick={handleThemeSave}
                      size="sm"
                      variant="outline"
                    >
                      {isSavingTheme ? (
                        <svg
                          className="h-4 w-4 animate-spin text-current"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            fill="none"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <CheckIcon size={16} />
                      )}
                      {isSavingTheme ? "Saving..." : "Apply"}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Edit/Save Button */}
              <Button
                className={`h-14 w-14 rounded-full shadow-lg sm:h-16 sm:w-16 ${
                  isEditing
                    ? "border-green-300 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-600"
                    : "border-purple-300 bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-600"
                }`}
                disabled={isUpdating}
                onClick={isEditing ? handleSave : handleEdit}
                size="icon"
                variant="outline"
              >
                {isEditing ? (
                  isUpdating ? (
                    <svg
                      className="h-6 w-6 animate-spin text-current"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        fill="none"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <CheckIcon size={24} />
                  )
                ) : (
                  <EditPencilLineIcon size={24} />
                )}
              </Button>

              {/* Cancel Button (only show when editing) */}
              {isEditing && (
                <Button
                  className="h-14 w-14 rounded-full border-gray-300 bg-gray-50 text-gray-600 shadow-lg hover:bg-gray-100 hover:text-gray-600 sm:h-16 sm:w-16"
                  disabled={isUpdating}
                  onClick={handleCancel}
                  size="icon"
                  variant="outline"
                >
                  <svg
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <line x1="18" x2="6" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="6" y2="18" />
                  </svg>
                </Button>
              )}

              {/* Delete Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="h-14 w-14 rounded-full border-red-300 bg-red-50 text-red-600 shadow-lg hover:bg-red-100 hover:text-red-600 sm:h-16 sm:w-16"
                    size="icon"
                    variant="outline"
                  >
                    <TrashCanIcon size={24} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Presentation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this presentation? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isDeleting}
                      onClick={async () => {
                        setIsDeleting(true);
                        try {
                          await deletePresentation(pitchDeckId);
                          toast.success("Presentation deleted successfully!");
                          router.push("/dashboard/pitch-deck");
                        } catch (error: any) {
                          console.error(
                            "Failed to delete presentation:",
                            error
                          );
                          toast.error(
                            error?.response?.data?.message ||
                              error.message ||
                              "Failed to delete presentation"
                          );
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
