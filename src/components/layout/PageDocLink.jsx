'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import DocLink from '@/components/ui/DocLink.jsx';

// The book icon beside a page's title, to the guide for that page
// (pageDocs.js). Nothing on a page without one.
export default function PageDocLink() {
  const pathname = usePathname() ?? '';
  const tab = useSearchParams()?.get('tab');
}
