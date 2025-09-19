"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { type DocumentGeneratorForm } from "@/lib/validation/document";
import { type LogoResponse } from "@/lib/api/logo";

export type NDAFieldsProps = {
  form: UseFormReturn<DocumentGeneratorForm>;
  userLogos: LogoResponse[];
  isLoadingLogos: boolean;
};

export default function NDAFields({ form, userLogos, isLoadingLogos }: NDAFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="disclosing_party">Disclosing Party</Label>
        <Input id="disclosing_party" {...form.register("disclosing_party")} placeholder="Enter disclosing party name" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="receiving_party">Receiving Party</Label>
        <Input id="receiving_party" {...form.register("receiving_party")} placeholder="Enter receiving party name" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose</Label>
        <Input id="purpose" {...form.register("purpose")} placeholder="Enter purpose of disclosure" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confidential_info_description">Confidential Information Description</Label>
        <Textarea id="confidential_info_description" {...form.register("confidential_info_description")} placeholder="Describe the confidential information" className="min-h-[120px] text-lg" rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input id="duration" {...form.register("duration")} placeholder="e.g., 2 years, 5 years" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="governing_law">Governing Law</Label>
        <Input id="governing_law" {...form.register("governing_law")} placeholder="e.g., California, New York" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="effective_date">Effective Date</Label>
        <Input id="effective_date" {...form.register("effective_date")} placeholder="e.g., January 1, 2025" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo_url">Company Logo</Label>
        <Select value={form.watch("logo_url") || ""} onValueChange={(value) => form.setValue("logo_url", value)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select a logo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-logo">No Logo</SelectItem>
            {isLoadingLogos && (
              <SelectItem value="loading" disabled>
                Loading logos...
              </SelectItem>
            )}
            {userLogos.length === 0 && !isLoadingLogos && (
              <SelectItem value="no-logos-found" disabled>
                No logos found
              </SelectItem>
            )}
            {userLogos.map((logo) => (
              <SelectItem key={logo.id} value={logo.logo_image_url}>
                <div className="flex items-center gap-2">
                  <img src={logo.logo_image_url} alt={logo.logo_title} className="w-6 h-6 object-contain" />
                  {logo.logo_title}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
