type ScrollOptions = {
  offset?: number;
  duration?: number;
};

const easeInOutCubic = (progress: number) =>
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

export function smoothScrollToElement(
  target: HTMLElement,
  { offset = 0, duration = 720 }: ScrollOptions = {}
): () => void {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reducedMotion = mediaQuery.matches;
  const startY = window.scrollY;
  const targetY = Math.max(
    0,
    Math.min(
      startY + target.getBoundingClientRect().top - offset,
      document.documentElement.scrollHeight - window.innerHeight
    )
  );

  if (reducedMotion || Math.abs(targetY - startY) < 2) {
    window.scrollTo(0, targetY);
    return () => undefined;
  }

  // Anima escrevendo window.scrollTo a cada frame. O Lenis (smoothWheel) não
  // interfere em scroll programático, então não precisamos integrá-lo aqui.
  let frame = 0;
  let cancelled = false;
  const startedAt = performance.now();

  const tick = (now: number) => {
    if (cancelled) {
      return;
    }

    const elapsed = now - startedAt;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    const currentY = startY + (targetY - startY) * eased;

    window.scrollTo(0, currentY);

    if (progress < 1) {
      frame = window.requestAnimationFrame(tick);
      return;
    }

    window.scrollTo(0, targetY);
  };

  frame = window.requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    if (frame) {
      window.cancelAnimationFrame(frame);
    }
  };
}
