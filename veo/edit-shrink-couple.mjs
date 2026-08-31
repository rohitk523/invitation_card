// Shrinks the couple + settee ~30% so the text zone gets taller.
// Usage: node --env-file=../.env edit-shrink-couple.mjs
import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync } from "node:fs";

const ai = new GoogleGenAI({});

const PROMPT = `Edit this illustration with a layout change: make the couple and the vintage settee they sit on about 30% smaller, keeping them anchored at the bottom center of the image (their feet and the settee legs stay near the bottom edge; do NOT move them upward). Also make the hanging strings of white jasmine flowers shorter so they end just below the two gold chandeliers. As a result, the empty cream wall area in the middle of the image becomes much taller and completely clear.

Keep everything else exactly the same: the same two faces (her long dark hair and smile, his beard, no eyeglasses), same outfits, same ring-exchange pose, same chandeliers, green garlands, drapes, pearls, roses, colors and flat illustration art style. No text anywhere.`;

async function withRetry(fn, tries = 4) {
  for (let i = 1; ; i++) {
    try { return await fn(); }
    catch (e) {
      const transient = e?.status === 503 || e?.status === 429 || e?.status === 500;
      if (!transient || i >= tries) throw e;
      console.log(`  transient ${e.status}, retry ${i}/${tries - 1}…`);
      await new Promise((r) => setTimeout(r, 15000 * i));
    }
  }
}

const data = readFileSync("../out/couple_invite.png").toString("base64");
const response = await withRetry(() => ai.models.generateContent({
  model: "gemini-3.1-flash-image",
  contents: [
    { inlineData: { mimeType: "image/png", data } },
    { text: PROMPT },
  ],
  config: {
    responseModalities: ["IMAGE"],
    imageConfig: { aspectRatio: "9:16" },
  },
}));

let saved = false;
for (const part of response.candidates?.[0]?.content?.parts ?? []) {
  if (part.inlineData?.data) {
    writeFileSync("../out/couple_invite_small.png", Buffer.from(part.inlineData.data, "base64"));
    saved = true;
  }
}
console.log(saved ? "saved ../out/couple_invite_small.png" : "FAILED: no image returned");
if (!saved) process.exit(1);
