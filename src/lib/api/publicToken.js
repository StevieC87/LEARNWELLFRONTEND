// On a public link's page (/public/<token>/…) every request to the API carries
// the link's token as x-public-token, the way postDashboard and customerPost
// always did. Most pages ask with a plain fetch(`${API}/…`, { credentials }),
// written for signed-in members; wrapping fetch reaches all of them without
// editing each. The backend (checkLogin.js, sitebelongsuser.js) then answers
// as the link, and on the demo's link only its reads (demoView.js).
//
// On the same pages, a request other than a GET that the API refuses (401 or
// 403) is something being saved, which a public link never does: it is told to
// the page as a `demo-save-refused` event, which the demo's shell turns into
// one line (PublicShell.jsx). The request itself answers as it would have.
import { publicPageToken } from "./dashboardClient.js";

export const HEADER = "x-public-token";
export const SAVE_REFUSED = "demo-save-refused";

// The demo's made-up account (features/public-links/demoAccount.js), set by
// the public layout on the demo's link only: Profile, Billing and the
// settings answered here from made-up data, so they never ask the backend
// about the real owner's account. null everywhere else.
let demoAnswers = null;
export function setDemoAnswers(answer) {
  demoAnswers = typeof answer === "function" ? answer : null;
}

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export function sendPublicTokenToApi(api = process.env.NEXT_PUBLIC_API_URL) {
  let apiUrl;
  try {
    apiUrl = new URL(api, location.href);
  } catch {
    return;
  }
  // The API's own addresses: its origin, under its path when it has one.
  const prefix = apiUrl.href.replace(/\/$/, "");
  const underApi = (href) => href === prefix || href.startsWith(`${prefix}/`) || href.startsWith(`${prefix}?`);

  // Once per page: a hot reload in development would otherwise wrap it again.
  if (window.fetch.publicTokenWrapper) return;
  const fetchOriginal = window.fetch;
  window.fetch = (input, init) => {
    let token = "";
    let target = "";
    let method = "GET";
    let sent = init;
    // Anything that goes wrong here sends the request as it was.
    try {
      token = publicPageToken();
      if (token) {
        target = new URL(input instanceof Request ? input.url : String(input), location.href).href;
        if (underApi(target)) {
          method = String(init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
          const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
          // A token the caller set itself is kept.
          if (!headers.has(HEADER)) {
            headers.set(HEADER, token);
            sent = { ...init, headers };
          }
        } else {
          token = "";
        }
      }
    } catch {
      token = "";
      sent = init;
    }
    // On the demo, a request the made-up account answers never leaves the page:
    // a read gets its made-up answer, a save is refused here, as the backend would.
    if (token && demoAnswers) {
      let found = null;
      try {
        found = demoAnswers(method, target.slice(prefix.length));
      } catch {
        found = null;
      }
      if (found === "save") {
        try {
          window.dispatchEvent(new CustomEvent(SAVE_REFUSED, { detail: { url: target, method, status: 403 } }));
        } catch { /* only a notice */ }
        return Promise.resolve(json(403, { error: "The demo doesn't save changes." }));
      }
      if (found === "missing") return Promise.resolve(json(404, { error: "Not part of the demo." }));
      if (found) return Promise.resolve(json(200, found.body));
    }
    const request = fetchOriginal(input, sent);
    if (!token || method === "GET" || method === "HEAD") return request;
    return request.then((res) => {
      if (res && (res.status === 401 || res.status === 403)) {
        try {
          window.dispatchEvent(new CustomEvent(SAVE_REFUSED, { detail: { url: target, method, status: res.status } }));
        } catch { /* only a notice */ }
      }
      return res;
    });
  };
  window.fetch.publicTokenWrapper = true;
}
