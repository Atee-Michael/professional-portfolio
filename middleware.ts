import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Only allow authenticated admins
      return Boolean(token && (token as any).isAdmin === true);
    },
  },
});

export const config = {
  matcher: ["/admin", "/api/admin/:path*"],
};
