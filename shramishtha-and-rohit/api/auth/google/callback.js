/* Google has spoken. Check who it says this is, and whether we know them. */

import { TIER, cookiesFor, issue, readCookie } from "../../../lib/session.js";
import { redirectUri, safeNext } from "./start.js";

const STATE_COOKIE = "rs_oauth_state";
const NEXT_COOKIE = "rs_oauth_next";

const allowlist = () =>
  (process.env.ALLOWED_EMAILS || "")
    .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

function backToLogin(res, why) {
  res.writeHead(302, {
    Location: `/login?error=${encodeURIComponent(why)}`,
    "Cache-Control": "private, no-store",
  });
  res.end();
}

export default async function handler(req, res) {
  const { GOOGLE_CLIENT_ID: id, GOOGLE_CLIENT_SECRET: secret, SESSION_SECRET } = process.env;
  if (!id || !secret || !SESSION_SECRET) { res.status(503).send("Sign-in is not configured yet."); return; }

  const cookies = req.headers.cookie;
  const expected = readCookie(cookies, STATE_COOKIE);
  const next = safeNext(decodeURIComponent(readCookie(cookies, NEXT_COOKIE) || "/"));

  /* The state cookie is what stops someone handing you a login link of theirs. */
  if (!expected || !req.query?.state || req.query.state !== expected) {
    return backToLogin(res, "expired");
  }
  if (!req.query?.code) return backToLogin(res, "cancelled");

  let email = null;
  try {
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: req.query.code,
        client_id: id,
        client_secret: secret,
        redirect_uri: redirectUri(req),
        grant_type: "authorization_code",
      }),
    });
    if (!r.ok) return backToLogin(res, "google");
    const { id_token } = await r.json();
    if (!id_token) return backToLogin(res, "google");

    /* This token came straight from Google's token endpoint over TLS using our
       client secret, so its contents are already trustworthy -- Google's own
       docs allow skipping signature checks on this path. */
    const claims = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64url").toString("utf8"));
    if (claims.aud !== id) return backToLogin(res, "google");
    if (claims.email_verified !== true && claims.email_verified !== "true") {
      return backToLogin(res, "unverified");
    }
    email = String(claims.email || "").toLowerCase();
  } catch {
    return backToLogin(res, "google");
  }

  if (!email || !allowlist().includes(email)) return backToLogin(res, "notinvited");

  const { token } = await issue(email, TIER.US, SESSION_SECRET);
  const expire = "Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax";
  res.setHeader("Set-Cookie", [
    ...cookiesFor(token, TIER.US),
    `${STATE_COOKIE}=; ${expire}`,
    `${NEXT_COOKIE}=; ${expire}`,
  ]);
  res.writeHead(302, { Location: next, "Cache-Control": "private, no-store" });
  res.end();
}
