import apiClient from "./client";

export type LogoGenerateRequest = {
  logo_title: string;
  logo_vision: string;
  color_palette_name: string;
  logo_style: string;
  user_id: number;
};

export type LogoResponse = {
  id: number;
  user_id: number;
  logo_image_url: string;
  remove_bg_logo_image_url: string;
  content: {
    additionalProp1: any;
  };
  logo_title: string;
  logo_vision: string;
  color_palette_name: string;
  logo_style: string;
  created_at: string;
  updated_at: string;
};

/**
 * Generate a new logo
 */
export async function generateLogo(data: LogoGenerateRequest): Promise<LogoResponse> {
  const response = await apiClient.post<LogoResponse>("/logo/design", data);
  return response.data;
}

/**
 * Get all logos for a specific user
 */
export async function getAllLogosForUser(userId: number): Promise<LogoResponse[]> {
  const response = await apiClient.get<LogoResponse[]>(`/logo/user/${userId}`);
  return response.data;
}

/**
 * Get a specific logo by ID
 */
export async function getLogoById(logoId: number): Promise<LogoResponse> {
  const response = await apiClient.get<LogoResponse>(`/logo/${logoId}`);
  return response.data;
}

/**
 * Delete a logo by ID
 */
export async function deleteLogo(logoId: number): Promise<void> {
  await apiClient.delete(`/logo/${logoId}`);
}

/**
 * Remove background from logo
 */
export async function removeLogoBackground(logoId: number): Promise<{
  success: boolean;
  logo_id: number;
  remove_bg_logo_image_url: string;
  error: string;
}> {
  const response = await apiClient.post("/logo/remove_bg", { logo_id: logoId });
  return response.data;
}
