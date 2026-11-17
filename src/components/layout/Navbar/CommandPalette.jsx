'use client';
import './css/commandpalette.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Dialog } from 'radix-ui';
import { navItemsFor } from './navItems';

export const OPEN_PALETTE_EVENT = 'open-command-palette';
export const openCommandPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));

// Ctrl/⌘+K jumps to any dashboard page without reaching for the menu.
export default function CommandPalette() {
  const router = useRouter();
  const userrole = useSelector((state) => state.DashSlice.userrole);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) { setQuery(''); setActive(0); }
  }, [open]);

  const capabilities = null;
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = navItemsFor(userrole, capabilities);
    if (!q) return items;
    return items.filter((item) =>
      `${item.label} ${item.hint ?? ''} ${item.group ?? ''}`.toLowerCase().includes(q));
  }, [query, userrole, capabilities]);


  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (item) => {
    if (!item) return;
    setOpen(false);
    router.push(item.href);
  };

  const onInputKey = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      go(results[active]);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="cmdk-backdrop" />
        <Dialog.Content className="cmdk-panel" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">Go to page</Dialog.Title>
          <input className="cmdk-input" autoFocus placeholder="Go to page…" value={query}
            onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={onInputKey}
            role="combobox" aria-expanded="true" aria-controls="cmdk-list"
            aria-activedescendant={results[active] ? `cmdk-${active}` : undefined} />
          <ul id="cmdk-list" ref={listRef} className="cmdk-list" role="listbox">
            {results.map((item, i) => (
              <li key={item.href} id={`cmdk-${i}`} role="option" aria-selected={i === active}
                data-active={i === active} className="cmdk-item"
                onMouseMove={() => setActive(i)} onClick={() => go(item)}>
                <span className="cmdk-icon">{item.icon}</span>
                <span className="cmdk-label">{item.label}</span>
                {item.hint && <span className="cmdk-hint">{item.hint}</span>}
              </li>
            ))}
            {results.length === 0 && <li className="cmdk-empty">No page matches “{query}”</li>}
          </ul>
          <div className="cmdk-foot">
            <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
            <span><kbd>Enter</kbd> open</span>
            <span><kbd>Esc</kbd> close</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
