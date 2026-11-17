'use client';

import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

// An in-page tab kept in the address (?tab=<key>, the fallback left out), so a
// refresh stays on it, Back returns to the last one and a link can open it.
// pushState, as filters do: Next keeps useSearchParams in step with it, so no
// navigation runs. `param` names it where the page's own ?tab= is taken.
export default function useTabParam(keys, fallback = keys[0], param = 'tab') {
  const wanted = useSearchParams()?.get(param);
  const tab = keys.includes(wanted) ? wanted : fallback;
  const openTab = useCallback((key) => {
    const url = new URL(window.location.href);
    if (key === fallback) url.searchParams.delete(param);
    else url.searchParams.set(param, key);
    if (url.href !== window.location.href) window.history.pushState(null, '', url);
  }, [fallback, param]);
  return [tab, openTab];
}
