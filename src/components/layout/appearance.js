// The rest of the viewer's look, beside the theme and the tab shape: the
// font, the text size, the accent colour, the page background, density,
// corners and motion. Picked in
// Profile → Appearance (features/account/profile/Appearance.jsx). Saved on
// the account with the rest of the look (lib/appearanceSaver.js,
// AppearanceSync.jsx); localStorage is the fast copy for the first paint.
// Each pick is a data attribute on <html> (data-font, data-text-size,
// data-accent, data-page-bg, data-density, data-corners, data-motion) and
// appearance.css holds what each value means.
// The default is no attribute at all, so the stylesheets' own values stand.
// appearanceBootScript sets them before the first paint, so a reload never
// draws one look and then another. No React here: the root layout, a server
// component, imports it.

import { saveAppearance } from "../../lib/appearanceSaver.js";

// [value, label, the next/font variable in app/layout.jsx]. All of them are
// already bundled; picking one only changes which the page uses.
export const FONTS = [
  ["public-sans", "Public Sans", "--PublicSans"],
  ["source-sans", "Source Sans 3", "--font-source-sans-3"],
  ["satoshi", "Satoshi", "--satoshi"],
  ["geist", "Geist", "--geist"],
  ["ibm-plex", "IBM Plex Sans", "--IBMPlexSans"],
  ["mona", "Mona Sans", "--MonaSans"],
  ["jakarta", "Plus Jakarta Sans", "--PlusJakartaSans"],
  ["system", "This device's font", null],
];

// Every size in the dashboard is in rem off <html>'s 62.5% (1rem = 10px), so
// this scales text, controls and spacing together.
export const TEXT_SIZES = [
  ["small", "Small"],
  ["normal", "Normal"],
  ["large", "Large"],
  ["larger", "Larger"],
];

// [value, label, light-mode swatch, dark-mode swatch]. Goose orange is the
// brand's. No green, yellow or red: those are the success/warning/danger
// colours, and a primary button in one of them reads as a status.
export const ACCENTS = [
  ["orange", "Goose orange", "#ff9f1c", "#ff9f1c"],
  ["blue", "Blue", "#2f5bff", "#6b8cff"],
  ["violet", "Violet", "#6d28d9", "#a78bfa"],
  ["teal", "Teal", "#0f766e", "#2dd4bf"],
  ["magenta", "Magenta", "#a21caf", "#e879f9"],
  ["graphite", "Graphite", "#374151", "#d1d5db"],
];

// [value, label, light page, dark page].
export const BACKGROUNDS = [
  ["cool", "Cool grey", "#edf0f5", "#0b1724"],
  ["neutral", "Neutral", "#f2f2f2", "#1e1e1e"],
  ["warm", "Warm", "#f5f2ec", "#221f1c"],
  ["blue", "Blue", "#edf2fb", "#121a2b"],
  ["contrast", "White / black", "#ffffff", "#0b0b0c"],
];

// Cards (.ui-card, .card) and kit controls only: other surfaces keep their
// own spacing and radii, and the analytics grid's gap is part of its layout
// maths, so it stays.
export const DENSITIES = [
  ["comfortable", "Comfortable"],
  ["compact", "Compact"],
];
export const CORNERS = [
  ["sharp", "Sharp"],
  ["soft", "Soft"],
  ["round", "Round"],
];

// "device" follows the OS's reduce-motion setting, as the CSS already does;
// "reduce" asks for it here whatever the device says.
export const MOTIONS = [
  ["device", "Follow device"],
  ["reduce", "Reduce"],
];

// The site's name beside each page title (SiteTag.jsx), on an account with
// more than one site. Hide: the sidebar's picker still says which site it is.
export const SITE_TAGS = [
  ["show", "Show"],
  ["hide", "Hide"],
];

