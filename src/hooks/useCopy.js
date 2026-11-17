'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// Puts text on the clipboard. `value` is the text, a function that returns it,
// or a promise of it. A promise is handed to the browser inside the click: one
// that only starts writing after a long wait is refused, as the click no
// longer counts by then.
export function writeClipboard(value) {
  // Checked first, so text that can't go anywhere isn't made at all.
  if (!navigator.clipboard) return Promise.reject(new Error('No clipboard'));
  const made = typeof value === 'function' ? Promise.resolve().then(value) : value;
  if (typeof made === 'string') return navigator.clipboard.writeText(made);
  return typeof ClipboardItem === 'undefined'
    ? Promise.resolve(made).then((text) => navigator.clipboard.writeText(text))
    : navigator.clipboard.write([new ClipboardItem({ 'text/plain': Promise.resolve(made).then((text) => new Blob([text], { type: 'text/plain' })) })]);
}

// Copies and says how it went, for the button that did it: `copied` is the
// key of what was just copied (true for a page with one copy button) for a
// moment, and `failed` the key of a copy the browser refused (no permission,
// a page not on https), for as long again and a bit, so the button can say to
// select the text by hand. A list passes each row's id as the key.
export function useCopy(ms = 1500) {
  const [copied, setCopied] = useState(null);
  const [failed, setFailed] = useState(null);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async (value, key = true) => {
    clearTimeout(timer.current);
    try {
      await writeClipboard(value);
      setFailed(null);
      setCopied(key);
      timer.current = setTimeout(() => setCopied(null), ms);
      return true;
    } catch {
      setCopied(null);
      setFailed(key);
      timer.current = setTimeout(() => setFailed(null), ms * 2);
      return false;
    }
  }, [ms]);

  return { copy, copied, failed };
}
