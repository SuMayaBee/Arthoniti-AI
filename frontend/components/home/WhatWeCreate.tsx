'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

type TabKey =
  | 'logo'
  | 'video'
  | 'businessName'
  | 'pitchDeck'
  | 'document'
  | 'website';

const TAB_ITEMS: { key: TabKey; label: string }[] = [
  { key: 'website', label: 'Website' },
  { key: 'video', label: 'Video' },
  { key: 'logo', label: 'Logo' },
  { key: 'businessName', label: 'Business Name' },
  { key: 'pitchDeck', label: 'Pitch Deck' },
  { key: 'document', label: 'Document' },
];

// For now, use placeholder image URLs (safe Unsplash sources). The user can replace later.
const PLACEHOLDER_IMAGES: Record<TabKey, string[]> = {
  logo: [
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975922224-c6c77767dc07?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522199670076-2852f80289c7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop',
  ],
  video: [
    'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop',
  ],
  businessName: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
  ],
  pitchDeck: [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555421689-43cad7100751?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200&auto=format&fit=crop',
  ],
  document: [
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488998527040-85054a85150e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop',
  ],
  website: [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  ],
};

function ImageGrid({ images }: { images: string[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2, once: false }}
      transition={{ staggerChildren: 0.08 }}
    >
      {images.map((src) => (
        <motion.div
          key={src}
          className="overflow-hidden rounded-lg border border-input bg-white shadow-sm will-change-transform transform-gpu"
          variants={{
            hidden: { opacity: 0, rotateX: -15, y: 24, transformOrigin: 'top center' },
            visible: { opacity: 1, rotateX: 0, y: 0 },
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            alt="placeholder"
            className="block h-[420px] w-full object-cover"
            height={600}
            priority={false}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={src}
            width={800}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function WhatWeCreate({ className }: { className?: string }) {
  return (
    <section className={clsx('mx-auto w-11/12 lg:w-10/12', className)}>
      <h2 className="mb-6 text-center font-medium text-4xl text-foreground tracking-tight md:mb-8 md:text-6xl">
        What We Create for You
      </h2>

      <Tabs className="w-full" defaultValue="logo">
        <div className="flex w-full justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2, once: false }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <TabsList className="flex h-auto w-full flex-wrap justify-center gap-3 rounded-none border-0 bg-transparent p-0 sm:gap-4 lg:inline-flex lg:h-16 lg:w-auto lg:flex-nowrap lg:gap-4 lg:rounded-[100px] lg:border lg:border-input lg:bg-white lg:p-3">
              {TAB_ITEMS.map((t) => (
                <TabsTrigger
                  className="rounded-full border border-primary-300/60 px-6 py-3 font-medium text-base text-foreground transition-colors data-[state=active]:border-transparent data-[state=active]:bg-primary-500 data-[state=active]:text-white sm:py-3.5 lg:border-0 lg:px-8 lg:text-black lg:text-sm lg:data-[state=active]:shadow-sm"
                  key={t.key}
                  value={t.key}
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>
        </div>

        {TAB_ITEMS.map((t) => (
          <TabsContent className="mt-6 md:mt-8" key={t.key} value={t.key}>
            <ImageGrid images={PLACEHOLDER_IMAGES[t.key]} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
