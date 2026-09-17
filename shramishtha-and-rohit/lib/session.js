/* Signed session cookies.
   Web Crypto only, so the identical code runs in the Edge middleware and in
   the Node functions -- one implementation, one place to get it right. */

const ENC = new TextEncoder();
const DEC = new TextDecoder();

export const COOKIE = "rs_session";
export const TIER_HINT = "rs_tier";        // readable by the page; a hint for
                                           // rendering only, never trusted
export const MAX_AGE = 60 * 60 * 24 * 30;  // 30 days

/* Access levels. "us" is the two of them, proven by Google.
   "family" is whoever was handed the passphrase -- deliberately less. */
export const TIER = { US: "us", FAMILY: "family" };
export const RANK = { family: 1, us: 2 };

const b64url = (bytes) => {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
};

const unb64url = (str) => {
  const norm = str.replaceAll("-", "+").replaceAll("_", "/");
  const bin = atob(norm + "=".repeat((4 - (norm.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

const hmacKey = (secret) =>
  crypto.subtle.importKey("raw", ENC.encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);

export async function sign(claims, secret) {
  const body = b64url(ENC.encode(JSON.stringify(claims)));
  const mac = await crypto.subtle.sign("HMAC", await hmacKey(secret), ENC.encode(body));
  return `${body}.${b64url(new Uint8Array(mac))}`;
}

/* Returns the claims, or null for anything we don't fully trust. */
export async function verify(token, secret) {
  if (typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  try {
    const good = await crypto.subtle.verify(
      "HMAC", await hmacKey(secret), unb64url(mac), ENC.encode(body));
    if (!good) return null;
    const claims = JSON.parse(DEC.decode(unb64url(body)));
    if (!claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    if (!RANK[claims.tier]) return null;
    return claims;
  } catch {
    return null;                 // malformed input is just a failed login
  }
}

export async function issue(sub, tier, secret) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return { token: await sign({ sub, tier, exp }, secret), exp };
}

export function readCookie(header, name) {
  for (const part of (header || "").split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return null;
}

/* The session itself is HttpOnly so no script can read or steal it.
   The tier hint is readable on purpose -- it only decides what to draw. */
export function cookiesFor(token, tier) {
  const base = `Path=/; Max-Age=${MAX_AGE}; Secure; SameSite=Lax`;
  return [
    `${COOKIE}=${token}; HttpOnly; ${base}`,
    `${TIER_HINT}=${tier}; ${base}`,
  ];
}

export function clearCookies() {
  const base = "Path=/; Max-Age=0; Secure; SameSite=Lax";
  return [`${COOKIE}=; HttpOnly; ${base}`, `${TIER_HINT}=; ${base}`];
}

export const allows = (claims, need) => !!claims && RANK[claims.tier] >= RANK[need];
