'use client';

import Image from 'next/image';
import { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import 'swiper/css';
import { Card } from './ui/card';

const TestimonialCarousel = ({ testimonials }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative w-full">
      <Swiper
        className="w-full rounded-2xl"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        spaceBetween={20}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <Card className="z-30 mx-auto w-full rounded-2xl border border-slate-200 bg-white p-0 shadow-lg shadow-purple-400/30 dark:border-slate-700 dark:bg-slate-800/95">
              {/* Image header */}
              <div className="testimonial-curved relative m-5 h-[20rem] overflow-hidden bg-white ring-1 ring-slate-200">
                <Image
                  alt={`${testimonial.name}, ${testimonial.role}`}
                  className="block object-cover"
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
                  src="/images/testimonial-example.jpg"
                />
              </div>

              <div className="px-6 pt-4 pb-6">
                <div className="mb-4 flex items-center">
                  <div>
                    <h4 className="font-space-grotesk font-medium text-lg text-slate-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-slate-600 text-sm dark:text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-slate-900 dark:text-slate-300">
                  "{testimonial.content}"
                </p>
              </div>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom navigation controls */}
      <div className="mt-6 flex items-center justify-end gap-4">
        <button
          aria-label="Previous testimonial"
          className="flex h-[56px] w-[84px] items-center justify-center rounded-full border-2 border-purple-500 text-purple-600 transition-colors hover:bg-purple-50 dark:border-purple-400 dark:text-purple-300 dark:hover:bg-purple-900/20"
          onClick={() => swiperRef.current?.slidePrev()}
          type="button"
        >
          {/* Left arrow icon */}
          <ChevronLeftIcon size={20} />
        </button>
        <button
          aria-label="Next testimonial"
          className="flex h-[56px] w-[84px] items-center justify-center rounded-full border-2 border-purple-500 text-purple-600 transition-colors hover:bg-purple-50 dark:border-purple-400 dark:text-purple-300 dark:hover:bg-purple-900/20"
          onClick={() => swiperRef.current?.slideNext()}
          type="button"
        >
          {/* Right arrow icon */}
          <ChevronRightIcon size={20} />
        </button>
      </div>

      {/* Pagination bullets removed */}
    </div>
  );
};

export default TestimonialCarousel;
