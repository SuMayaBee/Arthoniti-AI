'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import { cn } from '@/lib/utils';

export default function DashboardFloatingPillButton({
  threshold = 200,
  onClick,
  className,
  ariaLabel = 'Open navigation',
  title = 'Open navigation',
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
        '-translate-y-1/2 pointer-events-none fixed top-1/2 left-0 z-50 -translate-x-1/2 transition-opacity duration-200',
        hideOnLg && 'lg:hidden',
        visible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <button
        ref={buttonRef}
        aria-label={ariaLabel}
        className={cn(
          'pointer-events-auto flex h-40 w-10 items-center justify-end rounded-full bg-gradient-to-b from-fuchsia-200 to-purple-600 text-white shadow-primary-400 shadow-xl '
        )}
        onClick={onClick}
        title={title}
        type="button"
      >
        <ChevronRightIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}
