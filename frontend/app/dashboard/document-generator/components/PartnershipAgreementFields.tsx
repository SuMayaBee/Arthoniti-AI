"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { type DocumentGeneratorForm } from "@/lib/validation/document";
import { type LogoResponse } from "@/lib/api/logo";

export type PartnershipAgreementFieldsProps = {
  form: UseFormReturn<DocumentGeneratorForm>;
  userLogos: LogoResponse[];
  isLoadingLogos: boolean;
};

export default function PartnershipAgreementFields({ form, userLogos, isLoadingLogos }: PartnershipAgreementFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="party1_name">Party 1 Name</Label>
        <Input id="party1_name" {...form.register("party1_name")} placeholder="Enter first party name" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="party1_address">Party 1 Address</Label>
        <Input id="party1_address" {...form.register("party1_address")} placeholder="Enter first party address" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="party2_name">Party 2 Name</Label>
        <Input id="party2_name" {...form.register("party2_name")} placeholder="Enter second party name" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="party2_address">Party 2 Address</Label>
        <Input id="party2_address" {...form.register("party2_address")} placeholder="Enter second party address" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="partnership_purpose">Partnership Purpose</Label>
        <Textarea id="partnership_purpose" {...form.register("partnership_purpose")} placeholder="Describe the purpose of the partnership" className="min-h-[120px] text-lg" rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="partnership_duration">Partnership Duration</Label>
        <Input id="partnership_duration" {...form.register("partnership_duration")} placeholder="e.g., 2 years, 5 years" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profit_sharing_ratio">Profit Sharing Ratio</Label>
        <Input id="profit_sharing_ratio" {...form.register("profit_sharing_ratio")} placeholder="e.g., 60:40, 50:50" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsibilities_party1">Party 1 Responsibilities</Label>
        <Textarea id="responsibilities_party1" {...form.register("responsibilities_party1")} placeholder="List responsibilities for party 1 (comma-separated or new lines)" className="min-h-[120px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsibilities_party2">Party 2 Responsibilities</Label>
        <Textarea id="responsibilities_party2" {...form.register("responsibilities_party2")} placeholder="List responsibilities for party 2 (comma-separated or new lines)" className="min-h-[120px] text-lg" rows={3} />
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
