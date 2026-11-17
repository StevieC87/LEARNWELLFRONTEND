import {
  createCustomCard,
  createMetricCard,
  deleteCustomCard,
  deleteMetricCard,
  moveCardDown,
  moveCardTo,
  moveCardUp,
  moveTabToCard,
  sendTabHome,
  setCardWidths,
  toggleCardHidden,
} from '../slices/AnalyticsUISlice.js';

// Which changes to the analytics card layout someone made on purpose, so the
// cards slide only for those (CardGridMotion.jsx). Loading the saved layout,
// switching site or saved view, Reset layout and Show all change the layout
// too, often all of it at once, and those just appear in place.
const GESTURES = new Set([
  createCustomCard, createMetricCard, deleteCustomCard, deleteMetricCard, moveCardDown,
  moveCardTo, moveCardUp, moveTabToCard, sendTabHome, toggleCardHidden,
].map((action) => action.type));

// A width is set by the card's own width button, but also when the saved
// layout loads and by Reset layout, so it counts only straight after a click
// or key press inside the card grid.
const INPUT_MS = 1000;
let inputAt = -Infinity;
let inputInGrid = false;
if (typeof document !== 'undefined') {
  const note = (event) => {
    inputAt = performance.now();
    inputInGrid = Boolean(event.target?.closest?.('.analyticsCardGrid'));
  };
  document.addEventListener('pointerdown', note, true);
  document.addEventListener('keydown', note, true);
}

// When the last such change was dispatched. It is good for one redraw only,
// and only briefly: a change that moved nothing must not lend its mark to a
// site switch later on. A second, because drawing a dashboard of fifty cards
// can itself take a few hundred milliseconds before the redraw reads it.
let gestureAt = -Infinity;
const FRESH_MS = 1000;

export const layoutGestureMiddleware = () => (next) => (action) => {
  const now = typeof performance === 'undefined' ? 0 : performance.now();
  if (GESTURES.has(action?.type) || (action?.type === setCardWidths.type && inputInGrid && now - inputAt < INPUT_MS)) {
    gestureAt = now;
  }
  return next(action);
};

// True when the layout change being drawn now came from such a change; the
// mark is used up either way.
export function takeLayoutGesture() {
  const fresh = performance.now() - gestureAt < FRESH_MS;
  gestureAt = -Infinity;
  return fresh;
}
