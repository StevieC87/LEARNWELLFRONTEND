import { useId } from 'react';
import PageIcon from './PageIcon.jsx';
import TitleSlot from './TitleSlot.jsx';
import PageDocLink from '@/components/layout/PageDocLink.jsx';
import InfoDot from '@/components/ui/InfoDot.jsx';
import './PageTitle.css';

// A dashboard page's title: the section's sidebar icon, the name, an optional
// intro and optional controls on the right. Same size and spacing as the
// tabbed sections' title (SectionNav, SiteHealthTabs), so every page's title
// sits in the same place. `site` marks a page that shows one site's data,
// which then names that site beside the title (SiteTag).
//
// The intro (children) sits in an "i" beside the name, not on a line under it:
// a line of text on the page's grey made the title block taller than the
// controls beside it and pushed them onto a row of their own. The heading is
// named by the title and site alone (aria-labelledby), so a screen reader
// says "Notifications", not "Notifications About this page".
export default function PageTitle({ icon, title, children, actions, site = false }) {
  const id = useId();
  return (
    <header className="page-title-head">
      <div className="page-title-text">
        <h1 className="page-title" aria-labelledby={children ? `${id}-name ${id}-site` : undefined}>
          {icon && <PageIcon name={icon} />}<span id={`${id}-name`}>{title}</span>
          <PageDocLink />
          {children && <InfoDot label="About this page"><span>{children}</span></InfoDot>}
        </h1>
      </div>
      {actions && <div className="page-title-actions">{actions}</div>}
      <TitleSlot />
    </header>
  );
}
