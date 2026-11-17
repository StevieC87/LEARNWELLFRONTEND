import { useEffect, useRef } from 'react';

// Calls onEscape when Escape is pressed while enabled. Marks the event as handled
// (preventDefault) so other Escape listeners that check defaultPrevented skip it.
export default function useEscapeKey(onEscape, enabled = true) {
  const callbackRef = useRef(onEscape);
  callbackRef.current = onEscape;

  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      callbackRef.current?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
