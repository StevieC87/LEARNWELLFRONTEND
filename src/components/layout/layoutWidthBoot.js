// The page width choice (LayoutWidth.jsx), kept apart from that client
// component so the root layout, a server component, can inline
// layoutWidthBootScript beside appearanceBootScript. Set before the first
// paint, a Wide or Full page no longer opens at Narrow and then jumps.

export const LAYOUT_WIDTH_KEY = 'layout-width';
// Narrow, the default, is no attribute at all; Medium is the plain
// --maxlayoutwidth (styles/layout.css).
export const LAYOUT_WIDTH_DEFAULT = 'narrow';
export const LAYOUT_WIDTHS = [
  ['compact', 'Compact', '960px'],
  ['narrow', 'Narrow', '1100px'],
  ['medium', 'Medium', '1300px'],
  ['wide', 'Wide', '1600px'],
  ['full', 'Full', 'whole screen'],
];

const ALLOWED = LAYOUT_WIDTHS.map(([value]) => value).filter((value) => value !== LAYOUT_WIDTH_DEFAULT);

// Inlined into the document after themeBootScript, so it has to be
// self-contained and must never throw.
export const layoutWidthBootScript = `(function(){try{
var v=localStorage.getItem(${JSON.stringify(LAYOUT_WIDTH_KEY)});
if(${JSON.stringify(ALLOWED)}.indexOf(v)>-1){document.documentElement.setAttribute('data-layout-width',v)}
}catch(e){}})();`;
