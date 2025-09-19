"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { type DocumentGeneratorForm } from "@/lib/validation/document";
import { type LogoResponse } from "@/lib/api/logo";

export type BusinessProposalFieldsProps = {
  form: UseFormReturn<DocumentGeneratorForm>;
  userLogos: LogoResponse[];
  isLoadingLogos: boolean;
};

export default function BusinessProposalFields({ form, userLogos, isLoadingLogos }: BusinessProposalFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name</Label>
        <Input id="company_name" {...form.register("company_name")} placeholder="Enter your company name" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client_name">Client Name</Label>
        <Input id="client_name" {...form.register("client_name")} placeholder="Enter client name" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_title">Project Title</Label>
        <Input id="project_title" {...form.register("project_title")} placeholder="Enter project title" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_description">Project Description</Label>
        <Textarea id="project_description" {...form.register("project_description")} placeholder="Describe the project in detail" className="min-h-[120px] text-lg" rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="services_offered">Services Offered</Label>
        <Textarea id="services_offered" {...form.register("services_offered")} placeholder="List services offered (comma-separated or new lines)" className="min-h-[120px] text-lg" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeline">Timeline</Label>
        <Input id="timeline" {...form.register("timeline")} placeholder="e.g., 3 months, 6 weeks" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget_range">Budget Range</Label>
        <Input id="budget_range" {...form.register("budget_range")} placeholder="e.g., $10,000 - $15,000" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_person">Contact Person</Label>
        <Input id="contact_person" {...form.register("contact_person")} placeholder="Enter contact person name" className="h-12 text-lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input id="contact_email" {...form.register("contact_email")} placeholder="Enter contact email" className="h-12 text-lg" />
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
