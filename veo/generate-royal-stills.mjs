// Generates the three artwork stills for the royal Jaipur-style invite.
// Usage: node --env-file=../.env generate-royal-stills.mjs [key ...]
import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync } from "node:fs";

const ai = new GoogleGenAI({});

const STYLE = `Flat digital illustration in the style of premium Indian royal wedding e-invites: Jaipur palace / Pichwai miniature painting aesthetic, ornate but clean, soft pastel palette on cream, delicate linework. Vertical 9:16. Absolutely no text, letters, numbers, logos or watermarks anywhere.`;

const GARDEN = `The bottom of the scene is a palace garden terrace: a white marble balustrade railing, a small domed white chhatri pavilion on the right, manicured green trees and bushes, pink roses and wildflowers along the bottom edge. Delicate flowering vines and eucalyptus sprigs hang into the frame from the upper corners. The scene is framed by an ornate cream border with subtle floral damask ornaments in the corners.`;

const STILLS = {
  gate: {
    file: "royal_gate.png",
    refs: [],
    prompt: `A closed ornate golden double door in Jaipur City Palace rose-gate style, filling most of the frame: two tall arched golden door panels, richly carved with diamond lattice patterns and studs, each with a round golden ring knocker, CLOSED. They sit under a scalloped white marble arch. Above the arch, a large radiating fan of soft pink lotus petals (like the famous Jaipur Rose Gate ceiling), bordered by delicate pink flowers and small green accents on cream walls, with a small golden sun emblem at the very top center. White marble wainscot at the bottom sides. ${STYLE}`,
  },
  ganesh: {
    file: "royal_ganesh.png",
    refs: [],
    prompt: `An invitation backdrop: inside a large cream scalloped Mughal arch, a soft powder-blue wall with a subtle tone-on-tone floral damask pattern. Centered in the UPPER THIRD of the arch, a charming small illustrated Lord Ganesha wearing a red and gold turban, seated in blessing pose with folded trunk, drawn in the same flat illustration style with soft colors. The entire middle of the arch below Ganesha is empty powder-blue damask, reserved for text. ${GARDEN} ${STYLE}`,
  },
  couple: {
    file: "royal_couple.png",
    refs: ["../out/refs/ref1.jpg", "../out/refs/ref2.jpg"],
    prompt: `Using the two reference photos of this real couple, draw them as flat-illustration characters with their actual faces stylized but clearly recognizable (her long dark hair and warm smile, his beard, no eyeglasses). An invitation backdrop: inside a large cream scalloped Mughal arch, a big royal purple panel with a subtle tone-on-tone floral damask pattern fills the arch. A small blue peacock with an elegant trailing tail perches on the top edge of the purple panel. The couple stands together at the BOTTOM CENTER on the garden terrace, SMALL, occupying only the bottom fifth of the image: she wears a rose-pink heavily embroidered lehenga with a soft dupatta, holding his arm; he wears a white kurta with churidar and a rose-pink Nehru jacket. The purple panel above them is almost entirely EMPTY, reserved for text. ${GARDEN} ${STYLE}`,
  },
};

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

const keys = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(STILLS);
for (const key of keys) {
  const st = STILLS[key];
  if (!st) { console.error(`unknown: ${key}`); continue; }
  console.log(`generating ${key}…`);
  const parts = [
    ...st.refs.map((p) => ({ inlineData: { mimeType: "image/jpeg", data: readFileSync(p).toString("base64") } })),
    { text: st.prompt },
  ];
  const response = await withRetry(() => ai.models.generateContent({
    model: "gemini-3.1-flash-image",
    contents: parts,
    config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "9:16" } },
  }));
  let saved = false;
  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData?.data) {
      writeFileSync(`../out/${st.file}`, Buffer.from(part.inlineData.data, "base64"));
      saved = true;
    }
  }
  console.log(saved ? `saved ../out/${st.file}` : `FAILED: ${key}`);
}
