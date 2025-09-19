/** biome-ignore-all lint/complexity/noUselessFragments: <explanation> */
'use client';

import { Song_Myung } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NAV_ROUTES } from '@/components/nav/routes';
import { Button } from '@/components/ui/button';

// Font must be initialized at module scope for next/font
const songMyung = Song_Myung({ weight: '400' });

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsAuthenticated(document.cookie.includes('access_token='));
    }
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-transparent lg:py-4">
        {/* Desktop / Laptop navbar */}
        <div className="mx-auto hidden w-10/12 px-4 lg:block">
          {/* Glassy pill container */}
          <div className="relative rounded-full border border-white/30 bg-white/10 shadow-lg backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-white/5">
            <div className="relative flex h-16 items-center justify-between px-4">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-12 items-center justify-center overflow-hidden rounded-full">
                  <div className="relative h-full w-full">
                    <Image
                      alt="Scalebuild logo"
                      className="object-cover"
                      fill
                      priority
                      src="/images/Scalebuild-Logo.gif"
                    />
                  </div>
                </div>
                <span className={`${songMyung.className} text-base sm:text-lg`}>
                  Hyperscaler
                </span>
              </div>

              {/* Center nav links */}
              <div className="hidden items-center gap-8 md:flex">
                {NAV_ROUTES.map((route) => (
                  <Link
                    className="inline-block font-normal text-base text-slate-900 transition-transform duration-300 hover:scale-110 hover:text-primary-500"
                    href={route.href}
                    key={route.href}
                  >
                    {route.label}
                  </Link>
                ))}
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <Button
                    asChild
                    className="rotating-gradient-border hidden p-[2px] sm:inline-flex"
                    variant="rainbow"
                  >
                    <Link
                      className="p-0 font-normal text-base"
                      href="/dashboard"
                    >
                      <span>Dashboard</span>
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Link
                      className="inline-block font-normal text-base text-slate-700 transition-transform duration-300 hover:scale-110 hover:text-primary-500"
                      href="/signin"
                    >
                      Log in
                    </Link>
                    <Button
                      asChild
                      className="rotating-gradient-border p-[2px] sm:inline-flex"
                      variant="rainbow"
                    >
                      <Link
                        className="p-0 font-normal text-base"
                        href="/signup"
                      >
                        <span>Sign Up</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: centered logo with brand name */}
      </nav>
      <div className="mx-auto mb-10 w-10/12 px-4 lg:hidden">
        <div className="flex h-12 items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-12 items-center justify-center overflow-hidden rounded-full">
              <div className="relative h-full w-full">
                <Image
                  alt="Scalebuild logo"
                  className="object-cover"
                  fill
                  priority
                  src="/images/Scalebuild-Logo.gif"
                />
              </div>
            </div>
            <span className={`${songMyung.className} text-lg`}>
              Hyperscaler
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
