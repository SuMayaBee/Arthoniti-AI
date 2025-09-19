'use client';

import clsx from 'clsx';

type Props = {
  className?: string;
  title?: string;
};

export default function AboutHeading({
  className = '',
  title = 'Building the Future of AI-Powered Creativity',
}: Props) {
  return (
    <section
      className={clsx(
        'h-[220px] overflow-x-hidden bg-cover bg-top bg-no-repeat md:h-[300px] lg:h-[360px] xl:h-[560px]',
        className
      )}
      style={{ backgroundImage: "url('/images/about-bg.svg')" }}
    >
      {/* content */}
      <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 pt-10 pb-0 text-center md:pt-14 lg:pt-16">
        <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-100 px-6 py-3 font-normal text-lg text-white shadow-sm ring-1 ring-black/5">
          About Us
        </div>
        <h1 className="mt-4 font-extrabold text-2xl text-foreground tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
          <span className="mr-2">🚀</span>
          {title}
        </h1>
      </div>

      {/* Spacer to guarantee minimum gap below curve */}
    </section>
  );
}
