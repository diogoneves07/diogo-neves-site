type Dispose = () => void;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function setupPortfolioScroll(root: HTMLElement): Dispose {
  const sections = Array.from(
    root.querySelectorAll<HTMLElement>("[data-scene-section]")
  );
  const navLinks = Array.from(
    root.querySelectorAll<HTMLAnchorElement>("[data-nav-link]")
  );
  const revealNodes = Array.from(
    root.querySelectorAll<HTMLElement>("[data-reveal]")
  );

  if (!sections.length) {
    return () => undefined;
  }

  let frame = 0;

  const update = () => {
    frame = 0;

    const viewport = window.innerHeight || 1;
    const maxScroll = Math.max(document.body.scrollHeight - viewport, 1);
    const pageProgress = clamp(window.scrollY / maxScroll, 0, 1);

    root.dataset.scrollProgress = pageProgress.toFixed(4);
    document.documentElement.style.setProperty(
      "--portfolio-scroll-progress",
      pageProgress.toFixed(4)
    );

    let activeSection = sections[0];
    let activeDistance = Number.POSITIVE_INFINITY;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionProgress = clamp(
        (viewport - rect.top) / (viewport + rect.height),
        0,
        1
      );
      const distance = Math.abs(rect.top + rect.height / 2 - viewport / 2);

      section.style.setProperty("--section-progress", sectionProgress.toFixed(4));

      if (distance < activeDistance) {
        activeDistance = distance;
        activeSection = section;
      }
    });

    root.dataset.activeTone = activeSection.dataset.sceneTone ?? "dawn";
    root.dataset.activeFocus = activeSection.dataset.sceneFocus ?? "center";

    const activeId = activeSection.id;
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.dataset.active = isActive ? "true" : "false";
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    revealNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const isVisible = rect.top < viewport * 0.84 && rect.bottom > viewport * 0.18;
      node.dataset.revealed = isVisible ? "true" : "false";
    });
  };

  const queue = () => {
    if (!frame) {
      frame = window.requestAnimationFrame(update);
    }
  };

  update();

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);

  return () => {
    if (frame) {
      window.cancelAnimationFrame(frame);
    }
    window.removeEventListener("scroll", queue);
    window.removeEventListener("resize", queue);
  };
}
