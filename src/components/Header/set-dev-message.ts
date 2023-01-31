import { devMessageEl } from "./Header";

export function setDevMessage() {
  const { click$, el } = devMessageEl();

  if (!el) return;

  const initTextContent = el.textContent;

  const playWithTextContent = () => {
    el.textContent = "Yes, baby!";

    setTimeout(() => (el.textContent = initTextContent), 2000);
  };

  click$(playWithTextContent);
}
