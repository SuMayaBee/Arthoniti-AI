'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TrustBanner({ className }: { className?: string }) {
  return (
    <section
      aria-label="Trusted brands"
      className={cn('mx-auto w-full', className)}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/60 px-6 py-12 shadow-sm backdrop-blur-md sm:py-14 lg:py-16 dark:border-white/10 dark:bg-white/[0.06]">
        {/* soft purple glow edges */}
        <div className="-z-10 pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-fuchsia-300 to-transparent blur-3xl" />
        <div className="-z-10 pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-fuchsia-300 blur-3xl" />

        <h2 className="text-center font-medium text-4xl text-slate-900 tracking-tight md:text-6xl dark:text-white">
          See the Leading Brands That Trust Our Product
        </h2>

        {/* brands row */}
        <div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-6 text-center text-slate-600 text-sm sm:grid-cols-3 lg:grid-cols-6 dark:text-slate-300">
          {[
            'Amplitude',
            'Invoice2go',
            'XPENG',
            'Amplitude',
            'veroxfloor',
            'RPUBLICA',
          ].map((name, i) => (
            <div
              className={cn(
                'flex items-center justify-center gap-2',
                'h-10 rounded-md border-white/20 text-slate-700 dark:text-slate-200'
              )}
              key={name + i}
            >
              {/* simple dot logo */}
              <span className="h-2 w-2 rounded-full bg-slate-400/80" />
              <span className="tracking-widest">{name}</span>
            </div>
          ))}
        </div>

        {/* subtitle */}
        <p className="mt-10 text-center font-normal text-2xl text-slate-900 dark:text-slate-200">
          Trusted by{' '}
          <span className="bg-purple-500 bg-clip-text font-semibold text-transparent">
            1,000+
          </span>{' '}
          founders and solopreneurs worldwide
        </p>

        {/* CTA (same style as Sign Up button) */}
        <div className="mt-6 flex justify-center">
          <Button asChild className="p-[2px] sm:inline-flex" variant="rainbow">
            <Link
              aria-label="Start your journey"
              className="bg-white"
              href="#get-started"
            >
              <span className="!bg-white font-light text-[16px] text-black">
                Start Your Journey With Us
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
