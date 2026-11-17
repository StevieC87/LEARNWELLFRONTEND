// Where every look setting reports a change the viewer made (theme, font,
// tabs, page width, line colours…), so it can be saved on the account
// (components/layout/AppearanceSync.jsx, backend Users/UserControllers/
// appearancePrefs.js). Each setting still writes its own localStorage copy
// first; that copy draws the first paint. No React here: the root layout, a
// server component, imports modules that import this.
//
// Changes use the account's keys: theme, font, text_size, accent, background,
// density, corners, motion, width, tab_style, tab_hues, tab_order, line_colors.

let saver = null;
let quiet = 0;

export const setAppearanceSaver = (fn) => { saver = fn; };

export function saveAppearance(change) {
  if (!quiet) saver?.(change);
}

// Runs fn without reporting anything it changes: for putting the account's
// own copy on the page, which must not be posted back.
export function quietly(fn) {
  quiet += 1;
  try {
    return fn();
  } finally {
    quiet -= 1;
  }
}
