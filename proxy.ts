import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// This tells the Bouncer which routes to lock down. 
const isProtectedRoute = createRouteMatcher(['/portal(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Await the auth check (Clerk v6 requirement)
    const session = await auth();
    session.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
