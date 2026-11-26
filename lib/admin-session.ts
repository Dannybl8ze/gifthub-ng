// Session tokens for the admin console. Uses only Web Crypto so it runs in both
// the Edge middleware and the Node route handlers.

export const SESSION_COOKIE = "gh_admin";
export const SESSION_MAX_AGE_S = 60 * 60 * 8;
export const MIN_SECRET_LENGTH = 32;

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array | null {
  if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function importKey(secret: string, usage: KeyUsage) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

export function isSecretUsable(secret: string | undefined): secret is string {
  return typeof secret === "string" && secret.length >= MIN_SECRET_LENGTH;
}

export async function createSessionToken(secret: string, now = Date.now()): Promise<string> {
  const expires = String(now + SESSION_MAX_AGE_S * 1000);
  const key = await importKey(secret, "sign");
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(expires));
  return `${expires}.${toHex(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string | undefined,
  now = Date.now()
): Promise<boolean> {
  if (!token || !isSecretUsable(secret)) return false;
  const [expires, signatureHex, ...rest] = token.split(".");
  if (rest.length > 0 || !expires || !signatureHex || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < now) return false;
  const signature = fromHex(signatureHex);
  if (!signature) return false;
  const key = await importKey(secret, "verify");
  return crypto.subtle.verify("HMAC", key, signature, encoder.encode(expires));
}
