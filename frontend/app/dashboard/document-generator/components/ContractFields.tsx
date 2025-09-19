"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { type DocumentGeneratorForm } from "@/lib/validation/document";
import { type LogoResponse } from "@/lib/api/logo";

export type ContractFieldsProps = {
  form: UseFormReturn<DocumentGeneratorForm>;
  userLogos: LogoResponse[];
  isLoadingLogos: boolean;
};

export default function ContractFields({ form, userLogos, isLoadingLogos }: ContractFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="contract_type">Contract Type</Label>
        <Input id="contract_type" {...form.register("contract_type")} placeholder="e.g., Service Agreement, Consulting Contract" className="h-12 text-lg" />
      </div>

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
        <Label htmlFor="service_description">Service Description</Label>
        <Textarea id="service_description" {...form.register("service_description")} placeholder="Describe the services" className="min-h-[120px] text-lg" rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contract_value">Contract Value</Label>
        <Input id="contract_value" {...form.register("contract_value")} placeholder="e.g., $20,000" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_terms">Payment Terms</Label>
        <Textarea id="payment_terms" {...form.register("payment_terms")} placeholder="Describe payment terms" className="min-h-[100px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input id="duration" {...form.register("duration")} placeholder="e.g., 12 months" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliverables">Deliverables</Label>
        <Textarea id="deliverables" {...form.register("deliverables")} placeholder="List deliverables (comma-separated or new lines)" className="min-h-[100px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="terms_conditions">Terms & Conditions</Label>
        <Textarea id="terms_conditions" {...form.register("terms_conditions")} placeholder="List terms & conditions (comma-separated or new lines)" className="min-h-[120px] text-lg" rows={4} />
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
