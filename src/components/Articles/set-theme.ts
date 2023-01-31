import $theme, { isThemeDark } from "../../state-fns/theme";
import { CSSClass } from "bemtv";
import { css } from "./Articles";

let themeClass: CSSClass;

$theme.watch(() => {
  themeClass?.remove();

  if (isThemeDark()) {
    themeClass = css`
      background-color: #24222c;

      p {
        background-color: #201f28;
      }
    `;
    return;
  }

  themeClass = css`
    background-color: #e9e9e9;

    p {
      background-color: #e0e0e0;
    }
  `;
});
