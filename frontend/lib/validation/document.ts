import { z } from "zod";

export const documentGeneratorSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  // Business Proposal fields
  company_name: z.string().optional(),
  client_name: z.string().optional(),
  project_title: z.string().optional(),
  project_description: z.string().optional(),
  services_offered: z.string().optional(),
  timeline: z.string().optional(),
  budget_range: z.string().optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().optional(),
  logo_url: z.string().optional(),
  // Legacy fields for backward compatibility
  businessName: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  additional: z.string().optional(),
  // Partnership Agreement fields
  party1_name: z.string().optional(),
  party1_address: z.string().optional(),
  party2_name: z.string().optional(),
  party2_address: z.string().optional(),
  partnership_purpose: z.string().optional(),
  partnership_duration: z.string().optional(),
  profit_sharing_ratio: z.string().optional(),
  responsibilities_party1: z.string().optional(),
  responsibilities_party2: z.string().optional(),
  effective_date: z.string().optional(),
  // Legacy partnership fields
  partner1Name: z.string().optional(),
  partner2Name: z.string().optional(),
  businessPurpose: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  // NDA fields
  disclosing_party: z.string().optional(),
  receiving_party: z.string().optional(),
  purpose: z.string().optional(),
  confidential_info_description: z.string().optional(),
  duration: z.string().optional(),
  governing_law: z.string().optional(),
  // effective_date is already defined above; avoid duplication
  // Contract fields
  contract_type: z.string().optional(),
  service_description: z.string().optional(),
  contract_value: z.string().optional(),
  payment_terms: z.string().optional(),
  deliverables: z.string().optional(), // input as string, split to array for API
  terms_conditions: z.string().optional(), // input as string, split to array for API
  // party fields reused for contract: party1_name, party1_address, party2_name, party2_address, duration, effective_date, logo_url
  // Terms of Service fields
  tos_company_name: z.string().optional(),
  tos_website_url: z.string().optional(),
  tos_company_address: z.string().optional(),
  tos_service_description: z.string().optional(),
  tos_user_responsibilities: z.string().optional(), // input as string, split to array for API
  tos_prohibited_activities: z.string().optional(), // input as string, split to array for API
  tos_payment_terms: z.string().optional(),
  tos_cancellation_policy: z.string().optional(),
  tos_limitation_of_liability: z.string().optional(),
  tos_governing_law: z.string().optional(),
  tos_contact_email: z.string().optional(),
  tos_logo_url: z.string().optional(),
  // Privacy Policy fields
  pp_company_name: z.string().optional(),
  pp_website_url: z.string().optional(),
  pp_company_address: z.string().optional(),
  pp_data_collected: z.string().optional(), // input as string, split to array for API
  pp_data_usage_purpose: z.string().optional(), // input as string, split to array for API
  pp_third_party_sharing: z.string().optional(),
  pp_data_retention_period: z.string().optional(),
  pp_user_rights: z.string().optional(), // input as string, split to array for API
  pp_cookies_usage: z.string().optional(),
  pp_contact_email: z.string().optional(),
  pp_governing_law: z.string().optional(),
  pp_effective_date: z.string().optional(),
  pp_logo_url: z.string().optional(),
  // Legacy NDA fields
  disclosingPartyName: z.string().optional(),
  receivingPartyName: z.string().optional(),
  purposeOfDisclosure: z.string().optional(),
  ndaStartDate: z.string().optional(),
  ndaEndDate: z.string().optional(),
});

export type DocumentGeneratorForm = z.infer<typeof documentGeneratorSchema>;

