// Whether the desktop sidebar is kept open (SlideMenuDesktop.jsx), kept apart
// from that client component so the root layout, a server component, can
// inline sidebarBootScript beside layoutWidthBootScript. The attribute it sets
// before the first paint holds the open sidebar's width (slidemenu.css,
// layout.css) until the menu itself has loaded, so a page reloaded with the
// sidebar open doesn't open on the rail and then jump.

export const SIDEBAR_KEPT_OPEN_KEY = 'sidebar-kept-open';
export const SIDEBAR_KEPT_OPEN_ATTR = 'data-sidebar-kept-open';

// Inlined into the document after layoutWidthBootScript, so it has to be
// self-contained and must never throw.
export const sidebarBootScript = `(function(){try{
if(localStorage.getItem(${JSON.stringify(SIDEBAR_KEPT_OPEN_KEY)})==='1'){document.documentElement.setAttribute(${JSON.stringify(SIDEBAR_KEPT_OPEN_ATTR)},'')}
}catch(e){}})();`;
