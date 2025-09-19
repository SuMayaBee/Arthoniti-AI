'use client';

import { Space_Grotesk } from 'next/font/google';
import { useState } from 'react';
import AboutHeading from '@/components/about/AboutHeading';
import AboutHero from '@/components/about/AboutHero';
import MissionSection from '@/components/about/MissionSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';
import FreeTrialBanner2 from '@/components/home/FreeTrialBanner2';
import NavBar from '@/components/home/NavBar';
import TrustBanner from '@/components/home/TrustBanner';
import FloatingPillButton from '@/components/ui/FloatingPillButton';
import RightSideNavDrawer from '@/components/ui/RightSideNavDrawer';
import ScrollToTop from '@/components/ui/ScrollToTop';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export default function AboutPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className={`${spaceGrotesk.variable} home-headings relative`}>
      {/* top soft purple sheen */}
      <NavBar />
      <AboutHeading className="-mt-12 md:-mt-16 lg:-mt-24" />
      <AboutHero className="mt-8 md:mt-12" />
      <MissionSection className="pt-16 md:pt-24" />
      <TrustBanner className="mt-10" />
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
