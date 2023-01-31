import { stateFn } from "bemtv";

const initTheme =
  window.matchMedia &&
  !window.matchMedia("(prefers-color-scheme: dark)").matches;

const [$theme, setTheme] = stateFn(initTheme ? "light" : "dark", true);

export const isThemeDark = () => $theme() === "dark";

export const toggleTheme = () => setTheme(isThemeDark() ? "light" : "dark");

export default $theme;
