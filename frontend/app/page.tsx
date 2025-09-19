'use client';

import { Space_Grotesk } from 'next/font/google';
import { useState } from 'react';
import AffordablePlans from '@/components/home/AffordablePlans';
import ContactSection from '@/components/home/ContactSection';
import FAQ from '@/components/home/FAQ';
import Footer from '@/components/home/Footer';
import FreeTrialBanner from '@/components/home/FreeTrialBanner';
import FreeTrialBanner2 from '@/components/home/FreeTrialBanner2';
import Hero from '@/components/home/Hero';
import NavBar from '@/components/home/NavBar';
import Comparison from '@/components/home/Comparison';
import PurpleShade from '@/components/home/PurpleShade';
import Services from '@/components/home/Services';
import Testimonials from '@/components/home/Testimonials';
import TrustBanner from '@/components/home/TrustBanner';
import WhatWeCreate from '@/components/home/WhatWeCreate';
import FloatingPillButton from '@/components/ui/FloatingPillButton';
import RightSideNavDrawer from '@/components/ui/RightSideNavDrawer';
import ScrollToTop from '@/components/ui/ScrollToTop';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className={`${spaceGrotesk.variable} home-headings relative overflow-x-hidden`}>
      {/* top soft purple sheen */}
      <PurpleShade />
      <NavBar />
      <Hero />
      <TrustBanner className="mt-10" />
      <Services className="mt-16" />
      <Testimonials className="mt-20" />
      <FreeTrialBanner />
      <AffordablePlans />
      <Comparison className="mt-16" />
      <WhatWeCreate className="mt-20" />
      <FAQ className="mt-20" />
      <ContactSection className="mt-20" />
      <FreeTrialBanner2 />
      <Footer />

      {/* empty content area reserved for future sections */}
      <ScrollToTop />
      <FloatingPillButton
        ariaLabel="Open panel"
        onClick={() => setDrawerOpen(true)}
        title="Open panel"
      />
      <RightSideNavDrawer
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      />
    </div>
  );
}
