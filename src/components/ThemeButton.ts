import { toggleTheme } from "../state-fns/theme";

import { _ } from "bemtv";
import { isThemeDark } from "../state-fns/theme";

const { click$, $, onInit, css, template } = _`ThemeButton`({
  themeName: "",
  dropShadowValue: "",
});

const getPTBRThemeName = () => (isThemeDark() ? "Claro" : "Escuro");

const setThemeValues = () => {
  $.themeName = getPTBRThemeName();
  $.dropShadowValue = isThemeDark() ? "white" : "black";
};

onInit(setThemeValues);

click$(() => {
  toggleTheme();
  setThemeValues();
});

css`
  position: fixed;
  right: 2%;
  bottom: 3%;
  padding: 5px;
  width: 90px;
  color: #d4d4d4;
  font-size: 16px;
  border-radius: 10px 0px 10px;
  border: 0px;
  height: 40px;
  background-color: rgba(28, 1, 25, 1);
  border: solid blue;
  border-width: 0px 1px 0px 1px;
`;

template`button[ 
    &:hover {
      filter: drop-shadow(0em 0em 1em $dropShadowValue);
    }
    ~ 
    $themeName ]`;
