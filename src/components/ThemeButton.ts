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
  bottom: 5%;
  padding: 10px;
  width: 100px;
  color: #d4d4d4;
  font-size: 18px;
  border-radius: 10px 0px 10px;
  border: 0px;
  background-color: rgba(3, 6, 40, 1);
  border: solid blue;
  border-width: 0px 1px 0px 1px;
`;

template`button[ 
    &:hover {
      filter: drop-shadow(0em 0em 1em $dropShadowValue);
    }
    ~ 
    $themeName ]`;
