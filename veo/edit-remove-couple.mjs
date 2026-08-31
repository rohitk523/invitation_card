// Produces an empty "stage plate" from the style-B artwork by removing
// the couple, settee and foreground roses (for geometric recompositing).
// Usage: node --env-file=../.env edit-remove-couple.mjs
import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync } from "node:fs";

const ai = new GoogleGenAI({});

const PROMPT = process.argv[4] ?? `Edit this illustration: completely remove the couple, the settee they sit on, and the pink rose bushes at the bottom of the image. Fill those areas with the same empty cream wall and plain floor, continuing the existing background naturally. Keep everything else exactly identical: the green garlands, jasmine strings, gold chandeliers, champagne drapes, pearls, colors and art style. The result is the same scene but as an empty stage with nobody in it. No text anywhere.`;

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

const SRC = process.argv[2] ?? "../out/couple_invite.png";
const DST = process.argv[3] ?? "../out/bg_plate.png";
const data = readFileSync(SRC).toString("base64");
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
    writeFileSync(DST, Buffer.from(part.inlineData.data, "base64"));
    saved = true;
  }
}
console.log(saved ? `saved ${DST}` : "FAILED: no image returned");
if (!saved) process.exit(1);
