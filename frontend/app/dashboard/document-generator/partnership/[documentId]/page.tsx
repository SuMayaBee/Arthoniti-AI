"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
// DashboardLayout is provided by app/dashboard/layout.tsx — do not wrap pages here
import DownloadIcon from "@/components/icons/DownloadIcon";
import EditPencilLineIcon from "@/components/icons/EditPencilLineIcon";
import TrashCanIcon from "@/components/icons/TrashCanIcon";
import { GenerateIcon } from "@/components/icons/generate-icon";

export default function PartnershipAgreementDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  // Mock data - in real app this would come from API
  const document = {
    id: documentId,
    title: "Partnership Agreement",
    company: "Business Partners LLC",
    date: "July 25, 2025",
    phone: "+123-456-7890",
    address: "123 Partnership Ave., Business City, BC 12345",
    website: "www.businesspartners.com",
    content: {
      partner1Name: "Matt Zhang",
      partner2Name: "Anna Katrina Marchesi",
      businessPurpose: "To establish a joint venture for technology consulting services",
      startDate: "01/08/2025",
      endDate: "01/08/2030",
      additional: "This partnership will focus on providing innovative technology solutions to small and medium enterprises"
    }
  };

  const handleBack = () => {
    router.push("/dashboard/document-generator");
  };

  const handleDownload = (format: "docx" | "pdf") => {
    console.log(`Downloading partnership agreement as ${format}`);
    // Implement download logic
  };

  const handleEdit = () => {
    console.log("Edit partnership agreement");
    // Implement edit logic
  };

  const handleDelete = () => {
    console.log("Delete partnership agreement");
    // Implement delete logic
  };

  const handleGenerate = () => {
    console.log("Generate new partnership agreement");
    router.push("/dashboard/document-generator");
  };

  return (
    <div className="w-full">
      {/* Header with Back Button */}
      <BackButton onClick={handleBack} />

      {/* Full-width border below header */}
      <div className="w-full h-[1px] bg-gray-200"></div>

      {/* Main Content */}
      <div className="relative w-full h-[calc(100vh-180px)] flex">
        {/* Left Content Area - Scrollable */}
        <div className="flex-1 flex flex-col pr-14 p-0">
          {/* Download Buttons - Top Right */}
          <div className="flex justify-end gap-4 my-5 mr-4">
            <Button
              onClick={() => handleDownload("docx")}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 border-primary-500 bg-white hover:bg-purple-50 rounded-full"
            >
              <DownloadIcon size={16} color="#1C274C" />
              DOCX
            </Button>
            <Button
              onClick={() => handleDownload("pdf")}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 border-primary-500 bg-white hover:bg-purple-50 rounded-full"
            >
              <DownloadIcon size={16} color="#1C274C" />
              PDF
            </Button>
          </div>

          {/* Scrollable Document Area */}
          <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
            <div className="space-y-6">
              {/* Main Document - A4 Ratio */}
              <div className="bg-white rounded-2xl border-2 p-8 relative overflow-hidden h-[73vh]">
                {/* Document Header */}
                <div className="flex justify-between items-start mb-12">
                  <span className="text-sm font-medium text-blue-600">{document.company}</span>
                  <span className="text-sm font-medium text-blue-600">{document.date}</span>
                </div>

                {/* Document Title */}
                <div className="text-center mb-16">
                  <h1 className="text-6xl font-bold text-blue-600 mb-4">
                    {document.title}
                  </h1>
                  <div className="w-72 h-1 bg-blue-600 mx-auto"></div>
                </div>

                {/* Document Content */}
                <div className="space-y-8 text-gray-800">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-3">Partner 1</h3>
                    <p className="text-lg">{document.content.partner1Name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-3">Partner 2</h3>
                    <p className="text-lg">{document.content.partner2Name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-3">Business Purpose</h3>
                    <p className="text-lg">{document.content.businessPurpose}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-600 mb-3">Start Date</h3>
                      <p className="text-lg">{document.content.startDate}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-600 mb-3">End Date</h3>
                      <p className="text-lg">{document.content.endDate}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="absolute bottom-8 left-8">
                  <div className="flex gap-8 text-sm text-blue-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {document.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {document.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {document.website}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Content Section */}
              <div className="bg-white rounded-2xl border-2 p-8 relative overflow-hidden h-[73vh]">
                {/* Document Header */}
                <div className="flex justify-between items-start mb-12">
                  <span className="text-sm font-medium text-blue-600">{document.company}</span>
                  <span className="text-sm font-medium text-blue-600">{document.date}</span>
                </div>

                {/* Additional Content */}
                <div className="space-y-8 text-gray-800">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-3">Additional Terms</h3>
                    <p className="text-lg">{document.content.additional}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-3">1. Name and Business Purpose</h3>
                    <p className="text-lg">The partners hereby form a partnership under the name of {document.company} for the purpose of {document.content.businessPurpose.toLowerCase()}.</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-3">2. Partnership Duration</h3>
                    <p className="text-lg">This partnership shall commence on {document.content.startDate} and shall continue until {document.content.endDate}, unless terminated earlier in accordance with the terms herein.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons - Right Side Middle */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-10">
          {/* Generate Button */}
          <div
            className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
          </div>

          {/* Edit Button */}
          <Button
            onClick={handleEdit}
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full border-purple-300 bg-purple-50 hover:bg-purple-100 hover:text-purple-600 shadow-lg text-purple-600"
          >
            <EditPencilLineIcon size={24} />
          </Button>

          {/* Delete Button */}
          <Button
            onClick={handleDelete}
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full border-red-300 bg-red-50 hover:bg-red-100 hover:text-red-600 shadow-lg text-red-600"
          >
            <TrashCanIcon size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}
