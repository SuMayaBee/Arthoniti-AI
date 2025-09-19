'use client';

import Image from 'next/image';
import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';

type Service = {
  title: string;
  description: string;
  Icon: FC;
};

const CARD_VARIANTS_LEFT = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const CARD_VARIANTS_RIGHT = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const CARD_DURATION = 0.5;
const CARD_EASE = 'easeInOut';

function AnimatedCard({
  children,
  variants,
  className,
}: {
  children: ReactNode;
  variants: typeof CARD_VARIANTS_LEFT | typeof CARD_VARIANTS_RIGHT;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();

  // If already in view on mount (e.g., refresh mid-page), reveal immediately
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const checkInView = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh && rect.bottom > 0) {
        controls.start('visible');
      }
    };
    checkInView();
    // Fallback: ensure visible after mount so cards don't remain off-screen
    const t = window.setTimeout(() => controls.start('visible'), 100);
    window.addEventListener('scroll', checkInView, { passive: true });
    window.addEventListener('resize', checkInView);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('scroll', checkInView);
      window.removeEventListener('resize', checkInView);
    };
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="visible"
      animate={controls}
      onViewportEnter={() => controls.start('visible')}
      onViewportLeave={() => controls.start('hidden')}
      viewport={{ amount: 0.05, once: false }}
      transition={{ duration: CARD_DURATION, ease: CARD_EASE }}
    >
      {children}
    </motion.div>
  );
}

// Simple wrapper used by icon components to keep size/layout consistent
const GradientCard = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto flex h-32 w-64 items-center justify-center sm:h-36 sm:w-72">
    <div className="relative h-full w-full">{children}</div>
  </div>
);

function SwapImages({
  normalSrc,
  extendedSrc,
  altNormal,
  altExtended,
  sizes,
  intervalMs = 2500,
}: {
  normalSrc: string;
  extendedSrc: string;
  altNormal: string;
  altExtended: string;
  sizes: string;
  intervalMs?: number;
}) {
  const [isExtended, setIsExtended] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) {
      // pause rotation on hover
      return;
    }
    const id = setInterval(() => {
      setIsExtended((v) => !v);
    }, intervalMs);
    return () => clearInterval(id);
  }, [hovered, intervalMs]);

  return (
    <button
      aria-label="Preview service image"
      className="relative h-full w-full"
      onMouseEnter={() => {
        setHovered(true);
        setIsExtended(true);
      }}
      onMouseLeave={() => setHovered(false)}
      type="button"
    >
      <Image
        alt={altNormal}
        className={`object-contain transition-opacity duration-1000 ease-in-out ${isExtended ? 'opacity-0' : 'opacity-100'}`}
        fill
        priority
        sizes={sizes}
        src={normalSrc}
      />
      <Image
        alt={altExtended}
        className={`object-contain transition-opacity duration-1000 ease-in-out ${isExtended ? 'opacity-100' : 'opacity-0'}`}
        fill
        priority
        sizes={sizes}
        src={extendedSrc}
      />
    </button>
  );
}

const CodeIcon = () => (
  <GradientCard>
    <SwapImages
      altExtended="Website generate extended"
      altNormal="Website generate"
      extendedSrc="/images/services/web-extend.png"
      normalSrc="/images/services/web-normal.png"
      sizes="(min-width: 1024px) 288px, 256px"
    />
  </GradientCard>
);

const PlayIcon = () => (
  <GradientCard>
    <SwapImages
      altExtended="Video generate extended"
      altNormal="Video generate"
      extendedSrc="/images/services/video-extend.png"
      normalSrc="/images/services/video-normal.png"
      sizes="(min-width: 1024px) 288px, 256px"
    />
  </GradientCard>
);

const DocIcon = () => (
  <GradientCard>
    <SwapImages
      altExtended="Document generate extended"
      altNormal="Document generate"
      extendedSrc="/images/services/document-extend.png"
      normalSrc="/images/services/document-normal.png"
      sizes="(min-width: 1024px) 288px, 256px"
    />
  </GradientCard>
);

const ShapesIcon = () => (
  <GradientCard>
    <SwapImages
      altExtended="Business logo generate extended"
      altNormal="Business logo generate"
      extendedSrc="/images/services/logo-extend.png"
      normalSrc="/images/services/logo-normal.png"
      sizes="(min-width: 1024px) 288px, 256px"
    />
  </GradientCard>
);

const NameCardIcon = () => (
  <GradientCard>
    <SwapImages
      altExtended="Business name generate extended"
      altNormal="Business name generate"
      extendedSrc="/images/services/business-name-extend.png"
      normalSrc="/images/services/business-name-normal.png"
      sizes="(min-width: 1024px) 288px, 256px"
    />
  </GradientCard>
);

const IdCardIcon = () => (
  <GradientCard>
    <SwapImages
      altExtended="Pitch deck generate extended"
      altNormal="Pitch deck generate"
      extendedSrc="/images/services/pitch-deck-extend.png"
      normalSrc="/images/services/pitch-deck-normal.png"
      sizes="(min-width: 1024px) 288px, 256px"
    />
  </GradientCard>
);

const SERVICES: Service[] = [
  {
    title: 'Generate Website',
    description:
      'Launch a sleek, responsive website with zero coding. Go from an idea to a live working space in a click from a prompt.',
    Icon: CodeIcon,
  },
  {
    title: 'Generate Videos',
    description:
      'Generate high converting videos for your niche with zero editing skill. All you need is Script and Prompt.',
    Icon: PlayIcon,
  },
  {
    title: 'Generate Documents',
    description:
      'Create professional NDAs, proposals, and partnership contracts in minutes, vetted by experts.',
    Icon: DocIcon,
  },
  {
    title: 'Generate Business Logo',
    description:
      'Instantly design your tailored sleek, professional brand logo that stands out.',
    Icon: ShapesIcon,
  },
  {
    title: 'Generate Business Name',
    description:
      'From idea to identity: Instantly generate unique business names designed to capture attention and fuel growth',
    Icon: NameCardIcon,
  },
  {
    title: 'Generate Pitch Deck',
    description:
      'Generate AI-powered presentations that highlights  your vision and close the deal.',
    Icon: IdCardIcon,
  },
];

export default function Services({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8 overflow-x-hidden',
        className
      )}
      id="services"
    >
      <h2 className="text-center font-medium text-4xl text-slate-900 tracking-tight md:text-6xl dark:text-white">
        Hyperscaler Services
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {SERVICES.map((svc, idx) => {
          const { title, description, Icon } = svc;
          const variants = idx % 2 === 0 ? CARD_VARIANTS_LEFT : CARD_VARIANTS_RIGHT; // 1,3,5 from left; 2,4,6 from right
          return (
            <AnimatedCard
              key={title}
              variants={variants}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transform-gpu will-change-transform dark:border-white/10 dark:bg-white/[0.06]"
            >
              <Icon />
              <h3 className="mt-6 font-bold text-3xl text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-slate-700 text-sm leading-6 dark:text-slate-300">{description}</p>
            </AnimatedCard>
          );
        })}
      </div>
    </section>
  );
}