// key: [storage key, data attribute, allowed values, default, the account's key].
const SETTINGS = {
  font: ["dash_font", "font", FONTS.map(([value]) => value), "public-sans", "font"],
  textSize: ["dash_text_size", "textSize", TEXT_SIZES.map(([value]) => value), "normal", "text_size"],
  accent: ["dash_accent", "accent", ACCENTS.map(([value]) => value), "orange", "accent"],
  background: ["dash_page_bg", "pageBg", BACKGROUNDS.map(([value]) => value), "cool", "background"],
  density: ["dash_density", "density", DENSITIES.map(([value]) => value), "comfortable", "density"],
  corners: ["dash_corners", "corners", CORNERS.map(([value]) => value), "soft", "corners"],
  motion: ["dash_motion", "motion", MOTIONS.map(([value]) => value), "device", "motion"],
  siteTag: ["dash_site_tag", "siteTag", SITE_TAGS.map(([value]) => value), "show", "site_tag"],
};

export const APPEARANCE_DEFAULTS = Object.fromEntries(
  Object.entries(SETTINGS).map(([key, [, , , fallback]]) => [key, fallback]),
);

function read(key) {
  const [, attribute, allowed, fallback] = SETTINGS[key];
  const value = document.documentElement.dataset[attribute];
  return allowed.includes(value) ? value : fallback;
}

// The default clears the attribute and the stored value, so a later change to
// the default reaches everyone who never picked.
export function writeAppearance(key, value) {
  if (!SETTINGS[key][2].includes(value)) return;
  put(key, value);
  changed();
  saveAppearance({ [SETTINGS[key][4]]: value === SETTINGS[key][3] ? null : value });
}

function put(key, value) {
  const [storageKey, attribute, , fallback] = SETTINGS[key];
  const root = document.documentElement;
  try {
    if (value === fallback) {
      delete root.dataset[attribute];
      localStorage.removeItem(storageKey);
    } else {
      root.dataset[attribute] = value;
      localStorage.setItem(storageKey, value);
    }
  } catch {
    // storage blocked: the pick lasts until the page reloads
  }
}

// This browser's picks, in the account's keys, null for a default
// (AppearanceSync.jsx).
export function localAppearance() {
  return Object.fromEntries(Object.entries(SETTINGS).map(([key, [, , , fallback, account]]) => {
    const value = read(key);
    return [account, value === fallback ? null : value];
  }));
}

// The account's copy over this browser's; a missing or unknown value is the
// default. Nothing is posted back.
export function applyAppearance(account) {
  for (const [key, [, , allowed, fallback, name]] of Object.entries(SETTINGS)) {
    put(key, allowed.includes(account?.[name]) ? account[name] : fallback);
  }
  changed();
}

// For code that animates in script (the CSS side is in appearance.css):
// true when the device asks for less motion or the viewer picked Reduce.
export function prefersLessMotion() {
  if (typeof window === "undefined") return false;
  return document.documentElement.dataset.motion === "reduce"
    || Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

// The picks as one store, for useSyncExternalStore. The server snapshot is
// the defaults, as the server can't see the browser's.
let snapshot = null;
const listeners = new Set();
export const subscribeAppearance = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const appearanceSnapshot = () =>
  (snapshot ??= Object.fromEntries(Object.keys(SETTINGS).map((key) => [key, read(key)])));
function changed() {
  snapshot = null;
  listeners.forEach((listener) => listener());
}

// Inlined into the document after themeBootScript, so it has to be
// self-contained and must never throw. data-text-size is camelCase in
// dataset, hence the attribute names spelled out here.
const BOOT = Object.values(SETTINGS).map(([storageKey, attribute, allowed, fallback]) => [
  storageKey, attribute.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`), allowed.filter((value) => value !== fallback),
]);
export const appearanceBootScript = `(function(){try{
var r=document.documentElement,b=${JSON.stringify(BOOT)};
for(var i=0;i<b.length;i++){var v=localStorage.getItem(b[i][0]);if(b[i][2].indexOf(v)>-1){r.setAttribute('data-'+b[i][1],v)}}
}catch(e){}})();`;
