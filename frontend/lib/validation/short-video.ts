import { z } from "zod";

const MAX_VIDEO_DURATION = 60;
const DEFAULT_VIDEO_DURATION = 5;

export const shortVideoSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  aspect_ratio: z.enum(["16:9", "9:16", "1:1", "4:5"]).default("16:9"),
  duration: z.number().int().min(1).max(MAX_VIDEO_DURATION).default(DEFAULT_VIDEO_DURATION),
  resolution: z.enum(["480p", "720p", "1080p"]).default("720p"),
  generate_audio: z.boolean().default(true),
  negative_prompt: z.string().optional()
});

export type ShortVideoForm = z.infer<typeof shortVideoSchema>;

