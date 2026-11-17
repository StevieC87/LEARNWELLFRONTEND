// How the section tabs (.sh-tabs: Health, SEO, Settings…) look, the viewer's
// own pick: their shape from Profile → Appearance
// (features/account/profile/Appearance.jsx), each coloured tab's
// colour from the dot at the end of the tab row (TabColorDot.jsx), and each
// row's dragged order (ReorderableTabs.jsx). Saved on the account with the rest
// of the look (lib/appearanceSaver.js, AppearanceSync.jsx), so it follows the
// person to every device; localStorage is the fast copy that draws the first
// paint.
// Both live on <html>: the shape as data-tab-style, which the CSS keys off
// (sitehealth.css), and each colour as --tab-hue-<section>-<key>, which
// tabHue() reads. Tabs are grey until the viewer picks a colour: with no pick
// the variable is unset, and sitehealth.css falls back to grey wherever it
// reads one. tabStyleBootScript
// sets both before the first paint, so a reload never draws one look and then
// another. No React here: the root layout, a server component, imports it.

import { saveAppearance } from '../../lib/appearanceSaver.js';

export const TAB_STYLES = [
  ["crystal", "Crystal"],
  ["angled", "Angled"],
  ["slanted", "Slanted"],
  ["saw", "Saw blade"],
  ["rounded", "Rounded"],
  ["underline", "Underline"],
  ["glass", "Glass"],
];
export const DEFAULT_TAB_STYLE = "crystal";
const STYLE_KEY = "dash_tab_style";
const HUES_KEY = "dash_tab_hues";
// Prefix of a section's saved tab order (ReorderableTabs.jsx).
export const TAB_ORDER_KEY = "dash_tab_order_";
const STYLES = TAB_STYLES.map(([key]) => key);
const HEX = /^#[0-9a-f]{6}$/i;

export const isTabStyle = (value) => STYLES.includes(value);

// A tab's colour: the viewer's pick, or nothing (the CSS's grey fallback).
// No default colour on purpose: rainbow tabs were the default until
// 2026-10-24, and the open one hardly stood out among them.
export const tabHue = (section, key) => `var(--tab-hue-${section}-${key})`;

export function readTabStyle() {
  const value = document.documentElement.dataset.tabStyle;
  return isTabStyle(value) ? value : DEFAULT_TAB_STYLE;
}

export function writeTabStyle(style) {
  document.documentElement.dataset.tabStyle = style;
  save(STYLE_KEY, style);
  changed();
  saveAppearance({ tab_style: style });
}

// { "health-uptime": "#rrggbb" }, picks only.
export function readTabHues() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HUES_KEY) || "{}");
    return Object.fromEntries(Object.entries(parsed).filter(([, hex]) => HEX.test(hex)));
  } catch {
    return {};
  }
}

// Anything but a six-digit hex drops the pick, back to the tab's own colour.
export function writeTabHue(section, key, hex) {
  const id = `${section}-${key}`;
  const hues = readTabHues();
  if (HEX.test(hex || "")) {
    hues[id] = hex;
    document.documentElement.style.setProperty(`--tab-hue-${id}`, hex);
  } else {
    delete hues[id];
    document.documentElement.style.removeProperty(`--tab-hue-${id}`);
  }
  save(HUES_KEY, JSON.stringify(hues));
  changed();
  saveAppearance({ tab_hues: hues });
}

// Every tab back to grey; the shape stays.
export function clearTabHues() {
  for (const id of Object.keys(readTabHues())) document.documentElement.style.removeProperty(`--tab-hue-${id}`);
  try {
    localStorage.removeItem(HUES_KEY);
  } catch {
    // storage blocked
  }
  changed();
  saveAppearance({ tab_hues: {} });
}

