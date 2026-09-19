import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import {
  adminCookieName,
  adminLoginPath,
  isAdminLoginPath,
  verifyAdminToken,
} from "@/lib/admin/session";
import { SITE_HOST, SITE_URL, siteHostAliases } from "@/lib/seo";

const intl = createMiddleware(routing);
const INTERNAL_LOGIN = "/admin/login";

/** Collapse www/apex (and http) onto NEXT_PUBLIC_SITE_URL so Google sees one host. */
function canonicalOriginRedirect(req: NextRequest): NextResponse | null {
  const requestHost = (
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    ""
  )
    .split(",")[0]
    ?.trim()
    .toLowerCase()
    .replace(/:\d+$/, "");

  if (!requestHost) return null;

  const aliases = siteHostAliases(SITE_HOST);
  if (!aliases.includes(requestHost)) return null;

  const proto = (
    req.headers.get("x-forwarded-proto") ||
    req.nextUrl.protocol.replace(":", "")
  )
    .split(",")[0]
    ?.trim()
    .toLowerCase();

  const preferred = new URL(SITE_URL);
  const needsHost = requestHost !== SITE_HOST;
  const needsHttps = preferred.protocol === "https:" && proto === "http";
  if (!needsHost && !needsHttps) return null;

  const target = req.nextUrl.clone();
  target.protocol = preferred.protocol;
  target.hostname = SITE_HOST;
  target.port = "";
  target.host = SITE_HOST;
  return NextResponse.redirect(target, 301);
}

export default async function proxy(req: NextRequest) {
  const hostRedirect = canonicalOriginRedirect(req);
  if (hostRedirect) return hostRedirect;

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
