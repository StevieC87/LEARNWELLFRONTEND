'use client';
// Dashboard home: the CMS's pages as cards, for the signed-in role.
// Written by cms-copy (overrides/frontend).
import Link from 'next/link';
import { useSelector } from 'react-redux';
import PageTitle from '@/components/layout/PageTitle.jsx';
import { navItemsFor } from '@/components/layout/Navbar/navItems';

export default function DashHome() {
  const userrole = useSelector((state) => state.DashSlice.userrole);
  const items = navItemsFor(userrole).filter((item) => item.href !== '/dash');

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="Home" />
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))' }}>
        {items.map((item) => (
          <Link key={item.href} prefetch={false} href={item.href} className="ui-card flex flex-row items-center gap-3 p-4">
            {item.icon}
            <span>
              <strong>{item.label}</strong>
              {item.hint && <span className="block text-sm opacity-70">{item.hint}</span>}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
