import { _, CSSClass } from "bemtv";
import $theme, { isThemeDark } from "../state-fns/theme";

import { proxy } from "./LoadingBar";

export const { css, onInst, onUpdate, keepInst, $, template, render } =
  _`App`();

export const LoadingBarProxy = proxy();

let themeClass: CSSClass;

$theme.watch(() => {
  themeClass?.remove();

  if (isThemeDark()) {
    themeClass = css`
      background-color: #1c1b22;
      color: #eef;
    `;
    return;
  }
  themeClass = css`
    background-color: #d4d4d4;
    color: #131313;
  `;
});

css`
  transition: 0.6s all ease-in;
`;

template`  

div[ ${LoadingBarProxy}[] Header[] Main[] MainFooter[] ThemeButton[] ]`;

render();
