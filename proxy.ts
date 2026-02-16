import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function isDashboardRoute(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

export default async function proxy(request: NextRequest) {
  if (!isDashboardRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  if (token) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/sign-in", request.nextUrl.origin);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  signInUrl.searchParams.set("next", nextPath);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ico|woff2?|ttf|json|csv|zip|map)).*)",
    "/(api|trpc)(.*)",
  ],
};
