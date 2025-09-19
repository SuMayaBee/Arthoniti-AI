import * as z from "zod";

export const pitchDeckSchema = z.object({
  // First step fields
  slideCount: z
    .string()
    .min(1, "Please select number of slides")
    .refine((val) => {
      const n = parseInt(val, 10);
      return !isNaN(n) && n >= 3 && n <= 20;
    }, "Slides must be between 3 and 20"),
  color: z.string().min(1, "Please select a color"),
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  companyName: z.string().min(1, "Company name is required"),
  websiteUrl: z
    .string()
    .min(1, "Website URL is required")
    .refine((value) => {
      const entries = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
      if (entries.length === 0) return false;
      const allValid = entries.every((url) => {
        const withProtocol = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
        try {
          const u = new URL(withProtocol);
          return !!u.hostname && u.hostname.includes(".");
        } catch {
          return false;
        }
      });
      return allValid;
    }, "Enter valid URL(s), e.g., https://example.com or example.com"),
  industry: z.string().min(1, "Industry is required"),
  oneLinePitch: z.string().min(1, "One-line pitch is required"),
  problemSolving: z.string().min(10, "Problem description must be at least 10 characters"),
  // Second step fields
  uniqueSolution: z.string().min(10, "Solution description must be at least 10 characters"),
  targetAudience: z.string().min(1, "Target audience is required"),
  businessModel: z.string().min(10, "Business model must be at least 10 characters"),
  revenuePlan: z.string().min(10, "Revenue plan must be at least 10 characters"),
  competitors: z.string().min(1, "Competitors is required"),
  vision: z.string().min(1, "Vision is required"),
  language: z.string().min(1, "Language is required"),
  tone: z.string().min(1, "Tone is required"),
  generateImages: z.boolean(),
});

export type PitchDeckForm = z.infer<typeof pitchDeckSchema>;

