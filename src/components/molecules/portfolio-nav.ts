type Dispose = () => void;

import { smoothScrollToElement } from "./smooth-scroll";

export function setupPortfolioNav(root: HTMLElement): Dispose {
  const links = Array.from(
    root.querySelectorAll<HTMLAnchorElement>("[data-nav-link]")
  );

  if (!links.length) {
    return () => undefined;
  }

  let cancelScroll: () => void = () => {};
  let disposed = false;

  const scrollToHash = (id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    cancelScroll();
    cancelScroll = smoothScrollToElement(target, {
      offset: 24,
      duration: 1200,
    });
  };

  const onLinkClick = (event: MouseEvent) => {
    const link = event.currentTarget as HTMLAnchorElement;
    const id = link.getAttribute("href")?.slice(1);
    if (!id) {
      return;
    }

    event.preventDefault();
    history.replaceState(null, "", `#${id}`);
    scrollToHash(id);
  };

  const onHashChange = () => {
    if (disposed) {
      return;
    }

    const id = window.location.hash.slice(1);
    if (!id) {
      return;
    }

    scrollToHash(id);
  };

  links.forEach((link) => link.addEventListener("click", onLinkClick));
  window.addEventListener("hashchange", onHashChange);

  if (window.location.hash) {
    window.requestAnimationFrame(onHashChange);
  }

  return () => {
    disposed = true;
    cancelScroll();
    links.forEach((link) => link.removeEventListener("click", onLinkClick));
    window.removeEventListener("hashchange", onHashChange);
  };
}
