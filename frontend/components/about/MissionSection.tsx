'use client';

import clsx from 'clsx';
import Image from 'next/image';

type Props = {
  className?: string;
  pcWrapperClassName?: string; // additional classes to control left/right/top/bottom, etc.
};

export default function MissionSection({
  className = '',
  pcWrapperClassName = '',
}: Props) {
  return (
    <section className={clsx('relative', className)}>
      <div className="lg:10/12 p container mx-auto grid w-11/12 items-center justify-between gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Left: mission copy */}
        <div>
          <h2 className="text-pretty font-extrabold text-4xl text-foreground leading-tight sm:text-4xl md:text-6xl">
            Our mission is simple make advanced
            <span className="text-primary"> AI accessible</span>, practical, and
            powerful for
            <span className="text-primary"> everyone</span>.
          </h2>
        </div>

        {/* Right: mockups */}
        <div className="relative flex h-[420px] w-full items-center justify-center md:h-[460px] lg:h-[500px]">
          {/* subtle circular bg */}

          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
            <div className="flex h-80 w-80 items-center justify-center rounded-full border border-primary-50 bg-theme-50 px-11 py-16 md:h-96 md:w-96 lg:h-[432px] lg:w-[432px]">
              <div className="h-[195px] w-[224px] rounded-full bg-primary-50 lg:h-[295px] lg:w-[343px]" />
            </div>
          </div>
          <div
            className={clsx(
              '-translate-x-10 -translate-y-2 md:-translate-x-24 md:-translate-y-3 lg:-translate-x-24 lg:-translate-y-4 relative top-0 left-0 z-10 w-72 sm:w-72 md:w-[32rem] lg:w-[24rem] xl:w-[32rem]',
              pcWrapperClassName
            )}
            style={{ aspectRatio: '14 / 10' }}
          >
            <Image
              alt="AI desktop generation interface"
              className="object-contain"
              fill
              priority
              sizes="(min-width: 1536px) 24rem, (min-width: 1280px) 20rem, (min-width: 1024px) 20rem, (min-width: 768px) 18rem, (min-width: 640px) 16rem, 14rem"
              src="/images/Generating-pc.png"
            />
          </div>

          {/* mobile mock overlay */}
          <div
            className="md:-bottom-16 absolute right-0 bottom-3 z-20 w-28 sm:w-20 md:right-0 md:w-[12rem] lg:right-0 lg:bottom-0 lg:w-32 xl:w-40"
            style={{ aspectRatio: '10 / 21' }}
          >
            <Image
              alt="AI mobile code view"
              className="object-contain"
              fill
              sizes="(min-width: 1536px) 13rem, (min-width: 1280px) 11rem, (min-width: 1024px) 11rem, (min-width: 768px) 8rem, (min-width: 640px) 5rem, 5rem"
              src="/images/Code-mobile.png"
            />
          </div>

          {/* desktop mock */}
        </div>
      </div>
    </section>
  );
}
