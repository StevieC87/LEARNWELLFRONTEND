'use client';

import { Children, cloneElement, useRef, useState, useSyncExternalStore } from 'react';
import { TAB_ORDER_KEY } from './tabStyle.js';
import { saveAppearance } from '@/lib/appearanceSaver.js';

const storageKey = (section) => `${TAB_ORDER_KEY}${section}`;
const fallbackOrders = new Map();
const subscribe = (listener) => {
  window.addEventListener('storage', listener);
  window.addEventListener('tab-order-change', listener);
  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener('tab-order-change', listener);
  };
};
const readOrder = (section) => {
  if (fallbackOrders.has(section)) return fallbackOrders.get(section);
  try { return localStorage.getItem(storageKey(section)) || '[]'; }
  catch { return fallbackOrders.get(section) || '[]'; }
};
const parseOrder = (raw) => {
  try {
    const value = JSON.parse(raw);
    if (Array.isArray(value) && value.every((id) => typeof id === 'string')) return [...new Set(value)];
  } catch { /* Ignore an invalid saved preference. */ }
  return [];
};

// The viewer's saved order for a row, read once, for a page that opens on
// the first tab of it (Health's machine picker).
export const readTabOrder = (section) => (typeof window === 'undefined' ? [] : parseOrder(readOrder(section)));

// Keep the original groups until the viewer chooses their own order. Once
// reordered, omit group dividers: tabs can move freely between those groups.
// rawOrder is null until hydrated, as the server can't read a saved order. A
// viewer with one has the row hidden for that moment (tabStyleBootScript), so a
// reload doesn't draw the default order and its dividers first.
export default function ReorderableTabs({ section, children, enabled = true, as: Tag = 'div', ref, style, ...props }) {
  const rawOrder = useSyncExternalStore(subscribe, () => readOrder(section), () => null);
  const [target, setTarget] = useState(null);
  const [message, setMessage] = useState('');
  const dragging = useRef(null);
  const suppressClick = useRef(false);
  const savedOrder = parseOrder(rawOrder);

  const all = Children.toArray(children);
  const tabs = all.filter((child) => child.props?.['data-tab-id']);
  const order = enabled ? savedOrder : [];
  const ids = [...order.filter((id) => tabs.some((tab) => tab.props['data-tab-id'] === id)),
    ...tabs.map((tab) => tab.props['data-tab-id']).filter((id) => !order.includes(id))];
  const byId = new Map(tabs.map((tab) => [tab.props['data-tab-id'], tab]));
  const persist = (next) => {
    try {
      localStorage.setItem(storageKey(section), JSON.stringify(next));
      fallbackOrders.delete(section);
    } catch { fallbackOrders.set(section, JSON.stringify(next)); }
    window.dispatchEvent(new Event('tab-order-change'));
    saveAppearance({ tab_order: { [section]: next } });
  };
  const move = (from, to) => {
    if (from === to || !ids.includes(from) || !ids.includes(to)) return;
    const next = ids.filter((id) => id !== from);
    next.splice(ids.indexOf(to), 0, from);
    // Retain temporarily hidden tabs so capability changes don't lose them.
    persist([...next, ...order.filter((id) => !ids.includes(id))]);
    setMessage(`${byId.get(from).props['data-tab-label']} moved to position ${next.indexOf(from) + 1} of ${ids.length}.`);
  };
  // A tab's own handlers (a tab row's arrow keys, its click) still run.
  const decorate = (child) => {
    const id = child.props?.['data-tab-id'];
    if (!enabled || !id) return child;
    const own = child.props;
    return cloneElement(child, {
      key: id,
      draggable: true,
      title: [child.props.title, 'Drag to reorder, or use Alt + Left / Right arrow'].filter(Boolean).join('. '),
      'data-reorder-target': target === id || undefined,
      onDragStart: (event) => {
        dragging.current = id;
        suppressClick.current = true;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', id);
      },
      onDragOver: (event) => {
        if (!dragging.current) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setTarget(id);
      },
      onDrop: (event) => {
        if (!dragging.current) return;
        event.preventDefault();
        move(dragging.current, id);
        dragging.current = null;
        setTarget(null);
      },
      onDragEnd: () => { dragging.current = null; setTarget(null); },
      onPointerDownCapture: (event) => { suppressClick.current = false; own.onPointerDownCapture?.(event); },
      onClickCapture: (event) => {
        if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; return; }
        own.onClickCapture?.(event);
      },
      onKeyDown: (event) => {
        if (event.target !== event.currentTarget) { own.onKeyDown?.(event); return; }
        suppressClick.current = false;
        if (!event.altKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) { own.onKeyDown?.(event); return; }
        event.preventDefault();
        const neighbor = ids[ids.indexOf(id) + (event.key === 'ArrowLeft' ? -1 : 1)];
        if (neighbor) move(id, neighbor);
      },
    });
  };
  return <>
    <Tag {...props} ref={ref} style={enabled && rawOrder === null ? { ...style, visibility: `var(--tab-order-${section}, visible)` } : style}>
      {/* The refs in decorate are accessed only by event handlers, never during render. */}
      {/* eslint-disable-next-line react-hooks/refs */}
      {(order.length ? ids.map((id) => byId.get(id)) : all).map(decorate)}
    </Tag>
    <span className="sh-tab-order-status" aria-live="polite">{message}</span>
  </>;
}
