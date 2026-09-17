/* Hand the visitor to Google. We never see or store a password. */

const STATE_COOKIE = "rs_oauth_state";
const NEXT_COOKIE = "rs_oauth_next";

export function redirectUri(req) {
  if (process.env.OAUTH_REDIRECT_URI) return process.env.OAUTH_REDIRECT_URI;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}/api/auth/google/callback`;
}

/* Only ever bounce back to a path on this site, never to someone else's URL. */
export function safeNext(value) {
  return typeof value === "string" && /^\/[^/\\]/.test(value) ? value : "/";
}

export default function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || !process.env.SESSION_SECRET) {
    res.status(503).send("Sign-in is not configured yet.");
    return;
  }

  const state = crypto.randomUUID();
  const next = safeNext(req.query?.next);

  const short = "Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax";
  res.setHeader("Set-Cookie", [
    `${STATE_COOKIE}=${state}; ${short}`,
    `${NEXT_COOKIE}=${encodeURIComponent(next)}; ${short}`,
  ]);

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri(req));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");

  res.writeHead(302, { Location: url.toString(), "Cache-Control": "private, no-store" });
  res.end();
}
