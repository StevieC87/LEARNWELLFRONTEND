'use client';
import Link from 'next/link';

// A link to one of our guides (/dash/docs/<slug>): a small book icon, then the
// text, underlined so it reads as a link. With no children it's the icon
// alone, named by the guide's title (the page title's icon, PageDocLink.jsx).
// The demo has no docs, so there a link is just its words and the icon goes
// (as DashLink.jsx does). Styled by .ui-doclink in styles/kit.css.
export default function DocLink({ slug, children, className = '', ...props }) {
  if (demo === true) return children ? <span>{children}</span> : null;
  return (
    <Link prefetch={false} href={`/dash/docs/${slug}`} className={`ui-doclink${children ? '' : ' is-icon'} ${className}`.trim()}
      aria-label={children ? undefined : `Guide: ${title || 'how this works'}`} {...props}>
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" /></svg>
      {children && <span>{children}</span>}
    </Link>
  );
}
