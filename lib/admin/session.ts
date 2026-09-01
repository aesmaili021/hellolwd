const DEFAULT_LOGIN = "/admin/login";
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

export function adminCookieName() {
  return process.env.ADMIN_COOKIE_NAME?.trim() || "lwd_desk";
}

export function adminLoginPath() {
  const raw = process.env.ADMIN_LOGIN_PATH?.trim() || DEFAULT_LOGIN;
  if (!/^\/[a-zA-Z0-9/_-]{1,80}$/.test(raw)) return DEFAULT_LOGIN;
  if (raw.includes("..") || raw.includes("//")) return DEFAULT_LOGIN;
  const path = raw.replace(/\/+$/, "") || DEFAULT_LOGIN;
  if (path === "/" || path === "/admin") return DEFAULT_LOGIN;
  return path;
}

export function isAdminLoginPath(pathname: string) {
  return pathname === adminLoginPath() || pathname.startsWith(`${adminLoginPath()}/`);
}

function productionLock() {
  return process.env.NODE_ENV === "production" || Boolean(process.env.RAILWAY_ENVIRONMENT);
}

export function adminSecret() {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (secret) return secret;
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (productionLock()) return password || "";
  return `hellolwd-dev:${password || "lwd-admin"}`;
}

function toHex(bytes: ArrayBuffer | Uint8Array) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let out = 0;
  for (let i = 0; i < left.length; i += 1) out |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return out === 0;
}

async function hmacHex(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(signed);
}

export async function signAdminToken() {
  const secret = adminSecret();
  if (!secret) return "";
  const issued = Date.now().toString();
  const nonce = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const payload = `v1.${issued}.${nonce}`;
  return `${payload}.${await hmacHex(secret, payload)}`;
}

export async function verifyAdminToken(token?: string | null) {
  const secret = adminSecret();
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return false;
  const [version, issued, nonce, mac] = parts;
  const issuedAt = Number(issued);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > TOKEN_TTL_MS) return false;
  if (issuedAt > Date.now() + 60_000) return false;
  const expected = await hmacHex(secret, `${version}.${issued}.${nonce}`);
  return safeEqual(mac, expected);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: productionLock(),
    path: "/",
    maxAge: Math.floor(TOKEN_TTL_MS / 1000),
  };
}
