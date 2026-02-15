import { getSessionCookie } from 'better-auth/cookies';
import { Route } from 'next';
import { NextRequest, NextResponse } from 'next/server';

// Public routes that don't require authentication
const publicRoutes: Route[] = [
  '/',
  '/login',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
];

// API routes that should always be accessible (no redirects)
const publicAPIRoutes = [
  '/api/auth',
  '/api/trpc',
  '/api/signup',
  '/api/hello',
  '/api/inngest',
  '/api/sentry-example-api',
];

export default async function proxy(request: NextRequest) {
  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // CRITICAL: Never redirect API calls - they need to return proper responses
  const isPublicAPI = publicAPIRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isPublicAPI) {
    return NextResponse.next();
  }

  // Check if current path is public or starts with a public path
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // If no session and trying to access protected route, redirect to login
  if (!sessionCookie && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    // Store the attempted URL to redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If has session and trying to access auth pages, redirect to home
  if (sessionCookie && ['/login', '/sign-up'].includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // if (!sessionCookie) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',

    // Always run for API routes
    // '/(api|trpc)(.*)',

    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|.well-known/workflow/)).*)',
    // {
    //   source:
    //     '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.webp|.well-known/workflow/).*)',
    // },
  ],
};
