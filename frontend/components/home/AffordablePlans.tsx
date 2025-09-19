import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CrownIcon from '../icons/CrownIcon';
import { motion } from 'framer-motion';

type Props = {
  className?: string;
};

const features: string[] = [
  'Generate a Complete Website',
  'Generate Business Documents',
  'Generate NDA (Non-Disclosure Agreement)',
  'Generate Pitch Deck',
  'Create Unlimited Videos',
  'Generate Business Proposal',
  'Generate Brand Logo',
  'Priority support',
  // 'Premium Fast Chat',
  // 'Deploy Website with One Click',
  // 'Partnership Agreement',
  // 'Immediate full access',
];

const benefits: { title: string; desc: string }[] = [
  {
    title: 'AI-Powered Efficiency',
    desc: 'Generate videos, pitch decks, logos, and documents in minutes, not weeks.',
  },
  {
    title: 'Affordable for Founders',
    desc: 'Cut costs by 80% compared to hiring agencies or freelancers.',
  },
  {
    title: 'Professional-Grade Quality',
    desc: 'Investor-ready pitch decks, legally vetted NDAs, and designs that look world-class.',
  },
  {
    title: 'No Learning Curve',
    desc: 'Simple, intuitive, and beginner-friendly. Just type your idea, and AI brings it to life.',
  },
];

export default function AffordablePlans({ className = '' }: Props) {
  return (
    <section
      aria-label="Affordable Plans"
      className={[
        'relative mx-auto w-11/12 scroll-mt-28 lg:w-10/12 overflow-x-hidden',
        '',
        className,
      ].join(' ')}
      id="pricing"
    >
      {/* Heading */}
      <div className="text-center">
        <h2 className="font-medium text-4xl md:text-6xl">
          Affordable Plans for Every Founder
        </h2>
      </div>

      {/* Content */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8 overflow-x-hidden">
        {/* Left: Premium card */}
        <motion.div
          className="rounded-[28px] border border-primary-500 bg-primary-50 shadow-md shadow-primary-400 transform-gpu will-change-transform overflow-x-hidden"
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ amount: 0.2, once: false }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Gradient border wrapper */}
          <div className=" p-[2px] shadow-lg">
            {/* Inner card */}
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="text-center">
                <h3 className="font-bold text-3xl">Direct Purchase Premium</h3>
                <p className="mt-1 text-md text-slate-500">
                  Unlock everything right away.
                </p>

                <div className="mt-4 text-lg">
                  <span className="font-semibold text-primary-500">
                    $500 one-time payment
                  </span>
                  <span className="text-slate-500"> After </span>
                  <span className="font-semibold">$50/Month subscription</span>
                </div>

                <div className="mt-1 flex items-center justify-center text-md text-slate-900">
                  <Image
                    alt="Tick"
                    height={18}
                    src="/images/tick-scheld.svg"
                    width={18}
                  />
                  <span className="ml-2">Cancel anytime</span>
                </div>
              </div>

              {/* Features */}
              <ul className="mt-6 space-y-3">
                {features.map((f) => (
                  <li className="flex items-start gap-3" key={f}>
                    <span className="mt-0.5 inline-flex rounded-full">
                      <Image
                        alt="Tick"
                        height={24}
                        src="/images/octa-tick.svg"
                        width={24}
                      />
                    </span>
                    <span className="text-md text-slate-900">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-5 flex items-center justify-center gap-5">
                <Button
                  asChild
                  className="rotating-gradient-border w-full p-[2px]"
                  variant="rainbow"
                >
                  <Link className="w-full" href="/signup">
                    <span className="!flex w-full items-center justify-center gap-2 font-normal text-md">
                      <CrownIcon className="inline-block" size={20} />
                      <span className="leading-none">3 Days Free Trial</span>
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: 2x2 benefit cards */}
        <div className="flex flex-col gap-4 overflow-x-hidden">
          {benefits.map((b, idx) => {
            const fromX = idx % 2 === 0 ? -60 : 60; // alternate from sides
            const delay = 0.05 * idx;
            return (
              <motion.div
                key={b.title}
                className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm transform-gpu will-change-transform"
                initial={{ opacity: 0, x: fromX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.2, once: false }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
              >
                <h4 className="font-semibold text-2xl text-primary-500">{b.title}</h4>
                <p className="mt-1 font-normal text-base text-slate-900">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
