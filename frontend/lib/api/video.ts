import apiClient from "./client";

export type VideoGenerateRequest = {
  user_id: number;
  prompt: string;
  aspect_ratio: string;
  duration: number;
  resolution: string;
  generate_audio: boolean;
  negative_prompt: string;
};

export type VideoResponse = {
  id: number;
  user_id: number;
  prompt: string;
  video_url: string;
  created_at: string;
  updated_at: string;
};

/**
 * Generate a new video
 */
export async function generateVideo(
  data: VideoGenerateRequest
): Promise<VideoResponse> {
  const response = await apiClient.post<VideoResponse>(
    "/short-video/generate",
    data
  );
  return response.data;
}

/**
 * Get all videos for a specific user
 */
export async function getAllVideosForUser(
  userId: number
): Promise<VideoResponse[]> {
  const response = await apiClient.get<VideoResponse[]>(
    `/short-video/user/${userId}`
  );
  return response.data;
}

/**
 * Get a specific video by ID
 */
export async function getVideoById(videoId: number): Promise<VideoResponse> {
  const response = await apiClient.get<VideoResponse>(
    `/short-video/${videoId}`
  );
  return response.data;
}

/**
 * Delete a video by ID
 */
export async function deleteVideo(videoId: number): Promise<void> {
  await apiClient.delete(`/short-video/${videoId}`);
}
