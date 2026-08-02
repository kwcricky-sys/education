/**
 * Client-side English captions for P1 portfolios.
 * Default: 0-cost scene templates (private, instant).
 * Optional: dynamically load Transformers.js VLM later via generateCaptionWithVlm().
 */

export type PhotoScene =
  | "reading"
  | "sports"
  | "music"
  | "art"
  | "family"
  | "stem"
  | "service";

export const PHOTO_SCENES: { id: PhotoScene; label: string }[] = [
  { id: "reading", label: "閱讀／專注" },
  { id: "sports", label: "運動／團隊" },
  { id: "music", label: "音樂／表演" },
  { id: "art", label: "美術／創作" },
  { id: "family", label: "家庭時光" },
  { id: "stem", label: "STEM／探索" },
  { id: "service", label: "服務／關愛" },
];

const CAPTION_BANK: Record<PhotoScene, string[]> = {
  reading: [
    "Showing intense focus and curiosity during independent reading time.",
    "Engaging with stories calmly, building vocabulary and imagination.",
  ],
  sports: [
    "Demonstrating teamwork and sportsmanship in badminton training.",
    "Showing persistence and energy while practising physical skills.",
  ],
  music: [
    "Expressing confidence and joy through music performance.",
    "Practising with patience and listening carefully to rhythm.",
  ],
  art: [
    "Exploring colours and ideas with creativity and careful observation.",
    "Enjoying hands-on art-making and sharing creations with others.",
  ],
  family: [
    "Building warm family bonds through shared activities and conversation.",
    "Showing care, manners, and happiness in everyday family moments.",
  ],
  stem: [
    "Asking questions and exploring how things work with curious hands.",
    "Solving simple challenges with focus and a love of discovery.",
  ],
  service: [
    "Showing kindness and responsibility while helping others.",
    "Learning empathy through small acts of care in the community.",
  ],
};

/** Instant local caption (no model download). */
export function generateLocalCaption(scene: PhotoScene): string {
  const list = CAPTION_BANK[scene];
  return list[Math.floor(Math.random() * list.length)] ?? list[0];
}

/**
 * Placeholder for Transformers.js / WebLLM vision captioning.
 * Call from a button; keep heavy models out of the initial bundle.
 *
 * Future wiring example:
 *   const { pipeline } = await import('@xenova/transformers');
 *   const captioner = await pipeline('image-to-text', 'Xenova/...');
 *   const out = await captioner(imageDataUrl);
 */
export async function generateCaptionWithVlm(_opts: {
  imageDataUrl: string;
  scene?: PhotoScene;
}): Promise<{ caption: string; engine: "vlm" | "local-fallback" }> {
  // VLM not bundled yet — fall back so UI stays 0-cost & private by default.
  const scene = _opts.scene ?? "reading";
  return {
    caption: generateLocalCaption(scene),
    engine: "local-fallback",
  };
}
