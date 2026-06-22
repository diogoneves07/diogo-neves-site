export type QualityTier = "high" | "medium" | "low";

export type QualityProfile = {
  tier: QualityTier;
  reduceMotion: boolean;
  starCount: number;
  pixelRatio: number;
  postprocessing: boolean;
  bloomResolution: number;
};

const isMobile = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
  Math.min(window.innerWidth, window.innerHeight) < 640;

const isWeakGpu = () => {
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return cores <= 4 || memory <= 4;
};

export function detectQuality(): QualityProfile {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = isMobile();
  const weak = isWeakGpu();

  let tier: QualityTier = "high";
  if (mobile || weak) {
    tier = mobile && weak ? "low" : "medium";
  }

  const presets: Record<QualityTier, Omit<QualityProfile, "tier" | "reduceMotion">> = {
    high: { starCount: 2000, pixelRatio: 1.5, postprocessing: true, bloomResolution: 480 },
    medium: { starCount: 1200, pixelRatio: 1.25, postprocessing: true, bloomResolution: 320 },
    low: { starCount: 700, pixelRatio: 1, postprocessing: false, bloomResolution: 240 },
  };

  return { tier, reduceMotion, ...presets[tier] };
}
