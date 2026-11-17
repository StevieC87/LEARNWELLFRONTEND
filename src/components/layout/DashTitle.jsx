'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageTitleOf } from './pageTitles.js';

// Names the browser tab after the open page (pageTitles.js). Next writes the
// layout's own "SiteGoose" back into <title> on a navigation, sometimes after
// this has run, so the title is watched and put back.
export default function DashTitle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = pageTitleOf(pathname, searchParams);
  useEffect(() => {
    if (!page) return undefined;
    const title = `${page} | SiteGoose`;
    const apply = () => { if (document.title !== title) document.title = title; };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [page]);
  return null;
}
