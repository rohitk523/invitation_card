// Animates a still with Veo image-to-video.
// Usage: node --env-file=../.env generate-video.mjs [modelId] [imagePath] [outPath] [prompt]
//   default model: veo-3.1-lite-generate-preview ($0.05/s); pass
//   veo-3.1-generate-preview for the standard model ($0.40/s).
import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "node:fs";

const MODEL = process.argv[2] ?? "veo-3.1-lite-generate-preview";
const IMAGE = process.argv[3] ?? "../out/still.png";
const OUT = process.argv[4] ?? "../out/veo_raw.mp4";
const ai = new GoogleGenAI({});

const PROMPT = process.argv[5] ?? `Bring this illustrated wedding-invitation artwork to life with very subtle, gentle ambient motion. Locked static camera, no zoom, no pan. The green leaf garlands and jasmine strings at the top sway softly as if in a light breeze. The chandelier candle flames flicker gently. A few blush pink rose petals drift slowly down through the scene. The bride's dupatta and the drapes ripple very slightly. The couple moves minimally: a slight tilt of heads toward each other as the groom slides the ring onto the bride's finger, with a tiny golden sparkle at their hands. Preserve the flat illustration art style exactly; nothing changes style or color. No text, letters, watermarks or logos appear. No camera zoom, pan or cuts, no photorealism, no extra people. Soft romantic Indian instrumental music with gentle shehnai, no vocals, no talking.`;

const imageBytes = readFileSync(IMAGE).toString("base64");

async function withRetry(fn, label, tries = 5) {
  for (let i = 1; ; i++) {
    try { return await fn(); }
    catch (e) {
      const code = e?.cause?.code ?? e?.status ?? e?.message;
      if (i >= tries) throw e;
      console.log(`${label} failed (${code}), retry ${i}/${tries - 1} in ${i * 12}s…`);
      await new Promise((r) => setTimeout(r, i * 12000));
    }
  }
}

let operation = await withRetry(() => ai.models.generateVideos({
  model: MODEL,
  source: {
    prompt: PROMPT,
    image: { imageBytes, mimeType: "image/png" },
  },
  config: {
    aspectRatio: "9:16",
    resolution: "720p",
  },
}), "generateVideos");

const started = Date.now();
while (!operation.done) {
  const elapsed = Math.round((Date.now() - started) / 1000);
  console.log(`waiting… ${elapsed}s`);
  if (elapsed > 600) throw new Error("Timed out after 10 minutes");
  await new Promise((r) => setTimeout(r, 10000));
  try {
    operation = await ai.operations.getVideosOperation({ operation });
  } catch (e) {
    console.log(`  poll failed (${e?.cause?.code ?? e?.status ?? e.message}), retrying…`);
  }
}

if (operation.error) {
  console.error("Generation failed:", JSON.stringify(operation.error, null, 2));
  process.exit(1);
}

const video = operation.response?.generatedVideos?.[0]?.video;
if (!video) {
  console.error("No video in response:", JSON.stringify(operation.response, null, 2).slice(0, 3000));
  process.exit(1);
}

await withRetry(() => ai.files.download({ file: video, downloadPath: OUT }), "download");
console.log(`Saved ${OUT} (model: ${MODEL})`);
