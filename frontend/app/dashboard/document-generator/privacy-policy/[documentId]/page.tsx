"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// DashboardLayout is provided by app/dashboard/layout.tsx — do not wrap pages here
import DownloadIcon from "@/components/icons/DownloadIcon";
import EditPencilLineIcon from "@/components/icons/EditPencilLineIcon";
import TrashCanIcon from "@/components/icons/TrashCanIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import { getPrivacyPolicyById, deletePrivacyPolicy, updatePrivacyPolicy, type PrivacyPolicyResponse } from "@/lib/api/document";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AlignmentType, Document as DocxDocument, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import dynamic from "next/dynamic";
import DesktopHeader from "@/components/nav/DesktopHeader";
import MobileHeader from "@/components/nav/MobileHeader";
import HistoryLoader from "@/components/history-loader";
import Image from "next/image";

// Import BetterEditor with client-side only rendering
const BetterEditor = dynamic(() => import("@/components/better-editor"), {
  ssr: false,
});

export default function PrivacyPolicyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;
  const showLoader = useLoaderStore((s) => s.show);
  const hideLoader = useLoaderStore((s) => s.hide);

  const [document, setDocument] = useState<PrivacyPolicyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch Privacy Policy data
  useEffect(() => {
    const fetchDoc = async () => {
      if (!documentId) return;
      setLoading(true);
      try {
        const data = await getPrivacyPolicyById(parseInt(documentId));
        setDocument(data);
      } catch (err: any) {
        console.error("Failed to fetch Privacy Policy:", err);
        setError(err.response?.data?.message || err.message || "Failed to load Privacy Policy");
        toast.error("Failed to load Privacy Policy");
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [documentId]);

  const handleBack = () => {
    router.push("/dashboard/document-generator");
  };

  const handleDownload = async (format: "docx" | "pdf") => {
    if (!document) return;

    try {
      if (format === "pdf") {
        await downloadAsPDF();
      } else if (format === "docx") {
        await downloadAsDOCX();
      }
    } catch (error) {
      console.error(`Error downloading ${format}:`, error);
      toast.error(`Failed to download ${format.toUpperCase()}`);
    }
  };

  const downloadAsPDF = async () => {
    setDownloading("pdf");

    try {
      const pageElements = window.document.querySelectorAll('[id^="doc-preview"]');
      if (!pageElements || pageElements.length === 0) {
        toast.error("Document elements not found");
        return;
      }

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;

      for (let i = 0; i < pageElements.length; i++) {
        const element = pageElements[i] as HTMLElement;
        const originalStyle = element.style.cssText;
        element.style.position = 'relative';
        element.style.top = '0';
        element.style.left = '0';
        element.style.transform = 'none';
        element.style.margin = '0';
        element.style.padding = '12mm';
        element.style.width = '794px';
        element.style.minHeight = '1123px';
        element.style.backgroundColor = '#ffffff';
        element.style.boxShadow = 'none';
        element.style.borderRadius = '0';

        try {
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            width: 794,
            height: 1123,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 794,
            windowHeight: 1123,
          });

          const imgData = canvas.toDataURL("image/png");
          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        } finally {
          element.style.cssText = originalStyle;
        }
      }

      const name = document?.company_name ? `${document.company_name}-privacy-policy` : "privacy-policy";
      pdf.save(`${name}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(null);
    }
  };

  const downloadAsDOCX = async () => {
    setDownloading("docx");

    try {
      if (!document) return;

      const formatContentForDOCX = (content: string) => {
        return content
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/### (.*?)$/gm, "$1")
          .replace(/## (.*?)$/gm, "$1")
          .replace(/# (.*?)$/gm, "$1")
          .replace(/^###\s*$/gm, '')
          .replace(/^- (.*?)$/gm, "• $1")
          .replace(/^\d+\. (.*?)$/gm, "$1")
          .trim();
      };

  const doc = new DocxDocument({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "Privacy Policy",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Company: ${document.company_name}`, bold: true }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Website: ${document.website_url}`, bold: true }),
                ],
              }),
              ...formatContentForDOCX(document.ai_generated_content)
                .split('\n\n')
                .map((paragraph) => new Paragraph({ text: paragraph.trim() })),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      const name = document?.company_name ? `${document.company_name}-privacy-policy` : "privacy-policy";
      link.download = `${name}.docx`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("DOCX generation error:", error);
      toast.error("Failed to generate DOCX");
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async () => {
    if (!document) return;

    setIsDeleting(true);
    showLoader("Deleting Privacy Policy...");
    try {
      await deletePrivacyPolicy(document.id);
      setDownloading(null);
      toast.success("Privacy Policy deleted successfully!");
      router.push("/dashboard/document-generator");
    } catch (error: any) {
      setDownloading(null);
      console.error("Failed to delete Privacy Policy:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete Privacy Policy");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (!document) return;
    setEditedContent(document.ai_generated_content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!document) return;

    setIsUpdating(true);
    showLoader("Updating Privacy Policy...");
    try {
      const updatedDocument = await updatePrivacyPolicy(document.id, {
        ai_generated_content: editedContent,
      });
      setDocument(updatedDocument);
      setIsEditing(false);
      setDownloading(null);
      toast.success("Privacy Policy updated successfully!");
    } catch (error: any) {
      setDownloading(null);
      console.error("Failed to update Privacy Policy:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update Privacy Policy");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent("");
  };

  if (loading) {
    return (
      <div className="w-full">
        <DesktopHeader />
        <MobileHeader title="Privacy Policy" showBorder className="mb-2" />
        <div className="lg:hidden">
          <HistoryLoader />
        </div>
        <div className="hidden lg:block">
          <div className="px-8 py-10">
            <HistoryLoader />
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="w-full">
        <DesktopHeader />
        <MobileHeader title="Privacy Policy" showBorder className="mb-2" />
        <div className="flex items-center justify-center min-h-[calc(100svh-72px)] lg:min-h-[calc(100svh-56px)]">
          <div className="text-center">
            <div className="mb-4 text-red-500">{error || "Privacy Policy not found"}</div>
            <Button onClick={handleBack}>Back to Document Generator</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <DesktopHeader />
      <MobileHeader title="Privacy Policy" showBorder className="mb-2" />
      <div className="relative flex w-full min-h-[84vh] lg:min-h-[83vh]">
        <div className="flex-1 flex flex-col p-0">
          <div className="mx-auto w-full">
            <div className="flex justify-end gap-3 sm:gap-4 my-4 sm:my-5">
              <Button
                onClick={() => handleDownload("docx")}
                variant="outline"
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border-primary-500 bg-white hover:bg-purple-50 rounded-full"
              >
                <DownloadIcon size={16} color="#1C274C" />
                DOCX
              </Button>
              <Button
                onClick={() => handleDownload("pdf")}
                variant="outline"
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border-primary-500 bg-white hover:bg-purple-50 rounded-full"
              >
                <DownloadIcon size={16} color="#1C274C" />
                PDF
              </Button>
            </div>
          </div>

          {isEditing && (
            <div className="flex-1 overflow-y-auto scrollbar-hide edit-mode-scrollbar-hide">
              <div className="h-full overflow-y-auto bg-gray-100 py-6 sm:py-8 scrollbar-hide">
                <div className="mx-auto w-full max-w-[820px] px-3 sm:px-4 flex flex-col items-center">
                  <BetterEditor
                    content={editedContent}
                    onChange={setEditedContent}
                    onSave={() => {}}
                    isSaving={isUpdating}
                    logoUrl={document.input_data?.logo_url}
                  />
                </div>
              </div>
            </div>
          )}

          {!isEditing && (
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="h-full overflow-y-auto bg-gray-100 py-6 sm:py-8 scrollbar-hide">
                <div className="mx-auto w-full max-w-[820px] px-3 sm:px-4">
                  <div className="space-y-4 w-full flex flex-col items-center">
                    {(() => {
                      const formatContent = (content: string) => {
                        return content
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/^###\s*$/gm, "")
                          .replace(/### (.*?)$/gm, '<h3 class="text-lg font-semibold mb-3 mt-6">$1<\/h3>')
                          .replace(/## (.*?)$/gm, '<h2 class="text-xl font-bold mb-4 mt-8">$1<\/h2>')
                          .replace(/# (.*?)$/gm, '<h1 class="text-2xl font-bold mb-6 mt-8">$1<\/h1>')
                          .replace(/^((?:- .*\n?)+)/gm, (match) => {
                            const items = match.split("\n").filter((line) => line.trim().startsWith("- "));
                            const listItems = items.map((item) => `<li class=\"mb-2\">${item.replace(/^- /, "")}<\/li>`).join("");
                            return `<ul class=\"list-disc ml-6 mb-4\">${listItems}<\/ul>`;
                          })
                          .replace(/^((?:\d+\..*\n?)+)/gm, (match) => {
                            const items = match.split("\n").filter((line) => /^\d+\. /.test(line.trim()));
                            const listItems = items.map((item) => `<li class=\"mb-2\">${item.replace(/^\d+\. /, "")}<\/li>`).join("");
                            return `<ol class=\"list-decimal ml-6 mb-4\">${listItems}<\/ol>`;
                          })
                          .replace(/\n\n/g, '</p><p class="mb-4">')
                          .replace(/\n/g, "<br/>")
                          .replace(/^/, '<p class="mb-4">')
                          .replace(/$/, "</p>");
                      };

                      const wordsPerPage = 500;
                      const words = document.ai_generated_content.split(" ");
                      const totalPages = Math.ceil(words.length / wordsPerPage);
                      const pages: string[] = [];
                      for (let i = 0; i < totalPages; i++) {
                        const startWord = i * wordsPerPage;
                        const endWord = Math.min((i + 1) * wordsPerPage, words.length);
                        const pageWords = words.slice(startWord, endWord);
                        const pageContent = formatContent(pageWords.join(" "));
                        pages.push(pageContent);
                      }
                      return pages.map((pageContent, index) => (
                        <div
                          key={index}
                          id={index === 0 ? "doc-preview" : `doc-preview-page-${index + 1}`}
                          className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-10 lg:p-12 relative w-full max-w-[794px] md:min-h-[1123px]"
                          style={{ fontFamily: "Times, serif", fontSize: "14px", lineHeight: "1.6" }}
                        >
                          {document.input_data?.logo_url && (
                            <div className="mb-6 sm:mb-8">
                              <Image
                                src={document.input_data.logo_url}
                                alt="Company logo"
                                width={256}
                                height={64}
                                unoptimized
                                loader={({ src }) => src}
                                className="h-12 sm:h-16 w-auto object-contain"
                              />
                            </div>
                          )}
                          <div className="prose prose-sm max-w-none" style={{ color: "#000", fontSize: "14px", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: pageContent }} />
                          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-[10px] sm:text-xs text-gray-500">Page {index + 1} of {pages.length}</div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex fixed right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 transform flex-col gap-3 sm:gap-4 z-10">
          <Button
            onClick={isEditing ? handleSave : handleEdit}
            variant="outline"
            size="icon"
            className={`w-16 h-16 rounded-full shadow-lg ${isEditing ? "border-green-300 bg-green-50 hover:bg-green-100 hover:text-green-600 text-green-600" : "border-purple-300 bg-purple-50 hover:bg-purple-100 hover:text-purple-600 text-purple-600"}`}
            disabled={isUpdating}
          >
            {isEditing ? <CheckIcon size={24} /> : <EditPencilLineIcon size={24} />}
          </Button>

          {isEditing && (
            <Button onClick={handleCancel} variant="outline" size="icon" className="w-16 h-16 rounded-full border-gray-300 bg-gray-50 hover:bg-gray-100 hover:text-gray-600 shadow-lg text-gray-600" disabled={isUpdating}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="w-16 h-16 rounded-full border-red-300 bg-red-50 hover:bg-red-100 hover:text-red-600 shadow-lg text-red-600">
                <TrashCanIcon size={24} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Privacy Policy</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to delete this Privacy Policy? This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
