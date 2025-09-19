'use client';

import React, { useState } from 'react';
import RefreshArrowsCircleIcon from '@/components/icons/RefreshArrowsCircleIcon';
import { Button } from '@/components/ui/button';
import ComingSoon from '@/components/ui/coming-soon';
import { Input } from '@/components/ui/input';

export default function BusinessSettingsPage() {
  const [expandedBusiness, setExpandedBusiness] = useState<string | null>(
    'detos-agency'
  );
  const [showAddNewBusiness, setShowAddNewBusiness] = useState(false);
  const [formData, setFormData] = useState({
    businessName: 'Detos Agency',
    industry: 'Tech',
    businessType: 'StartUp',
    totalEmployee: '5-10',
    monthlyRevenue: '10000$',
  });
  const [newBusinessData, setNewBusinessData] = useState({
    businessName: '',
    industry: '',
    businessType: '',
    totalEmployee: '',
    monthlyRevenue: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewBusinessInputChange = (field: string, value: string) => {
    setNewBusinessData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddNewBusiness = () => {
    if (
      newBusinessData.businessName.trim() &&
      newBusinessData.industry.trim()
    ) {
      // Handle add new business logic here
      setShowAddNewBusiness(false);
      setNewBusinessData({
        businessName: '',
        industry: '',
        businessType: '',
        totalEmployee: '',
        monthlyRevenue: '',
      });
    }
  };

  const handleUpdate = () => {
    // Handle update logic here
  };

  return (
    <ComingSoon />
    // <div className="w-full">
    //   {/* Header */}
    //   <div className="flex items-center justify-between mb-8">
    //     <h1 className="text-3xl font-bold text-gray-900">Business</h1>
    //     <Button
    //       onClick={handleUpdate}
    //       className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-5 py-3"
    //     >
    //       Update
    //     </Button>
    //   </div>

    //   {/* Business Cards */}
    //   <div className="space-y-6">
    //     <h2 className="text-xl font-semibold text-gray-900 mb-6">Business</h2>

    //     {/* Primary Business Card */}
    //     <div className="bg-purple-600 rounded-xl p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedBusiness(expandedBusiness === "detos-agency" ? null : "detos-agency")}>
    //       <span className="text-white font-medium">Detos Agency</span>
    //       <div className="flex items-center gap-2">
    //         <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
    //           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //             <path d={expandedBusiness === "detos-agency" ? "M6 9L12 15L18 9" : "M9 18L15 12L9 6"} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    //           </svg>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Expanded Business Details */}
    //     {expandedBusiness === "detos-agency" && (
    //       <div className="bg-white border-none space-y-6">
    //         {/* Business Name */}
    //         <div>
    //           <label htmlFor="businessName" className="block text-sm font-medium text-gray-900 mb-2">
    //             Business Name
    //           </label>
    //           <Input
    //             id="businessName"
    //             type="text"
    //             value={formData.businessName}
    //             onChange={(e) => handleInputChange("businessName", e.target.value)}
    //             className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
    //           />
    //         </div>

    //         {/* Industry */}
    //         <div>
    //           <label htmlFor="industry" className="block text-sm font-medium text-gray-900 mb-2">
    //             Industry
    //           </label>
    //           <Input
    //             id="industry"
    //             type="text"
    //             value={formData.industry}
    //             onChange={(e) => handleInputChange("industry", e.target.value)}
    //             className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
    //           />
    //         </div>

    //         {/* Business Type */}
    //         <div>
    //           <label htmlFor="businessType" className="block text-sm font-medium text-gray-900 mb-2">
    //             Business type
    //           </label>
    //           <Input
    //             id="businessType"
    //             type="text"
    //             value={formData.businessType}
    //             onChange={(e) => handleInputChange("businessType", e.target.value)}
    //             className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
    //           />
    //         </div>

    //         {/* Total Employee */}
    //         <div>
    //           <label htmlFor="totalEmployee" className="block text-sm font-medium text-gray-900 mb-2">
    //             Total Employee
    //           </label>
    //           <Input
    //             id="totalEmployee"
    //             type="text"
    //             value={formData.totalEmployee}
    //             onChange={(e) => handleInputChange("totalEmployee", e.target.value)}
    //             className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
    //           />
    //         </div>

    //         {/* Monthly Revenue */}
    //         <div>
    //           <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-gray-900 mb-2">
    //             Monthly Revenue
    //           </label>
    //           <Input
    //             id="monthlyRevenue"
    //             type="text"
    //             value={formData.monthlyRevenue}
    //             onChange={(e) => handleInputChange("monthlyRevenue", e.target.value)}
    //             className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
    //           />
    //         </div>
    //       </div>
    //     )}

    //     {/* Secondary Business Card */}
    //     <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
    //       <span className="text-gray-900 font-medium">Detos Agency</span>
    //       <div className="flex items-center gap-2">
    //         <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
    //           <RefreshArrowsCircleIcon size={14} color="text-gray-700" />
    //         </button>
    //         <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
    //           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //             <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    //           </svg>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Add New Business Button */}
    //     <Button
    //       variant="outline"
    //       className="border-purple-300 text-purple-700 hover:bg-purple-50 mt-6"
    //       onClick={() => setShowAddNewBusiness(!showAddNewBusiness)}
    //     >
    //       + Add New Business
    //     </Button>

    //     {/* Add New Business Form */}
    //     {showAddNewBusiness && (
    //       <div className="bg-white border-none rounded-lg space-y-6">
    //         <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>

    //         {/* Business Name */}
    //         <div>
    //           <label htmlFor="newBusinessName" className="block text-sm font-medium text-gray-900 mb-2">
    //             Business Name
    //           </label>
    //           <Input
    //             id="newBusinessName"
    //             type="text"
    //             value={newBusinessData.businessName}
    //             onChange={(e) => handleNewBusinessInputChange("businessName", e.target.value)}
    //             className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
    //             placeholder="Enter business name"
    //           />
    //         </div>

    //         {/* Industry */}
    //         <div>
    //           <label htmlFor="newIndustry" className="block text-sm font-medium text-gray-900 mb-2">
    //             Industry
    //           </label>
    //           <Input
    //             id="newIndustry"
    //             type="text"
    //             value={newBusinessData.industry}
    //             onChange={(e) => handleNewBusinessInputChange("industry", e.target.value)}
    //             className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
    //             placeholder="Enter industry"
    //           />
    //         </div>

    //         {/* Business Type */}
    //         <div>
    //           <label htmlFor="newBusinessType" className="block text-sm font-medium text-gray-900 mb-2">
    //             Business type
    //           </label>
    //           <Input
    //             id="newBusinessType"
    //             type="text"
    //             value={newBusinessData.businessType}
    //             onChange={(e) => handleNewBusinessInputChange("businessType", e.target.value)}
    //             className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
    //             placeholder="Enter business type"
    //           />
    //         </div>

    //         {/* Total Employee */}
    //         <div>
    //           <label htmlFor="newTotalEmployee" className="block text-sm font-medium text-gray-900 mb-2">
    //             Total Employee
    //           </label>
    //           <Input
    //             id="newTotalEmployee"
    //             type="text"
    //             value={newBusinessData.totalEmployee}
    //             onChange={(e) => handleNewBusinessInputChange("totalEmployee", e.target.value)}
    //             className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
    //             placeholder="Enter total employees"
    //           />
    //         </div>

    //         {/* Monthly Revenue */}
    //         <div>
    //           <label htmlFor="newMonthlyRevenue" className="block text-sm font-medium text-gray-900 mb-2">
    //             Monthly Revenue
    //           </label>
    //           <Input
    //             id="newMonthlyRevenue"
    //             type="text"
    //             value={newBusinessData.monthlyRevenue}
    //             onChange={(e) => handleNewBusinessInputChange("monthlyRevenue", e.target.value)}
    //             className="w-full h-12 px-5 py-3 border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
    //             placeholder="Enter monthly revenue"
    //           />
    //         </div>

    //         {/* Action Buttons */}
    //         <div className="flex gap-3 pt-4">
    //           <Button
    //             onClick={handleAddNewBusiness}
    //             className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3"
    //           >
    //             Add Business
    //           </Button>
    //           <Button
    //             variant="outline"
    //             onClick={() => setShowAddNewBusiness(false)}
    //             className="border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-3"
    //           >
    //             Cancel
    //           </Button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
}
