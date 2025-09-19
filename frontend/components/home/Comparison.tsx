import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Props = { className?: string };

type CompetitorKey = 'hyperscaler' | 'cursor' | 'bolt' | 'replit';

type FeatureRow = {
  label: string;
  support: Record<CompetitorKey, boolean>;
};

const FEATURES: FeatureRow[] = [
  {
    label: 'No-Code Friendly',
    support: { hyperscaler: true, cursor: true, bolt: true, replit: true },
  },
  {
    label: 'AI for Content & Branding',
    support: { hyperscaler: true, cursor: true, bolt: true, replit: true },
  },
  {
    label: 'AI for Coding',
    support: { hyperscaler: true, cursor: true, bolt: false, replit: true },
  },
  {
    label: 'Logo Generation',
    support: { hyperscaler: true, cursor: false, bolt: false, replit: false },
  },
  {
    label: 'Pitch Deck Builder',
    support: { hyperscaler: true, cursor: false, bolt: false, replit: false },
  },
  {
    label: 'Video Generation',
    support: { hyperscaler: true, cursor: false, bolt: false, replit: false },
  },
  {
    label: 'Document Generation',
    support: { hyperscaler: true, cursor: false, bolt: false, replit: false },
  },
  {
    label: 'Business Name Generation',
    support: { hyperscaler: true, cursor: false, bolt: false, replit: false },
  },
];

const COLS: { key: CompetitorKey; title: string }[] = [
  { key: 'hyperscaler', title: 'Hyperscaler' },
  { key: 'cursor', title: 'Cursor' },
  { key: 'bolt', title: 'Bolt' },
  { key: 'replit', title: 'Replit' },
];

type IconProps = { className?: string };

const Check: FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    height="16"
    role="img"
    viewBox="0 0 24 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Check</title>
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const Cross: FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    height="16"
    role="img"
    viewBox="0 0 24 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Cross</title>
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export default function Comparison({ className }: Props) {
  return (
    <section
      className={cn('mx-auto w-11/12 scroll-mt-28 lg:w-10/12', className)}
      id="compare"
    >
      <h2 className="text-center font-medium text-4xl text-slate-900 md:text-6xl dark:text-white">
        AI Development Partner Comparison
      </h2>

      <div className="mt-10 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4 sm:gap-6 xl:grid xl:grid-cols-5">
          {/* Feature labels column */}
          <motion.div
            className="min-w-[220px] rounded-2xl border border-slate-200 bg-white p-5 xl:min-w-0 dark:border-white/10 dark:bg-white/[0.06]"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2, once: false }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-4 font-semibold text-slate-900 dark:text-white">
              Features
            </div>
            <ul className="space-y-5">
              {FEATURES.map((f) => (
                <li
                  className="flex h-8 items-center text-slate-800 dark:text-slate-200"
                  key={f.label}
                >
                  {f.label}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Competitor columns */}
          {COLS.map(({ key, title }, idx) => {
            const isPrimary = key === 'hyperscaler';
            return (
              <motion.div
                key={key}
                className="min-w-[220px] xl:min-w-0"
                initial={
                  isPrimary
                    ? { opacity: 0, scale: 0.94, filter: 'blur(6px)' }
                    : { opacity: 0, y: 30 }
                }
                whileInView={
                  isPrimary
                    ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                    : { opacity: 1, y: 0 }
                }
                viewport={{ amount: 0.2, once: false }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 * idx }}
              >
                <div
                  className={cn(
                    'rounded-2xl border p-5',
                    isPrimary
                      ? 'border-primary-500 bg-primary-500 text-white shadow-md shadow-primary-400'
                      : 'border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.06]'
                  )}
              >
                <div
                  className={cn(
                    'mb-4 text-center font-semibold',
                    isPrimary ? 'text-white' : 'text-slate-900 dark:text-white'
                  )}
                >
                  {title}
                </div>
                <ul className="space-y-5">
                  {FEATURES.map((f) => (
                    <li
                      className="flex h-8 items-center justify-center"
                      key={f.label}
                    >
                      {f.support[key] ? (
                        <Check
                          className={cn(
                            'h-6 w-6',
                            isPrimary ? 'text-white' : 'text-black'
                          )}
                        />
                      ) : (
                        <Cross
                          className={cn(
                            'h-6 w-6',
                            isPrimary ? 'text-white' : 'text-black'
                          )}
                        />
                      )}
                    </li>
                  ))}
                </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
