"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import useEscapeKey from "@/components/ui/useEscapeKey";

// A round "i" beside a heading or a notice. The page keeps the one line that
// says what something is; the panel underneath keeps the detail, for the
// reader who wants it. Closes on Escape, on a click away, or on a second
// click. Children are laid out as a column, so pass `<span>`s rather than
// `<p>`s: this sits inside a heading or a paragraph, where a <p> is invalid.
// Styled by .ui-infodot in styles/kit.css.
//
// The panel is placed in viewport coordinates rather than against the button,
// because .ui-card sets `overflow: hidden` and would otherwise crop it. That
// means its position has to be recomputed whenever the page moves under it.
export default function InfoDot({ label = "What this means", children }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const btn = useRef(null);
  const panel = useRef(null);

  useEscapeKey(() => setOpen(false), open);

  const place = useCallback(() => {
    const anchor = btn.current?.getBoundingClientRect();
    const el = panel.current;
    if (!anchor || !el) return;
    const edge = 16;
    // .navbar1 is fixed to the bottom of the window and 32px tall, so the
    // floor the panel may reach sits that much higher than the edge.
    const floor = window.innerHeight - edge - 32;
    // Start under the button's left edge; if the panel would run off the right
    // of the window, end it at the button's right edge instead.
    let left = anchor.left;
    if (left + el.offsetWidth > window.innerWidth - edge) {
      left = Math.max(edge, anchor.right - el.offsetWidth);
    }
    // Below the button, unless that overflows the window and there is room above.
    // Below the button by default; above it when that overflows and there is
    // room; resting on the floor when neither fits, so a short window crops
    // nothing. The panel scrolls itself if it is taller than the window.
    let top = anchor.bottom + 8;
    if (top + el.offsetHeight > floor) {
      const above = anchor.top - 8 - el.offsetHeight;
      top = above > edge ? above : Math.max(edge, floor - el.offsetHeight);
    }
    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(top)}px`;
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", away);
    // Capture, so the panel follows a scroll of any container it sits in.
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("pointerdown", away);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  return (
    <span className="ui-infodot" ref={wrap}>
      <button type="button" className="ui-infodot-btn" ref={btn} aria-label={label}
        aria-expanded={open} onClick={() => setOpen(!open)}>i</button>
      {open && <span className="ui-infodot-panel" role="note" ref={panel}>{children}</span>}
    </span>
  );
}
