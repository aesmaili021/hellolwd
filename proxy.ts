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
const LOCALES = new Set<string>(routing.locales);

function requestHostname(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    ""
  )
    .split(",")[0]
    ?.trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
}

function requestProto(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-proto") ||
    req.nextUrl.protocol.replace(":", "")
  )
    .split(",")[0]
    ?.trim()
    .toLowerCase();
}

/** Absolute URL on the preferred public origin (host + https from SITE_URL). */
function canonicalUrl(req: NextRequest, pathname: string): URL {
  const preferred = new URL(SITE_URL);
  const target = new URL(pathname + req.nextUrl.search, preferred);
  target.protocol = preferred.protocol;
  target.hostname = SITE_HOST;
  target.port = "";
  return target;
}

/**
 * One 301 hop for:
 * - www ↔ apex / http → https (only for hellolwd host aliases)
 * - missing locale prefix (`/article/…` → `/en/article/…`)
 */
function canonicalRedirect(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin")) return null;

  const host = requestHostname(req);
  const aliases = siteHostAliases(SITE_HOST);
  const onSiteHost = Boolean(host && aliases.includes(host));
  const preferred = new URL(SITE_URL);
  const proto = requestProto(req);

  const needsHost =
    onSiteHost && (host !== SITE_HOST || (preferred.protocol === "https:" && proto === "http"));

  const first = pathname.split("/")[1] ?? "";
  const hasLocalePrefix = LOCALES.has(first);
  const needsLocalePrefix = pathname === "/" || !hasLocalePrefix;

  if (!needsHost && !needsLocalePrefix) return null;

  // Only force host/https when the request is already on a public site alias.
  // Localhost / Railway preview keep their host; still fix missing locale prefix.
  let pathnameOut = pathname;
  if (needsLocalePrefix) {
    pathnameOut =
      pathname === "/"
        ? `/${routing.defaultLocale}`
        : `/${routing.defaultLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  }

  if (onSiteHost && (needsHost || needsLocalePrefix)) {
    return NextResponse.redirect(canonicalUrl(req, pathnameOut), 301);
  }

  if (needsLocalePrefix) {
    const target = req.nextUrl.clone();
    target.pathname = pathnameOut;
    return NextResponse.redirect(target, 301);
  }

  return null;
}

export default async function proxy(req: NextRequest) {
  const redirect = canonicalRedirect(req);
  if (redirect) return redirect;

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
