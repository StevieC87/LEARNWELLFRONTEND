// Sends the tracker's visit ID with every request to the API, so a server error
// links to the visit that caused it. The dashboard's own copy of the script
// customers install (SESSION_SCRIPT), matching the API's origin instead of the
// page's, because the API lives on another one. Wrapping fetch reaches every
// direct call without editing them.
const HEADER = "x-analytics-session";

// The site this app tracks itself under: the tracker tag in app/layout.jsx, and
// the same ID in the backend's createPlatform.
export const OWN_SITE_ID = "6ae077bef40f41fe60ab7d82";

// Read from what the tracker saved, never through analyticsSession.getId().
// getId() counts as activity, so a background poll would keep a visit open
// forever and start a new one with no pageview once it did expire. Reading also
// works before the tracker has loaded (it waits for "load"). A new visit has nothing
// saved yet, so its first requests go without. Keep the keys and the 30 minutes
// in sync with createAnalyticsSession and readConsent in expresscollect/tracker/track.js.
const VISIT_TIMEOUT_MS = 30 * 60 * 1000;
const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

const consentRefused = () => (typeof window.analyticsConsent === "boolean"
  ? !window.analyticsConsent
  : ![null, "1"].includes(localStorage.getItem(`analytics:consent:${OWN_SITE_ID}`)));

function savedVisit() {
  if (consentRefused()) return "";
  const { id, lastActivity } = JSON.parse(localStorage.getItem(`analytics:session:${OWN_SITE_ID}`)) || {};
  const age = Date.now() - lastActivity;
  return UUID.test(id) && age >= 0 && age < VISIT_TIMEOUT_MS ? id : "";
}

export function sendVisitToApi(api = process.env.NEXT_PUBLIC_API_URL) {
  let origin;
  try {
    origin = new URL(api, location.href).origin;
  } catch {
    return;
  }
  const url = (input) => new URL(input instanceof Request ? input.url : input, location.href);

  // This is only for debugging, so it never gets in a request's way: anything
  // that goes wrong here sends the request as it was, and a header native fetch
  // refuses still rejects as it would have, rather than throwing here.
  const withVisit = (input, init) => {
    try {
      const id = url(input).origin === origin && savedVisit();
      if (!id) return init;
      const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
      headers.set(HEADER, id);
      return { ...init, headers };
    } catch {
      return init;
    }
  };

  const fetchOriginal = window.fetch;
  window.fetch = (input, init) => fetchOriginal(input, withVisit(input, init));
}
