"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { type DocumentGeneratorForm } from "@/lib/validation/document";
import { type LogoResponse } from "@/lib/api/logo";

export type TermsOfServiceFieldsProps = {
  form: UseFormReturn<DocumentGeneratorForm>;
  userLogos: LogoResponse[];
  isLoadingLogos: boolean;
};

export default function TermsOfServiceFields({ form, userLogos, isLoadingLogos }: TermsOfServiceFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="tos_company_name">Company Name</Label>
        <Input id="tos_company_name" {...form.register("tos_company_name")} placeholder="Enter your company name" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tos_website_url">Website URL</Label>
        <Input id="tos_website_url" {...form.register("tos_website_url")} placeholder="https://example.com" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tos_company_address">Company Address</Label>
        <Input id="tos_company_address" {...form.register("tos_company_address")} placeholder="Enter company address" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tos_service_description">Service Description</Label>
        <Textarea id="tos_service_description" {...form.register("tos_service_description")} placeholder="Describe your services" className="min-h-[120px] text-lg" rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tos_user_responsibilities">User Responsibilities</Label>
        <Textarea id="tos_user_responsibilities" {...form.register("tos_user_responsibilities")} placeholder="List responsibilities (comma-separated or new lines)" className="min-h-[120px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tos_prohibited_activities">Prohibited Activities</Label>
        <Textarea id="tos_prohibited_activities" {...form.register("tos_prohibited_activities")} placeholder="List prohibited activities (comma-separated or new lines)" className="min-h-[120px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tos_payment_terms">Payment Terms</Label>
        <Input id="tos_payment_terms" {...form.register("tos_payment_terms")} placeholder="e.g., Monthly subscription, Net 30" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tos_cancellation_policy">Cancellation Policy</Label>
        <Textarea id="tos_cancellation_policy" {...form.register("tos_cancellation_policy")} placeholder="Describe cancellation terms" className="min-h-[100px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tos_limitation_of_liability">Limitation of Liability</Label>
        <Textarea id="tos_limitation_of_liability" {...form.register("tos_limitation_of_liability")} placeholder="Describe liability limitations" className="min-h-[100px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tos_governing_law">Governing Law</Label>
        <Input id="tos_governing_law" {...form.register("tos_governing_law")} placeholder="e.g., California, USA" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tos_contact_email">Contact Email</Label>
        <Input id="tos_contact_email" {...form.register("tos_contact_email")} placeholder="support@example.com" className="h-12 text-lg" />
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
