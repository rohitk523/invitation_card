/* Hands over a letter's text, but only to the two of them and only once the
   date has passed. Before that the body never leaves the server. */

import { COOKIE, TIER, allows, readCookie, verify } from "../lib/session.js";
import { LETTERS, publicFace, sealed } from "../lib/letters.js";

export default async function handler(req, res) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) { res.status(503).json({ error: "unconfigured" }); return; }

  const claims = await verify(readCookie(req.headers.cookie, COOKIE), secret);
  if (!allows(claims, TIER.US)) { res.status(401).json({ error: "not yours" }); return; }

  res.setHeader("Cache-Control", "private, no-store");
  const now = new Date();

  const id = req.query?.id;
  if (!id) {
    /* The index: who wrote what, and when it opens. Never the text. */
    res.status(200).json({
      letters: Object.entries(LETTERS).map(([k, v]) => publicFace(k, v, now)),
    });
    return;
  }

  const letter = LETTERS[id];
  if (!letter) { res.status(404).json({ error: "no such letter" }); return; }
  if (sealed(letter, now)) {
    res.status(403).json({ ...publicFace(id, letter, now), error: "still sealed" });
    return;
  }
  res.status(200).json({ ...publicFace(id, letter, now), body: letter.body });
}
