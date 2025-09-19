import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Auth routes that should redirect to dashboard if user is authenticated
const authRoutes = [
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/logo-generator',
  '/dashboard/business-name-generator',
  '/dashboard/pitch-deck',
  '/dashboard/document-generator',
  '/dashboard/short-video-generator',
  '/dashboard/website-builder',
  '/chat',
  '/dashboard/settings',
  '/dashboard/subscriptions',
  '/dashboard/referrals',
  '/dashboard/favourites',
  '/dashboard/faq',
];

// Public routes that don't need authentication
const publicRoutes = ['/', '/terms', '/privacy', '/coming-soon'];

// Helper function to get token from cookies
function getTokenFromCookies(request: NextRequest): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  return cookies['access_token'] || null;
}

// Helper function to check if path matches any of the given routes
function isPathMatching(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Exact match
    if (pathname === route) return true;

    // Check if pathname starts with route (for nested routes)
    if (route !== '/' && pathname.startsWith(route + '/')) return true;

    return false;
  });
}

// Helper function to check if path is a public route
function isPublicRoute(pathname: string): boolean {
  return isPathMatching(pathname, publicRoutes);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getTokenFromCookies(request);
  const isAuthenticated = !!token;

  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthenticated && isPathMatching(pathname, authRoutes)) {
    console.log(
      `[Middleware] Authenticated user accessing auth route: ${pathname}, redirecting to dashboard`
    );
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and trying to access protected routes, redirect to signin
  if (!isAuthenticated && isPathMatching(pathname, protectedRoutes)) {
    console.log(
      `[Middleware] Unauthenticated user accessing protected route: ${pathname}, redirecting to signin`
    );
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
