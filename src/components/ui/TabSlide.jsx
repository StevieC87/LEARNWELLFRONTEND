'use client';
import { useEffect } from 'react';
import { animate } from 'motion';
import { SPRINGS, animateAndClear, canAnimate } from '@/lib/motion.js';

// The mark on whichever tab is open glides to the one opened next, instead of
// jumping. One listener for the whole dashboard, so no tab row needs to know
// about it: after a click (or an arrow key) on a tab, it waits for that row to
// show a different tab as open, then moves a copy of the mark across while the
// real one is held back. Tabs that change the address can take a moment to
// draw; past the row's `wait`, it gives up and the mark just appears.
//
// Four kinds of row:
// - .ui-tabs, the switches: the glass thumb slides (kit.css).
// - an analytics card's own switch (.analyticscardactive buttons): the same
//   thumb (analytics.css).
// - .sh-tabs, a section's tabs above a page: the coloured line under the open
//   tab glides, its leading end a little ahead of its trailing one, while the
//   faces fade on their own (sitehealth.css).
// - the collapsed side rail: the glass drop on the open page's icon glides
//   up or down to the next one (slidemenu.css).
const KEYS = new Set(['ArrowLeft', 'ArrowRight', 'Home', 'End']);
const SQUASH = { duration: 0.32, ease: 'easeInOut', times: [0, 0.4, 1] };
const LINE_LEAD = { type: 'spring', visualDuration: 0.26, bounce: 0 };
const LINE_TRAIL = { type: 'spring', visualDuration: 0.38, bounce: 0 };
// The rail while it's collapsed, or opened over the page by hovering it.
const RAIL_COLLAPSED = '.responsive-sidebar:is([data-desktop-collapsed="true"], [data-desktop-peek="true"])';

// `refind`: there is one such row on a page, so one the next page redrew is
// found again by its selector. Never for rows a page can hold several of.
const KINDS = [
  { row: '.ui-tabs:not(.si-stacks)', tab: '.ui-tab', on: '.is-on', wait: 300, mark: 'thumb' },
  {
    row: '.analyticsCardGrid :is(div, span):has(> .analyticscardactive, > .analyticscardinactive)',
    tab: '.analyticscardactive, .analyticscardinactive', on: '.analyticscardactive', wait: 300, mark: 'thumb',
  },
  { row: '.sh-tabs .perf-viewswitch', tab: 'a, button', on: '.active', wait: 1200, mark: 'line', refind: true },
  { row: `${RAIL_COLLAPSED} .verticalnav`, tab: 'a.sidebarlinkforicon', on: '[aria-current="page"]', wait: 1200, mark: 'drop', refind: true },
];
const LINE = KINDS.find((kind) => kind.mark === 'line');
const DROP = KINDS.find((kind) => kind.mark === 'drop');

// The row's own tab that is open; tab rows inside a tab's panel are their own.
const onTabOf = (row, kind) => [...row.children].find((child) => child.matches(kind.tab) && child.matches(kind.on));

// A box on screen, then the same box in a row's own coordinates (scroll included).
const screenBox = (element) => {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { left, top, width, height };
};
function inRow(row, box) {
  const outer = row.getBoundingClientRect();
  return {
    ...box,
    left: box.left - outer.left - row.clientLeft + row.scrollLeft,
    top: box.top - outer.top - row.clientTop + row.scrollTop,
    width: box.width,
    height: box.height,
  };
}

// Where each kind draws its mark on a tab, on screen.
function markBox(kind, tab) {
  const box = screenBox(tab);
  if (kind.mark === 'line') return { ...box, top: box.top + box.height - 3, height: 3 };
  if (kind.mark === 'drop') {
    const drop = getComputedStyle(tab, '::after');
    return { left: box.left + parseFloat(drop.left), top: box.top + parseFloat(drop.top), width: parseFloat(drop.width), height: parseFloat(drop.height) };
  }
  return box;
}

// The line's colour, from the open tab's inset shadow; none means no line.
const lineColour = (tab) => getComputedStyle(tab).boxShadow.match(/^(rgba?\([^)]*\)|color\([^)]*\)|#\w+)/)?.[1];

// A copy starts where the mark was. Motion moves it only from its next frame,
// so without this it shows for one frame at the row's corner.
const at = (box) => `translateX(${box.left}px) translateY(${box.top}px)`;

