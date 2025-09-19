'use client';

import { useEffect, useState } from 'react';
import UpperArrowMdIcon from '@/components/icons/UpperArrowMdIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ScrollToTop({
  threshold = 200,
  className,
}: {
  threshold?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        'pointer-events-none fixed right-6 bottom-6 z-50 transition-opacity duration-200',
        visible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <Button
        aria-label="Scroll to top"
        className="pointer-events-auto shadow-primary-400 shadow-xl"
        onClick={handleClick}
        size="icon"
        title="Back to top"
      >
        <UpperArrowMdIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
