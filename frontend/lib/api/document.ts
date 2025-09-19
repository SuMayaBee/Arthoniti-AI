import apiClient from "./client";

export type BusinessProposalRequest = {
  user_id: number;
  company_name: string;
  client_name: string;
  project_title: string;
  project_description: string;
  services_offered: string[];
  timeline: string;
  budget_range: string;
  contact_person: string;
  contact_email: string;
  logo_url: string;
};

export type BusinessProposalResponse = {
  id: number;
  user_id: number;
  company_name: string;
  client_name: string;
  project_title: string;
  ai_generated_content: string;
  input_data: Record<string, any>;
  docs_url: string;
  created_at: string;
  updated_at: string;
  contact_person: string;
  contact_email: string;
};

export async function generateBusinessProposal(data: BusinessProposalRequest): Promise<BusinessProposalResponse> {
  const response = await apiClient.post<BusinessProposalResponse>("/documents/business-proposal", data);
  return response.data;
}

export async function getAllBusinessProposalsForUser(userId: number): Promise<BusinessProposalResponse[]> {
  const response = await apiClient.get<BusinessProposalResponse[]>(`/documents/business-proposal/user/${userId}`);
  return response.data;
}

export async function getBusinessProposalById(documentId: number): Promise<BusinessProposalResponse> {
  const response = await apiClient.get<BusinessProposalResponse>(`/documents/business-proposal/${documentId}`);
  return response.data;
}

export async function deleteBusinessProposal(documentId: number): Promise<void> {
  await apiClient.delete(`/documents/business-proposal/${documentId}`);
}

export async function updateBusinessProposal(documentId: number, data: { ai_generated_content: string }): Promise<BusinessProposalResponse> {
  const response = await apiClient.put<BusinessProposalResponse>(`/documents/business-proposal/${documentId}`, data);
  return response.data;
}

// Partnership Agreement types
export interface PartnershipAgreementRequest {
  user_id: number;
  party1_name: string;
  party1_address: string;
  party2_name: string;
  party2_address: string;
  partnership_purpose: string;
  partnership_duration: string;
  profit_sharing_ratio: string;
  responsibilities_party1: string[];
  responsibilities_party2: string[];
  effective_date: string;
  logo_url: string;
}

export interface PartnershipAgreementResponse {
  id: number;
  user_id: number;
  party1_name: string;
  party2_name: string;
  partnership_purpose: string;
  ai_generated_content: string;
  input_data: {
    [key: string]: any;
  };
  docs_url: string;
  created_at: string;
  updated_at: string;
}

// NDA Types
export interface NDARequest {
  user_id: number;
  disclosing_party: string;
  receiving_party: string;
  purpose: string;
  confidential_info_description: string;
  duration: string;
  governing_law: string;
  effective_date: string;
  logo_url: string;
}

export interface NDAResponse {
  id: number;
  user_id: number;
  disclosing_party: string;
  receiving_party: string;
  purpose: string;
  ai_generated_content: string;
  input_data: {
    [key: string]: any;
  };
  docs_url: string;
  created_at: string;
  updated_at: string;
}

// Partnership Agreement API functions
export const generatePartnershipAgreement = async (data: PartnershipAgreementRequest): Promise<PartnershipAgreementResponse> => {
  const response = await apiClient.post('/documents/partnership-agreement', data);
  return response.data;
};

export const getAllPartnershipAgreementsForUser = async (userId: number): Promise<PartnershipAgreementResponse[]> => {
  const response = await apiClient.get(`/documents/partnership-agreement/user/${userId}`);
  return response.data;
};

export const getPartnershipAgreementById = async (id: number): Promise<PartnershipAgreementResponse> => {
  const response = await apiClient.get(`/documents/partnership-agreement/${id}`);
  return response.data;
};

export const deletePartnershipAgreement = async (id: number): Promise<void> => {
  await apiClient.delete(`/documents/partnership-agreement/${id}`);
};

export const updatePartnershipAgreement = async (id: number, data: { ai_generated_content: string }): Promise<PartnershipAgreementResponse> => {
  const response = await apiClient.put(`/documents/partnership-agreement/${id}`, data);
  return response.data;
};

// NDA API functions
export const generateNDA = async (data: NDARequest): Promise<NDAResponse> => {
  const response = await apiClient.post("/documents/nda", data);
  return response.data;
};

export const getAllNDAsForUser = async (userId: number): Promise<NDAResponse[]> => {
  const response = await apiClient.get(`/documents/nda/user/${userId}`);
  return response.data;
};

export const getNDAById = async (id: number): Promise<NDAResponse> => {
  const response = await apiClient.get(`/documents/nda/${id}`);
  return response.data;
};

export const deleteNDA = async (id: number): Promise<void> => {
  await apiClient.delete(`/documents/nda/${id}`);
};

export const updateNDA = async (id: number, data: { ai_generated_content: string }): Promise<NDAResponse> => {
  const response = await apiClient.put(`/documents/nda/${id}`, data);
  return response.data;
};

