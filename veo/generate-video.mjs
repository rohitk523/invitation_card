// Animates the still with Veo image-to-video.
// Usage: node --env-file=../.env generate-video.mjs [modelId]
//   default model: veo-3.1-lite-generate-preview ($0.05/s); pass
//   veo-3.1-generate-preview for the standard model ($0.40/s).
import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "node:fs";

const MODEL = process.argv[2] ?? "veo-3.1-lite-generate-preview";
const ai = new GoogleGenAI({});

const PROMPT = `Bring this illustrated wedding-invitation artwork to life with very subtle, gentle ambient motion. Locked static camera, no zoom, no pan. The green leaf garlands and jasmine strings at the top sway softly as if in a light breeze. The chandelier candle flames flicker gently. A few blush pink rose petals drift slowly down through the scene. The bride's dupatta and the drapes ripple very slightly. The couple moves minimally: a slight tilt of heads toward each other as the groom slides the ring onto the bride's finger, with a tiny golden sparkle at their hands. Preserve the flat illustration art style exactly; nothing changes style or color. No text, letters, watermarks or logos appear. No camera zoom, pan or cuts, no photorealism, no extra people. Soft romantic Indian instrumental music with gentle shehnai, no vocals, no talking.`;

const imageBytes = readFileSync("../out/still.png").toString("base64");

let operation = await ai.models.generateVideos({
  model: MODEL,
  source: {
    prompt: PROMPT,
    image: { imageBytes, mimeType: "image/png" },
  },
  config: {
    aspectRatio: "9:16",
    resolution: "720p",
  },
});

const started = Date.now();
while (!operation.done) {
  const elapsed = Math.round((Date.now() - started) / 1000);
  console.log(`waiting… ${elapsed}s`);
  if (elapsed > 600) throw new Error("Timed out after 10 minutes");
  await new Promise((r) => setTimeout(r, 10000));
  operation = await ai.operations.getVideosOperation({ operation });
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

await ai.files.download({ file: video, downloadPath: "../out/veo_raw.mp4" });
console.log(`Saved ../out/veo_raw.mp4 (model: ${MODEL})`);
