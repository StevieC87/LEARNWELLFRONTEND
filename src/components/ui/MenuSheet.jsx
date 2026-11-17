'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import './menu-sheet.css';

// How far down the handle is dragged before the sheet closes.
const SWIPE_CLOSE_PX = 80;

// The dimmed page behind a menu shown as a sheet on a phone. A tap on it
// closes the menu and stops there: pointerdown is cancelled, so focus doesn't
// move and the menu isn't dismissed early, and the click that follows lands on
// this layer rather than whatever is under it. Menus that close on an outside
// pointerdown have to let this layer through (isSheetBackdrop) or that click
// would reach the page. Only a tap that started on the layer closes it: a
// menu opens on the trigger's pointerdown, so on a touchscreen the click of
// that same tap lands on this layer, which has just appeared under the finger.
export function SheetBackdrop({ onClose, portal = false }) {
  const pressed = useRef(false);
  const layer = (
    <div className="menu-sheet-backdrop" aria-hidden="true"
      onPointerDown={(event) => { event.preventDefault(); pressed.current = true; }}
      onClick={() => { if (pressed.current) onClose(); pressed.current = false; }} />
  );
  return portal ? createPortal(layer, document.body) : layer;
}

export const isSheetBackdrop = (target) => target instanceof Element && target.classList.contains('menu-sheet-backdrop');

// The grab strip across a sheet's top edge: drag it down to close. It moves
// its parent, the sheet, with the finger; only this strip listens, so
// scrolling a long list never closes the sheet. Esc and the dimmed page close
// it too, so it is hidden from screen readers and the keyboard.
export function SheetHandle({ onClose }) {
  const drag = useRef(null);

  const move = (event) => {
    if (!drag.current) return;
    const dy = Math.max(0, event.clientY - drag.current.startY);
    drag.current.dy = dy;
    drag.current.sheet.style.transform = dy ? `translateY(${dy}px)` : '';
  };
  // Far enough: close from where the finger left it. Not: spring back. A
  // sheet still there a frame after closing (its menu kept itself open)
  // springs back too, rather than hanging where it was dropped.
  const end = () => {
    if (!drag.current) return;
    const { sheet, dy } = drag.current;
    drag.current = null;
    const springBack = () => {
      sheet.style.transition = '';
      sheet.style.transform = '';
    };
    if (dy > SWIPE_CLOSE_PX) {
      onClose();
      requestAnimationFrame(() => { if (sheet.isConnected) springBack(); });
    } else {
      springBack();
    }
  };

  return (
    <div className="menu-sheet-handle" aria-hidden="true"
      onPointerDown={(event) => {
        const sheet = event.currentTarget.parentElement;
        if (!sheet) return;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        sheet.style.transition = 'none';
        drag.current = { sheet, startY: event.clientY, dy: 0 };
      }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    />
  );
}
