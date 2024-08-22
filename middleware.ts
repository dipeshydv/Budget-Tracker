import { authMiddleware, clerkMiddleware } from "@clerk/nextjs/server";


export default authMiddleware({
  publicRoutes: ["/", "/contact"],
});
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};