'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
// Per-page DashboardLayout removed so this page renders inside app/dashboard/layout.tsx
import DocumentHistory from '@/components/history/DocumentHistory';
// Import custom icons
import { GenerateIcon } from '@/components/icons/generate-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  generateBusinessProposal,
  generateContract,
  generateNDA,
  generatePartnershipAgreement,
  generatePrivacyPolicy,
  generateTermsOfService,
} from '@/lib/api/document';
import { getAllLogosForUser, type LogoResponse } from '@/lib/api/logo';
import {
  type DocumentGeneratorForm,
  documentGeneratorSchema,
} from '@/lib/validation/document';
import MobileHeader from '@/components/nav/MobileHeader';
import GeneratingLoader from '@/components/ui/generating-loader';
// Field components per document type
import BusinessProposalFields from './components/BusinessProposalFields';
import ContractFields from './components/ContractFields';
import NDAFields from './components/NDAFields';
import PartnershipAgreementFields from './components/PartnershipAgreementFields';
import PrivacyPolicyFields from './components/PrivacyPolicyFields';
import TermsOfServiceFields from './components/TermsOfServiceFields';

const documentTypes = [
  { value: 'business-proposal', label: 'Business Proposal' },
  { value: 'partnership-agreement', label: 'Partnership Agreement' },
  { value: 'nda', label: 'NDA' },
  { value: 'contract', label: 'Contract' },
  { value: 'terms-of-service', label: 'Terms of Service' },
  { value: 'privacy-policy', label: 'Privacy Policy' },
];

// moved to lib/validation/document.ts

// using type from lib/validation/document

// Utility to extract user_id from JWT in access_token cookie
function getUserIdFromToken(): number | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || null;
  } catch {
    return null;
  }
}

