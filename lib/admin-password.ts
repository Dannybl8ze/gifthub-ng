// Node-only helpers for checking the admin credentials. Never import this from
// middleware or client code.
import { createHash, scryptSync, timingSafeEqual } from "node:crypto";

/** Compares two strings without leaking where they differ. */
export function safeEqual(a: string, b: string): boolean {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

/** `stored` is "<saltHex>:<hashHex>", produced by scripts/admin-credentials.mjs. */
export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  if (expected.length === 0) return false;
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
