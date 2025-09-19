import { z } from "zod";

export const logoGeneratorSchema = z.object({
  businessName: z.string().min(1, { message: "Business name is required" }),
  logoDescription: z.string().min(1, { message: "Logo description is required" }),
  colorPalette: z.string().min(1, { message: "Please select a color palette" }),
  logoStyle: z.string().min(1, { message: "Please select a logo style" }),
});

export type LogoGeneratorForm = z.infer<typeof logoGeneratorSchema>;

