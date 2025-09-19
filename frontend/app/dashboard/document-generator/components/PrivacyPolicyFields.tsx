"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { type DocumentGeneratorForm } from "@/lib/validation/document";
import { type LogoResponse } from "@/lib/api/logo";

export type PrivacyPolicyFieldsProps = {
  form: UseFormReturn<DocumentGeneratorForm>;
  userLogos: LogoResponse[];
  isLoadingLogos: boolean;
};

export default function PrivacyPolicyFields({ form, userLogos, isLoadingLogos }: PrivacyPolicyFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pp_company_name">Company Name</Label>
        <Input id="pp_company_name" {...form.register("pp_company_name")} placeholder="Enter your company name" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pp_website_url">Website URL</Label>
        <Input id="pp_website_url" {...form.register("pp_website_url")} placeholder="https://example.com" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pp_company_address">Company Address</Label>
        <Input id="pp_company_address" {...form.register("pp_company_address")} placeholder="Enter company address" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pp_data_collected">Data Collected</Label>
        <Textarea id="pp_data_collected" {...form.register("pp_data_collected")} placeholder="List data collected (comma-separated or new lines)" className="min-h-[120px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pp_data_usage_purpose">Data Usage Purpose</Label>
        <Textarea id="pp_data_usage_purpose" {...form.register("pp_data_usage_purpose")} placeholder="List purposes (comma-separated or new lines)" className="min-h-[120px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pp_third_party_sharing">Third-Party Sharing</Label>
        <Textarea id="pp_third_party_sharing" {...form.register("pp_third_party_sharing")} placeholder="Describe third-party sharing" className="min-h-[100px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pp_data_retention_period">Data Retention Period</Label>
        <Input id="pp_data_retention_period" {...form.register("pp_data_retention_period")} placeholder="e.g., 12 months" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pp_user_rights">User Rights</Label>
        <Textarea id="pp_user_rights" {...form.register("pp_user_rights")} placeholder="List user rights (comma-separated or new lines)" className="min-h-[120px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pp_cookies_usage">Cookies Usage</Label>
        <Textarea id="pp_cookies_usage" {...form.register("pp_cookies_usage")} placeholder="Describe cookies usage" className="min-h-[100px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pp_contact_email">Contact Email</Label>
        <Input id="pp_contact_email" {...form.register("pp_contact_email")} placeholder="privacy@example.com" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pp_governing_law">Governing Law</Label>
        <Input id="pp_governing_law" {...form.register("pp_governing_law")} placeholder="e.g., California, USA" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pp_effective_date">Effective Date</Label>
        <Input id="pp_effective_date" {...form.register("pp_effective_date")} placeholder="e.g., January 1, 2025" className="h-12 text-lg" />
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
