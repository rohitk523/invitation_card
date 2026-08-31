// Generates the invitation scene still (no text) with Nano Banana 2.
// Usage: node --env-file=../.env generate-still.mjs
import { GoogleGenAI } from "@google/genai";
import { writeFileSync, mkdirSync } from "node:fs";

const ai = new GoogleGenAI({});

const PROMPT = `A vertical 9:16 illustrated Indian engagement invitation backdrop, flat digital illustration in the style of premium wedding e-invites. Soft ivory and cream palette.

Scene: an elegant cream wall with a large soft ivory arch. From the top edge hang lush green leafy garlands and strings of white jasmine flowers. Two small antique gold chandeliers with lit candles hang beneath the greenery. On the left and right edges, champagne-beige silk drapes fall to the floor with strings of pearls. Blush pink rose arrangements with green leaves at the sides and bottom corners, and one tall rose arrangement on a stand.

At the bottom center, a faceless illustrated Indian couple sits on a cream and gold vintage settee, exchanging engagement rings: the bride wears a mint green embroidered lehenga with a soft dupatta, long dark hair; the groom wears a pistachio green kurta with white churidar. Their faces are blank with no facial features (faceless illustration style). Warm, soft, romantic lighting.

IMPORTANT: the upper-middle area of the image (from below the chandeliers down to above the couple) must be completely EMPTY cream wall, reserved for text to be added later. Absolutely no text, no letters, no words, no numbers, no logo, no watermark anywhere in the image.`;

const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image",
  contents: PROMPT,
  config: {
    responseModalities: ["IMAGE"],
    imageConfig: { aspectRatio: "9:16" },
  },
});

mkdirSync("../out", { recursive: true });
let saved = false;
for (const part of response.candidates?.[0]?.content?.parts ?? []) {
  if (part.inlineData?.data) {
    writeFileSync("../out/still.png", Buffer.from(part.inlineData.data, "base64"));
    saved = true;
  } else if (part.text) {
    console.log("model text:", part.text.slice(0, 500));
  }
}
if (!saved) {
  console.error("No image returned. Full response follows:");
  console.error(JSON.stringify(response, null, 2).slice(0, 3000));
  process.exit(1);
}
console.log("Saved ../out/still.png");