export default function DocumentGeneratorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('document-generator');
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<string>('business-proposal');
  const [userLogos, setUserLogos] = useState<LogoResponse[]>([]);
  const [isLoadingLogos, setIsLoadingLogos] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingBusinessProposal, setIsGeneratingBusinessProposal] =
    useState(false);
  const [isGeneratingPartnership, setIsGeneratingPartnership] = useState(false);
  const [isGeneratingNda, setIsGeneratingNda] = useState(false);
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);
  const [isGeneratingTos, setIsGeneratingTos] = useState(false);
  const [isGeneratingPrivacyPolicy, setIsGeneratingPrivacyPolicy] =
    useState(false);

  const form = useForm<DocumentGeneratorForm>({
    resolver: zodResolver(documentGeneratorSchema),
    defaultValues: {
      documentType: 'business-proposal',
      // Business Proposal fields
      company_name: '',
      client_name: '',
      project_title: '',
      project_description: '',
      services_offered: '',
      timeline: '',
      budget_range: '',
      contact_person: '',
      contact_email: '',
      logo_url: '',
      // Partnership Agreement fields
      party1_name: '',
      party1_address: '',
      party2_name: '',
      party2_address: '',
      partnership_purpose: '',
      partnership_duration: '',
      profit_sharing_ratio: '',
      responsibilities_party1: '',
      responsibilities_party2: '',
      effective_date: '',
      // Legacy fields for backward compatibility
      businessName: '',
      problem: '',
      solution: '',
      additional: '',
      partner1Name: '',
      partner2Name: '',
      businessPurpose: '',
      startDate: '',
      endDate: '',
      disclosingPartyName: '',
      receivingPartyName: '',
      purposeOfDisclosure: '',
      ndaStartDate: '',
      ndaEndDate: '',
      // Contract fields
      contract_type: '',
      service_description: '',
      contract_value: '',
      payment_terms: '',
      deliverables: '',
      terms_conditions: '',
      // Terms of Service fields (scoped under tos_*)
      tos_company_name: '',
      tos_website_url: '',
      tos_company_address: '',
      tos_service_description: '',
      tos_user_responsibilities: '',
      tos_prohibited_activities: '',
      tos_payment_terms: '',
      tos_cancellation_policy: '',
      tos_limitation_of_liability: '',
      tos_governing_law: '',
      tos_contact_email: '',
    },
  });

  // Load user logos on component mount
  useEffect(() => {
    const loadUserLogos = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;

      setIsLoadingLogos(true);
      try {
        const logos = await getAllLogosForUser(userId);
        setUserLogos(logos);
      } catch {
        toast.error('Failed to load logos');
      } finally {
        setIsLoadingLogos(false);
      }
    };

    loadUserLogos();
  }, []);

  // History fetching, view, and deletion are moved into DocumentHistory component

  const onSubmit = async (data: DocumentGeneratorForm) => {
    // Form submission handled below

    // Convert "no-logo" to empty string for API
    const formData = {
      ...data,
      logo_url: data.logo_url === 'no-logo' ? '' : data.logo_url,
    };

    // Normalize optional fields

    if (selectedDocumentType === 'business-proposal') {
      setIsGeneratingBusinessProposal(true);
      setIsGenerating(true);
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          setIsGenerating(false);
          toast.error('User not authenticated');
          return;
        }

        // Process services_offered into array
        const services_offered = formData.services_offered
          ? formData.services_offered
              .split(/[,\n]/)
              .map((service) => service.trim())
              .filter((service) => service.length > 0)
          : [];

        const businessProposalData = {
          user_id: userId,
          company_name: formData.company_name || '',
          client_name: formData.client_name || '',
          project_title: formData.project_title || '',
          project_description: formData.project_description || '',
          services_offered,
          timeline: formData.timeline || '',
          budget_range: formData.budget_range || '',
          contact_person: formData.contact_person || '',
          contact_email: formData.contact_email || '',
          logo_url: formData.logo_url || '',
        };

        const response = await generateBusinessProposal(businessProposalData);

        toast.success('Business proposal generated successfully!');

        // Navigate to the document details page
        router.push(`/dashboard/document-generator/business-proposal/${response.id}`);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            'Failed to generate business proposal'
        );
      } finally {
        setIsGenerating(false);
        setIsGeneratingBusinessProposal(false);
      }
    } else if (selectedDocumentType === 'partnership-agreement') {
      setIsGeneratingPartnership(true);
      setIsGenerating(true);
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          setIsGenerating(false);
          toast.error('User not authenticated');
          return;
        }

        // Process responsibilities into arrays
        const responsibilities_party1 = formData.responsibilities_party1
          ? formData.responsibilities_party1
              .split(/[,\n]/)
              .map((resp) => resp.trim())
              .filter((resp) => resp.length > 0)
          : [];

        const responsibilities_party2 = formData.responsibilities_party2
          ? formData.responsibilities_party2
              .split(/[,\n]/)
              .map((resp) => resp.trim())
              .filter((resp) => resp.length > 0)
          : [];

        const partnershipAgreementData = {
          user_id: userId,
          party1_name: formData.party1_name || '',
          party1_address: formData.party1_address || '',
          party2_name: formData.party2_name || '',
          party2_address: formData.party2_address || '',
          partnership_purpose: formData.partnership_purpose || '',
          partnership_duration: formData.partnership_duration || '',
          profit_sharing_ratio: formData.profit_sharing_ratio || '',
          responsibilities_party1,
          responsibilities_party2,
          effective_date: formData.effective_date || '',
          logo_url: formData.logo_url || '',
        };

        const response = await generatePartnershipAgreement(
          partnershipAgreementData
        );

        toast.success('Partnership agreement generated successfully!');

        // Navigate to the document details page
        router.push(`/dashboard/document-generator/partnership-agreement/${response.id}`);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            'Failed to generate partnership agreement'
        );
      } finally {
        setIsGenerating(false);
        setIsGeneratingPartnership(false);
      }
    } else if (selectedDocumentType === 'nda') {
      setIsGeneratingNda(true);
      setIsGenerating(true);
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          setIsGenerating(false);
          toast.error('User not authenticated');
          return;
        }

        const ndaData = {
          user_id: userId,
          disclosing_party: formData.disclosing_party || '',
          receiving_party: formData.receiving_party || '',
          purpose: formData.purpose || '',
          confidential_info_description:
            formData.confidential_info_description || '',
          duration: formData.duration || '',
          governing_law: formData.governing_law || '',
          effective_date: formData.effective_date || '',
          logo_url: formData.logo_url || '',
        };

        const response = await generateNDA(ndaData);

        toast.success('NDA generated successfully!');

        // Navigate to the document details page
        router.push(`/dashboard/document-generator/nda/${response.id}`);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            'Failed to generate NDA'
        );
      } finally {
        setIsGenerating(false);
        setIsGeneratingNda(false);
      }
    } else if (selectedDocumentType === 'contract') {
      setIsGeneratingContract(true);
      setIsGenerating(true);
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          setIsGenerating(false);
          toast.error('User not authenticated');
          return;
        }

        // Process list fields into arrays
        const deliverables =
          formData.deliverables || ''
            ? (formData.deliverables as string)
                .split(/[,\n]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            : [];

        const terms_conditions =
          formData.terms_conditions || ''
            ? (formData.terms_conditions as string)
                .split(/[,\n]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            : [];

        const contractData = {
          user_id: userId,
          contract_type: formData.contract_type || '',
          party1_name: formData.party1_name || '',
          party1_address: formData.party1_address || '',
          party2_name: formData.party2_name || '',
          party2_address: formData.party2_address || '',
          service_description: formData.service_description || '',
          contract_value: formData.contract_value || '',
          payment_terms: formData.payment_terms || '',
          duration: formData.duration || '',
          deliverables,
          terms_conditions,
          effective_date: formData.effective_date || '',
          logo_url: formData.logo_url || '',
        };

        const response = await generateContract(contractData);
        toast.success('Contract generated successfully!');
        router.push(`/dashboard/document-generator/contract/${response.id}`);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            'Failed to generate Contract'
        );
      } finally {
        setIsGenerating(false);
        setIsGeneratingContract(false);
      }
    } else if (selectedDocumentType === 'terms-of-service') {
      setIsGeneratingTos(true);
      setIsGenerating(true);
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          setIsGenerating(false);
          toast.error('User not authenticated');
          return;
        }

        const user_responsibilities =
          formData.tos_user_responsibilities || ''
            ? (formData.tos_user_responsibilities as string)
                .split(/[,\n]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            : [];

        const prohibited_activities =
          formData.tos_prohibited_activities || ''
            ? (formData.tos_prohibited_activities as string)
                .split(/[,\n]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            : [];

        const tosData = {
          user_id: userId,
          company_name: formData.tos_company_name || '',
          website_url: formData.tos_website_url || '',
          company_address: formData.tos_company_address || '',
          service_description: formData.tos_service_description || '',
          user_responsibilities,
          prohibited_activities,
          payment_terms: formData.tos_payment_terms || '',
          cancellation_policy: formData.tos_cancellation_policy || '',
          limitation_of_liability: formData.tos_limitation_of_liability || '',
          governing_law: formData.tos_governing_law || '',
          contact_email: formData.tos_contact_email || '',
          logo_url: formData.logo_url || '',
        };

        const response = await generateTermsOfService(tosData);
        toast.success('Terms of Service generated successfully!');
        router.push(`/dashboard/document-generator/terms-of-service/${response.id}`);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            'Failed to generate Terms of Service'
        );
      } finally {
        setIsGenerating(false);
        setIsGeneratingTos(false);
      }
    } else if (selectedDocumentType === 'privacy-policy') {
      setIsGeneratingPrivacyPolicy(true);
      setIsGenerating(true);
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          setIsGenerating(false);
          toast.error('User not authenticated');
          return;
        }

        // Lists -> arrays
        const data_collected =
          formData.pp_data_collected || ''
            ? (formData.pp_data_collected as string)
                .split(/[,\n]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            : [];

        const data_usage_purpose =
          formData.pp_data_usage_purpose || ''
            ? (formData.pp_data_usage_purpose as string)
                .split(/[,\n]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            : [];

        const user_rights =
          formData.pp_user_rights || ''
            ? (formData.pp_user_rights as string)
                .split(/[,\n]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            : [];

        const ppData = {
          user_id: userId,
          company_name: formData.pp_company_name || '',
          website_url: formData.pp_website_url || '',
          company_address: formData.pp_company_address || '',
          data_collected,
          data_usage_purpose,
          third_party_sharing: formData.pp_third_party_sharing || '',
          data_retention_period: formData.pp_data_retention_period || '',
          user_rights,
          cookies_usage: formData.pp_cookies_usage || '',
          contact_email: formData.pp_contact_email || '',
          governing_law: formData.pp_governing_law || '',
          effective_date: formData.pp_effective_date || '',
          logo_url: formData.logo_url || '',
        };

        const response = await generatePrivacyPolicy(ppData);
        toast.success('Privacy Policy generated successfully!');
        router.push(`/dashboard/document-generator/privacy-policy/${response.id}`);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            'Failed to generate Privacy Policy'
        );
      } finally {
        setIsGenerating(false);
        setIsGeneratingPrivacyPolicy(false);
      }
    }
  };

  return (
    <div className="space-y-6 w-full max-w-none relative">
        {/* Full-screen overlay only on mobile/tablet; desktop uses contained loader */}
        {isGenerating && (
          <div className="fixed inset-0 z-[9999] lg:hidden">
            <GeneratingLoader isVisible variant="full" />
          </div>
        )}

        {/* Mobile header (hidden on lg+), sits above tabs */}
        <MobileHeader className="bg-white relative z-[10000]" showBorder title="Document Generate" />
        <div className="w-full">
          <div>
            <Tabs
              onValueChange={(value) => setActiveTab(value)}
              value={activeTab}
            >
              <TabsList className="mb-6">
                <TabsTrigger value="document-generator">
                  Document Generate
                </TabsTrigger>
                <TabsTrigger value="previous-history">
                  Previous History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="document-generator">
                <div className="w-full">
                  <div className={`space-y-6 ${isGenerating ? 'hidden' : ''}`}>
                    <div>
                      <h2 className="mb-2 font-bold text-3xl text-gray-900">
                        What type of Document you need?
                      </h2>
                      <p className="text-gray-600 text-lg">
                        No design skills? No problem. Just tell us your brand
                        name—we'll handle the creativity.
                      </p>
                    </div>

                    <form
                      className="space-y-6"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      {/* Document Type Selection */}
                      <div className="space-y-4">
                        <Label className="font-semibold text-lg">
                          Select Document Type
                        </Label>
                        <div className="flex flex-wrap gap-3">
                          {documentTypes.map((type) => (
                            <Button
                              className="rounded-[100px] px-6 py-2 font-medium text-[14px]"
                              key={type.value}
                              onClick={() => {
                                setSelectedDocumentType(type.value);
                                form.setValue('documentType', type.value);
                              }}
                              type="button"
                              variant={
                                selectedDocumentType === type.value
                                  ? 'default'
                                  : 'outline'
                              }
                            >
                              {type.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-6">
                        {/* Business Proposal Fields */}
                        {selectedDocumentType === 'business-proposal' && (
                          <BusinessProposalFields
                            form={form}
                            isLoadingLogos={isLoadingLogos}
                            userLogos={userLogos}
                          />
                        )}

                        {/* Terms of Service Fields */}
                        {selectedDocumentType === 'terms-of-service' && (
                          <TermsOfServiceFields
                            form={form}
                            isLoadingLogos={isLoadingLogos}
                            userLogos={userLogos}
                          />
                        )}

                        {/* Partnership Agreement Fields */}
                        {selectedDocumentType === 'partnership-agreement' && (
                          <PartnershipAgreementFields
                            form={form}
                            isLoadingLogos={isLoadingLogos}
                            userLogos={userLogos}
                          />
                        )}

                        {selectedDocumentType === 'nda' && (
                          <NDAFields
                            form={form}
                            isLoadingLogos={isLoadingLogos}
                            userLogos={userLogos}
                          />
                        )}

                        {/* Privacy Policy Fields */}
                        {selectedDocumentType === 'privacy-policy' && (
                          <PrivacyPolicyFields
                            form={form}
                            isLoadingLogos={isLoadingLogos}
                            userLogos={userLogos}
                          />
                        )}

                        {/* Contract Fields */}
                        {selectedDocumentType === 'contract' && (
                          <ContractFields
                            form={form}
                            isLoadingLogos={isLoadingLogos}
                            userLogos={userLogos}
                          />
                        )}
                      </div>

                      {/* Generate Button */}
                      <Button
                        className="flex w-full items-center justify-center gap-3 rounded-full bg-primary-600 font-medium text-lg text-white hover:bg-primary-700"
                        disabled={isGenerating}
                        style={{
                          paddingTop: '16px',
                          paddingBottom: '16px',
                          paddingLeft: '24px',
                          paddingRight: '24px',
                        }}
                        type="submit"
                      >
                        <div className="flex h-6 w-6 items-center justify-center">
                          <GenerateIcon size={24} />
                        </div>
                        <span className="font-medium text-base">
                          {isGenerating ? 'Generating...' : 'Generate Document'}
                        </span>
                      </Button>
                    </form>
                  </div>
                </div>
                {/* Desktop-contained loader mirrors history loader layout */}
                {isGenerating ? (
                  <div className="hidden lg:block">
                    <GeneratingLoader isVisible variant="contained" />
                  </div>
                ) : null}
              </TabsContent>

              <TabsContent value="previous-history">
                <DocumentHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
  </div>
  );
}
