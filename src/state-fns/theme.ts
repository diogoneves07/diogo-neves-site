import { stateFn } from "bemtv";

const localStorageTheme = localStorage.getItem("theme");

const checkTheme =
  window.matchMedia &&
  !window.matchMedia("(prefers-color-scheme: dark)").matches;

const initTheme = localStorageTheme || (checkTheme ? "light" : "dark");

const [$theme, setTheme] = stateFn(initTheme, true);

export const isThemeDark = () => $theme() === "dark";

export const toggleTheme = () => {
  const value = isThemeDark() ? "light" : "dark";

  localStorage.setItem("theme", value);

  setTheme(value);
};

export default $theme;
