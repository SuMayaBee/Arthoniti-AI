"use client";

import Image from "next/image";
import Link from "next/link";
import EnvelopeIcon from "@/components/icons/EnvelopeIcon";
import LocationPinIcon from "@/components/icons/LocationPinIcon";
import PhoneFilledIcon from "@/components/icons/PhoneFilledIcon";

type Props = { className?: string };

export default function Footer({ className = "" }: Props) {
  return (
    <footer className={`${className} font-open-sans`}>
      <div className="relative w-full overflow-hidden rounded-t-[24px] bg-primary-50 lg:rounded-t-[52px]">
        {/* Background globe image fills the container; height comes from content below */}

        <Image
          alt="Decorative globe"
          aria-hidden
          className="absolute inset-0 z-0 object-cover object-left-top lg:object-top"
          fill
          priority
          sizes="100vw"
          src="/images/globe.svg"
        />

        {/* Foreground content defines the height */}
        <div className="relative z-10 flex w-full flex-col items-center justify-between gap-32">
          {/* Top content area */}
          <div className="mx-auto w-11/12 px-4 pt-6 sm:px-6 sm:pt-8 md:pt-10 lg:w-10/12">
            <div className="grid grid-cols-1 items-start justify-between gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
              {/* Follow Us */}
              <div>
                <p className="mb-6 font-bold text-black text-xl">Follow Us</p>
                <div className="flex items-center gap-3">
                  <Link href="#">
                    <Image
                      alt="Facebook"
                      className="h-[50px] w-[50px]"
                      height={50}
                      src="/images/footer-social/fb.png"
                      width={50}
                    />
                  </Link>
                  <Link href="#">
                    <Image
                      alt="Google"
                      className="h-[50px] w-[50px]"
                      height={50}
                      src="/images/footer-social/google.png"
                      width={50}
                    />
                  </Link>
                  <Link href="#">
                    <Image
                      alt="Instagram"
                      className="h-[50px] w-[50px]"
                      height={50}
                      src="/images/footer-social/insta.png"
                      width={50}
                    />
                  </Link>
                  <Link href="#">
                    <Image
                      alt="YouTube"
                      className="h-[50px] w-[50px]"
                      height={50}
                      src="/images/footer-social/youtube.png"
                      width={50}
                    />
                  </Link>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <p className="mb-6 font-bold text-black text-xl">
                  Contact Information
                </p>
                <ul className="space-y-3 text-base text-black">
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-black">
                      <EnvelopeIcon className="h-4 w-4" />
                    </div>
                    <a
                      className="hover:underline"
                      href="mailto:contact@scalebuild.ai"
                    >
                      contact@scalebuild.ai
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-black">
                      <LocationPinIcon className="h-4 w-4" />
                    </div>
                    <div>Manhattan, NYC</div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-black">
                      <PhoneFilledIcon className="h-4 w-4" />
                    </div>
                    <a className="hover:underline" href="tel:+19195766153">
                      +1 919 576 6153
                    </a>
                  </li>
                </ul>
              </div>

              {/* Service Included */}
              <div>
                <p className="mb-6 font-bold text-black text-xl">
                  Services Included
                </p>
                <ul className="space-y-2 text-base text-black">
                  <li>Logo Design</li>
                  <li>Business Name</li>
                  <li>Pitch Deck</li>
                  <li>Document</li>
                  <li>Video Generation</li>
                  <li>Website Generation</li>
                </ul>
              </div>

              {/* Important Links */}
              <div>
                <p className="mb-6 font-bold text-black text-xl">
                  Important Links
                </p>
                <ul className="space-y-2 text-base text-black">
                  <li>
                    <Link className="hover:underline" href="/about">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:underline" href="/terms">
                      Terms & Condition
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:underline" href="/refund-policy">
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:underline" href="/privacy">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
          </div>
          <div className="mt-6 text-center text-base text-black sm:mt-8">
            &copy; 2025, Hyperscaler, All Right Reserved by ScaleBuild AI. Made with ❤️ in NYC
          </div>

          <div className="flex w-full items-end justify-center pb-2 sm:pb-3 md:pb-4">
            <Image
              alt="Scalebuild.AI logo"
              className="h-auto w-full"
              height={36}
              src="/images/scalebuild-rb.png"
              width={240}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
