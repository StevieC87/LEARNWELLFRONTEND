'use client';

import { useSyncExternalStore } from 'react';
import './TitleSlot.css';

// A spot at the right end of the page title's row (SectionNav, SiteHealthTabs,
// PageTitle) that a page fills from inside itself: the title lives in the dash
// layout, the page's controls in the page. PageTopbar puts its period bar here.
// One title shows at a time, so one slot is enough.
let slot = null;
const listeners = new Set();
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const notify = () => listeners.forEach((listener) => listener());
// A ref callback with a cleanup (React 19), so an old title unmounting after a
// new one mounted can't clear the new one's slot.
const attach = (element) => {
  slot = element;
  notify();
  return () => {
    if (slot !== element) return;
    slot = null;
    notify();
  };
};

export function useTitleSlot() {
  return useSyncExternalStore(subscribe, () => slot, () => null);
}

export default function TitleSlot() {
  return <div className="title-slot" ref={attach} />;
}
