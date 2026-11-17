'use client';
import './css/slidemenu.css';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { setIsButtonExpandTablet } from '@/redux/slices/SlideMenu';
import SlideMenuContent from './SlideMenuContent';
import { SIDEBAR_KEPT_OPEN_ATTR, SIDEBAR_KEPT_OPEN_KEY } from './sidebarBoot.js';

// The toggle's pick, remembered in this browser, as the open sidebar is where
// an entry's tabs fold out under it (NavFlyout.jsx). The attribute on <html>
// is the live copy: set before the first paint from the saved pick
// (sidebarBoot.js), so the open width holds while the server's rail loads,
// and still toggling where storage is blocked.
const KEPT_OPEN_CHANGED = 'sidebar-kept-open-change';
const subscribeKeptOpen = (onChange) => {
  window.addEventListener(KEPT_OPEN_CHANGED, onChange);
  return () => window.removeEventListener(KEPT_OPEN_CHANGED, onChange);
};
const readKeptOpen = () => document.documentElement.hasAttribute(SIDEBAR_KEPT_OPEN_ATTR);
function saveKeptOpen(open) {
  try { localStorage.setItem(SIDEBAR_KEPT_OPEN_KEY, open ? '1' : '0'); } catch { /* storage blocked */ }
  document.documentElement.toggleAttribute(SIDEBAR_KEPT_OPEN_ATTR, open);
  window.dispatchEvent(new Event(KEPT_OPEN_CHANGED));
}

// A single mounted sidebar preserves focus and scroll during tablet expansion.
export default function SlideMenuDesktop() {
  const dispatch = useDispatch();
  const expanded = useSelector((state) => state.SlideMenuSlice.buttonexpandtablet);
  const [tablet, setTablet] = useState(false);
  // Desktop starts as an icon rail and expands on hover, like the toggle does.
  const desktopCollapsed = !useSyncExternalStore(subscribeKeptOpen, readKeptOpen, () => false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef(null);
  const toggleRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);
  const hoverExpanded = !tablet && desktopCollapsed && hovered;
  const collapsed = tablet ? !expanded : desktopCollapsed && !hovered;

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };
  const clearLeaveTimer = () => {
    clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = null;
  };

  useEffect(() => {
    return () => { clearHoverTimer(); clearLeaveTimer(); };
  }, []);

  // A rail taller than the window scrolls inside itself (slidemenu.css), so
  // the open page's entry may be below its fold: bring it into view.
  const pathname = usePathname();
  useEffect(() => {
    const nav = containerRef.current?.querySelector('.verticalnav');
    const link = nav?.querySelector('[aria-current="page"]');
    if (!link || nav.scrollHeight <= nav.clientHeight) return;
    const top = link.offsetTop;
    if (top < nav.scrollTop || top + link.offsetHeight > nav.scrollTop + nav.clientHeight) {
      nav.scrollTop = top - (nav.clientHeight - link.offsetHeight) / 2;
    }
  }, [pathname]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 769px) and (max-width: 1035px)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const update = () => {
      setTablet(query.matches);
      dispatch(setIsButtonExpandTablet(false));
    };
    update();
    query.addEventListener('change', update);
    mobileQuery.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
      mobileQuery.removeEventListener('change', update);
    };
  }, [dispatch]);

  // Radix site selection and the entries' flyouts (NavFlyout.jsx) live in
  // portals outside this container.
  const inSelectPortal = (node) =>
    node?.closest?.('[data-slot="select-content"], [data-radix-popper-content-wrapper], .nav-flyout');

  // Leaving while the site select is open would collapse the trigger under it;
  // stay open until the pointer returns or a click lands outside.
  useEffect(() => {
    if (!hoverExpanded) return;
    const close = (event) => {
      if (inSelectPortal(event.target)) return;
      if (!containerRef.current?.contains(event.target)) {
        clearHoverTimer();
        setHovered(false);
      }
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [hoverExpanded]);

  useEffect(() => {
    if (!tablet || !expanded) return;
    const close = (event) => {
      if (inSelectPortal(event.target)) return;
      if (!containerRef.current?.contains(event.target)) dispatch(setIsButtonExpandTablet(false));
    };
    const escape = (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      dispatch(setIsButtonExpandTablet(false));
      toggleRef.current?.focus();
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [tablet, expanded, dispatch]);

  // CSS hides this sidebar on mobile. Keep it mounted so SiteSelection can
  // initialize the active site even while the mobile drawer is closed.
  // Only the nav items open it on hover; the aside spans the full page height.

  return (
    <aside ref={containerRef} className="responsive-sidebar slidemenuouterdiv"
      data-tablet-expanded={expanded} data-desktop-collapsed={!tablet && collapsed}
      data-desktop-peek={hoverExpanded}
      onMouseOver={(event) => {
        // Back on the nav or onto an entry's flyout (its portal still bubbles
        // here) before the fold below: stay open.
        if (event.target.closest?.('.verticalnav') || inSelectPortal(event.target)) clearLeaveTimer();
        if (event.target.closest?.('.verticalnav :is(a, button, .logonavbar)')) {
          if (!hovered && !hoverTimerRef.current) {
            hoverTimerRef.current = setTimeout(() => {
              setHovered(true);
              hoverTimerRef.current = null;
            }, 150);
          }
        }
      }}
      onMouseOut={(event) => {
        const to = event.relatedTarget;
        if (to?.closest?.('.verticalnav') || inSelectPortal(to)) return;
        if (document.querySelector('[data-slot="select-content"]')) return;
        clearHoverTimer();
        // Folding at once would pull the flyout left from under a pointer still
        // crossing the gap to it (and close it); wait as long as the flyout does.
        clearLeaveTimer();
        leaveTimerRef.current = setTimeout(() => {
          leaveTimerRef.current = null;
          setHovered(false);
        }, 250);
      }}>
      <SlideMenuContent iconsOnly={collapsed} keptOpen={!tablet && !desktopCollapsed} toggleRef={toggleRef}
        onToggle={() => tablet
          ? dispatch(setIsButtonExpandTablet(!expanded))
          : (clearHoverTimer(), saveKeptOpen(desktopCollapsed), setHovered(false))}
        onNavigate={() => {
          clearHoverTimer();
          setHovered(false);
          dispatch(setIsButtonExpandTablet(false));
        }} />
    </aside>
  );
}
