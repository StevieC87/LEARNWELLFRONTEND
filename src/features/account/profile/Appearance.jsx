'use client';

import { useState, useSyncExternalStore } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setdarkmodeOn } from '@/redux/slices/DashSlice.js';
import {
  followSystemTheme, hasExplicitTheme, persistTheme, subscribeThemeChoice, systemPrefersDark,
} from '@/lib/themeBoot.js';
import { setMetricLineColors } from '@/redux/slices/AnalyticsUISlice.js';
import { saveAppearance } from '@/lib/appearanceSaver.js';
import { LAYOUT_WIDTHS, useLayoutWidth } from '@/components/layout/LayoutWidth.jsx';
import {
  TAB_APPEARANCE_DEFAULTS, TAB_STYLES, clearTabHues, subscribeTabAppearance, tabAppearanceSnapshot, writeTabStyle,
} from '@/components/layout/tabStyle.js';
import {
  ACCENTS, APPEARANCE_DEFAULTS, BACKGROUNDS, CORNERS, DENSITIES, FONTS, MOTIONS, SITE_TAGS, TEXT_SIZES,
  appearanceSnapshot, subscribeAppearance, writeAppearance,
} from '@/components/layout/appearance.js';
import '@/components/layout/tabShapeDemo.css';

// How the dashboard looks, gathered in one place: theme, accent, background,
// font, text size, density, corners, motion, page width, the section tabs'
// shape, and resets for the colours picked elsewhere. Each pick applies to the page at once, this card
// included, so the page itself is the preview. All of it is saved on the
// account (AppearanceSync.jsx), so it follows the person to every device, and
// the browser keeps a copy for the first paint. The theme and
// width toggles stay in the side menu as shortcuts, and each tab's and chart
// line's colour is still picked on the tab or tile itself; only their resets
// live here. The Settings tabs sit right above this card, so a shape pick
// shows on real tabs at once.
const LINE_COLORS_KEY = 'analytics_metric_line_colors';

function storedLineColorCount() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LINE_COLORS_KEY) || 'null');
    return parsed && typeof parsed === 'object' ? Object.keys(parsed).length : 0;
  } catch {
    return 0;
  }
}

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

// A row of mutually exclusive buttons: [value, label] options.
function Choices({ id, options, value, onPick }) {
  return (
    <div className="appearance-choices" role="radiogroup" aria-labelledby={id}>
      {options.map(([option, label]) => (
        <button key={option} type="button" role="radio" aria-checked={value === option}
          className="appearance-choice" onClick={() => onPick(option)}>
          {label}
        </button>
      ))}
    </div>
  );
}

