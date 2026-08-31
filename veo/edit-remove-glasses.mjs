// Removes the groom's eyeglasses from the generated couple stills via
// Nano Banana image editing, leaving everything else untouched.
// Usage: node --env-file=../.env edit-remove-glasses.mjs [file ...]
import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync } from "node:fs";

const ai = new GoogleGenAI({});
const FILES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["couple_invite.png", "couple_ghibli.png", "couple_watercolor.png"];

async function withRetry(fn, tries = 4) {
  for (let i = 1; ; i++) {
    try { return await fn(); }
    catch (e) {
      const transient = e?.status === 503 || e?.status === 429 || e?.status === 500;
      if (!transient || i >= tries) throw e;
      const wait = 15000 * i;
      console.log(`  transient ${e.status}, retry ${i}/${tries - 1} in ${wait / 1000}s…`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

const PROMPT = `Edit this illustration: remove the man's eyeglasses completely so his face is bare around the eyes, drawn in the same art style. Change absolutely nothing else — keep the same faces, hair, beard, outfits, pose, furniture, decorations, colors, composition and empty text area exactly as they are.`;

for (const file of FILES) {
  console.log(`editing ${file}…`);
  const data = readFileSync(`../out/${file}`).toString("base64");
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
      writeFileSync(`../out/${file}`, Buffer.from(part.inlineData.data, "base64"));
      saved = true;
    }
  }
  console.log(saved ? `updated ../out/${file}` : `FAILED: ${file} returned no image`);
}
