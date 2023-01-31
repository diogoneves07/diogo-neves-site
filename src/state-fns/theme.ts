import { stateFn } from "bemtv";

const [$theme, setTheme] = stateFn("dark", true);

export const isThemeDark = () => $theme() === "dark";

export const toggleTheme = () => setTheme(isThemeDark() ? "light" : "dark");

export default $theme;
