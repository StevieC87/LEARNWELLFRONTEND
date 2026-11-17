'use client';
// The sidebar: the CMS's pages from navItems.jsx, by group.
// Written by cms-copy (overrides/frontend).
import './css/slidemenu.css';
import Link from 'next/link';
import { Fragment, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import LogoutButton from '@/features/auth/Logout.jsx';
import ThemeToggle from '@/components/layout/ThemeToggle.jsx';
import { LayoutWidthToggle } from '@/components/layout/LayoutWidth.jsx';
import { setContentTypesList } from '@/redux/slices/CustomTypesSlice';
import SiteGooseLogo from '@/components/ui/SiteGooseLogo.jsx';
import { isActive, MENU_GROUPS, navItemsFor } from './navItems';

export default function SlideMenu({ iconsOnly = false, onNavigate, onToggle, toggleRef }) {
  const dispatch = useDispatch();
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const userrole = useSelector((state) => state.DashSlice.userrole);
  const items = navItemsFor(userrole);
  const openHref = items.find((item) => isActive(item, pathname, null, searchParams))?.href;

  // The content types list, which the page editor reads from the store.
  const contentTypesList = useSelector((state) => state.CustomTypesSlice.contentTypesList);
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current && contentTypesList.length > 0) return;
    if (userrole !== 'admin' && userrole !== 'superadmin') return;
    fetchedRef.current = true;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/contenttypes`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.types) dispatch(setContentTypesList(data.types)); })
      .catch(() => { });
  }, [userrole, contentTypesList.length, dispatch]);

  const link = (item) => (
    <Link key={item.href} prefetch={false} href={item.href} onClick={onNavigate}
      aria-current={item.href === openHref ? 'page' : undefined}
      className="sidebarlinkforicon" title={item.hint ? `${item.label}: ${item.hint}` : item.label}>
      {item.icon}
      <span className="py-2 sidebartext"><span className="nav-label">{item.label}</span></span>
    </Link>
  );

  return (
    <div>
      <nav aria-label="Main navigation" className={`verticalnav flex flex-col card ${iconsOnly ? 'icons-only' : ''}`}>
        <div className="logonavbar flex items-center justify-center mb-8">
          <SiteGooseLogo nameClassName="nav-label" />
        </div>
        {onToggle && (
          <button ref={toggleRef} type="button" className="sidebarlinkforicon sidebar-toggle"
            onClick={onToggle} aria-expanded={!iconsOnly}
            aria-label={iconsOnly ? 'Expand navigation' : 'Collapse navigation'}
            title={iconsOnly ? 'Expand navigation' : 'Collapse navigation'}>
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
              <path d={iconsOnly ? 'm14 9 3 3-3 3' : 'm17 9-3 3 3 3'} />
            </svg>
            <span className="sidebartext"><span className="nav-label" /></span>
          </button>
        )}

        {items.filter((item) => !item.group).map(link)}
        {MENU_GROUPS.map((group) => {
          const inGroup = items.filter((item) => item.group === group);
          if (!inGroup.length) return null;
          return (
            <Fragment key={group}>
              <div className="nav-section" role="presentation"><span className="nav-label">{group}</span></div>
              {inGroup.map(link)}
            </Fragment>
          );
        })}

        <ThemeToggle sidebar iconsOnly={iconsOnly} />
        <LayoutWidthToggle iconsOnly={iconsOnly} />
        <LogoutButton iconsOnly={iconsOnly} />
      </nav>
    </div>
  );
}