// The slide running in each row, to be finished at once if another starts.
const sliding = new WeakMap();

function begin(row, ghost, hold) {
  sliding.get(row)?.();
  const placed = getComputedStyle(row).position === 'static';
  if (placed) row.style.position = 'relative';
  row.setAttribute('data-tab-sliding', '');
  row.append(ghost);
  const finish = () => {
    if (sliding.get(row) !== finish) return;
    sliding.delete(row);
    ghost.remove();
    hold();
    if (placed) row.style.removeProperty('position');
    row.removeAttribute('data-tab-sliding');
  };
  sliding.set(row, finish);
  return finish;
}

// Holds back the real mark while its copy moves; inline and important, so it
// wins over every row's own rule, base.css's dark `!important` ones included.
// The returned function puts it back without a fade, or the mark would dip as
// the copy is removed.
function holdBack(tab, styles) {
  const names = [...Object.keys(styles), 'transition'];
  const kept = names.map((name) => [name, tab.style.getPropertyValue(name), tab.style.getPropertyPriority(name)]);
  for (const [name, value] of Object.entries(styles)) tab.style.setProperty(name, value, 'important');
  return () => {
    tab.style.setProperty('transition', 'none', 'important');
    for (const [name, value, priority] of kept.slice(0, -1)) {
      if (value) tab.style.setProperty(name, value, priority);
      else tab.style.removeProperty(name);
    }
    requestAnimationFrame(() => {
      const [, value, priority] = kept.at(-1);
      if (value) tab.style.setProperty('transition', value, priority);
      else tab.style.removeProperty('transition');
    });
  };
}

function slideThumb(row, from, to) {
  const toBox = inRow(row, screenBox(to));
  // A row that wraps: across two lines there is nothing sensible to slide.
  if (Math.abs(toBox.top - from.top) > 2) return;
  const look = getComputedStyle(to);
  const ghost = document.createElement('span');
  ghost.className = 'ui-tab-slider';
  Object.assign(ghost.style, {
    width: `${from.width}px`,
    height: `${from.height}px`,
    // Colour and image apart: Firefox gives no computed `background`.
    backgroundColor: look.backgroundColor,
    backgroundImage: look.backgroundImage,
    boxShadow: look.boxShadow,
    borderRadius: look.borderRadius,
    // No backdrop-filter on the moving copy: a blur that moves and resizes
    // makes phone browsers repaint the whole card under it, which shows as a
    // flash of the card, title and all. Over the flat groove it blurs nothing.
    transform: at(from),
  });
  const finish = begin(row, ghost, holdBack(to, { background: 'transparent', 'box-shadow': 'none' }));
  // The thumb flattens a hair in flight and fills out as it lands, which is
  // what makes it read as something pushed across rather than redrawn.
  animateAndClear(ghost, {
    x: [from.left, toBox.left],
    y: [from.top, toBox.top],
    width: [from.width, toBox.width],
    height: [from.height, toBox.height],
    scaleY: [1, 0.95, 1],
  }, { ...SPRINGS.tab, scaleY: SQUASH }, []).finished.then(finish, finish);
}

function slideLine(row, from, to) {
  const colour = lineColour(to);
  if (!colour) return;
  const toBox = inRow(row, markBox(LINE, to));
  if (Math.abs(toBox.top - from.top) > 2) return;
  const ghost = document.createElement('span');
  ghost.className = 'sh-tab-slider';
  Object.assign(ghost.style, { top: `${toBox.top}px`, height: `${toBox.height}px`, backgroundColor: from.colour || colour });
  const finish = begin(row, ghost, holdBack(to, { 'box-shadow': 'none' }));
  // Each end on its own spring: the end heading the way it goes gets there
  // first, so the line reaches, then gathers itself under the new tab.
  const rightward = toBox.left > from.left;
  const ends = { left: from.left, right: from.left + from.width };
  const draw = () => {
    ghost.style.transform = `translateX(${ends.left}px)`;
    ghost.style.width = `${Math.max(0, ends.right - ends.left)}px`;
  };
  draw();
  const left = animate(ends.left, toBox.left, { ...(rightward ? LINE_TRAIL : LINE_LEAD), onUpdate: (value) => { ends.left = value; draw(); } });
  const right = animate(ends.right, toBox.left + toBox.width, { ...(rightward ? LINE_LEAD : LINE_TRAIL), onUpdate: (value) => { ends.right = value; draw(); } });
  if (from.colour && from.colour !== colour) animateAndClear(ghost, { backgroundColor: [from.colour, colour] }, LINE_TRAIL, []);
  Promise.all([left.finished, right.finished]).then(finish, finish);
}

