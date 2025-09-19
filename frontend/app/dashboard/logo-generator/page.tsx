'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  type LogoGeneratorForm,
  logoGeneratorSchema,
} from '@/lib/validation/logo';
// No global loader for generation; use local generating loader overlay

// API removed: temporary local stubs to keep UI working without backend
// Remove these once the new API is implemented
// eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeLogoBg = async (..._args: any[]) => {};
const downloadFromGcs = async (url: string) => fetch(url).then((r) => r.blob());

import { useRouter } from 'next/navigation';
import LogoHistory from '@/components/history/LogoHistory';
import { GenerateIcon } from '@/components/icons/generate-icon';
import { generateLogo } from '@/lib/api/logo';
import MobileHeader from '@/components/nav/MobileHeader';
import GeneratingLoader from '@/components/ui/generating-loader';

// moved to lib/validation/logo.ts

// using type from lib/validation/logo

const colorPalettes = [
  {
    name: 'Neon Pop',
    colors: ['#FF0000', '#00FF00', '#D500FF', '#FF00FF', '#F6FF00'],
  },
  {
    name: 'Sunset Sorbet',
    colors: ['#FF2350', '#FF5D2A', '#FF9945', '#FFB347', '#FFE156'],
  },
  {
    name: 'Deep Dusk',
    colors: ['#112266', '#3A176A', '#782AB6', '#B51FA7', '#F70072'],
  },
  {
    name: 'Emerald City',
    colors: ['#016A53', '#019267', '#01B087', '#00C9A7', '#16D5C7'],
  },
  {
    name: 'Purple Parade',
    colors: ['#5C258D', '#763AA6', '#A25BCF', '#C569E6', '#E159F8'],
  },
  {
    name: 'Coffee Tones',
    colors: ['#6A4E42', '#7E5C4C', '#9C6D59', '#B08B74', '#CDC1B5'],
  },
  {
    name: 'None',
    colors: [],
  },
];

const logoStyles = [
  {
    name: 'Modern Mascot Logo',
    description: 'Colorful, detailed animal and character mascots',
    examples: ['lion', 'wolf', 'bear', 'dragon'],
    img: 'https://www.designbolts.com/wp-content/uploads/2021/04/35-Professional-Mascot-Logo-Designs-for-Inspiration-2-1.jpg',
  },
  {
    name: 'Black & White Line Logo',
    description: 'Minimalist, abstract logos using lines and simple shapes',
    examples: ['geometric', 'linear', 'minimal'],
    img: 'https://img.freepik.com/free-vector/set-company-logo-design-ideas-vector_53876-64063.jpg?semt=ais_hybrid&w=740',
  },
  {
    name: 'Vintage Logo',
    description: 'Circular, badge-like logos with classic typography',
    examples: ['retro', 'classic', 'badge'],
    img: 'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/115826584/original/9c766a1c4e0fd29459a672c82ad1e85f575c16f8/design-two-modern-retro-vintage-logo-for-you.jpg',
  },
  {
    name: 'Cartoon Logo',
    description: 'Colorful, playful cartoon-style logos',
    examples: ['fun', 'playful', 'animated'],
    img: 'https://i.pinimg.com/736x/fd/b0/a0/fdb0a0723e23829fc34a10055490f824.jpg',
  },
  {
    name: 'Minimal Logo',
    description: 'Clean, simple logos with abstract shapes',
    examples: ['clean', 'simple', 'abstract'],
    img: 'https://img.freepik.com/free-vector/pack-six-minimal-emblem-logo-template-promotion_1017-52219.jpg',
  },
  {
    name: 'Symbol Logo',
    description: 'Logos based on a single, distinct symbol or initial',
    examples: ['symbol', 'initial', 'iconic'],
    img: 'https://img.freepik.com/premium-vector/modern-sharp-line-letter-b-logo-design-branding_571869-1570.jpg',
  },
  {
    name: 'Abstract Logo',
    description: 'Highly stylized, non-representational logos',
    examples: ['artistic', 'creative', 'unique'],
    img: 'https://cdn.dribbble.com/userupload/17056290/file/original-6b323250b4ca187d4b7d378d3e6b15fc.jpg',
  },
];

// Utility to extract user_id from JWT in access_token cookie
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

