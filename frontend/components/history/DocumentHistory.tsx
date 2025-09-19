"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { StarIcon } from "@/components/icons/star-icon";
import {
  getAllBusinessProposalsForUser,
  deleteBusinessProposal,
  type BusinessProposalResponse,
  getAllPartnershipAgreementsForUser,
  deletePartnershipAgreement,
  type PartnershipAgreementResponse,
  getAllNDAsForUser,
  deleteNDA,
  type NDAResponse,
  getAllContractsForUser,
  deleteContract,
  type ContractResponse,
  getAllTermsOfServiceForUser,
  deleteTermsOfService,
  type TermsOfServiceResponse,
  getAllPrivacyPoliciesForUser,
  deletePrivacyPolicy,
  type PrivacyPolicyResponse,
} from "@/lib/api/document";
import { toast } from "sonner";
import HistoryLoader from "@/components/history-loader";

function getUserIdFromToken(): number | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || null;
  } catch {
    return null;
  }
}

export default function DocumentHistory() {
  const router = useRouter();

  const [businessProposals, setBusinessProposals] = useState<BusinessProposalResponse[]>([]);
  const [partnershipAgreements, setPartnershipAgreements] = useState<PartnershipAgreementResponse[]>([]);
  const [ndas, setNdas] = useState<NDAResponse[]>([]);
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [tosList, setTosList] = useState<TermsOfServiceResponse[]>([]);
  const [privacyPolicies, setPrivacyPolicies] = useState<PrivacyPolicyResponse[]>([]);

  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Filter state: controls which document type to show
  const [activeFilter, setActiveFilter] = useState<
    | "all"
    | "business-proposal"
    | "partnership-agreement"
    | "nda"
    | "contract"
    | "terms-of-service"
    | "privacy-policy"
  >("all");

  // Derived counts to decide empty state per filter
  const hasAnyForCurrentFilter = (() => {
    if (activeFilter === "business-proposal") return businessProposals.length > 0;
    if (activeFilter === "partnership-agreement") return partnershipAgreements.length > 0;
    if (activeFilter === "nda") return ndas.length > 0;
    if (activeFilter === "contract") return contracts.length > 0;
    if (activeFilter === "terms-of-service") return tosList.length > 0;
    if (activeFilter === "privacy-policy") return privacyPolicies.length > 0;
    // all
    return (
      businessProposals.length > 0 ||
      partnershipAgreements.length > 0 ||
      ndas.length > 0 ||
      contracts.length > 0 ||
      tosList.length > 0 ||
      privacyPolicies.length > 0
    );
  })();

  const [proposalToDelete, setProposalToDelete] = useState<BusinessProposalResponse | null>(null);
  const [isDeletingProposal, setIsDeletingProposal] = useState(false);

  const [partnershipToDelete, setPartnershipToDelete] = useState<PartnershipAgreementResponse | null>(null);
  const [isDeletingPartnership, setIsDeletingPartnership] = useState(false);

  const [ndaToDelete, setNdaToDelete] = useState<NDAResponse | null>(null);
  const [isDeletingNda, setIsDeletingNda] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<ContractResponse | null>(null);
  const [isDeletingContract, setIsDeletingContract] = useState(false);
  const [tosToDelete, setTosToDelete] = useState<TermsOfServiceResponse | null>(null);
  const [isDeletingTos, setIsDeletingTos] = useState(false);
  const [ppToDelete, setPpToDelete] = useState<PrivacyPolicyResponse | null>(null);
  const [isDeletingPp, setIsDeletingPp] = useState(false);

  useEffect(() => {
    const loadAllHistory = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;
      setIsLoadingHistory(true);
      try {
        const [proposals, partnerships, ndaList, contractList, tosDocs, ppDocs] = await Promise.all([
          getAllBusinessProposalsForUser(userId),
          getAllPartnershipAgreementsForUser(userId),
          getAllNDAsForUser(userId),
          getAllContractsForUser(userId),
          getAllTermsOfServiceForUser(userId),
          getAllPrivacyPoliciesForUser(userId),
        ]);
        setBusinessProposals(proposals);
        setPartnershipAgreements(partnerships);
        setNdas(ndaList);
        setContracts(contractList);
        setTosList(tosDocs);
        setPrivacyPolicies(ppDocs);
      } catch (error) {
        console.error("Error loading document history:", error);
        toast.error("Failed to load document history");
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadAllHistory();
  }, []);

  const handleViewBusinessProposal = (id: number) => {
    router.push(`/dashboard/document-generator/business-proposal/${id}`);
  };
  const handleViewPartnershipAgreement = (id: number) => {
    router.push(`/dashboard/document-generator/partnership-agreement/${id}`);
  };
  const handleViewNda = (id: number) => {
    router.push(`/dashboard/document-generator/nda/${id}`);
  };
  const handleViewContract = (id: number) => {
    router.push(`/dashboard/document-generator/contract/${id}`);
  };
  const handleViewTos = (id: number) => {
    router.push(`/dashboard/document-generator/terms-of-service/${id}`);
  };
  const handleViewPrivacyPolicy = (id: number) => {
    router.push(`/dashboard/document-generator/privacy-policy/${id}`);
  };

  const handleDeleteBusinessProposal = async () => {
    if (!proposalToDelete) return;
    setIsDeletingProposal(true);
    try {
      await deleteBusinessProposal(proposalToDelete.id);
      setBusinessProposals((prev) => prev.filter((p) => p.id !== proposalToDelete.id));
      toast.success("Business proposal deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete business proposal:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete business proposal");
    } finally {
      setIsDeletingProposal(false);
      setProposalToDelete(null);
    }
  };

  const handleDeletePartnershipAgreement = async () => {
    if (!partnershipToDelete) return;
    setIsDeletingPartnership(true);
    try {
      await deletePartnershipAgreement(partnershipToDelete.id);
      setPartnershipAgreements((prev) => prev.filter((p) => p.id !== partnershipToDelete.id));
      toast.success("Partnership agreement deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete partnership agreement:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete partnership agreement");
    } finally {
      setIsDeletingPartnership(false);
      setPartnershipToDelete(null);
    }
  };

  const handleDeleteNda = async () => {
    if (!ndaToDelete) return;
    setIsDeletingNda(true);
    try {
      await deleteNDA(ndaToDelete.id);
      setNdas((prev) => prev.filter((n) => n.id !== ndaToDelete.id));
      toast.success("NDA deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete NDA:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete NDA");
    } finally {
      setIsDeletingNda(false);
      setNdaToDelete(null);
    }
  };

  const handleDeleteContract = async () => {
    if (!contractToDelete) return;
    setIsDeletingContract(true);
    try {
      await deleteContract(contractToDelete.id);
      setContracts((prev) => prev.filter((c) => c.id !== contractToDelete.id));
      toast.success("Contract deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete Contract:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete Contract");
    } finally {
      setIsDeletingContract(false);
      setContractToDelete(null);
    }
  };

  const handleDeleteTos = async () => {
    if (!tosToDelete) return;
    setIsDeletingTos(true);
    try {
      await deleteTermsOfService(tosToDelete.id);
      setTosList((prev) => prev.filter((t) => t.id !== tosToDelete.id));
      toast.success("Terms of Service deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete Terms of Service:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete Terms of Service");
    } finally {
      setIsDeletingTos(false);
      setTosToDelete(null);
    }
  };

  const handleDeletePrivacyPolicy = async () => {
    if (!ppToDelete) return;
    setIsDeletingPp(true);
    try {
      await deletePrivacyPolicy(ppToDelete.id);
      setPrivacyPolicies((prev) => prev.filter((p) => p.id !== ppToDelete.id));
      toast.success("Privacy Policy deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete Privacy Policy:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete Privacy Policy");
    } finally {
      setIsDeletingPp(false);
      setPpToDelete(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          className="rounded-full px-6 py-2 text-sm font-medium"
          onClick={() => setActiveFilter("all")}
        >
          All
        </Button>
        <Button
          variant={activeFilter === "business-proposal" ? "default" : "outline"}
          className="rounded-full px-6 py-2 text-sm font-medium"
          onClick={() => setActiveFilter("business-proposal")}
        >
          Business Proposal
        </Button>
        <Button
          variant={activeFilter === "partnership-agreement" ? "default" : "outline"}
          className="rounded-full px-6 py-2 text-sm font-medium"
          onClick={() => setActiveFilter("partnership-agreement")}
        >
          Partnership Agreement
        </Button>
        <Button
          variant={activeFilter === "nda" ? "default" : "outline"}
          className="rounded-full px-6 py-2 text-sm font-medium"
          onClick={() => setActiveFilter("nda")}
        >
          NDA
        </Button>
        <Button
          variant={activeFilter === "contract" ? "default" : "outline"}
          className="rounded-full px-6 py-2 text-sm font-medium"
          onClick={() => setActiveFilter("contract")}
        >
          Contract
        </Button>
        <Button
          variant={activeFilter === "terms-of-service" ? "default" : "outline"}
          className="rounded-full px-6 py-2 text-sm font-medium"
          onClick={() => setActiveFilter("terms-of-service")}
        >
          Terms of Service
        </Button>
        <Button
          variant={activeFilter === "privacy-policy" ? "default" : "outline"}
          className="rounded-full px-6 py-2 text-sm font-medium"
          onClick={() => setActiveFilter("privacy-policy")}
        >
          Privacy Policy
        </Button>
      </div>

      {/* Document Cards Grid */}
      {isLoadingHistory ? (
        <HistoryLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {!hasAnyForCurrentFilter ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600 mb-4">No documents found</p>
              <p className="text-sm text-gray-500">Generate your first document to see it here</p>
            </div>
          </div>
        ) : (
          <>
            {/* Business Proposal Cards */}
            {(activeFilter === 'all' || activeFilter === 'business-proposal') && businessProposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="bg-gray-50 rounded-lg p-4 mb-4 h-[340px] flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    {proposal.input_data?.logo_url && (
                      <img
                        src={proposal.input_data.logo_url}
                        alt="Company Logo"
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <h4 className="text-black font-medium text-sm">{proposal.company_name}</h4>
                  </div>
                  <h3 className="text-black font-bold text-lg mb-4">Business Proposal</h3>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>Project:</strong> {proposal.project_title}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Client:</strong> {proposal.client_name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Contact:</strong> {proposal.contact_person}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Email:</strong> {proposal.contact_email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{new Date(proposal.created_at).toLocaleDateString()}</span>
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
                        onClick={() => setProposalToDelete(proposal)}
                        disabled={isDeletingProposal}
                      >
                        {isDeletingProposal ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Business Proposal</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{proposal.project_title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteBusinessProposal} disabled={isDeletingProposal} className="bg-red-600 hover:bg-red-700">
                          {isDeletingProposal ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="outline"
                    className="flex-1 px-6 py-3 rounded-full border-primary-500 text-primary-500 hover:bg-primary-50"
                    onClick={() => handleViewBusinessProposal(proposal.id)}
                    disabled={isDeletingProposal}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}

            {/* Privacy Policy Cards */}
            {(activeFilter === 'all' || activeFilter === 'privacy-policy') && privacyPolicies.map((pp) => (
              <div key={pp.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="bg-gray-50 rounded-lg p-4 mb-4 h-[340px] flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    {pp.input_data?.logo_url && (
                      <img
                        src={pp.input_data.logo_url}
                        alt="Company Logo"
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <h4 className="text-black font-medium text-sm">{pp.company_name}</h4>
                  </div>
                  <h3 className="text-black font-bold text-lg mb-4">Privacy Policy</h3>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>Website:</strong> {pp.website_url}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Effective:</strong> {pp.input_data?.effective_date || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{new Date(pp.created_at).toLocaleDateString()}</span>
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
                        onClick={() => setPpToDelete(pp)}
                        disabled={isDeletingPp}
                      >
                        {isDeletingPp ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Privacy Policy</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this Privacy Policy? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePrivacyPolicy} disabled={isDeletingPp} className="bg-red-600 hover:bg-red-700">
                          {isDeletingPp ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="outline"
                    className="flex-1 px-6 py-3 rounded-full border-primary-500 text-primary-500 hover:bg-primary-50"
                    onClick={() => handleViewPrivacyPolicy(pp.id)}
                    disabled={isDeletingPp}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}

            {/* Terms of Service Cards */}
            {(activeFilter === 'all' || activeFilter === 'terms-of-service') && tosList.map((tos) => (
              <div key={tos.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="bg-gray-50 rounded-lg p-4 mb-4 h-[340px] flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    {tos.input_data?.logo_url && (
                      <img
                        src={tos.input_data.logo_url}
                        alt="Company Logo"
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <h4 className="text-black font-medium text-sm">{tos.company_name}</h4>
                  </div>
                  <h3 className="text-black font-bold text-lg mb-4">Terms of Service</h3>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>Website:</strong> {tos.website_url}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Service:</strong> {tos.service_description?.slice(0, 60)}{tos.service_description && tos.service_description.length > 60 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{new Date(tos.created_at).toLocaleDateString()}</span>
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
                        onClick={() => setTosToDelete(tos)}
                        disabled={isDeletingTos}
                      >
                        {isDeletingTos ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Terms of Service</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this Terms of Service? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTos} disabled={isDeletingTos} className="bg-red-600 hover:bg-red-700">
                          {isDeletingTos ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="outline"
                    className="flex-1 px-6 py-3 rounded-full border-primary-500 text-primary-500 hover:bg-primary-50"
                    onClick={() => handleViewTos(tos.id)}
                    disabled={isDeletingTos}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}

            {/* Contract Cards */}
            {(activeFilter === 'all' || activeFilter === 'contract') && contracts.map((contract) => (
              <div key={contract.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="bg-gray-50 rounded-lg p-4 mb-4 h-[340px] flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    {contract.input_data?.logo_url && (
                      <img
                        src={contract.input_data.logo_url}
                        alt="Company Logo"
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <h4 className="text-black font-medium text-sm">{contract.contract_type}</h4>
                  </div>
                  <h3 className="text-black font-bold text-lg mb-4">Contract</h3>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>Party 1:</strong> {contract.party1_name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Party 2:</strong> {contract.party2_name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Service:</strong> {contract.service_description?.slice(0, 60)}{contract.service_description && contract.service_description.length > 60 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{new Date(contract.created_at).toLocaleDateString()}</span>
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
                        onClick={() => setContractToDelete(contract)}
                        disabled={isDeletingContract}
                      >
                        {isDeletingContract ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Contract</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this contract? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteContract} disabled={isDeletingContract} className="bg-red-600 hover:bg-red-700">
                          {isDeletingContract ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="outline"
                    className="flex-1 px-6 py-3 rounded-full border-primary-500 text-primary-500 hover:bg-primary-50"
                    onClick={() => handleViewContract(contract.id)}
                    disabled={isDeletingContract}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}

            {/* Partnership Agreement Cards */}
            {(activeFilter === 'all' || activeFilter === 'partnership-agreement') && partnershipAgreements.map((partnership) => (
              <div key={partnership.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="bg-gray-50 rounded-lg p-4 mb-4 h-[340px] flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    {partnership.input_data?.logo_url && (
                      <img
                        src={partnership.input_data.logo_url}
                        alt="Company Logo"
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <h4 className="text-black font-medium text-sm">Partnership Agreement</h4>
                  </div>
                  <h3 className="text-black font-bold text-lg mb-4">Partnership Agreement</h3>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>Party 1:</strong> {partnership.party1_name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Party 2:</strong> {partnership.party2_name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Purpose:</strong> {partnership.partnership_purpose}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{new Date(partnership.created_at).toLocaleDateString()}</span>
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
                        onClick={() => setPartnershipToDelete(partnership)}
                        disabled={isDeletingPartnership}
                      >
                        {isDeletingPartnership ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Partnership Agreement</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this partnership agreement? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePartnershipAgreement} disabled={isDeletingPartnership} className="bg-red-600 hover:bg-red-700">
                          {isDeletingPartnership ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="outline"
                    className="flex-1 px-6 py-3 rounded-full border-primary-500 text-primary-500 hover:bg-primary-50"
                    onClick={() => handleViewPartnershipAgreement(partnership.id)}
                    disabled={isDeletingPartnership}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}

            {/* NDA Cards */}
            {(activeFilter === 'all' || activeFilter === 'nda') && ndas.map((nda) => (
              <div key={nda.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="bg-gray-50 rounded-lg p-4 mb-4 h-[340px] flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    {nda.input_data?.logo_url && (
                      <img
                        src={nda.input_data.logo_url}
                        alt="Company Logo"
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <h4 className="text-black font-medium text-sm">NDA</h4>
                  </div>
                  <h3 className="text-black font-bold text-lg mb-4">Non-Disclosure Agreement</h3>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>Disclosing Party:</strong> {nda.disclosing_party}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Receiving Party:</strong> {nda.receiving_party}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Purpose:</strong> {nda.purpose}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{new Date(nda.created_at).toLocaleDateString()}</span>
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
                        onClick={() => setNdaToDelete(nda)}
                        disabled={isDeletingNda}
                      >
                        {isDeletingNda ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete NDA</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this NDA? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteNda} disabled={isDeletingNda} className="bg-red-600 hover:bg-red-700">
                          {isDeletingNda ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="outline"
                    className="flex-1 px-6 py-3 rounded-full border-primary-500 text-primary-500 hover:bg-primary-50"
                    onClick={() => handleViewNda(nda.id)}
                    disabled={isDeletingNda}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      )}
    </div>
  );
}
