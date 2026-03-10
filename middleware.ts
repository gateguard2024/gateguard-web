import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// This explicitly protects the sales-portal and your API routes, 
// but leaves your public pages, login, and the actual client proposals open.
const isProtectedRoute = createRouteMatcher([
  '/sales-portal(.*)',
  '/api/maintainx(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
