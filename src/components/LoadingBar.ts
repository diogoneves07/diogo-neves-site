import { useFirstElManager, _ } from "bemtv";

function animeLoadingBar(p: number) {
  const { el } = useFirstElManager<HTMLDivElement>();

  if (!el) return;

  if (p === 0) {
    el.style.cssText = "";
    return;
  }

  if (p < 100) {
    Object.assign(el.style, {
      opacity: "1",
      width: `${p}%`,
      transition: "0.7s width ease-in-out",
    });
    return;
  }

  Object.assign(el.style, {
    opacity: "0",
    width: "100%",
    transition: "0.5s opacity ease-in-out",
  });

  setTimeout(() => (el.style.cssText = ""), 500);
}

function showLoadingBar(percent: number) {
  animeLoadingBar(percent);
}

export const { css, proxy, onInit, onUpdate, $, template } = _`LoadingBar`({
  showLoadingBar,
});

css`
  opacity: 0;
  width: 0;
  position: fixed;
  top: 0;
  height: 3px;
  background: rgb(89, 25, 81);
  background: linear-gradient(90deg, rgba(109, 25, 81, 1) 28%, blue 76%);
  z-index: 999;
`;

template`div[]`;
