'use client';

import { useSelector } from 'react-redux';

// The content manager's settings: admins and superadmins, as the backend's
// /settings routes allow (adminOnly). The role is the session's, from Redux;
// the backend still decides.
export default function Layout({ children }) {
  const userrole = useSelector((state) => state.DashSlice.userrole);

  if (userrole && userrole !== 'admin' && userrole !== 'superadmin') {
    return <p className="ui-status is-error">Admins only.</p>;
  }
  // The page scrolls with the window, like every other page.
  return children;
}
