// Generates invitation-scene stills featuring the actual couple (from
// reference photos) in different illustration styles.
// Usage: node --env-file=../.env generate-couple-styles.mjs [styleKey ...]
import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync } from "node:fs";

const ai = new GoogleGenAI({});

const SCENE = `Place them into a vertical 9:16 illustrated Indian engagement invitation scene: an elegant cream wall with a large soft ivory arch; lush green leafy garlands and strings of white jasmine hanging from the top; two small antique gold chandeliers with lit candles; champagne-beige silk drapes with pearl strings on the left and right edges; blush pink rose arrangements at the sides and bottom corners. The couple sits together at the bottom center on a cream and gold vintage settee, exchanging engagement rings, dressed in coordinated outfits: she wears a mint green embroidered lehenga with a soft dupatta, he wears a pistachio green kurta with white churidar (he keeps his glasses and beard). The upper-middle area of the image, from below the chandeliers to above the couple, must be completely EMPTY cream wall reserved for text. Absolutely no text, letters, numbers, logos or watermarks anywhere.`;

const STYLES = {
  invite: {
    file: "couple_invite.png",
    prompt: `Using the two reference photos of this real couple, draw them as elegant premium wedding e-invite illustrations (flat vector-style digital illustration, clean linework, soft pastel shading) with their actual faces stylized but clearly recognizable: her long dark hair and warm smile, his beard and glasses. ${SCENE}`,
  },
  ghibli: {
    file: "couple_ghibli.png",
    prompt: `Using the two reference photos of this real couple, redraw them in the style of a hand-painted Japanese animated film: soft watercolor-like backgrounds, warm gentle light, expressive rounded anime faces that are clearly recognizable as this couple: her long dark hair and warm smile, his beard and glasses. ${SCENE}`,
  },
  watercolor: {
    file: "couple_watercolor.png",
    prompt: `Using the two reference photos of this real couple, paint them as a romantic loose watercolor illustration: soft blooming washes of color, delicate ink linework, dreamy and airy, faces softly painted but clearly recognizable as this couple: her long dark hair and warm smile, his beard and glasses. ${SCENE}`,
  },
};

const keys = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(STYLES);
const ref1 = readFileSync("../out/refs/ref1.jpg").toString("base64");
const ref2 = readFileSync("../out/refs/ref2.jpg").toString("base64");

for (const key of keys) {
  const style = STYLES[key];
  if (!style) { console.error(`unknown style: ${key}`); continue; }
  console.log(`generating ${key}…`);
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image",
    contents: [
      { inlineData: { mimeType: "image/jpeg", data: ref1 } },
      { inlineData: { mimeType: "image/jpeg", data: ref2 } },
      { text: style.prompt },
    ],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: "9:16" },
    },
  });
  let saved = false;
  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData?.data) {
      writeFileSync(`../out/${style.file}`, Buffer.from(part.inlineData.data, "base64"));
      saved = true;
    } else if (part.text) {
      console.log(`model text (${key}):`, part.text.slice(0, 300));
    }
  }
  console.log(saved ? `saved ../out/${style.file}` : `FAILED: ${key} returned no image`);
}
