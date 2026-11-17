'use client';
import { useCallback, useEffect, useEffectEvent, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DURATIONS, SPRINGS, animateAndClear, canAnimate } from '@/lib/motion.js';
import './modal.css';
import './softmodal.css';

const INNER_POPUPS = '[role="menu"], [role="menuitem"], [role="listbox"], [role="option"], [role="combobox"][aria-expanded="true"]';
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
// The open dialogs, newest last. Only the newest answers Escape and keeps Tab
// inside itself, so a confirmation opened over another dialog closes alone.
const openDialogs = [];

// The move and size that lay the dialog over the button that opened it, so it
// can grow out of it and shrink back in; null when there is no such button to
// see (opened from code or a menu that has since closed, hidden on a narrow
// screen) or motion is turned down, and the dialog then just eases in where it
// is. The dialog's own box comes from its offsets, which ignore a transform,
// so a grow or shrink still running doesn't throw the measurement off.
function overOrigin(dialog, origin) {
  if (!canAnimate(dialog)) return null;
  if (!(origin instanceof HTMLElement) || origin === document.body || !origin.isConnected) return null;
  const from = origin.getBoundingClientRect();
  const overlay = dialog.offsetParent;
  if (!overlay) return null;
  const frame = overlay.getBoundingClientRect();
  const to = {
    left: frame.left + dialog.offsetLeft - overlay.scrollLeft,
    top: frame.top + dialog.offsetTop - overlay.scrollTop,
    width: dialog.offsetWidth,
    height: dialog.offsetHeight,
  };
  if (!from.width || !from.height || !to.width || !to.height) return null;
  return {
    x: from.left + from.width / 2 - (to.left + to.width / 2),
    y: from.top + from.height / 2 - (to.top + to.height / 2),
    scaleX: from.width / to.width,
    scaleY: from.height / to.height,
  };
}

// The opacity fades faster than the dialog grows, so its content is readable
// while it is still settling.
const GROW = { ...SPRINGS.dialog, opacity: { duration: DURATIONS.quick } };
// Closing is a plain ease rather than a spring: a spring is only finished
// once every value has come to rest, which from full size down to a button
// is well over a second, and the dialog is only removed then.
const SHRINK = { duration: DURATIONS.normal, ease: 'easeIn' };

