// Recomposes the style-B scene with a much smaller couple and a tall
// clear text wall, using the existing artwork as identity/style reference.
// Usage: node --env-file=../.env recompose-small-couple.mjs
import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync } from "node:fs";

const ai = new GoogleGenAI({});

const PROMPT = `Using the reference illustration, create the SAME illustrated Indian engagement invitation scene with the SAME couple (identical faces: her long dark hair and smile, his beard, no eyeglasses; identical outfits: mint green lehenga, pistachio green kurta; same ring-exchange pose on the same cream-gold settee) and the same flat e-invite art style — but with a different COMPOSITION in vertical 9:16:

- The couple and settee are SMALL: together they occupy only the bottom quarter of the image height, centered at the bottom, with the blush rose bushes beside them kept proportionally small.
- The top 18% of the image: green leaf garlands with two small gold chandeliers and SHORT strings of white jasmine that end just below the chandeliers.
- The champagne drapes and pearls stay only at the far left and right edges, slim, not intruding toward the center.
- Everything between the chandeliers and the couple — more than half of the image height — is completely EMPTY clear cream wall for text: no flowers, no strings, no decorations in that whole middle band.
- Absolutely no text, letters, numbers, logos or watermarks anywhere.`;

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

const artwork = readFileSync("../out/couple_invite.png").toString("base64");
const response = await withRetry(() => ai.models.generateContent({
  model: "gemini-3.1-flash-image",
  contents: [
    { inlineData: { mimeType: "image/png", data: artwork } },
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
