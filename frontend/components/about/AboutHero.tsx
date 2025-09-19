'use client';

import clsx from 'clsx';
import Image from 'next/image';

type Props = {
  className?: string;
};

export default function AboutHero({ className = '' }: Props) {
  return (
    <section className={clsx('relative', className)}>
      <div className="container mx-auto px-4">
        <div
          className="relative overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, black 30%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 90%)',
          }}
        >
          <Image
            alt="About hero visual"
            className="h-auto w-full object-cover"
            height={720}
            priority
            sizes="100vw"
            src="/images/about-hero.png"
            width={1280}
          />
        </div>
      </div>
    </section>
  );
}