// A dialog that eases in over a dimmed page: a head (title, anything beside
// it such as tabs, and a close button), a body that scrolls on its own, and
// an optional foot that stays put. Closes on Escape, the close button or a
// click on the dimmed page. It grows out of the button that opened it and
// shrinks back into it on close.
//
// width: the most it grows to, in px. tall: a fixed height, so switching
// between tabs of different lengths doesn't make it jump. bodyKey: changes
// when the body shows something else (a tab), which fades the new body in.
// role: "alertdialog" for a question that must be answered.
export default function SoftModal({ open, onClose, title, head = null, foot = null, width = 560, tall = false, className = '', bodyKey, role = 'dialog', children }) {
  const titleId = useId();
  const close = useEffectEvent(() => onClose());
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  // The button it grew from, kept past the close to shrink back into.
  const origin = useRef(null);
  // Whatever had focus before it opened (the toolbar button), noted just
  // before the dialog takes focus, and given it back on close.
  const opener = useRef(null);
  // What it showed when last open: a parent usually empties the dialog as it
  // closes it, and the shrink still needs something to show.
  const [held, setHeld] = useState(null);
  if (open && (held?.head !== head || held?.foot !== foot || held?.children !== children || held?.bodyKey !== bodyKey)) {
    setHeld({ head, foot, children, bodyKey });
  }

  // Closing stays on screen for the shrink, then goes.
  const [closing, setClosing] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    setClosing(!open);
  }
  useLayoutEffect(() => {
    if (!closing) return undefined;
    const dialog = dialogRef.current;
    const overlay = overlayRef.current;
    const end = dialog && overOrigin(dialog, origin.current);
    if (!end) {
      setClosing(false);
      return undefined;
    }
    // From wherever it is drawn now, so closing mid-grow turns straight back.
    // Neither clears what it wrote when it ends: the dialog is about to go,
    // and clearing first would show it whole for a frame before it does.
    const shrink = animateAndClear(dialog, { ...end, opacity: 0 }, SHRINK, []);
    const fade = overlay && animateAndClear(overlay, { backgroundColor: 'rgba(0, 0, 0, 0)' }, { duration: DURATIONS.normal }, []);
    shrink.finished.then(() => setClosing(false), () => {});
    return () => {
      // A dialog that really closed has already been taken off the page by
      // now (React removes it before running this). One still on it was
      // reopened mid-shrink, or just as it ended: it grows back from where it
      // got to, and the page dims again.
      if (!dialog.isConnected) return;
      fade?.stop();
      overlay?.style.removeProperty('background-color');
      shrink.stop();
      animateAndClear(dialog, { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 }, GROW);
    };
  }, [closing]);
  // Where the press began: a drag that starts inside (selecting text in a
  // field) and ends on the dimmed page is not a click outside.
  const pressedOutside = useRef(false);

  useEffect(() => {
    if (!open) return undefined;
    return () => {
      const target = opener.current;
      opener.current = null;
      if (target instanceof HTMLElement && target.isConnected) target.focus({ preventScroll: true });
    };
  }, [open]);

  // Capture phase, ahead of every other Escape listener, and marked handled:
  // the dashboard's filter chips remove a filter on an Escape nobody claimed.
  useEffect(() => {
    if (!open) return undefined;
    const self = {};
    openDialogs.push(self);
    const onKeyDown = (event) => {
      if (openDialogs[openDialogs.length - 1] !== self) return;
      // Tab goes round the dialog, never out to the page under it.
      if (event.key === 'Tab' && dialogRef.current) {
        const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const inside = dialogRef.current.contains(document.activeElement);
        if (event.shiftKey && (!inside || document.activeElement === first || document.activeElement === dialogRef.current)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      // A menu or list open inside the dialog closes first, on its own.
      if (event.target instanceof Element && event.target.closest(INNER_POPUPS)) return;
      event.preventDefault();
      close();
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      openDialogs.splice(openDialogs.indexOf(self), 1);
    };
  }, [open]);

  // It grows out of whatever has focus as it is put on the page (the toolbar
  // button), in place of the CSS rise. A stable callback ref, so only once.
  const growOnMount = useCallback((node) => {
    dialogRef.current = node;
    if (!node) return;
    origin.current = node.contains(document.activeElement) ? null : document.activeElement;
    const start = overOrigin(node, origin.current);
    if (start) {
      node.getAnimations?.().forEach((animation) => animation.cancel());
      animateAndClear(node, {
        x: [start.x, 0], y: [start.y, 0], scaleX: [start.scaleX, 1], scaleY: [start.scaleY, 1], opacity: [0, 1],
      }, GROW);
    }
  }, []);

  // Focus moves into the dialog as it opens, so the keyboard starts there: on
  // the element marked data-autofocus (a confirm button, the first field),
  // else the dialog itself. Also when it is reopened mid-shrink, which keeps
  // the same dialog. A layout effect, as React puts back the focus it found
  // once it has changed the page, which would undo it any sooner (and why
  // not React's autoFocus, which also comes before the opener is noted).
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog || dialog.contains(document.activeElement)) return;
    opener.current = document.activeElement;
    (dialog.querySelector('[data-autofocus]') ?? dialog).focus({ preventScroll: true });
  }, [open]);

  if ((!open && !closing) || typeof document === 'undefined') return null;
  const shown = open ? { head, foot, children, bodyKey } : held;
  return createPortal(
    <div ref={overlayRef} className={`modalouterdiv softmodal-overlay ${closing ? 'is-closing' : ''}`}
      onPointerDown={(event) => { pressedOutside.current = event.target === event.currentTarget; }}
      onClick={(event) => { if (event.target === event.currentTarget && pressedOutside.current) onClose(); }}>
      <div ref={growOnMount} tabIndex={-1} role={role} aria-modal="true" aria-labelledby={titleId}
        className={`modalinner darkmode softmodal ${tall ? 'is-tall' : ''} ${className}`} style={{ maxWidth: width }}>
        <div className="softmodal-head">
          <h2 id={titleId}>{title}</h2>
          {shown.head}
          <button type="button" onClick={onClose} aria-label="Close" className="softmodal-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </button>
        </div>
        {shown.children != null && shown.children !== false && (
          <div key={shown.bodyKey} className={`softmodal-body ${shown.bodyKey === undefined ? '' : 'is-keyed'}`}>{shown.children}</div>
        )}
        {shown.foot && <div className="softmodal-foot">{shown.foot}</div>}
      </div>
    </div>,
    document.body,
  );
}
