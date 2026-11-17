// The browser tab's title for a dashboard address, from the menu's own list
// (DashTitle.jsx). Written by cms-copy (overrides/frontend).
import { NAV_ITEMS, isActive } from './Navbar/navItems';

export function pageTitleOf(pathname, searchParams) {
  if (!pathname) return null;
  return NAV_ITEMS.find((item) => isActive(item, pathname, null, searchParams))?.label ?? null;
}
