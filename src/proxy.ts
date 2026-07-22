import {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // next-intl's cookie lookup and Accept-Language lookup are gated by the
  // same `localeDetection` flag, so we can't keep cookie-based memory while
  // ignoring the browser's language via config alone. Instead, only when no
  // saved-choice cookie exists yet do we neutralize Accept-Language, so a
  // first-time visitor always lands on the Turkish default while a
  // returning visitor's saved choice still wins.
  if (!request.cookies.has('NEXT_LOCALE')) {
    request.headers.set('accept-language', routing.defaultLocale);
  }
  return handleI18nRouting(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(tr|en)/:path*',

    // Enable redirects that add a locale prefix
    // (e.g. `/hello` -> `/en/hello`)
    // We ignore /admin and /api explicitly here
    '/((?!_next|_vercel|api|admin|.*\\..*).*)'
  ]
};