// A row's order, [] for its own (ReorderableTabs.jsx).
export function readTabOrders() {
  const orders = {};
  let keys = [];
  try {
    keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
  } catch {
    return orders; // storage blocked
  }
  for (const key of keys) {
    if (!key?.startsWith(TAB_ORDER_KEY)) continue;
    try {
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(list) && list.length && list.every((id) => typeof id === 'string')) orders[key.slice(TAB_ORDER_KEY.length)] = list;
    } catch {
      // a bad entry: that row keeps its own order, the rest still count
    }
  }
  return orders;
}

// This browser's copy, in the account's keys (AppearanceSync.jsx).
export const localTabPrefs = () => ({ tab_style: readTabStyle(), tab_hues: readTabHues(), tab_order: readTabOrders() });

// The account's copy over this browser's: the page and the fast copy both
// take it. Nothing here reports a change, so nothing is posted back.
export function applyTabPrefs({ tab_style: style, tab_hues: hues, tab_order: order }) {
  hues = hues || {};
  order = order || {};
  const root = document.documentElement;
  const next = isTabStyle(style) ? style : DEFAULT_TAB_STYLE;
  root.dataset.tabStyle = next;
  if (isTabStyle(style)) save(STYLE_KEY, style);
  else remove(STYLE_KEY);
  for (const id of Object.keys(readTabHues())) root.style.removeProperty(`--tab-hue-${id}`);
  const picks = Object.fromEntries(Object.entries(hues).filter(([id, hex]) => /^[a-z0-9-]+$/.test(id) && HEX.test(hex)));
  for (const [id, hex] of Object.entries(picks)) root.style.setProperty(`--tab-hue-${id}`, hex);
  if (Object.keys(picks).length) save(HUES_KEY, JSON.stringify(picks));
  else remove(HUES_KEY);
  for (const section of Object.keys(readTabOrders())) if (!order[section]) remove(`${TAB_ORDER_KEY}${section}`);
  for (const [section, list] of Object.entries(order)) save(`${TAB_ORDER_KEY}${section}`, JSON.stringify(list));
  changed();
  window.dispatchEvent(new Event('tab-order-change'));
}

function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // storage blocked
  }
}

// The picks as one store, for useSyncExternalStore: the Appearance card and
// the tab row's colour dot (TabColorDot.jsx) show the same thing. The
// server snapshot is the defaults, as the server can't see the browser's.
let snapshot = null;
const listeners = new Set();
export const subscribeTabAppearance = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const tabAppearanceSnapshot = () => (snapshot ??= { style: readTabStyle(), hues: readTabHues() });
export const TAB_APPEARANCE_DEFAULTS = { style: DEFAULT_TAB_STYLE, hues: {} };
function changed() {
  snapshot = null;
  listeners.forEach((listener) => listener());
}

function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage blocked: the pick lasts until the page reloads
  }
}

// Inlined into the document after themeBootScript, so it has to be
// self-contained and must never throw. The default goes on first: Crystal is
// drawn only under its attribute, and reading storage can throw.
// The server can't know a saved tab order, so it sends the default one, group
// bars included: --tab-order-<section> hides that row until React has the
// real order (ReorderableTabs.jsx).
export const tabStyleBootScript = `(function(){try{
var r=document.documentElement;r.dataset.tabStyle='${DEFAULT_TAB_STYLE}';
var s=localStorage.getItem('${STYLE_KEY}');
if(${JSON.stringify(STYLES)}.indexOf(s)>-1){r.dataset.tabStyle=s}
var h=JSON.parse(localStorage.getItem('${HUES_KEY}')||'{}');
for(var k in h){if(/^[a-z0-9-]+$/.test(k)&&${HEX}.test(h[k])){r.style.setProperty('--tab-hue-'+k,h[k])}}
for(var i=0;i<localStorage.length;i++){var o=localStorage.key(i);
if(o.indexOf('${TAB_ORDER_KEY}')===0&&localStorage.getItem(o)!=='[]'){r.style.setProperty('--tab-order-'+o.slice(${TAB_ORDER_KEY.length}),'hidden')}}
}catch(e){}})();`;
