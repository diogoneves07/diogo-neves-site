import $theme, { isThemeDark } from "../state-fns/theme";
import { _, onRouteUnfound, CSSClass } from "bemtv";

const { renderRoute, css, template } = _`PageNotFound`();

let themeClass: CSSClass;

$theme.watch(() => {
  themeClass?.remove();

  if (isThemeDark()) {
    themeClass = css`
      button {
        border-color: lightblue;
        color: lightblue;
      }
    `;
    return;
  }

  themeClass = css`
    button {
      border-color: blue;
      color: blue;
    }
  `;
});

css`
  height: 200px;
  display: grid;
  justify-content: center;
  align-items: center;
  div {
    text-align: center;
  }
  h1 {
    text-align: center;
  }
  button {
    width: 200px;
    height: 50px;
    font-size: 18px;
    margin-top: 20px;
    background-color: transparent;
    border: 1px solid;
    cursor: pointer;
    border-radius: 10px 0px 10px;
  }
`;

template`
    div[
        div[
            h2[Página não encontrada! :(]

            #Root[button[Início]]
        ]
    ]`;

onRouteUnfound(() => {
  renderRoute();
});
