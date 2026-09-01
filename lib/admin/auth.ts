import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminCookieName,
  adminCookieOptions,
  adminLoginPath,
  adminSecret,
  signAdminToken,
  verifyAdminToken,
} from "@/lib/admin/session";

export { adminCookieName as ADMIN_COOKIE, adminLoginPath, signAdminToken, verifyAdminToken };

const attempts = new Map<string, number[]>();

function productionLock() {
  return process.env.NODE_ENV === "production" || Boolean(process.env.RAILWAY_ENVIRONMENT);
}

function username() {
  return process.env.ADMIN_USERNAME?.trim() || (productionLock() ? "" : "admin");
}

function password() {
  return process.env.ADMIN_PASSWORD?.trim() || (productionLock() ? "" : "lwd-admin");
}

async function digest(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(adminSecret() || "hellolwd"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Buffer.from(signed);
}

function clientIp(requestHeaders: Headers) {
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "local"
  );
}

function recentAttempts(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((at) => now - at < 15 * 60 * 1000);
  attempts.set(ip, recent);
  return recent;
}

export async function loginAllowed() {
  return recentAttempts(clientIp(await headers())).length < 5;
}

export async function recordFailedLogin() {
  recentAttempts(clientIp(await headers())).push(Date.now());
}

export async function checkAdminCredentials(user: string, pass: string) {
  const expectedUser = username();
  const expectedPass = password();
  if (!expectedUser || !expectedPass) return false;
  const [gotUser, wantUser, gotPass, wantPass] = await Promise.all([
    digest(user.trim()),
    digest(expectedUser),
    digest(pass),
    digest(expectedPass),
  ]);
  return gotUser.equals(wantUser) && gotPass.equals(wantPass);
}

export async function isAdmin() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(adminCookieName())?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect(adminLoginPath());
}

export async function setAdminCookie() {
  const token = await signAdminToken();
  if (!token) return;
  const jar = await cookies();
  jar.set(adminCookieName(), token, adminCookieOptions());
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.set(adminCookieName(), "", { ...adminCookieOptions(), maxAge: 0 });
}
