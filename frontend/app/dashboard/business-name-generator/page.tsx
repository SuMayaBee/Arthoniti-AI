'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import BusinessNameHistory from '@/components/history/BusinessNameHistory';
import { GenerateIcon } from '@/components/icons/generate-icon';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { generateBusinessNames } from '@/lib/api/business-generation';
import {
  type BusinessNameForm,
  businessNameSchema,
} from '@/lib/validation/business-name';
import MobileHeader from '@/components/nav/MobileHeader';
import GeneratingLoader from '@/components/ui/generating-loader';

// Utility to extract user_id from JWT in access_token cookie (consistent with other pages)
function getUserIdFromToken(): number | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || null;
  } catch {
    return null;
  }
}

export default function BusinessNameGeneratorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'business-name' | 'previous-history'
  >('business-name');
  const [isGenerating, setIsGenerating] = useState(false);

  // react-hook-form schema (mirror of logo page style)
  // moved to lib/validation/business-name.ts
  // using type from lib/validation/business-name

  const form = useForm<BusinessNameForm>({
    resolver: zodResolver(businessNameSchema),
    defaultValues: {
      tone: '',
      industry: '',
      description: '',
      nameCount: '',
    },
  });

  const toneOptions = [
    'Short & Catchy',
    'Brandable',
    'Keyword-Based',
    'Modern',
    'Professional',
  ];

  const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Food & Beverage',
    'Real Estate',
    'Manufacturing',
    'Consulting',
    'Creative Services',
    'E-commerce',
    'Travel & Tourism',
  ];

  const nameCountOptions = Array.from({ length: 50 }, (_, index) =>
    (index + 1).toString()
  );

  const onSubmit = async (data: BusinessNameForm) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    // Map form fields to API requirements
    const request = {
      user_id: userId,
      name_tone: data.tone,
      industry: data.industry,
      prompts: data.description,
      no_of_names: Number(data.nameCount),
    } as const;

    setIsGenerating(true);
    try {
      const response = await generateBusinessNames(request);
  toast.success('Business names generated successfully!');
  router.push(`/dashboard/business-name-generator/${response.id}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Failed to generate business names'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
      <div className="w-full max-w-none relative">
        {/* Full-screen overlay only on mobile/tablet; desktop uses contained loader */}
        {isGenerating && (
          <div className="fixed inset-0 z-[9999] lg:hidden">
            <GeneratingLoader isVisible variant="full" />
          </div>
        )}

        {/* Mobile header (hidden on lg+), sits above tabs */}
        <MobileHeader className="bg-white relative z-[10000]" showBorder title="Business Name" />
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as 'business-name' | 'previous-history')
          }
        >
          <TabsList className="mb-6">
            <TabsTrigger value="business-name">Business Name</TabsTrigger>
            <TabsTrigger value="previous-history">Previous History</TabsTrigger>
          </TabsList>

          <TabsContent value="business-name">
            <div className={`relative flex h-full w-full flex-col justify-between ${isGenerating ? 'hidden' : ''}`}>
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 font-bold text-3xl text-gray-900">
                    Find the Perfect Name for Your Business
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Start with a name that speaks your brand — creative, memorable, and 100% unique.
                  </p>
                </div>

                <Form {...form}>
                  <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                      <Label className="font-semibold text-lg">Select Name Tone</Label>
                      <div className="flex flex-wrap gap-3">
                        {toneOptions.map((tone) => (
                          <Button
                            key={tone}
                            type="button"
                            className="rounded-full px-6 py-2 font-medium text-sm"
                            variant={form.getValues('tone') === tone ? 'default' : 'outline'}
                            onClick={() =>
                              form.setValue('tone', tone, {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                            }
                          >
                            {tone}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </div>

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-lg">What Industry or Sector Are You In?</FormLabel>
                          <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                            <SelectTrigger className="h-12 w-full text-lg md:w-1/2">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {industryOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nameCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-lg">Number of name</FormLabel>
                          <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                            <SelectTrigger className="h-12 w-full text-lg md:w-1/2">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {nameCountOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-lg">What's Your Business About?</FormLabel>
                          <FormControl>
                            <Textarea
                              className="min-h-[120px] resize-none text-lg"
                              placeholder="Write here.."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>

              <div className="mx-auto mt-8 flex w-full justify-center">
                <Button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 text-white transition-colors duration-200 hover:bg-primary-600"
                  disabled={isGenerating}
                  onClick={form.handleSubmit(onSubmit)}
                  style={{ paddingTop: '16px', paddingBottom: '16px', paddingLeft: '24px', paddingRight: '24px' }}
                >
                  <GenerateIcon size={24} />
                  <span className="font-medium text-base">Generate Business Names</span>
                </Button>
              </div>
            </div>
            {/* Desktop-contained loader mirrors history loader layout */}
            {isGenerating ? (
              <div className="hidden lg:block">
                <GeneratingLoader isVisible variant="contained" />
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="previous-history">
            <BusinessNameHistory />
          </TabsContent>
        </Tabs>
    </div>
  );
}
