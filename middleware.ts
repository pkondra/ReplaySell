import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((request) => {
  const { pathname, search, origin } = request.nextUrl;
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (!isDashboard) return NextResponse.next();
  if (request.auth) return NextResponse.next();

  const signInUrl = new URL("/sign-in", origin);
  signInUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ico|woff2?|ttf|json|csv|zip|map)).*)",
    "/(api|trpc)(.*)",
  ],
};
