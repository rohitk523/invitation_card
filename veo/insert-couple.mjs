// Seats the couple (from the style-B artwork) onto the empty stage plate,
// which draws them at the settee's naturally smaller scale.
// Usage: node --env-file=../.env insert-couple.mjs
import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync } from "node:fs";

const ai = new GoogleGenAI({});

const PROMPT = `Take the couple from the SECOND image and seat them on the empty settee in the FIRST image, in the same ring-exchange pose: she sits on the left in her mint green lehenga with dupatta, he sits on the right in his pistachio green kurta, gently putting the ring on her finger. Their faces must stay IDENTICAL to the second image: her long dark hair and smile, his beard, no eyeglasses. Scale them naturally to fit the settee as it is drawn in the first image — do not enlarge the settee or the couple. Keep the first image's scene completely unchanged otherwise: same garlands, jasmine, chandeliers, drapes, roses, empty cream wall, colors and flat e-invite art style. No text anywhere.`;

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

const plate = readFileSync("../out/bg_plate.png").toString("base64");
const couple = readFileSync("../out/couple_invite.png").toString("base64");
const response = await withRetry(() => ai.models.generateContent({
  model: "gemini-3.1-flash-image",
  contents: [
    { inlineData: { mimeType: "image/png", data: plate } },
    { inlineData: { mimeType: "image/png", data: couple } },
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
