import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import {
  adminCookieName,
  adminLoginPath,
  isAdminLoginPath,
  verifyAdminToken,
} from "@/lib/admin/session";

const intl = createMiddleware(routing);
const INTERNAL_LOGIN = "/admin/login";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loginPath = adminLoginPath();

  if (isAdminLoginPath(pathname) && pathname !== INTERNAL_LOGIN) {
    const url = req.nextUrl.clone();
    url.pathname = INTERNAL_LOGIN;
    return NextResponse.rewrite(url);
  }

  if (pathname === INTERNAL_LOGIN && loginPath !== INTERNAL_LOGIN) {
    return new NextResponse(null, { status: 404 });
  }

  if (pathname.startsWith("/admin")) {
    if (pathname !== INTERNAL_LOGIN) {
      const token = req.cookies.get(adminCookieName())?.value;
      if (!(await verifyAdminToken(token))) {
        return NextResponse.redirect(new URL(loginPath, req.url));
      }
    }
    return NextResponse.next();
  }

  return intl(req);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
