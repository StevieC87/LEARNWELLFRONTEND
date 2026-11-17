'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LAYOUT_WIDTHS, LAYOUT_WIDTH_DEFAULT as DEFAULT, LAYOUT_WIDTH_KEY as KEY } from './layoutWidthBoot.js';
import { saveAppearance } from '@/lib/appearanceSaver.js';

export { LAYOUT_WIDTHS };

// How wide the dashboard may grow. Saved on the account with the rest of the
// look (AppearanceSync.jsx), localStorage the fast copy; the choice is a data
// attribute on <html> so the caps in styles/layout.css apply without any
// component re-rendering. The saved choice is put there before the first
// paint by layoutWidthBootScript (layoutWidthBoot.js, in app/layout.jsx).

function apply(width) {
  if (width === DEFAULT) delete document.documentElement.dataset.layoutWidth;
  else document.documentElement.dataset.layoutWidth = width;
}

export function readWidth() {
  try {
    const saved = localStorage.getItem(KEY);
    return LAYOUT_WIDTHS.some(([value]) => value === saved) ? saved : DEFAULT;
  } catch { return DEFAULT; }
}

// Several controls set it (the side menu, Profile → Appearance, the Cards
// dialog); each hears the others' change through this event.
const CHANGED = 'layout-width-change';

const subscribe = (onChange) => {
  window.addEventListener(CHANGED, onChange);
  return () => window.removeEventListener(CHANGED, onChange);
};

export function useLayoutWidth() {
  // The server renders the default; the browser reads the saved choice.
  const width = useSyncExternalStore(subscribe, readWidth, () => DEFAULT);
  const choose = (value) => {
    applyLayoutWidth(value);
    saveAppearance({ width: value === DEFAULT ? null : value });
  };
  return [width, choose];
}

// The account's copy, or a pick here (useLayoutWidth); nothing is posted.
export function applyLayoutWidth(value) {
  const width = LAYOUT_WIDTHS.some(([option]) => option === value) ? value : DEFAULT;
  apply(width);
  try { localStorage.setItem(KEY, width); } catch { }
  window.dispatchEvent(new Event(CHANGED));
}

// A side menu row next to the theme toggle (icon + label, label hidden when
// iconsOnly), opening the five widths. The collapsed rail is too narrow for tabs.
// Hidden at 960px and below (slidemenu.css), where every width renders the same.
// A wider option only differs from the one below it once the screen is wider
// than that one's cap: on a 1400px screen Wide and Full both fill it.
const CAPS = { compact: 0, narrow: 960, medium: 1100, wide: 1300, full: 1600 };

function useScreenWidth() {
  const [screen, setScreen] = useState(Infinity);
  useEffect(() => {
    const read = () => setScreen(window.innerWidth);
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);
  return screen;
}

// The widths worth offering on this screen. The saved choice stays listed
// even when the screen can't show it, so a menu always has its tick.
export function useLayoutWidthOptions(width) {
  const screen = useScreenWidth();
  return LAYOUT_WIDTHS.filter(([value]) => screen > CAPS[value] || value === width);
}

export function LayoutWidthToggle({ iconsOnly = false }) {
  const [width, setWidth] = useLayoutWidth();
  const options = useLayoutWidthOptions(width);
  const current = LAYOUT_WIDTHS.find(([value]) => value === width)?.[1] || 'Narrow';
  const label = `Width: ${current}`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="sidebar-logout layout-width-toggle" aria-label={`Page width, ${current}`} title={label}
          style={{ background: 'transparent', border: 0, cursor: 'pointer' }}>
          <div className="flex flex-row justify-center items-center sidebarlinkforicon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows" viewBox="0 0 16 16">
              <path d="M1.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L2.707 7.5h10.586l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L13.293 8.5H2.707l1.147 1.146a.5.5 0 0 1-.708.708z" />
            </svg>
            <span className={iconsOnly ? 'sidebartext sidebartext-compact' : 'sidebartext'}>
              <span className="nav-label">{label}</span>
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" sideOffset={8}>
        <DropdownMenuLabel>Page width</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={width} onValueChange={setWidth}>
          {options.map(([value, name, size]) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {name}<span className="ml-auto pl-4 text-xs opacity-60">{size}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
