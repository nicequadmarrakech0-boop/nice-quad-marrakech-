import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';

// Supported locales
const locales = ['en', 'fr'];
const defaultLocale = 'en';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
]);

const isUnauthorizedRoute = createRouteMatcher([
  '/unauthorized',
  '/:locale/unauthorized',
]);

const isApiRoute = createRouteMatcher([
  '/api(.*)',
  '/trpc(.*)',
]);

// Routes that should NOT have locale prefix (static pages at root)
const isRootOnlyRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()).filter(Boolean) || [];

// Get locale from pathname
function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && locales.includes(firstSegment)) {
    return firstSegment;
  }
  return null;
}

// Get locale from cookie or Accept-Language header
function getPreferredLocale(req: NextRequest): string {
  // Check cookie first
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Check Accept-Language header
  const acceptLanguage = req.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLang = acceptLanguage.split(',')[0].split('-')[0];
    if (locales.includes(preferredLang)) {
      return preferredLang;
    }
  }

  return defaultLocale;
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Skip middleware for sitemap and robots (must not get locale-rewritten)
  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }

  // Skip middleware for API routes and static files
  if (isApiRoute(req)) {
    return NextResponse.next();
  }

  // Skip locale handling for root-only routes (auth pages)
  if (isRootOnlyRoute(req)) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameLocale = getLocaleFromPathname(pathname);

  // If no locale in pathname, rewrite to include locale
  if (!pathnameLocale) {
    const preferredLocale = getPreferredLocale(req);

    // Rewrite to /{locale}/... internally without changing URL
    const newUrl = new URL(`/${preferredLocale}${pathname}`, req.url);
    const response = NextResponse.rewrite(newUrl);
    return response;
  }

  // Allow access to unauthorized page without protection
  if (isUnauthorizedRoute(req)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    // If not signed in, protect the route (Clerk will handle redirect to sign-in)
    if (!userId) {
      await auth.protect();
      return;
    }

    // Get user from Clerk to access email
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;

    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|sitemap\\.xml|robots\\.txt|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
