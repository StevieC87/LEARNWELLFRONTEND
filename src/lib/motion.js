import { animate, frame } from 'motion';

// The timings every animation shares, in seconds. The stylesheet's copies are
// the --motion-* variables in styles/kit.css: change the two together.
export const DURATIONS = { quick: 0.12, normal: 0.2, slow: 0.28 };

// Cards settle with a touch of give, and a tab's highlight lands on its tab
// like a switch's thumb, barely past and back; a dialog growing from a
// small button never overshoots its own size.
export const SPRINGS = {
  card: { type: 'spring', visualDuration: DURATIONS.slow, bounce: 0.12 },
  dialog: { type: 'spring', visualDuration: 0.3, bounce: 0 },
  tab: { type: 'spring', visualDuration: DURATIONS.slow, bounce: 0.08 },
};

// Whether to animate this element at all: not without the browser's animation
// API (jsdom in tests has none), and not for anyone who has asked their
// system for less motion. Asked each time, so a change applies at once.
export function canAnimate(element) {
  if (typeof window === 'undefined' || !element || typeof element.animate !== 'function') return false;
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

// The latest animation started on each element by animateAndClear, and the
// inline values its styles had before any of them began.
const running = new WeakMap();

// A Motion animation that leaves nothing behind. Motion keeps what it wrote
// (a transform, an opacity) on the element when it ends, and a leftover
// transform turns the element into the box its fixed-position children are
// placed in, while a leftover opacity overrides the stylesheet's own. So the
// styles named in `clear` go back to what they were inline before (usually
// nothing) once it ends or is stopped, unless a newer animation on the same
// element has taken over by then. Pass [] for an element about to be removed.
export function animateAndClear(element, keyframes, options, clear = ['transform', 'opacity']) {
  // An animation cutting into another keeps the first one's starting values,
  // not the half-way ones Motion has written since.
  const original = running.get(element)?.original
    ?? Object.fromEntries([...clear, 'will-change'].map((property) => [property, element.style.getPropertyValue(property)]));
  const controls = animate(element, keyframes, options);
  running.set(element, { controls, original });
  const tidy = () => {
    if (running.get(element)?.controls !== controls) return;
    running.delete(element);
    for (const property of [...clear, 'will-change']) {
      if (original[property]) element.style.setProperty(property, original[property]);
      else element.style.removeProperty(property);
    }
  };
  // After Motion's last render, which comes just after `finished`: tidying
  // any sooner has its final value (transform: none, opacity: 1) written back.
  const later = () => frame.postRender(tidy);
  controls.finished.then(later, later);
  return controls;
}

// What is left of a translate from an animation cut short, so a new one can
// start from where the element is drawn rather than where its box is.
export function currentTranslate(element) {
  try {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return { x: matrix.m41, y: matrix.m42 };
  } catch {
    return { x: 0, y: 0 };
  }
}