function slideDrop(row, from, to) {
  const toBox = inRow(row, markBox(DROP, to));
  const look = getComputedStyle(to, '::after');
  const ghost = document.createElement('span');
  ghost.className = 'nav-drop-slider';
  Object.assign(ghost.style, {
    width: `${toBox.width}px`,
    height: `${toBox.height}px`,
    backgroundColor: look.backgroundColor,
    backgroundImage: look.backgroundImage,
    boxShadow: look.boxShadow,
    borderRadius: look.borderRadius,
    backdropFilter: look.backdropFilter,
    transform: at(from),
  });
  const finish = begin(row, ghost, () => to.removeAttribute('data-drop-held'));
  to.setAttribute('data-drop-held', '');
  // A drop running down the glass: a touch longer in the way it moves.
  animateAndClear(ghost, {
    x: [from.left, toBox.left],
    y: [from.top, toBox.top],
    scaleY: [1, 1.12, 1],
    scaleX: [1, 0.92, 1],
  }, { ...SPRINGS.tab, scaleY: SQUASH, scaleX: SQUASH }, []).finished.then(finish, finish);
}

const SLIDES = { thumb: slideThumb, line: slideLine, drop: slideDrop };

// Waits for a row of this kind to show a tab other than `from` as open, then
// slides. A row redrawn by the page it leads to is found again by its kind.
function watch(kind, row, from) {
  if (!canAnimate(row)) return;
  // A slide already under way starts the next one from where it has got to.
  const ghost = row.querySelector(':scope > :is(.ui-tab-slider, .sh-tab-slider, .nav-drop-slider)');
  const fromBox = ghost ? screenBox(ghost) : markBox(kind, from);
  if (kind.mark === 'line') fromBox.colour = ghost ? getComputedStyle(ghost).backgroundColor : lineColour(from);
  const started = performance.now();
  const check = () => {
    const here = row.isConnected ? row : kind.refind && document.querySelector(kind.row);
    const now = here && onTabOf(here, kind);
    if (now && now !== from && now.isConnected) SLIDES[kind.mark](here, inRow(here, fromBox), now);
    else if (performance.now() - started < kind.wait) requestAnimationFrame(check);
  };
  requestAnimationFrame(check);
}

// A card's tab or view switch swaps its body for a taller or shorter one. The
// browser's scroll anchoring then pins the card below and moves the page, so
// the reader lands at the bottom of the new view (Time → Heatmap). While the
// card redraws, nothing in the dashboard grid is an anchor.
const ANCHOR_HOLD_MS = 1500;
let anchorTimer = 0;
function holdScrollAnchor(target) {
  const grid = target.closest('.analyticsCardGrid');
  if (!grid || !target.closest('.card') || !target.closest('button, a, [role="tab"]')) return;
  grid.style.overflowAnchor = 'none';
  clearTimeout(anchorTimer);
  anchorTimer = setTimeout(() => grid.style.removeProperty('overflow-anchor'), ANCHOR_HOLD_MS);
}

export default function TabSlide() {
  useEffect(() => {
    const onInput = (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.type === 'click') holdScrollAnchor(event.target);
      if (event.type === 'keydown' && !KEYS.has(event.key)) return;
      for (const kind of KINDS) {
        const tab = event.target.closest(kind.tab);
        const row = tab?.parentElement;
        if (!row?.matches(kind.row)) continue;
        const from = onTabOf(row, kind);
        if (from && (event.type === 'keydown' || from !== tab)) watch(kind, row, from);
        return;
      }
    };
    document.addEventListener('click', onInput, true);
    document.addEventListener('keydown', onInput, true);
    return () => {
      document.removeEventListener('click', onInput, true);
      document.removeEventListener('keydown', onInput, true);
    };
  }, []);
  return null;
}
