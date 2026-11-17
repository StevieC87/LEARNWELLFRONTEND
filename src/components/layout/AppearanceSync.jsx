'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCsrfTokenFromCookies } from '@/lib/api/dashboardClient.js';
import { quietly, setAppearanceSaver } from '@/lib/appearanceSaver.js';
import {
  followSystemTheme, hasExplicitTheme, localTheme, persistTheme, systemPrefersDark,
} from '@/lib/themeBoot.js';
import { setdarkmodeOn } from '@/redux/slices/DashSlice.js';
import { setMetricLineColors } from '@/redux/slices/AnalyticsUISlice.js';
import { applyAppearance, localAppearance } from './appearance.js';
import { applyLayoutWidth, readWidth } from './LayoutWidth.jsx';
import { LAYOUT_WIDTH_DEFAULT } from './layoutWidthBoot.js';
import { applyTabPrefs, localTabPrefs } from './tabStyle.js';

// Keeps how the dashboard looks on the account, so it follows the person to
// every browser and device (backend Users/UserControllers/appearancePrefs.js):
// theme, font, text size, accent, background, density, corners, motion, page
// width, the tabs' shape, colours and order, and the chart's line colours.
// Each setting's localStorage copy stays the fast copy: the page is drawn from
// it at once, and this brings it in line once the signed-in person is known.
// Each setting reports its own changes through lib/appearanceSaver.js. Draws
// nothing.
//
// - The account has a copy: it replaces this browser's.
// - It has none yet: this browser's picks are uploaded, so nobody loses the
//   look they already had, unless they are another person's (someone else
//   signed in here before), and then this browser goes back to the defaults.
// - A change that couldn't be posted marks this copy unsynced; the next visit
//   uploads it instead of taking the account's.

const OWNER_KEY = 'dash_appearance_owner';
const UNSYNCED_KEY = 'dash_appearance_unsynced';
const LINE_COLORS_KEY = 'analytics_metric_line_colors';
const url = () => `${process.env.NEXT_PUBLIC_API_URL}/users/appearance`;

const get = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const put = (key, value) => { try { localStorage.setItem(key, value); } catch { /* storage blocked */ } };
const drop = (key) => { try { localStorage.removeItem(key); } catch { /* storage blocked */ } };

function readLineColors() {
  try {
    const parsed = JSON.parse(get(LINE_COLORS_KEY) || 'null');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

// This browser's whole copy, in the account's keys.
export function localCopy() {
  const width = readWidth();
  return {
    theme: localTheme(),
    ...localAppearance(),
    width: width === LAYOUT_WIDTH_DEFAULT ? null : width,
    ...localTabPrefs(),
    line_colors: readLineColors(),
  };
}

// The account's copy onto the page and the fast copies, without any of it
// being reported back as a pick.
function applyAccount(account, dispatch) {
  quietly(() => {
    applyAppearance(account);
    applyLayoutWidth(account.width || LAYOUT_WIDTH_DEFAULT);
    applyTabPrefs(account);
    const colors = account.line_colors || {};
    put(LINE_COLORS_KEY, JSON.stringify(colors));
    dispatch(setMetricLineColors(colors));
    // As Profile → Appearance picks a theme (Appearance.jsx pickTheme).
    const dark = document.documentElement.classList.contains('dark-mode');
    if (!account.theme || account.theme === 'system') {
      if (hasExplicitTheme()) {
        const os = systemPrefersDark();
        followSystemTheme(os !== dark);
        if (os !== dark) dispatch(setdarkmodeOn(os));
      }
    } else {
      const wantDark = account.theme === 'dark';
      if (wantDark === dark) persistTheme(dark, true);
      else dispatch(setdarkmodeOn(wantDark));
    }
  });
}

async function post(change) {
  const res = await fetch(url(), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': getCsrfTokenFromCookies() || '' },
    body: JSON.stringify(change),
  });
  if (!res.ok) throw new Error(`appearance: ${res.status}`);
  return res.json();
}

// What the account holds, as last read or saved: a change that matches it is
// not posted (a theme switch the account's copy itself caused, say).
let known = null;
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
function newOnly(change) {
  const out = {};
  for (const [key, value] of Object.entries(change)) {
    if (key === 'tab_order') {
      const rows = Object.fromEntries(Object.entries(value || {})
        .filter(([row, list]) => !same(known?.tab_order?.[row] ?? [], list)));
      if (Object.keys(rows).length) out.tab_order = rows;
    } else if (!same(known?.[key], value)) {
      out[key] = value;
    }
  }
  return out;
}

// One post at a time: colour maps are sent whole, so two racing could save the older.
let queue = Promise.resolve();
function send(change) {
  queue = queue.then(async () => {
    const fresh = newOnly(change);
    if (!Object.keys(fresh).length) return;
    known = await post(fresh);
  }).catch(() => put(UNSYNCED_KEY, '1'));
  return queue;
}

// Until the account's copy is in, a change only marks this one as newer.
const markUnsynced = () => put(UNSYNCED_KEY, '1');

export default function AppearanceSync() {
  const userid = useSelector((state) => state.DashSlice.userid);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!userid) return undefined;
    const me = String(userid);
    let live = true;
    known = null;
    setAppearanceSaver(markUnsynced);
    (async () => {
      try {
        const res = await fetch(url(), { credentials: 'include' });
        if (!res.ok) return;
        const account = await res.json();
        if (!live) return;
        const owner = get(OWNER_KEY);
        const mine = !owner || owner === me;
        if (mine && (get(UNSYNCED_KEY) || !account.saved)) {
          const copy = localCopy();
          // Rows put back in their own order here are cleared there too.
          for (const row of Object.keys(account.tab_order || {})) copy.tab_order[row] ??= [];
          known = await post(copy);
        } else {
          applyAccount(account.saved ? account : {}, dispatch);
          known = account;
        }
        drop(UNSYNCED_KEY);
        put(OWNER_KEY, me);
        // Only now: a single change posted before the account and this
        // browser agree would mark the account saved with part of the picks.
        if (live) setAppearanceSaver(send);
      } catch {
        // offline or the API down: the fast copy stands, and a change made
        // meanwhile is still marked for the next visit
      }
    })();
    return () => {
      live = false;
      setAppearanceSaver(null);
    };
  }, [userid, dispatch]);
  return null;
}
