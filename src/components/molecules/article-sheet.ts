type Dispose = () => void;

const HASH_PREFIX = "#leitura-";

/**
 * Controla o bottom-sheet de leitura de artigos sobre a home.
 *
 * O deep-link é feito por hash (`#leitura-<slug>`): clicar num card é uma
 * navegação de hash nativa (entra no histórico), então o `hashchange` é a
 * única fonte de verdade para abrir/fechar — back/forward funcionam de graça
 * e não há conflito com o ClientRouter (hashes não disparam view transitions).
 */
export function setupArticleSheet(root: HTMLElement): Dispose {
  const sheet = root.querySelector<HTMLElement>("[data-article-sheet]");
  const dialog = sheet?.querySelector<HTMLElement>("[data-article-dialog]");
  const scroller = sheet?.querySelector<HTMLElement>("[data-article-scroll]");

  if (!sheet || !dialog || !scroller) {
    return () => undefined;
  }

  const panels = Array.from(
    sheet.querySelectorAll<HTMLElement>("[data-article-panel]")
  );
  let hideTimer: number | null = null;

  const clearHideTimer = () => {
    if (hideTimer === null) return;
    window.clearTimeout(hideTimer);
    hideTimer = null;
  };

  const finalizeClose = () => {
    if (sheet.dataset.open === "false") {
      sheet.hidden = true;
    }
    clearHideTimer();
  };

  const slugFromHash = (): string | null =>
    location.hash.startsWith(HASH_PREFIX)
      ? decodeURIComponent(location.hash.slice(HASH_PREFIX.length))
      : null;

  const openSheet = (slug: string) => {
    const target = panels.find((panel) => panel.dataset.articlePanel === slug);
    if (!target) {
      closeSheet();
      return;
    }

    panels.forEach((panel) => {
      panel.hidden = panel !== target;
    });
    scroller.scrollTop = 0;
    clearHideTimer();
    sheet.hidden = false;
    document.documentElement.dataset.sheetOpen = "true";
    window.dispatchEvent(new CustomEvent("lenis:lock"));
    // Próximo frame para a transição de entrada disparar a partir do estado fechado.
    requestAnimationFrame(() => {
      sheet.dataset.open = "true";
    });
  };

  const closeSheet = () => {
    if (sheet.hidden) return;
    sheet.dataset.open = "false";
    document.documentElement.dataset.sheetOpen = "false";
    window.dispatchEvent(new CustomEvent("lenis:unlock"));
    clearHideTimer();
    const closeDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 20
      : 500;
    hideTimer = window.setTimeout(finalizeClose, closeDelay);
  };

  // Só esconde de fato após a animação de saída do painel.
  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName === "transform" && sheet.dataset.open === "false") {
      finalizeClose();
    }
  };

  const sync = () => {
    const slug = slugFromHash();
    if (slug) openSheet(slug);
    else closeSheet();
  };

  // Fechar limpa o hash sem deixar um "#" solto e sem empilhar histórico,
  // de modo que o botão "voltar" do navegador saia para antes do artigo.
  const requestClose = () => {
    if (slugFromHash()) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    closeSheet();
  };

  const onCloseClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest("[data-article-close]")) return;
    event.preventDefault();
    requestClose();
  };

  // Abrir no clique do card: o ClientRouter pode interceptar o link de hash e
  // trocar a URL via pushState (que não dispara `hashchange`), então não
  // dependemos da navegação nativa — definimos o hash nós mesmos, o que sempre
  // emite `hashchange` e mantém o botão "voltar" do navegador funcional.
  const onLinkClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>("[data-article-link]");
    if (!link) return;

    const hash = link.getAttribute("href") ?? "";
    if (!hash.startsWith(HASH_PREFIX)) return;

    event.preventDefault();
    const slug = decodeURIComponent(hash.slice(HASH_PREFIX.length));
    if (slugFromHash() === slug) {
      openSheet(slug);
    } else {
      location.hash = hash;
    }
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && sheet.dataset.open === "true") {
      requestClose();
    }
  };

  dialog.addEventListener("transitionend", onTransitionEnd);
  root.addEventListener("click", onLinkClick);
  sheet.addEventListener("click", onCloseClick);
  window.addEventListener("hashchange", sync);
  document.addEventListener("keydown", onKeydown);
  window.addEventListener("keydown", onKeydown);

  sync();

  return () => {
    dialog.removeEventListener("transitionend", onTransitionEnd);
    root.removeEventListener("click", onLinkClick);
    sheet.removeEventListener("click", onCloseClick);
    window.removeEventListener("hashchange", sync);
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("keydown", onKeydown);
    clearHideTimer();
    delete document.documentElement.dataset.sheetOpen;
  };
}
