"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GenerationLoader from "@/components/generation-loader";
import DownloadIcon from "@/components/icons/DownloadIcon";
import EditIcon from "@/components/icons/EditIcon";
import SparklesIcon from "@/components/icons/SparklesIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import DesktopHeader from "@/components/nav/DesktopHeader";
import MobileHeader from "@/components/nav/MobileHeader";
import { Button } from "@/components/ui/button";

export default function DocumentDetailsPage() {
  const params = useParams();
  const documentType = String((params as any)?.documentType ?? "");
  const documentId = String((params as any)?.documentId ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPPTX = () => {
    // TODO: implement PPTX export
  };

  const handleExportPDF = () => {
    // TODO: implement PDF export
  };

  const handleEdit = () => {
    // TODO: implement edit action
  };

  const handleDelete = () => {
    // TODO: implement delete action
  };

  const handleGenerate = () => {
    // TODO: implement regenerate action
  };

  useEffect(() => {
    setIsLoading(false);
  }, [documentType, documentId]);

  const titleMap: Record<string, string> = {
    "business-proposal": "Business Proposal",
    nda: "NDA",
    partnership: "Partnership",
  };
  const headerTitle = titleMap[documentType] || "Document Details";

  const Content = () => {
    switch (documentType) {
      case "business-proposal":
        return (
          <>
            <div className="mb-6 flex justify-end gap-3">
              <Button
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-500 hover:bg-gray-50"
                onClick={handleExportPPTX}
                variant="outline"
              >
                <DownloadIcon /> PPTX
              </Button>
              <Button
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-500 hover:bg-gray-50"
                onClick={handleExportPDF}
                variant="outline"
              >
                <DownloadIcon /> PDF
              </Button>
            </div>
            <div className="relative rounded-[20px] border-2 border-purple-200 bg-white p-8">
              <div className="text-center">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <SparklesIcon />
                  <span className="font-medium text-gray-900 text-lg">
                    Larana Company
                  </span>
                </div>
                <h1 className="mb-8 font-bold text-6xl text-gray-900">
                  Business Proposal
                </h1>
                <div className="mx-auto w-full max-w-2xl">
                  <Image
                    alt="Business professionals collaborating"
                    className="h-64 w-full rounded-[20px] object-cover"
                    height={256}
                    priority
                    src="/placeholder.jpg"
                    width={1024}
                  />
                </div>
              </div>
            </div>
            <div className="-translate-y-1/2 fixed top-1/2 right-8 flex transform flex-col gap-4">
              <button
                className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all duration-300 hover:bg-blue-600"
                onClick={handleGenerate}
                type="button"
              >
                <SparklesIcon />
              </button>
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg transition-all duration-300 hover:bg-purple-600"
                onClick={handleEdit}
                type="button"
              >
                <EditIcon />
              </button>
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-300 hover:bg-red-600"
                onClick={handleDelete}
                type="button"
              >
                <TrashIcon />
              </button>
            </div>
          </>
        );
      case "nda":
        return (
          <>
            <div className="mb-6 flex justify-end gap-3">
              <Button
                className="flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-purple-600 hover:bg-purple-50"
                onClick={handleExportPPTX}
                variant="outline"
              >
                <DownloadIcon /> PPTX
              </Button>
              <Button
                className="flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-purple-600 hover:bg-purple-50"
                onClick={handleExportPDF}
                variant="outline"
              >
                <DownloadIcon /> PDF
              </Button>
            </div>
            <div className="relative rounded-[20px] border-2 border-purple-200 bg-white p-8">
              <div className="relative">
                <div className="absolute top-0 left-0 h-32 w-32 rounded-br-full bg-blue-500 opacity-20" />
                <div className="relative z-10">
                  <h1 className="mb-4 font-bold text-4xl text-blue-900">
                    NON-DISCLOSURE AGREEMENT
                  </h1>
                  <p className="mb-6 text-blue-600 text-lg">
                    Use this NDA to protect confidential information shared
                    during early-stage discussions between parties, such as
                    exploring a potential partnership. Fill in the details as
                    appropriate for your business or project.
                  </p>
                  <p className="mb-8 text-gray-900">
                    This Non-Disclosure Agreement ("Agreement") is entered into
                    as of April 15, 2030, by and between:
                  </p>
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-2 font-bold text-blue-900 text-xl">
                        DISCLOSING PARTY:
                      </h2>
                      <p className="mb-2 text-blue-600 text-sm">
                        Insert the name, address, and contact information of the
                        party sharing confidential information. See the example
                        below.
                      </p>
                      <div className="text-gray-900">
                        <p>Salapi Solutions</p>
                        <p>123 Anywhere St., Any City 12345</p>
                      </div>
                    </div>
                    <div>
                      <h2 className="mb-2 font-bold text-blue-900 text-xl">
                        RECEIVING PARTY:
                      </h2>
                      <p className="mb-2 text-blue-600 text-sm">
                        Insert the name, address, and contact information of the
                        party receiving confidential information. See the
                        example below.
                      </p>
                      <div className="text-gray-900">
                        <p>Francisco Perez</p>
                        <p>123 Anywhere St., Any City 12345</p>
                      </div>
                    </div>
                    <div>
                      <h2 className="mb-2 font-bold text-blue-900 text-xl">
                        1. DEFINITIONS
                      </h2>
                      <p className="mb-2 text-blue-600 text-sm">
                        Describe what types of information should be treated as
                        confidential and specify the reason the confidential
                        information is being shared. See the example below.
                      </p>
                      <div className="text-gray-900">
                        <p>
                          Confidential Information: Any financial reports,
                          technical data, customer lists, or proprietary
                          processes related to Salapi Solutions' software
                          development projects.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="-translate-y-1/2 fixed top-1/2 right-8 flex transform flex-col gap-4">
              <button
                className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all duration-300 hover:bg-blue-600"
                onClick={handleGenerate}
                type="button"
              >
                <SparklesIcon />
              </button>
              <button
                className="h-12 w-12 rounded-full border-2 border-purple-500 bg-white text-purple-600 shadow-lg transition-all duration-300 hover:bg-purple-50"
                onClick={handleEdit}
                type="button"
              >
                <EditIcon />
              </button>
              <button
                className="h-12 w-12 rounded-full border-2 border-purple-500 bg-white text-purple-600 shadow-lg transition-all duration-300 hover:bg-purple-50"
                onClick={handleDelete}
                type="button"
              >
                <TrashIcon />
              </button>
            </div>
          </>
        );
      case "partnership":
        return (
          <>
            <div className="mb-6 flex justify-end gap-3">
              <Button
                className="flex items-center gap-2 rounded-full border border-purple-200 bg-purple-100 px-4 py-2 text-purple-600 hover:bg-purple-200"
                onClick={handleExportPPTX}
                variant="outline"
              >
                <DownloadIcon /> PPTX
              </Button>
              <Button
                className="flex items-center gap-2 rounded-full border border-purple-200 bg-purple-100 px-4 py-2 text-purple-600 hover:bg-purple-200"
                onClick={handleExportPDF}
                variant="outline"
              >
                <DownloadIcon /> PDF
              </Button>
            </div>
            <div className="relative rounded-[20px] border border-gray-200 bg-white p-8">
              <div className="mb-8 text-center">
                <h1 className="mb-6 font-bold text-4xl text-gray-900">
                  PARTNERSHIP AGREEMENT
                </h1>
                <p className="text-gray-900 text-lg">
                  This Partnership Agreement ("Agreement") is made and entered
                  into on October 10, 2024, by and between:
                </p>
              </div>
              <div className="mb-8 space-y-6">
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-lg">Matt Zhang</p>
                  <p className="font-bold text-gray-900">123 Anywhere ST.</p>
                  <p className="font-bold text-gray-900">Any City 12345</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-lg">
                    Anna Katrina Marchesi
                  </p>
                  <p className="font-bold text-gray-900">123 Anywhere ST.</p>
                  <p className="font-bold text-gray-900">Any City 12345</p>
                </div>
              </div>
              <p className="mb-6 text-gray-900 text-lg">
                The partners wish to form a business partnership on the terms
                set out below:
              </p>
              <div className="space-y-6">
                <div>
                  <h2 className="mb-3 font-bold text-gray-900 text-xl">
                    1. Name and Business Purpose
                  </h2>
                  <p className="text-gray-900">
                    The partnership will conduct its business under the name
                    "Fauget Studio". The purpose of the partnership is to
                    provide graphic design services for small businesses.
                  </p>
                </div>
                <div>
                  <h2 className="mb-3 font-bold text-gray-900 text-xl">
                    2. Contributions
                  </h2>
                  <ul className="list-inside list-disc space-y-2 text-gray-900">
                    <li>
                      Matt Zhang agrees to contribute: $30,000 in capital.
                    </li>
                    <li>
                      Anna Katrina Marchesi agrees to contribute: design
                      expertise, portfolio, and client contacts.
                    </li>
                  </ul>
                </div>
                <div>
                  <h2 className="mb-3 font-bold text-gray-900 text-xl">
                    3. Profit and Loss Sharing
                  </h2>
                  <p className="mb-3 text-gray-900">
                    The partners agree to share profits and losses as follows:
                  </p>
                  <ul className="list-inside list-disc space-y-2 text-gray-900">
                    <li>Matt Zhang: 60%</li>
                    <li>Anna Katrina Marchesi: 40%</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="-translate-y-1/2 fixed top-1/2 right-8 flex transform flex-col gap-4">
              <button
                className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all duration-300 hover:bg-blue-600"
                onClick={handleGenerate}
                type="button"
              >
                <SparklesIcon />
              </button>
              <button
                className="h-12 w-12 rounded-full border-2 border-purple-500 bg-purple-100 text-purple-600 shadow-lg transition-all duration-300 hover:bg-purple-200"
                onClick={handleEdit}
                type="button"
              >
                <EditIcon />
              </button>
              <button
                className="h-12 w-12 rounded-full bg-red-500 text-white shadow-lg transition-all duration-300 hover:bg-red-600"
                onClick={handleDelete}
                type="button"
              >
                <TrashIcon />
              </button>
            </div>
          </>
        );
      default:
        return (
          <div className="py-12 text-center">
            <h1 className="mb-4 font-bold text-2xl text-gray-900">
              {documentType} Document Details
            </h1>
            <p className="text-gray-600">Document ID: {documentId}</p>
            <p className="mt-2 text-gray-500">
              Design for {documentType} documents will be implemented later.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <DesktopHeader />
      <MobileHeader className="mb-2" showBorder title={headerTitle} />
      {isLoading ? (
        <>
          <div className="lg:hidden">
            <GenerationLoader fullscreen />
          </div>
          <div className="hidden lg:block">
            <div className="px-8 py-10">
              <GenerationLoader fullscreen={false} />
            </div>
          </div>
        </>
      ) : (
        <div className="relative flex min-h-[calc(100svh-72px)] w-full flex-col lg:min-h-[calc(100svh-56px)]">
          <Content />
        </div>
      )}
    </div>
  );
}
