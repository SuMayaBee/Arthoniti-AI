"use client";

import Image from "next/image";
import Link from "next/link";
import CheckIcon from "@/components/icons/CheckIcon";
import { Button } from "@/components/ui/button";

type Props = {
  className?: string;
};

export default function FreeTrialBanner({ className = "" }: Props) {
  return (
    <div className="relative w-full py-20">
      <section
        aria-label="Start your 3-days free trial"
        className={[
          "mx-auto w-11/12 px-5 py-10 lg:w-10/12",
          "rounded-[50px] lg:rounded-[120px]",
          "bg-gradient-to-r from-primary-400 via-fuchsia-50 to-primary-400",
          "flex items-center justify-center overflow-hidden text-black shadow-lg shadow-purple-900/15 lg:h-[375px]",
          className,
        ].join(" ")}
      >
        {/* Decorative stars */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          {/* Left star cluster */}
          <div className="-translate-y-1/2 absolute top-2/3 left-[15rem] hidden lg:block">
            <Image
              alt="Decorative star"
              height={140}
              priority
              src="/images/AI-2.png"
              width={140}
            />
          </div>
          {/* Right star cluster */}
          <div className="lg:-top-16 -top-3 absolute right-0 lg:right-16">
            <Image
              alt="Decorative star cluster"
              className="h-[170px] w-[170px] lg:h-[330px] lg:w-[330px]"
              height={330}
              priority
              src="/images/AI.png"
              width={330}
            />
          </div>
          {/* Small top-right accent star */}
          {/* <div className="absolute top-4 right-6 hidden sm:block">
          <Image
            alt="Accent star"
            height={56}
            priority
            src="/images/AI-2.png"
            width={56}
          />
        </div> */}
        </div>

        <div className="text-center">
          <h2 className="text-balance font-bold text-2xl md:text-4xl">
            Start your 3-days free trial
          </h2>
          <p className="mx-auto mt-3 font-normal text-[20px]">
            Experience the full power of AI‑generated videos, logos, websites,
            and more — no credit card required.
          </p>

          {/* Free trial badge */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-slate-800 text-sm">
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
                <span className="px-7 py-4 font-normal text-md">
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