// Contract Types
export interface ContractRequest {
  user_id: number;
  contract_type: string;
  party1_name: string;
  party1_address: string;
  party2_name: string;
  party2_address: string;
  service_description: string;
  contract_value: string;
  payment_terms: string;
  duration: string;
  deliverables: string[];
  terms_conditions: string[];
  effective_date: string;
  logo_url: string;
}

export interface ContractResponse {
  id: number;
  user_id: number;
  contract_type: string;
  party1_name: string;
  party2_name: string;
  service_description: string;
  ai_generated_content: string;
  input_data: {
    [key: string]: any;
  };
  docs_url: string;
  created_at: string;
  updated_at: string;
}

// Contract API functions
export const generateContract = async (data: ContractRequest): Promise<ContractResponse> => {
  const response = await apiClient.post("/documents/contract", data);
  return response.data;
};

export const getAllContractsForUser = async (userId: number): Promise<ContractResponse[]> => {
  const response = await apiClient.get(`/documents/contract/user/${userId}`);
  return response.data;
};

export const getContractById = async (id: number): Promise<ContractResponse> => {
  const response = await apiClient.get(`/documents/contract/${id}`);
  return response.data;
};

export const deleteContract = async (id: number): Promise<void> => {
  await apiClient.delete(`/documents/contract/${id}`);
};

export const updateContract = async (id: number, data: { ai_generated_content: string }): Promise<ContractResponse> => {
  const response = await apiClient.put(`/documents/contract/${id}`, data);
  return response.data;
};

// Terms of Service Types
export interface TermsOfServiceRequest {
  user_id: number;
  company_name: string;
  website_url: string;
  company_address: string;
  service_description: string;
  user_responsibilities: string[];
  prohibited_activities: string[];
  payment_terms: string;
  cancellation_policy: string;
  limitation_of_liability: string;
  governing_law: string;
  contact_email: string;
  logo_url: string;
}

export interface TermsOfServiceResponse {
  id: number;
  user_id: number;
  company_name: string;
  website_url: string;
  service_description: string;
  ai_generated_content: string;
  input_data: {
    [key: string]: any;
  };
  docs_url: string;
  created_at: string;
  updated_at: string;
}

// Terms of Service API functions
export const generateTermsOfService = async (data: TermsOfServiceRequest): Promise<TermsOfServiceResponse> => {
  const response = await apiClient.post("/documents/terms-of-service", data);
  return response.data;
};

export const getAllTermsOfServiceForUser = async (userId: number): Promise<TermsOfServiceResponse[]> => {
  const response = await apiClient.get(`/documents/terms-of-service/user/${userId}`);
  return response.data;
};

export const getTermsOfServiceById = async (id: number): Promise<TermsOfServiceResponse> => {
  const response = await apiClient.get(`/documents/terms-of-service/${id}`);
  return response.data;
};

export const deleteTermsOfService = async (id: number): Promise<void> => {
  await apiClient.delete(`/documents/terms-of-service/${id}`);
};

export const updateTermsOfService = async (id: number, data: { ai_generated_content: string }): Promise<TermsOfServiceResponse> => {
  const response = await apiClient.put(`/documents/terms-of-service/${id}`, data);
  return response.data;
};

// Privacy Policy Types
export interface PrivacyPolicyRequest {
  user_id: number;
  company_name: string;
  website_url: string;
  company_address: string;
  data_collected: string[];
  data_usage_purpose: string[];
  third_party_sharing: string;
  data_retention_period: string;
  user_rights: string[];
  cookies_usage: string;
  contact_email: string;
  governing_law: string;
  effective_date: string;
  logo_url: string;
}

export interface PrivacyPolicyResponse {
  id: number;
  user_id: number;
  company_name: string;
  website_url: string;
  ai_generated_content: string;
  input_data: {
    [key: string]: any;
  };
  docs_url: string;
  created_at: string;
  updated_at: string;
}

// Privacy Policy API functions
export const generatePrivacyPolicy = async (data: PrivacyPolicyRequest): Promise<PrivacyPolicyResponse> => {
  const response = await apiClient.post("/documents/privacy-policy", data);
  return response.data;
};

export const getAllPrivacyPoliciesForUser = async (userId: number): Promise<PrivacyPolicyResponse[]> => {
  const response = await apiClient.get(`/documents/privacy-policy/user/${userId}`);
  return response.data;
};

export const getPrivacyPolicyById = async (id: number): Promise<PrivacyPolicyResponse> => {
  const response = await apiClient.get(`/documents/privacy-policy/${id}`);
  return response.data;
};

export const deletePrivacyPolicy = async (id: number): Promise<void> => {
  await apiClient.delete(`/documents/privacy-policy/${id}`);
};

export const updatePrivacyPolicy = async (id: number, data: { ai_generated_content: string }): Promise<PrivacyPolicyResponse> => {
  const response = await apiClient.put(`/documents/privacy-policy/${id}`, data);
  return response.data;
};
