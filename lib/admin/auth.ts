import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "hellolwd_admin";

function password() {
  return process.env.ADMIN_PASSWORD || "lwd-admin";
}

function secret() {
  return process.env.ADMIN_SECRET || password();
}

export function signAdminToken() {
  return createHmac("sha256", secret()).update("hellolwd-admin").digest("hex");
}

export function verifyAdminToken(token?: string | null) {
  if (!token) return false;
  const expected = signAdminToken();
  const left = Buffer.from(token);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function checkAdminPassword(value: string) {
  const left = Buffer.from(value);
  const right = Buffer.from(password());
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function isAdmin() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}
