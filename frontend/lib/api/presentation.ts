import apiClient from "./client";

export type GenerateUnifiedRequest = {
  slides_count: number; // 3-20
  prompt: string; // minLength: 10
  color_theme?: string | null;
  website_urls?: string | null; // comma-separated
  industry_sector?: string | null;
  one_line_pitch?: string | null;
  problem_solving?: string | null;
  unique_solution?: string | null;
  target_audience?: string | null;
  business_model?: string | null;
  revenue_plan?: string | null;
  competitors?: string | null;
  vision?: string | null;
  language?: string | null;
  tone?: string | null;
  generate_images?: boolean | null;
  user_id: number;
};

export type GenerateUnifiedResponse = {
  success: boolean;
  presentation_xml: string;
  slides_count: number;
  processing_time: number;
  generated_images: string[];
  context_sources_used: string[];
  error: string | null;
  presentation_id: number;
  database_id: number;
  database_error: string | null;
  prompt: string;
  theme: string | null;
  language: string | null;
  tone: string | null;
};

export type PresentationSummary = {
  id: string;
  title: string;
  content: Record<string, any> | null;
  theme: string | null;
  language: string | null;
  tone: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  slug: string;
};

export type PresentationDetail = PresentationSummary & {
  presentation_xml?: string | null;
  slides_count?: number;
  prompt?: string;
  processing_time?: number;
  generated_images?: string[];
  context_sources_used?: any[];
  error?: string | null;
  content?: {
    slides?:
      | string
      | Array<{
          xml?: string | null;
          [key: string]: any;
        }>;
    [key: string]: any;
  } | null;
};

export async function generatePresentationUnified(
  data: GenerateUnifiedRequest
): Promise<GenerateUnifiedResponse> {
  const formData = new FormData();
  formData.append("slides_count", String(data.slides_count));
  formData.append("prompt", data.prompt);
  formData.append("user_id", String(data.user_id));

  if (data.color_theme) formData.append("color_theme", data.color_theme);
  if (data.website_urls) formData.append("website_urls", data.website_urls);
  if (data.industry_sector) formData.append("industry_sector", data.industry_sector);
  if (data.one_line_pitch) formData.append("one_line_pitch", data.one_line_pitch);
  if (data.problem_solving) formData.append("problem_solving", data.problem_solving);
  if (data.unique_solution) formData.append("unique_solution", data.unique_solution);
  if (data.target_audience) formData.append("target_audience", data.target_audience);
  if (data.business_model) formData.append("business_model", data.business_model);
  if (data.revenue_plan) formData.append("revenue_plan", data.revenue_plan);
  if (data.competitors) formData.append("competitors", data.competitors);
  if (data.vision) formData.append("vision", data.vision);
  if (data.language) formData.append("language", data.language);
  if (data.tone) formData.append("tone", data.tone);
  if (data.generate_images != null) formData.append("generate_images", String(!!data.generate_images));

  const response = await apiClient.post<GenerateUnifiedResponse>(
    "/presentation/presentation/generate-unified",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
}

export async function getPresentationsForUser(
  userId: number
): Promise<PresentationSummary[]> {
  const response = await apiClient.get<PresentationSummary[]>(
    `/presentation/presentation/user-id/${userId}`
  );
  return Array.isArray(response.data) ? response.data : [];
}

export async function deletePresentation(presentationId: string): Promise<void> {
  await apiClient.delete(`/presentation/presentation/${presentationId}`);
}

export async function getPresentationById(
  presentationId: string
): Promise<PresentationDetail> {
  const response = await apiClient.get<PresentationDetail>(
    `/presentation/presentation/${presentationId}`
  );
  return response.data as PresentationDetail;
}

// Update presentation content (e.g., slides XML)
export async function updatePresentation(
  presentationId: string,
  data: { content?: { slides?: string } ; title?: string; [key: string]: any }
): Promise<PresentationDetail> {
  const response = await apiClient.put<PresentationDetail>(
    `/presentation/presentation/${presentationId}`,
    data
  );
  return response.data as PresentationDetail;
}

// Image generation API
export type GenerateImageRequest = {
  prompt: string;
  presentation_id: number;
  user_email: string;
  size: string; // e.g., "1792x1024"
  quality: string; // e.g., "hd"
  context?: string;
};

export type GenerateImageResponse = {
  success: boolean;
  url: string;
  prompt: string;
  model: string;
  size: string;
  quality: string;
  filename: string;
  error: string | null;
};

export async function generatePresentationImage(
  data: GenerateImageRequest
): Promise<GenerateImageResponse> {
  const response = await apiClient.post<GenerateImageResponse>(
    "/presentation/presentation/generate-image",
    data
  );
  return response.data;
}

// Retrieve any previously generated images for a presentation
export async function getPresentationImages(
  presentationId: string
): Promise<string[]> {
  const response = await apiClient.get<any>(
    `/presentation/presentation/${presentationId}/images`
  );
  const data = response.data;
  if (Array.isArray(data)) return data as string[];
  if (data && Array.isArray(data.images)) return data.images as string[];
  return [];
}
