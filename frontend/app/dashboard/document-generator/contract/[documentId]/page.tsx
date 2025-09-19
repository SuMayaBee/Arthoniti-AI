"use client";

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import HistoryLoader from "@/components/history-loader";
import CheckIcon from "@/components/icons/CheckIcon";
// Dashboard layout is provided by app/dashboard/layout.tsx — do not wrap pages again
import DownloadIcon from "@/components/icons/DownloadIcon";
import EditPencilLineIcon from "@/components/icons/EditPencilLineIcon";
import TrashCanIcon from "@/components/icons/TrashCanIcon";
import DesktopHeader from "@/components/nav/DesktopHeader";
import MobileHeader from "@/components/nav/MobileHeader";
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
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import {
  type ContractResponse,
  deleteContract,
  getContractById,
  updateContract,
} from "@/lib/api/document";

// Import BetterEditor with client-side only rendering
const BetterEditor = dynamic(() => import("@/components/better-editor"), {
  ssr: false,
});

export default function ContractDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  const [document, setDocument] = useState<ContractResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [downloading, setDownloading] = useState<"docx" | "pdf" | null>(null);

  // Fetch contract data
  useEffect(() => {
    const fetchContract = async () => {
      if (!documentId) return;
      setLoading(true);
      try {
        const data = await getContractById(Number.parseInt(documentId));
        setDocument(data);
      } catch (err: any) {
        console.error("Failed to fetch contract:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load contract"
        );
        toast.error("Failed to load contract");
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
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
      const pageElements = window.document.querySelectorAll(
        '[id^="doc-preview"]'
      );
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
        element.style.position = "relative";
        element.style.top = "0";
        element.style.left = "0";
        element.style.transform = "none";
        element.style.margin = "0";
        element.style.padding = "12mm";
        element.style.width = "794px";
        element.style.minHeight = "1123px";
        element.style.backgroundColor = "#ffffff";
        element.style.boxShadow = "none";
        element.style.borderRadius = "0";

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

      pdf.save(`${document?.contract_type || "contract"}.pdf`);
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
          .replace(/^###\s*$/gm, "")
          .replace(/^- (.*?)$/gm, "• $1")
          .replace(/^\d+\. (.*?)$/gm, "$1")
          .trim();
      };

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "Contract",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Type: ${document.contract_type}`,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Party 1: ${document.party1_name}`,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Party 2: ${document.party2_name}`,
                    bold: true,
                  }),
                ],
              }),
              ...formatContentForDOCX(document.ai_generated_content)
                .split("\n\n")
                .map((paragraph) => new Paragraph({ text: paragraph.trim() })),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `${document?.contract_type || "contract"}.docx`;
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
    try {
      await deleteContract(document.id);
      toast.success("Contract deleted successfully!");
      router.push("/dashboard/document-generator");
    } catch (error: any) {
      console.error("Failed to delete contract:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete contract"
      );
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
    try {
      const updatedDocument = await updateContract(document.id, {
        ai_generated_content: editedContent,
      });
      setDocument(updatedDocument);
      setIsEditing(false);
      toast.success("Contract updated successfully!");
    } catch (error: any) {
      console.error("Failed to update contract:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update contract"
      );
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
        <MobileHeader className="mb-2" showBorder title="Contract" />
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
        <MobileHeader className="mb-2" showBorder title="Contract" />
        <div className="flex min-h-[calc(100svh-72px)] items-center justify-center lg:min-h-[calc(100svh-56px)]">
          <div className="text-center">
            <div className="mb-4 text-red-500">
              {error || "Contract not found"}
            </div>
            <Button onClick={handleBack}>Back to Document Generator</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <DesktopHeader />
      <MobileHeader className="mb-2" showBorder title="Contract" />
      <div className="relative flex min-h-[84vh] w-full lg:min-h-[83vh]">
        <div className="flex flex-1 flex-col p-0">
          <div className="mx-auto w-full">
            <div className="my-4 flex justify-end gap-3 sm:my-5 sm:gap-4">
              <Button
                className="flex items-center gap-2 rounded-full border-primary-500 bg-white px-4 py-2.5 hover:bg-purple-50 sm:px-6 sm:py-3"
                disabled={downloading === "docx"}
                onClick={() => handleDownload("docx")}
                variant="outline"
              >
                <DownloadIcon color="#1C274C" size={16} />
                {downloading === "docx" ? "Downloading..." : "DOCX"}
              </Button>
              <Button
                className="flex items-center gap-2 rounded-full border-primary-500 bg-white px-4 py-2.5 hover:bg-purple-50 sm:px-6 sm:py-3"
                disabled={downloading === "pdf"}
                onClick={() => handleDownload("pdf")}
                variant="outline"
              >
                <DownloadIcon color="#1C274C" size={16} />
                {downloading === "pdf" ? "Downloading..." : "PDF"}
              </Button>
            </div>
          </div>

          {isEditing && (
            <div className="scrollbar-hide edit-mode-scrollbar-hide flex-1 overflow-y-auto">
              <div className="scrollbar-hide h-full overflow-y-auto bg-gray-100 py-6 sm:py-8">
                <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-3 sm:px-4">
                  <BetterEditor
                    content={editedContent}
                    isSaving={isUpdating}
                    logoUrl={document.input_data?.logo_url}
                    onChange={setEditedContent}
                    onSave={() => {}}
                  />
                </div>
              </div>
            </div>
          )}

          {!isEditing && (
            <div className="scrollbar-hide flex-1 overflow-y-auto">
              <div className="scrollbar-hide h-full overflow-y-auto bg-gray-100 py-6 sm:py-8">
                <div className="mx-auto w-full max-w-[820px] px-3 sm:px-4">
                  <div className="flex w-full flex-col items-center space-y-4">
                    {(() => {
                      const formatContent = (content: string) => {
                        return content
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/^###\s*$/gm, "")
                          .replace(
                            /### (.*?)$/gm,
                            '<h3 class="text-lg font-semibold mb-3 mt-6">$1</h3>'
                          )
                          .replace(
                            /## (.*?)$/gm,
                            '<h2 class="text-xl font-bold mb-4 mt-8">$1</h2>'
                          )
                          .replace(
                            /# (.*?)$/gm,
                            '<h1 class="text-2xl font-bold mb-6 mt-8">$1</h1>'
                          )
                          .replace(/^((?:- .*\n?)+)/gm, (match) => {
                            const items = match
                              .split("\n")
                              .filter((line) => line.trim().startsWith("- "));
                            const listItems = items
                              .map(
                                (item) =>
                                  `<li class="mb-2">${item.replace(/^- /, "")}</li>`
                              )
                              .join("");
                            return `<ul class="list-disc ml-6 mb-4">${listItems}</ul>`;
                          })
                          .replace(/^((?:\d+\. .*\n?)+)/gm, (match) => {
                            const items = match
                              .split("\n")
                              .filter((line) => /^\d+\. /.test(line.trim()));
                            const listItems = items
                              .map(
                                (item) =>
                                  `<li class="mb-2">${item.replace(/^\d+\. /, "")}</li>`
                              )
                              .join("");
                            return `<ol class="list-decimal ml-6 mb-4">${listItems}</ol>`;
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
                        const endWord = Math.min(
                          (i + 1) * wordsPerPage,
                          words.length
                        );
                        const pageWords = words.slice(startWord, endWord);
                        const pageContent = formatContent(pageWords.join(" "));
                        pages.push(pageContent);
                      }

                      return pages.map((pageContent, index) => (
                        <div
                          className="relative w-full max-w-[794px] rounded-lg bg-white p-4 shadow-lg sm:p-6 md:min-h-[1123px] md:p-10 lg:p-12"
                          id={
                            index === 0
                              ? "doc-preview"
                              : `doc-preview-page-${index + 1}`
                          }
                          key={index}
                          style={{
                            fontFamily: "Times, serif",
                            fontSize: "14px",
                            lineHeight: "1.6",
                          }}
                        >
                          {document.input_data?.logo_url && (
                            <div className="mb-6 sm:mb-8">
                              <Image
                                alt="Company logo"
                                className="h-12 w-auto object-contain sm:h-16"
                                height={64}
                                loader={({ src }) => src}
                                onError={() => {
                                  /* hide if error by rendering nothing */
                                }}
                                src={document.input_data.logo_url}
                                unoptimized
                                width={256}
                              />
                            </div>
                          )}

                          <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: pageContent }}
                            style={{
                              color: "#000",
                              fontSize: "14px",
                              lineHeight: "1.6",
                            }}
                          />

                          <div className="absolute right-3 bottom-3 text-[10px] text-gray-500 sm:right-4 sm:bottom-4 sm:text-xs">
                            Page {index + 1} of {pages.length}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Floating action bar (all viewports) */}
        <div className="-translate-y-1/2 fixed top-1/2 right-3 z-10 flex transform flex-col gap-3 sm:right-6 sm:gap-4 lg:right-8">
          <Button
            className={`h-16 w-16 rounded-full shadow-lg ${
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
              <CheckIcon size={24} />
            ) : (
              <EditPencilLineIcon size={24} />
            )}
          </Button>

          {isEditing && (
            <Button
              className="h-16 w-16 rounded-full border-gray-300 bg-gray-50 text-gray-600 shadow-lg hover:bg-gray-100 hover:text-gray-600"
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="h-16 w-16 rounded-full border-red-300 bg-red-50 text-red-600 shadow-lg hover:bg-red-100 hover:text-red-600"
                size="icon"
                variant="outline"
              >
                <TrashCanIcon size={24} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Contract</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this contract? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
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
