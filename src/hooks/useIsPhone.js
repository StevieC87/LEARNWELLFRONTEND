'use client';

import { useSyncExternalStore } from 'react';

// The width the dashboard's phone rules start at (analytics.css).
export const PHONE_QUERY = '(max-width: 640px)';

function subscribe(onChange) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener?.('change', onChange);
  return () => query.removeEventListener?.('change', onChange);
}

const isPhone = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(PHONE_QUERY).matches);

// False on the server, in tests (jsdom has no matchMedia) and for the first
// render, so nothing depends on it before the page is in a browser.
export default function useIsPhone() {
  return useSyncExternalStore(subscribe, isPhone, () => false);
}
