import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);
const ADMIN_COOKIE = "hellolwd_admin";

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const onLogin = pathname.startsWith("/admin/login");
    if (!onLogin && !req.cookies.get(ADMIN_COOKIE)?.value) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  return intl(req);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
