'use client';
import { useLayoutEffect, useRef } from 'react';
import { DURATIONS, animateAndClear, canAnimate } from '@/lib/motion.js';
import './skeleton.css';

// What takes the skeleton's place fades in rather than popping. That is
// whatever the skeleton's parent holds once it has gone that it didn't hold
// as it went, so a heading or a toolbar beside it stays as it was. React runs
// this cleanup after taking the old content out and before putting the new
// in. An element that sets its own opacity inline is left alone.
function useFadeInReplacement() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return undefined;
    return () => {
      const before = new Set(parent.children);
      requestAnimationFrame(() => {
        if (!parent.isConnected || !canAnimate(parent)) return;
        for (const element of parent.children) {
          if (before.has(element) || element.style.opacity !== '' || element.classList.contains('ui-skel')) continue;
          animateAndClear(element, { opacity: [0, 1] }, { duration: DURATIONS.normal, ease: 'easeOut' }, ['opacity']);
        }
      });
    };
  }, []);
  return ref;
}

// What a section shows before its first answer: grey bars in the shape of what
// is coming, so the page keeps its size and nothing jumps when it lands. Only
// for the first load. A refresh keeps the old content under a veil instead
// (analytics/components/LoadingOverlay.jsx).
//
//   <Skeleton />                      three lines of text
//   <Skeleton kind="table" rows={5} cols={3} />   a list or table, one label column and cols numbers
//   <Skeleton kind="tiles" count={4} />           a row of number tiles
//   <Skeleton kind="block" height="24rem" />      a chart or a panel of one size
//
// Screen readers hear `label` ("Loading…" unless given) once, not the bars.
export default function Skeleton({ kind = 'lines', rows, cols = 2, count = 3, height = '16rem', label = 'Loading…', className = '' }) {
  const ref = useFadeInReplacement();
  return (
    <div ref={ref} className={`ui-skel ui-skel-${kind} ${className}`.trim()} role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" style={{ display: 'contents' }}>
        {kind === 'lines' && Array.from({ length: rows ?? 3 }, (_, i) => <span key={i} className="ui-skel-bar" />)}

        {kind === 'table' && (
          <>
            <div className="ui-skel-row is-head" style={{ '--skel-cols': cols }}>
              {Array.from({ length: cols + 1 }, (_, i) => <span key={i} className="ui-skel-bar" />)}
            </div>
            {Array.from({ length: rows ?? 5 }, (_, r) => (
              <div key={r} className="ui-skel-row" style={{ '--skel-cols': cols }}>
                {/* Label widths vary, as real ones do. */}
                <span className="ui-skel-bar" style={{ width: `${[85, 65, 75, 55, 70][r % 5]}%` }} />
                {Array.from({ length: cols }, (_, c) => <span key={c} className="ui-skel-bar" />)}
              </div>
            ))}
          </>
        )}

        {kind === 'tiles' && (
          <div className="ui-skel-grid">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="ui-skel-tile"><span className="ui-skel-bar" /><span className="ui-skel-bar" /></div>
            ))}
          </div>
        )}

        {kind === 'block' && <span className="ui-skel-bar ui-skel-tall" style={{ height }} />}
      </div>
    </div>
  );
}
