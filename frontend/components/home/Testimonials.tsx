import { motion } from 'framer-motion';
import TestimonialCarousel from '../TestimonialCarousel';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    content:
      'Scalebuild AI transformed our online presence. The website they built for us increased our lead generation by 200% in just three months.',
    rotation: 'lg:-rotate-12',
    position: 'lg:absolute lg:-left-2 lg:top-20',
    zIndex: 'z-10',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Founder, DesignHub',
    content:
      'The video content created by Scalebuild AI perfectly captured our brand voice. The quality exceeded our expectations!',
    rotation: 'lg:rotate-[20deg]',
    position: 'lg:absolute lg:-right-5 lg:top-20',
    zIndex: 'z-30',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Marketing Director, GrowthLabs',
    content:
      'Their document generation service saved us countless hours. The AI understands context and delivers professional results every time.',
    rotation: 'lg:-rotate-[26deg]',
    position: 'lg:absolute lg:left-[27rem] lg:top-[10rem]',
    zIndex: 'z-20',
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'CTO, InnovateX',
    content:
      'The AI integration was seamless and the results were remarkable. Our team was able to focus on strategy while Scalebuild handled the execution.',
    rotation: 'lg:rotate-[20deg]',
    position: 'lg:absolute lg:right-[10rem] lg:top-[25rem]',
    zIndex: 'z-20',
  },
  {
    id: 5,
    name: 'Jessica Williams',
    role: 'Product Manager, TechNova',
    content:
      'The speed and accuracy of their AI solutions helped us launch our product two months ahead of schedule. Truly impressive!',
    rotation: 'lg:-rotate-[20deg]',
    position: 'lg:absolute lg:left-[10rem] lg:top-[30rem]',
    zIndex: 'z-50',
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto w-11/12 overflow-x-hidden bg-white py-16 lg:w-full dark:bg-slate-900">
      <div className="mx-auto w-full">
        <div className="mb-24 text-center">
          <h2 className="font-medium text-4xl text-slate-900 md:text-6xl dark:text-white">
           What Our Clients Say
          </h2>
          <p className="mt-4 font-normal text-md text-slate-900 dark:text-slate-300">
            Founders and solopreneurs building better, smarter, and more cost-effective businesses with Hyperscaler.
          </p>
        </div>

        {/* Mobile Carousel - Hidden on desktop */}
        <div className="lg:hidden">
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>

        {/* Desktop Grid - Hidden on mobile */}
        <div className="relative hidden h-[600px] lg:block lg:h-[800px]">
          {TESTIMONIALS.map((t) => {
            const originClass = t.position.includes('left') ? 'origin-left' : 'origin-right';
            const fromAngle = t.position.includes('left') ? -90 : 90;
            return (
              <motion.div
                key={t.id}
                className={`${t.position} ${t.zIndex} absolute ${originClass} w-full lg:w-2/5`}
                initial={{ rotateZ: fromAngle, opacity: 0 }}
                whileInView={{ rotateZ: 0, opacity: 1 }}
                viewport={{ amount: 0, margin: '200px 0px -100px 0px', once: false }}
                transition={{ type: 'spring', stiffness: 140, damping: 16, mass: 0.6 }}
              >
                <div
                  className={`${t.rotation} relative w-full gap-5 rounded-xl bg-white/95 p-6 shadow-lg shadow-purple-400 backdrop-blur-sm transition-all duration-300 dark:bg-slate-800/95`}
                >
                  <div className="mb-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                        <span className="font-medium text-lg text-slate-800 dark:text-white">
                          {t.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium font-space-grotesk text-3xl text-slate-900 dark:text-white">
                        {t.name}
                      </h4>
                      <p className="text-lg text-slate-600 dark:text-slate-400">{t.role}</p>
                    </div>
                  </div>
                  <p className="font-normal text-lg text-slate-900 dark:text-slate-300">"{t.content}"</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
