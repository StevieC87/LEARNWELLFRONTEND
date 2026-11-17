// Where public status pages live. On their own domain once
// NEXT_PUBLIC_STATUS_PAGES_URL names one, so a page anyone can make never sits
// on the address customers sign in at (backend docs/UPTIME_CHECKS.md,
// "Keeping status pages from being used for phishing"); until then on the
// app's own address. proxy.js keeps each kind of page on its own domain.
const trim = (url) => String(url || '').replace(/\/+$/, '');

export const STATUS_PAGES_URL = trim(process.env.NEXT_PUBLIC_STATUS_PAGES_URL);
const APP_URL = trim(process.env.NEXT_PUBLIC_FRONTENDURL);

const hostOf = (url) => {
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return '';
  }
};

// The status domain's host (with any port), or "" when the pages share the
// app's: a status URL equal to the app's would otherwise wall the app off.
export const STATUS_HOST = STATUS_PAGES_URL && hostOf(STATUS_PAGES_URL) !== hostOf(APP_URL) ? hostOf(STATUS_PAGES_URL) : '';

// The base status page addresses start with: the status domain, the app's
// own address, or this browser's origin when neither is configured.
export const statusPagesBase = () => STATUS_PAGES_URL || APP_URL
  || (typeof window !== 'undefined' ? window.location.origin : '');

export const statusPageUrl = (slug) => `${statusPagesBase()}/status/${encodeURIComponent(String(slug || '').toLowerCase())}`;
