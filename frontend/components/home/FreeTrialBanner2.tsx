'use client';

import Link from 'next/link';
import CheckIcon from '@/components/icons/CheckIcon';
import { Button } from '@/components/ui/button';

type Props = {
  className?: string;
};

export default function FreeTrialBanner2({ className = '' }: Props) {
  return (
    <div className="relative w-full py-20">
      <section
        aria-label="Turn Your Ideas Into Reality With AI"
        className={[
          'mx-auto w-11/12 px-5 py-10 lg:w-10/12',
          'rounded-tl-[16px] rounded-tr-[120px] rounded-br-[16px] rounded-bl-[120px]',
          'bg-gradient-to-r from-primary-600 via-fuchsia-50 to-primary-600',
          'flex items-center justify-center overflow-hidden text-black shadow-lg shadow-purple-900/15 lg:h-[375px]',
          className,
        ].join(' ')}
      >
        <div className="text-center">
          <h2 className="text-balance font-semibold text-4xl">
            Turn Your Ideas Into Reality With AI
          </h2>
          <p className="mx-auto mt-3 font-normal text-[20px]">
            Get instant access to powerful AI tools for content, design, and
            growth.
          </p>

          {/* Free trial badge */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-[16px] text-slate-800">
            <span className="rounded-full bg-primary-500 p-[2px]">
              <CheckIcon className="h-5 w-5 text-white" size={20} />
            </span>
            <span>Free 3‑days trial</span>
          </div>

          <div className="mt-6">
            <Button
              asChild
              className="rotating-gradient-border p-[2px]"
              variant="rainbow"
            >
              <Link className="p-0" href="/signup">
                <span className="px-7 py-4 font-normal text-base">
                  Sign Up Now
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
