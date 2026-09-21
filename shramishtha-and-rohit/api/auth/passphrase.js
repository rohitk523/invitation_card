/* The second door, for people without an invited Google account.
   Deliberately weaker in what it grants: family tier only, never the just-us
   album. That needs a verified Google account. */

import { createHash, timingSafeEqual } from "node:crypto";
import { TIER, cookiesFor, issue } from "../../lib/session.js";
import { safeNext } from "./google/start.js";

/* Typed by hand on a phone, so be forgiving about case and stray spaces --
   the strength comes from the passphrase being long, not fussy. */
const normalise = (s) => String(s ?? "").trim().toLowerCase().replace(/\s+/g, " ");

/* Hash both sides first so the compare is over equal lengths and leaks
   nothing about how much of the passphrase was right. */
const same = (a, b) => {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
};

/* Best-effort brake on rapid guessing. Serverless instances come and go, so
   this is a speed bump, not a wall -- a long passphrase is the real defence. */
const seen = new Map();
const WINDOW = 60_000;
const MAX_TRIES = 8;

function tooMany(ip) {
  const now = Date.now();
  const hits = (seen.get(ip) || []).filter((t) => now - t < WINDOW);
  hits.push(now);
  seen.set(ip, hits);
  if (seen.size > 500) for (const [k, v] of seen) if (!v.some((t) => now - t < WINDOW)) seen.delete(k);
  return hits.length > MAX_TRIES;
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "method" }); return; }

  const { FAMILY_PASSPHRASE, SESSION_SECRET } = process.env;
  if (!FAMILY_PASSPHRASE || !SESSION_SECRET) { res.status(503).json({ error: "unconfigured" }); return; }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (tooMany(ip)) { res.status(429).json({ error: "slowdown" }); return; }

  /* A uniform pause on every attempt, right or wrong, so timing says nothing. */
  await new Promise((r) => setTimeout(r, 400));

  const given = normalise(req.body?.passphrase);
  if (!given || !same(given, normalise(FAMILY_PASSPHRASE))) {
    res.status(401).json({ error: "wrong" });
    return;
  }

  const { token } = await issue("passphrase", TIER.FAMILY, SESSION_SECRET);
  res.setHeader("Set-Cookie", cookiesFor(token, TIER.FAMILY));
  res.status(200).json({ ok: true, next: safeNext(req.body?.next) });
}
