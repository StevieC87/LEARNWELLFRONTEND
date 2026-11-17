// Theme is resolved before the first paint, not in a React effect, otherwise the page
// renders light and then switches once hydration runs — the white flash on reload.
//
// Two layers, because neither alone covers every load:
//  - the cookie lets the server put the right class on <html>/<body> in the streamed HTML,
//    so a returning visitor never has a wrong frame at all (works with JS off too);
//  - themeBootScript runs as the first thing inside <body>, before any content is parsed,
//    and covers the first ever visit (no cookie yet) and OS-preference-only visitors.
// It also writes the cookie back, so the next load is handled by the server.

import { saveAppearance } from "./appearanceSaver.js";

export const THEME_COOKIE = "preferredtheme";
export const THEME_STORAGE_KEY = "preferredtheme";
// Set only when the visitor actually works the toggle. The value above is just what to
// paint, and the boot script fills it in from the OS too, so it cannot answer "did they
// choose this?" — and without that we would stop following the OS after one page load.
export const THEME_EXPLICIT_KEY = "preferredtheme.explicit";

// Keep in sync with --backgrounddark / --backgroundlight in src/styles/variables.css.
const DARK_INK = "#333";
const LIGHT_INK = "#eee";

// The browser's own bar (theme-color) takes the page's colour, so the two read as one
// surface. Keep in sync with the body backgrounds in src/styles/base.css.
export const THEME_COLOR = { light: "#edf0f5", dark: "#0b1724" };

// For the server's first HTML: the side the cookie holds, else one tag per OS side.
export function themeColorFor(stored) {
  if (stored === "dark" || stored === "light") return THEME_COLOR[stored];
  return [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR.dark },
  ];
}

export function themeClass(isDark) {
  return isDark ? "dark-mode" : "light-mode";
}

// Client-side counterpart of the boot script, for components that need the stored value.
// Null when the visitor never picked: they follow the OS, not whatever the cookie last
// painted (the cookie is rewritten on every repaint, OS-driven ones included).
export function readPreferredTheme() {
  if (typeof document === "undefined") return null;
  if (!hasExplicitTheme() && typeof window.matchMedia === "function") return null;
  const fromCookie = document.cookie.match(/(?:^|;\s*)preferredtheme=(dark|light)/);
  if (fromCookie) return fromCookie[1];
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch (e) {
    // storage blocked
  }
  return null;
}

export function hasExplicitTheme() {
  try {
    return localStorage.getItem(THEME_EXPLICIT_KEY) === "1";
  } catch (e) {
    return false;
  }
}

// Whether the visitor picked a side, as a store for useSyncExternalStore: Profile →
// Appearance shows "Match system" as picked until they do.
const choiceListeners = new Set();
export const subscribeThemeChoice = (listener) => {
  choiceListeners.add(listener);
  return () => choiceListeners.delete(listener);
};
const choiceChanged = () => choiceListeners.forEach((listener) => listener());

// Back to following the OS. willRepaint: the caller is about to switch the theme to the
// OS's, and ThemeMetaUpdater must not take that switch for a pick (takeSystemFollow).
// Only set when a switch follows, or the flag would swallow the next real toggle.
let followPending = false;
export function followSystemTheme(willRepaint) {
  try {
    localStorage.removeItem(THEME_EXPLICIT_KEY);
  } catch (e) {
    // storage blocked
  }
  followPending = Boolean(willRepaint);
  choiceChanged();
  saveAppearance({ theme: "system" });
}

// The theme as the account keeps it (AppearanceSync.jsx): a side only once
// the visitor picked one, else "system".
export function localTheme() {
  if (!hasExplicitTheme()) return "system";
  return readPreferredTheme() || "system";
}
export function takeSystemFollow() {
  const pending = followPending;
  followPending = false;
  return pending;
}

export function systemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function applyTheme(isDark) {
  const root = document.documentElement;
  root.classList.toggle("dark-mode", isDark);
  root.classList.toggle("light-mode", !isDark);
  root.style.setProperty("--colorbasedontheme", isDark ? DARK_INK : LIGHT_INK);
  root.style.setProperty("--reversecolorbasedontheme", isDark ? LIGHT_INK : DARK_INK);
  if (document.body) {
    document.body.classList.toggle("dark-mode", isDark);
    document.body.classList.toggle("light-mode", !isDark);
  }
}

export function persistTheme(isDark, explicit = false) {
  const value = isDark ? "dark" : "light";
  try {
    localStorage.setItem(THEME_STORAGE_KEY, value);
    if (explicit) localStorage.setItem(THEME_EXPLICIT_KEY, "1");
  } catch (e) {
    // storage blocked
  }
  if (explicit) {
    choiceChanged();
    saveAppearance({ theme: value });
  }
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${THEME_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax${secure}`;
}

// Inlined into the document, so it has to be self-contained and must never throw.
export const themeBootScript = `(function(){try{
var x=null;try{x=localStorage.getItem('${THEME_EXPLICIT_KEY}')}catch(e){}
var m=x==='1'||!window.matchMedia?document.cookie.match(/(?:^|;\\s*)${THEME_COOKIE}=(dark|light)/):null;
var t=m?m[1]:null;
if(!t&&x==='1'){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');if(s==='dark'||s==='light'){t=s}}catch(e){}}
if(!t){t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}
var d=t==='dark',r=document.documentElement;
r.classList.toggle('dark-mode',d);r.classList.toggle('light-mode',!d);
r.style.setProperty('--colorbasedontheme',d?'${DARK_INK}':'${LIGHT_INK}');
r.style.setProperty('--reversecolorbasedontheme',d?'${LIGHT_INK}':'${DARK_INK}');
if(document.body){document.body.classList.toggle('dark-mode',d);document.body.classList.toggle('light-mode',!d)}
document.cookie='${THEME_COOKIE}='+t+'; path=/; max-age=31536000; samesite=lax'+(location.protocol==='https:'?'; secure':'');
}catch(e){}})();`;
