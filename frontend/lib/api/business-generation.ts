import apiClient from "./client";

export type BusinessGenerationRequest = {
  user_id: number;
  name_tone: string;
  industry: string;
  prompts: string;
  no_of_names: number; // 1-50
};

export type BusinessGenerationResponse = {
  id: number;
  user_id: number;
  name_tone: string;
  industry: string;
  no_of_names: number;
  generated_names: string[];
  created_at: string;
};

export type BusinessGenerationHistoryResponse = {
  generations: BusinessGenerationResponse[];
  total: number;
};

export async function generateBusinessNames(
  data: BusinessGenerationRequest
): Promise<BusinessGenerationResponse> {
  const formData = new FormData();
  formData.append("user_id", String(data.user_id));
  formData.append("name_tone", data.name_tone);
  formData.append("industry", data.industry);
  formData.append("prompts", data.prompts);
  formData.append("no_of_names", String(data.no_of_names));

  const response = await apiClient.post<BusinessGenerationResponse>(
    "/business-generation/generate-simple",
    formData,
    
  );
  return response.data;
}

export async function getBusinessGenerationById(
  generationId: number
): Promise<BusinessGenerationResponse> {
  const response = await apiClient.get<BusinessGenerationResponse>(
    `/business-generation/${generationId}`
  );
  return response.data;
}

export async function getBusinessGenerationHistory(
  userId: number
): Promise<BusinessGenerationHistoryResponse> {
  const response = await apiClient.get<BusinessGenerationHistoryResponse>(
    `/business-generation/user/${userId}`
  );
  return response.data;
}

export async function deleteBusinessGeneration(
  generationId: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiClient.delete(`/business-generation/${generationId}`);
    // DELETE requests typically return 204 No Content or 200 OK without body
    // If we get here, the deletion was successful
    return { success: true, message: "Generation deleted successfully" };
  } catch (error: any) {
    console.error("Delete API error:", error);
    // Re-throw the error so the component can handle it
    throw error;
  }
}
