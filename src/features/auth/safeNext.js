// Where to go after login, e.g. back to a team invitation. Paths on this site
// only: browsers read both //host and /\host as another site, and drop tabs and
// newlines before parsing, so /<tab>/host is //host too.
export const safeNext = (value) =>
  value && /^\/(?![\\/])/.test(value) && !/[\u0000-\u001f\u007f\\]/.test(value) ? value : '';
