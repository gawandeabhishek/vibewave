import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define your protected route pattern using regular expression for '/loggedin/*'
const isProtectedRoute = createRouteMatcher([/^\/loggedin(.*)/]);

export default clerkMiddleware(async (auth, req) => {
  // Check if the route is protected
  if (isProtectedRoute(req)) {
    // If protected, ensure the user is authenticated
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    
    // Always run for API routes
    "/(api|trpc)(.*)",

    // Apply middleware for routes under /loggedin using regular expression
    "/loggedin(.*)", // This matches all routes under /loggedin
  ],
};
