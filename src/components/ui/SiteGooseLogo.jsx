'use client';

import { useRef } from 'react';
import Image from 'next/image';
import './sitegoose-logo.css';

// The goose's drawn size at each logo size; the PNG is 810 x 934.
const GOOSE = { sm: [20, 23], md: [30, 35], lg: [44, 51] };

// The same tilt as the marketing home page's goose, a bit wider at this size.
const NUDGE = [
  { transform: 'rotate(0deg)' },
  { transform: 'rotate(6deg)' },
  { transform: 'rotate(-2deg)' },
  { transform: 'rotate(0deg)' },
];

// The SiteGoose logo, the goose with the name beside it. Every place that shows
// it uses this, so its look is set once, in sitegoose-logo.css. SITEGOOSE has
// a copy of both files; change them together.
//
// size: "sm" in bars, menus and the status page's "Powered by", "md" in the
// marketing header, "lg" on its own above a form. Only "lg" colours "Goose"
// orange: smaller, the orange is too thin to read as anything but a smudge.
// nameClassName goes on the name, e.g. "nav-label" so the folded sidebar
// fades it out and leaves the goose.
export default function SiteGooseLogo({ size = 'sm', className = '', nameClassName = '' }) {
  const [width, height] = GOOSE[size];
  const goose = useRef(null);
  const nudging = useRef(false);

  // Moving the pointer over the logo nudges the goose again each time the last
  // nudge has finished, so it keeps wobbling while you play with it.
  const nudge = (event) => {
    if (event.pointerType !== 'mouse' || nudging.current || !goose.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    nudging.current = true;
    goose.current.animate(NUDGE, { duration: 320, easing: 'ease-out' }).onfinish = () => {
      nudging.current = false;
    };
  };

  return (
    <span className={`brandlogo brandlogo-${size} ${className}`} onPointerMove={nudge}>
      <Image ref={goose} className="brandlogo-goose" src="/images/logo/goose.png" alt="" width={width} height={height} />
      <span className={`brandlogo-name ${nameClassName}`}>Site<span className="brandlogo-accent">Goose</span></span>
    </span>
  );
}
