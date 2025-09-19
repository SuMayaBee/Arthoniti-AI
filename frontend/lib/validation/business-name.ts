import { z } from "zod";

export const businessNameSchema = z.object({
  tone: z.string().min(1, { message: "Please select a tone" }),
  industry: z.string().min(1, { message: "Please select an industry" }),
  description: z.string().min(1, { message: "Description is required" }),
  nameCount: z.string().min(1, { message: "Please select number of names" }),
});

export type BusinessNameForm = z.infer<typeof businessNameSchema>;