export default function LogoGeneratorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'logo-generate' | 'previous-history'
  >('logo-generate');
  const [isGenerating, setIsGenerating] = useState(false);

  // History now handled inside LogoHistory component

  const form = useForm<LogoGeneratorForm>({
    resolver: zodResolver(logoGeneratorSchema),
    defaultValues: {
      businessName: '',
      logoDescription: '',
      colorPalette: '',
      logoStyle: '',
    },
  });

  const onSubmit = async (data: LogoGeneratorForm) => {
    setIsGenerating(true);
    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error('User not authenticated');

      // Call the real API
      const response = await generateLogo({
        logo_title: data.businessName,
        logo_vision: data.logoDescription,
        color_palette_name: data.colorPalette,
        logo_style: data.logoStyle,
        user_id: userId,
      });

      // Show success message
      toast.success('Logo generated successfully!');

      // Navigate to the generated logo page using the real logo ID from response
      router.push(`/dashboard/logo-generator/${response.id}`);
    } catch (err: any) {
      console.error('Failed to generate logo:', err);
      toast.error(
        err.response?.data?.message || err.message || 'Failed to generate logo'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // History actions handled inside LogoHistory component

  return (
    <div className="w-full max-w-none relative">
      {/* Full-screen overlay only on mobile/tablet; desktop uses contained loader */}
      {isGenerating && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <GeneratingLoader isVisible variant="full" />
        </div>
      )}
      {/* Mobile header (hidden on lg+), sits above tabs like Figma */}
      <MobileHeader
  className="bg-white relative z-[10000]"
        showBorder
        title="Logo Generate"
      />

      {/* Header with Tabs */}

  <Tabs
        className="w-full max-w-none"
        onValueChange={(value) =>
          setActiveTab(value as 'logo-generate' | 'previous-history')
        }
        value={activeTab}
      >
        <TabsList className="lg:mb-6 mb-3">
          <TabsTrigger value="logo-generate">Logo Generate</TabsTrigger>
          <TabsTrigger value="previous-history">Previous History</TabsTrigger>
        </TabsList>

        <TabsContent value="logo-generate">
          {/* Logo Generate Form */}
          <div className={`w-full ${isGenerating ? 'hidden' : ''}`}>
            <div className="space-y-6">
              <div className='hidden lg:block'>
                <h2 className="mb-2 font-bold text-3xl text-gray-900">
                  Create Your Perfect Logo Instantly with AI
                </h2>
                <p className="text-gray-600 text-lg">
                  No design skills? No problem. Just tell us your brand
                  name—we'll handle the creativity.
                </p>
              </div>

              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-base  lg:text-lg">
                          Business Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-12 text-lg"
                            placeholder="Enter your business name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-base  lg:text-lg">
                          Describe Your Logo
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[120px] text-lg"
                            placeholder="Tell us little about your Logo"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colorPalette"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-base  lg:text-lg">
                          Select Color Palette
                        </FormLabel>
                        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                          {colorPalettes.map((palette) => {
                            const selected = field.value === palette.name;
                            return (
                              <div
                                className={` cursor-pointer rounded-lg border md:px-3 md:py-2 p-2 transition-all ${
                                  selected
                                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                                    : 'border-gray-300 bg-white hover:border-primary-300'
                                }`}
                                key={palette.name}
                                onClick={() => field.onChange(palette.name)}
                              >
                                {palette.colors.length === 0 ? (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <span className="font-normal text-black text-sm md:text-base">
                                      {palette.name}
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="mb-3 text-center">
                                      <span className="font-normal text-black text-sm md:text-base">
                                        {palette.name}
                                      </span>
                                    </div>
                                    <div className="flex justify-center">
                                      {palette.colors.map((color, idx) => (
                                        <div
                                          className="-ml-2 md:h-8 md:w-8 h-6 w-6 rounded-full first:ml-0"
                                          key={idx}
                                          style={{ backgroundColor: color }}
                                          title={color}
                                        />
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logoStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-base  lg:text-lg">
                          Select Your Preferred Style
                        </FormLabel>
                        <div
                          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"
                          style={{ gap: '12px' }}
                        >
                          {logoStyles.map((style) => {
                            const selected = field.value === style.name;
                            return (
                              <div
                                className={` flex-shrink-0 cursor-pointer rounded-2xl border-2 p-3 transition-all ${
                                  selected
                                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                                    : 'border-gray-200 bg-white hover:border-primary-300'
                                } group`}
                                key={style.name}
                                onClick={() => field.onChange(style.name)}
                              >
                                <div className="relative h-32 w-full overflow-hidden rounded-xl">
                                  <Image
                                    alt={style.name}
                                    className=""
                                    fill
                                    loading="lazy"
                                    sizes="258px"
                                    src={style.img}
                                    style={{ objectFit: 'cover' }}
                                  />
                                </div>
                                <div className="text-center mt-3">
                                  <h3 className="font-normal  text-sm">
                                    {style.name}
                                  </h3>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-primary-600 font-medium text-lg text-white hover:bg-primary-700"
                    disabled={isGenerating}
                    style={{
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '24px',
                      paddingRight: '24px',
                    }}
                    type="submit"
                  >
                    <div className="flex h-6 w-6 items-center justify-center">
                      <GenerateIcon size={24} />
                    </div>
                    <span className="font-medium text-base">Generate Logo</span>
                  </Button>
                </form>
              </Form>
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
          <LogoHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
