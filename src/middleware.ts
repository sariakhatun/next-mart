import { withAuth } from "next-auth/middleware";

// Export the middleware function
export default withAuth({
  // Redirect unauthenticated users to your custom login page
  pages: {
    signIn: "/login",
  },
});

// Protect specific routes
export const config = {
  matcher: ["/cart", "/profile", "/checkout"], // Add other protected routes here
};
