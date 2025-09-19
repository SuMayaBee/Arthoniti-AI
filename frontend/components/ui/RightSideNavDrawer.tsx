'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV_ROUTES } from '@/components/nav/routes';
import { cn, isAuthenticated } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// Hoisted regex to remove trailing slashes (except root)
const TRAILING_SLASH_RE = /(.+)?\/$/;

function normalizePath(path: string | null | undefined) {
  if (!path) {
    return '/';
  }
  if (path === '/') {
    return '/';
  }
  return path.replace(TRAILING_SLASH_RE, '$1');
}

export default function RightSideNavDrawer({
  open,
  onClose,
  closeOnSelect = false,
}: {
  open: boolean;
  onClose: () => void;
  closeOnSelect?: boolean;
}) {
  const pathname = usePathname();
  const [hash, setHash] = useState<string>('');
  const {isAuthenticated} = useAuth()

  useEffect(() => {
    const update = () => setHash(window.location.hash || '');
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  return (
    <>
      {/* Backdrop must be outside transformed container so it covers the full viewport */}
      <button
        aria-label="Close side navigation"
        className={cn(
          'fixed inset-0 z-[59] h-full w-full bg-black/0 transition-colors duration-300',
          open ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        onClick={onClose}
        type="button"
      />

      <div
        aria-hidden={!open}
        aria-modal="true"
        className={cn(
          '-translate-y-1/2 fixed top-1/2 right-0 z-[60] transition-transform duration-300',
          open
            ? 'pointer-events-auto translate-x-0'
            : 'pointer-events-none translate-x-full'
        )}
        role="dialog"
      >
        {/* Drawer container (match LG navbar backdrop) */}
        <div className="pointer-events-auto relative z-10 flex gap-5 h-[85vh] w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 shadow-lg backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-white/5">
        <nav className="flex h-full w-full flex-col items-center justify-between py-6">
          {NAV_ROUTES.map((item) => {
            const hasHash = hash.length > 0;
            const current = `${normalizePath(pathname)}${hash}`;
            const isHashItem = item.href.includes('#');
            const isActive = isHashItem
              ? current === item.href
              : !hasHash &&
                normalizePath(pathname) === normalizePath(item.href);
            return (
              <Link
                className={cn(
                  'relative flex h-12 w-full items-center justify-center'
                )}
                href={item.href}
                key={item.href}
                onClick={() => {
                  // Optimistically update the hash state so the active style applies immediately
                  if (isHashItem) {
                    const idx = item.href.indexOf('#');
                    if (idx !== -1) {
                      setHash(item.href.substring(idx));
                    }
                  } else {
                    setHash('');
                  }
                  if (closeOnSelect) {
                    onClose();
                  }
                }}
              >
                <span
                  className={cn(
                    // Vertical label style: rotate and chip when active
                    '-rotate-90 block select-none whitespace-nowrap font-medium text-slate-700 text-sm',
                    isActive &&
                      'rounded-full bg-primary-400 px-3 py-1 text-white'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
          <div className="flex flex-col items-center space-y-2">
            {isAuthenticated ? (
              // Dashboard button for authenticated users
              <Link
                className={cn(
                  'relative flex h-12 w-full items-center justify-center'
                )}
                href="/dashboard"
                onClick={() => {
                  if (closeOnSelect) {
                    onClose();
                  }
                }}
              >
                <span
                  className={cn(
                    // Vertical label style: rotate and chip when active
                    '-rotate-90 block select-none whitespace-nowrap font-medium text-sm',
                    normalizePath(pathname).startsWith('/dashboard')
                      ? 'rounded-full bg-primary-400 px-3 py-1 text-white'
                      : 'text-primary-600 hover:text-primary-700'
                  )}
                >
                  Dashboard
                </span>
              </Link>
            ) : (
              // Login and signup buttons for unauthenticated users
              <>
                <Link
                  className={cn(
                    'relative flex h-12 w-full items-center justify-center'
                  )}
                  href="/signin"
                  onClick={() => {
                    if (closeOnSelect) {
                      onClose();
                    }
                  }}
                >
                  <span
                    className={cn(
                      // Vertical label style: rotate and chip when active
                      '-rotate-90 block select-none whitespace-nowrap font-medium text-sm',
                      pathname === '/signin'
                        ? 'rounded-full bg-primary-400 px-3 py-1 text-white'
                        : 'text-primary-500'
                    )}
                  >
                    Login
                  </span>
                </Link>
                {/* <Link
                  className={cn(
                    'relative flex h-12 w-full items-center justify-center'
                  )}
                  href="/signup"
                  onClick={() => {
                    if (closeOnSelect) {
                      onClose();
                    }
                  }}
                >
                  <span
                    className={cn(
                      // Vertical label style: rotate and chip when active
                      '-rotate-90 block select-none whitespace-nowrap font-medium text-sm',
                      pathname === '/signup'
                        ? 'rounded-full bg-primary-400 px-3 py-1 text-white'
                        : 'text-primary-600 hover:text-primary-700'
                    )}
                  >
                    Sign Up
                  </span>
                </Link> */}
              </>
            )}
          </div>
        </nav>
        </div>
      </div>
    </>
  );
}
