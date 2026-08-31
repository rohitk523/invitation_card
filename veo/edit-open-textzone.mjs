// Shortens the hanging jasmine strings in the style-B artwork so the
// middle cream wall has more open space for the text overlay.
// Usage: node --env-file=../.env edit-open-textzone.mjs
import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync } from "node:fs";

const ai = new GoogleGenAI({});

const PROMPT = `Edit this illustration: make the hanging strings of small white jasmine flowers much shorter, so they end just below the two gold chandeliers instead of hanging far down the wall. The empty cream wall area in the middle of the image should become noticeably taller and completely clear. Change absolutely nothing else — keep the couple, their faces, outfits, pose, the settee, chandeliers, green garlands, drapes, roses, colors and art style exactly as they are. No text anywhere.`;

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
    writeFileSync("../out/couple_invite_open.png", Buffer.from(part.inlineData.data, "base64"));
    saved = true;
  }
}
console.log(saved ? "saved ../out/couple_invite_open.png" : "FAILED: no image returned");
if (!saved) process.exit(1);
