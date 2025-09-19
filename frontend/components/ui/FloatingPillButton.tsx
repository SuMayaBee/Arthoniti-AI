'use client';

import { useEffect, useState } from 'react';
import type React from 'react';
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon';
import { cn } from '@/lib/utils';

export default function FloatingPillButton({
  threshold = 200,
  onClick,
  className,
  ariaLabel = 'Action',
  title = 'Action',
  alwaysVisible = true,
  hideOnLg = true,
  buttonRef,
}: {
  threshold?: number;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  title?: string;
  alwaysVisible?: boolean;
  hideOnLg?: boolean;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  const [visible, setVisible] = useState(alwaysVisible);

  useEffect(() => {
    if (alwaysVisible) {
      setVisible(true);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [alwaysVisible, threshold]);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        '-translate-y-1/2 pointer-events-none fixed top-1/2 right-0 z-50 translate-x-1/2 transition-opacity duration-200',
        hideOnLg && 'lg:hidden',
        visible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <button
        ref={buttonRef}
        aria-label={ariaLabel}
        className={cn(
          'pointer-events-auto flex h-40 w-10 items-center justify-start rounded-full bg-gradient-to-b from-fuchsia-200 to-purple-600 text-white shadow-primary-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-primary'
        )}
        onClick={onClick}
        title={title}
        type="button"
      >
        <ChevronLeftIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}