export default function Appearance() {
  const dispatch = useDispatch();
  const dark = useSelector((state) => Boolean(state.DashSlice?.darkmodeOn));
  const [width, setWidth] = useLayoutWidth();
  const { style, hues } = useSyncExternalStore(subscribeTabAppearance, tabAppearanceSnapshot, () => TAB_APPEARANCE_DEFAULTS);
  const tabColorCount = Object.keys(hues).length;
  const look = useSyncExternalStore(subscribeAppearance, appearanceSnapshot, () => APPEARANCE_DEFAULTS);
  const pickedTheme = useSyncExternalStore(subscribeThemeChoice, hasExplicitTheme, () => true);
  const theme = !pickedTheme ? 'system' : dark ? 'dark' : 'light';
  // A pick of the side already showing changes nothing in the store, so the
  // theme updater never sees it; mark it picked directly.
  const pickTheme = (value) => {
    if (value === 'system') {
      const os = systemPrefersDark();
      followSystemTheme(os !== dark);
      if (os !== dark) dispatch(setdarkmodeOn(os));
      return;
    }
    const wantDark = value === 'dark';
    if (wantDark === dark) persistTheme(dark, true);
    else dispatch(setdarkmodeOn(wantDark));
  };
  // Swatches show the colour for the mode in use; the other mode has its own.
  const swatch = (light, darkHex) => (dark ? darkHex : light);

  // The chart's picks reach Redux only once the analytics page has loaded
  // them, so storage is counted too. The card renders only once the profile
  // has loaded in the browser, so reading storage up front is safe.
  const lineColors = useSelector((state) => state.AnalyticsUISlice.metricLineColors);
  const [storedLines, setStoredLines] = useState(() => (typeof window === 'undefined' ? 0 : storedLineColorCount()));
  const lineColorCount = Math.max(Object.keys(lineColors || {}).length, storedLines);

  const resetLineColors = () => {
    dispatch(setMetricLineColors({}));
    try { localStorage.removeItem(LINE_COLORS_KEY); } catch { /* storage blocked */ }
    saveAppearance({ line_colors: {} });
    setStoredLines(0);
  };

  return (
    <section className="ui-card">
      <header className="ui-card-head">
        <div>
          <h3>Appearance</h3>
          <p>How the dashboard looks for you. It is saved on your account, so every browser you sign in on looks the same.</p>
        </div>
      </header>
      <div className="profile-rows">
        <div className="profile-row">
          <div>
            <span className="ui-label" id="appearance-theme">Theme</span>
          </div>
          <Choices id="appearance-theme" value={theme} onPick={pickTheme}
            options={[['system', 'Match system'], ['light', 'Light'], ['dark', 'Dark']]} />
        </div>

        <div className="profile-row">
          <div>
            <span className="ui-label" id="appearance-accent">Accent colour</span>
            <p className="ui-help">Buttons, links, toggles and focus rings.</p>
          </div>
          <div className="ui-swatches" role="radiogroup" aria-labelledby="appearance-accent">
            {ACCENTS.map(([value, label, light, darkHex]) => (
              <button key={value} type="button" role="radio" aria-checked={look.accent === value} aria-label={label} title={label}
                className={`ui-swatch${look.accent === value ? ' is-on' : ''}`} style={{ background: swatch(light, darkHex) }}
                onClick={() => writeAppearance('accent', value)} />
            ))}
          </div>
        </div>

        <div className="profile-row">
          <div>
            <span className="ui-label" id="appearance-background">Background</span>
            <p className="ui-help">The page behind the cards. Each one has a light and a dark shade.</p>
          </div>
          <div className="ui-swatches" role="radiogroup" aria-labelledby="appearance-background">
            {BACKGROUNDS.map(([value, label, light, darkHex]) => (
              <button key={value} type="button" role="radio" aria-checked={look.background === value} aria-label={label} title={label}
                className={`ui-swatch appearance-bg${look.background === value ? ' is-on' : ''}`}
                style={{ '--bg-light': light, '--bg-dark': darkHex }}
                onClick={() => writeAppearance('background', value)} />
            ))}
          </div>
        </div>

        <div className="profile-row">
          <div>
            <label className="ui-label" htmlFor="appearance-font">Font</label>
          </div>
          <select id="appearance-font" className="ui-input ui-input-sm appearance-select" value={look.font}
            onChange={(e) => writeAppearance('font', e.target.value)}>
            {FONTS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="profile-row">
          <div>
            <span className="ui-label" id="appearance-text-size">Text size</span>
            <p className="ui-help">Scales text, buttons and spacing together.</p>
          </div>
          <Choices id="appearance-text-size" options={TEXT_SIZES} value={look.textSize}
            onPick={(value) => writeAppearance('textSize', value)} />
        </div>

        <div className="profile-row">
          <div>
            <span className="ui-label" id="appearance-density">Density</span>
            <p className="ui-help">Space inside cards and the height of buttons and fields.</p>
          </div>
          <Choices id="appearance-density" options={DENSITIES} value={look.density}
            onPick={(value) => writeAppearance('density', value)} />
        </div>

        <div className="profile-row">
          <div>
            <span className="ui-label" id="appearance-corners">Corners</span>
            <p className="ui-help">Of cards, buttons and fields.</p>
          </div>
          <Choices id="appearance-corners" options={CORNERS} value={look.corners}
            onPick={(value) => writeAppearance('corners', value)} />
        </div>

        <div className="profile-row">
          <div>
            <span className="ui-label" id="appearance-motion">Motion</span>
            <p className="ui-help">Reduce stops animations and transitions here, even when your device allows them.</p>
          </div>
          <Choices id="appearance-motion" options={MOTIONS} value={look.motion}
            onPick={(value) => writeAppearance('motion', value)} />
        </div>

        <div className="profile-row">
          <div>
            <span className="ui-label" id="appearance-site-tag">Site name beside titles</span>
            <p className="ui-help">The pill naming the site next to each page title, when you have more than one site.</p>
          </div>
          <Choices id="appearance-site-tag" options={SITE_TAGS} value={look.siteTag}
            onPick={(value) => writeAppearance('siteTag', value)} />
        </div>

        <div className="profile-row">
          <div>
            <label className="ui-label" htmlFor="appearance-width">Page width</label>
            <p className="ui-help">How wide pages may grow on a large screen.</p>
          </div>
          <select id="appearance-width" className="ui-input ui-input-sm appearance-select" value={width}
            onChange={(e) => setWidth(e.target.value)}>
            {LAYOUT_WIDTHS.map(([value, name, size]) => (
              <option key={value} value={value}>{name} ({size})</option>
            ))}
          </select>
        </div>

        <div className="profile-row appearance-row-wide">
          <div>
            <span className="ui-label" id="appearance-tabs">Tab shape</span>
            <p className="ui-help">The section tabs, like Site settings | Profile | Billing above.</p>
          </div>
          <div className="appearance-choices" role="radiogroup" aria-labelledby="appearance-tabs">
            {TAB_STYLES.map(([key, label]) => (
              <button key={key} type="button" role="radio" aria-checked={style === key}
                className="appearance-choice appearance-shape" onClick={() => writeTabStyle(key)}>
                <span className="tab-shape-demo" data-shape={key} aria-hidden="true"><i /><i /><i /></span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-row">
          <div>
            <span className="ui-label">Tab colours</span>
            <p className="ui-help">
              Hover a tab in Health, SEO or Security and click its dot to give it a colour.
              {tabColorCount > 0 && ` ${plural(tabColorCount, 'tab')} coloured.`}
            </p>
          </div>
          <button type="button" className="ui-btn ui-btn-secondary" disabled={tabColorCount === 0} onClick={clearTabHues}>
            Reset tab colours
          </button>
        </div>

        <div className="profile-row">
          <div>
            <span className="ui-label">Chart line colours</span>
            <p className="ui-help">
              Picked from the dot on a headline tile, or Chart settings → Line colours.
              {lineColorCount > 0 && ` ${plural(lineColorCount, 'line')} recoloured.`}
            </p>
          </div>
          <button type="button" className="ui-btn ui-btn-secondary" disabled={lineColorCount === 0} onClick={resetLineColors}>
            Reset line colours
          </button>
        </div>
      </div>
    </section>
  );
}
