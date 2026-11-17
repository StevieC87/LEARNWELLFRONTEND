'use client';
// Tablet and phone top bar: the sidebar's logo and icons in a row, which
// scrolls sideways when they don't fit. The grid button and Ctrl+K reach
// every page too. Written by cms-copy (overrides/frontend).
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import Hamburgericon from './Navbar/Hamburgericon';
import { openCommandPalette } from './Navbar/CommandPalette';
import { navItemsFor, isActive } from './Navbar/navItems';
import './header.css';
import SiteGooseLogo from '@/components/ui/SiteGooseLogo.jsx';

export default function Header() {
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const userrole = useSelector((state) => state.DashSlice.userrole);
  const barItems = navItemsFor(userrole).filter((item) => item.bar);
  const activeIndex = barItems.findIndex((item) => isActive(item, pathname, null, searchParams));

  // Bring the open page's icon into view without scrolling the page.
  const linksRef = useRef(null);
  useEffect(() => {
    const nav = linksRef.current;
    const link = nav?.children?.[activeIndex];
    if (!nav || !link) return;
    nav.scrollLeft = Math.max(0, link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2);
  }, [activeIndex]);

  return (
    <header className="appheader">
      <Link prefetch={false} href="/dash" className="appheader-logo" aria-label="Home">
        <SiteGooseLogo />
      </Link>

      <nav aria-label="Main pages" className="appheader-links" ref={linksRef}>
        {barItems.map((item, i) => (
          <Link key={item.href} prefetch={false} href={item.href} title={item.label}
            aria-label={item.label} aria-current={i === activeIndex ? 'page' : undefined}
            className={`appheader-link${i === activeIndex ? ' is-on' : ''}`}>
            {item.icon}
          </Link>
        ))}
      </nav>

      <button type="button" className="appheader-search" onClick={openCommandPalette} aria-label="Go to page (Ctrl+K)" title="Go to page (Ctrl+K)">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></svg>
        <kbd>Ctrl K</kbd>
      </button>

      <div className="hamburgericondiv">
        <Hamburgericon />
      </div>
    </header>
  );
}
