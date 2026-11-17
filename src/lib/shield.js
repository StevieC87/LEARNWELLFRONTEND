// Spam protection (sites that turn it on). Loaded by the tracker only then.
// On the visitor's first interaction it fetches a challenge and finds the
// number that answers it, in a Web Worker so the page never stutters. The
// answer goes out with what the visitor did (typed, used a pointer, ticked
// the box), whether the browser is automated, and whether a hidden trap field
// was filled. Protected forms get the answer in a hidden "analytics-shield"
// field, for the site's server to check with POST /shield/verify.
// In "checkbox" mode each protected form also shows "I'm not a robot": one
// click, no puzzles.
// Copy of expresscollect/tracker/shield.js (keep them the same), for our own
// login and sign-up pages: see features/auth/useShield.js. One difference: the
// box takes --shield-bg/-color/-border/-width from the page, so it follows
// the app's own light/dark theme instead of the system's.

// Everything the proof of work needs, in one self-contained function (no
// names from outside it), as it is also the Web Worker's source: as text,
// `(${powKernel})()`. Called on the page it only returns its helpers.
function powKernel() {
  // SHA-256 of a short ASCII text (one block), first 32 bits only: all the
  // proof of work needs.
  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);
  const W = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));

  function sha256FirstWord(text) {
    W.fill(0, 0, 16);
    for (let i = 0; i < text.length; i++) W[i >> 2] |= text.charCodeAt(i) << (24 - (i & 3) * 8);
    W[text.length >> 2] |= 0x80 << (24 - (text.length & 3) * 8);
    W[15] = text.length * 8;
    for (let i = 16; i < 64; i++) {
      const x = W[i - 15];
      const y = W[i - 2];
      W[i] = (W[i - 16] + (rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3)) + W[i - 7] + (rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10))) | 0;
    }
    let a = 0x6a09e667, b = 0xbb67ae85, c = 0x3c6ef372, d = 0xa54ff53a;
    let e = 0x510e527f, f = 0x9b05688c, g = 0x1f83d9ab, h = 0x5be0cd19;
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0;
      d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    return (a + 0x6a09e667) >>> 0;
  }

  // Tries numbers from `from` on: { found } for the answer, or { next } once
  // stop() says the time is up (asked every 512 tries).
  function search(nonce, shift, from, stop) {
    for (let x = from; ; x++) {
      if (sha256FirstWord(`${nonce}:${x}`) >>> shift === 0) return { found: String(x) };
      if ((x & 511) === 511 && stop()) return { next: x + 1 };
    }
  }

  if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
    self.onmessage = (event) => self.postMessage(search(event.data.nonce, event.data.shift, 0, () => false).found);
  }
  return { sha256FirstWord, search };
}

const kernel = powKernel();
export const sha256FirstWord = kernel.sha256FirstWord;

// In a Web Worker, so the page never waits on it: the speed test counted the
// main-thread version as seconds of blocking time on our login page. A page
// whose Content-Security-Policy refuses blob: workers (or a browser without
// workers) gets the page version, in slices short enough not to block.
let workerUrl = null;
function solveInWorker(nonce, shift) {
  return new Promise((resolve, reject) => {
    let worker;
    try {
      workerUrl ||= URL.createObjectURL(new Blob([`(${powKernel})()`], { type: "text/javascript" }));
      worker = new Worker(workerUrl);
    } catch (error) {
      reject(error);
      return;
    }
    worker.onmessage = (event) => {
      worker.terminate();
      resolve(event.data);
    };
    worker.onerror = (event) => {
      event.preventDefault?.();
      worker.terminate();
      reject(new Error("worker"));
    };
    worker.postMessage({ nonce, shift });
  });
}

const SLICE_MS = 8;
const pause = () => new Promise((resolve) => setTimeout(resolve, 0));

async function solveOnPage(nonce, shift) {
  for (let from = 0; ;) {
    const until = performance.now() + SLICE_MS;
    const step = kernel.search(nonce, shift, from, () => performance.now() >= until);
    if (step.found) return step.found;
    from = step.next;
    await pause();
  }
}

let workers = typeof Worker !== "undefined" && typeof Blob !== "undefined" && typeof URL?.createObjectURL === "function";
async function solve(challenge, bits) {
  const nonce = JSON.parse(atob(challenge.split(".")[0].replace(/-/g, "+").replace(/_/g, "/"))).n;
  const shift = 32 - bits;
  if (workers) {
    try {
      return await solveInWorker(nonce, shift);
    } catch {
      // Refused once, refused every time on this page.
      workers = false;
    }
  }
  return solveOnPage(nonce, shift);
}

// The server refuses answers sent sooner than this after the challenge
// (shieldCore.js MIN_FILL_MS, plus a margin); a quick visitor waits instead.
const MIN_WAIT_MS = 1700;

const b64 = (text) => btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const BOX_CSS = `
  :host { all: initial; display: block; margin: 8px 0; }
  label {
    display: inline-flex; align-items: center; gap: 10px; box-sizing: border-box; min-width: 220px; padding: 10px 14px;
    width: var(--shield-width, auto);
    border: 1px solid var(--shield-border, #d1d5db); border-radius: 8px;
    background: var(--shield-bg, #f9fafb); color: var(--shield-color, #111827); cursor: pointer;
    font: 14px/1.3 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  label.nudge { border-color: #dc2626; }
  input { width: 18px; height: 18px; margin: 0; cursor: pointer; }
  .state { width: 18px; height: 18px; display: none; }
  .busy input, .done input { display: none; }
  .busy .spin { display: block; border: 2px solid #d1d5db; border-top-color: #2563eb; border-radius: 50%; animation: s .7s linear infinite; box-sizing: border-box; }
  .done .tick { display: block; color: #16a34a; font-weight: 700; text-align: center; line-height: 18px; }
  @keyframes s { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .busy .spin { animation: none; border-top-color: #d1d5db; } }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  @media (prefers-color-scheme: dark) {
    label { background: var(--shield-bg, #1f2937); color: var(--shield-color, #f9fafb); border-color: var(--shield-border, #4b5563); }
  }
`;

// A constructed sheet, as a page's Content-Security-Policy blocks a <style>
// element without its nonce, and the box then shows unstyled. Browsers
// without constructed sheets get the element.
let boxSheet = null;
function styleBox(root) {
  try {
    if (!boxSheet) {
      boxSheet = new CSSStyleSheet();
      boxSheet.replaceSync(BOX_CSS);
    }
    root.adoptedStyleSheets = [boxSheet];
  } catch {
    const style = document.createElement("style");
    style.textContent = BOX_CSS;
    root.append(style);
  }
}

// mode: "invisible" or "checkbox"; fetchChallenge() -> Promise<{ challenge, bits }>.
export function createShield({ mode, fetchChallenge }) {
  const signals = { k: 0, p: 0, c: 0, h: 0, wd: navigator.webdriver === true ? 1 : 0 };
  const traps = new Set();
  const fields = new Set();
  const boxes = new Set();
  let pending = null;
  let solved = null;
  let received = 0;

  document.addEventListener("keydown", (e) => { if (e.isTrusted) signals.k++; }, { capture: true, passive: true });
  document.addEventListener("pointerdown", (e) => { if (e.isTrusted) signals.p++; }, { capture: true, passive: true });

  const answerNow = () => {
    if (!solved) return "";
    signals.h = [...traps].some((t) => t.value) ? 1 : 0;
    return `${solved.challenge}.${solved.solution}.${b64(JSON.stringify(signals))}`;
  };
  const refresh = () => {
    const answer = answerNow();
    for (const field of fields) field.value = answer;
  };
  const showBoxes = () => {
    for (const box of boxes) {
      box.label.className = box.ticked ? (solved ? "done" : "busy") : box.nudged ? "nudge" : "";
      // Read out by screen readers, as the box itself is swapped for a spinner or tick.
      const said = box.ticked ? (solved ? "Done, you can send the form" : "Checking") : box.nudged ? "Tick the box to send the form" : "";
      if (box.live.textContent !== said) box.live.textContent = said;
    }
  };
  // Milliseconds until the answer can be sent (Infinity while it's being found).
  const readyIn = () => (solved ? Math.max(0, received + MIN_WAIT_MS - Date.now()) : Infinity);

  function start() {
    pending ||= fetchChallenge()
      .then(async ({ challenge, bits }) => {
        received = Date.now();
        solved = { challenge, solution: await solve(challenge, bits) };
        refresh();
        showBoxes();
        return solved;
      })
      .catch(() => {
        // Tried again on the next submit.
        pending = null;
        return null;
      });
    return pending;
  }

  // The answer for one submission; the next one gets a new challenge. Form
  // fields keep this answer until then, as the browser reads them after.
  function consume() {
    const answer = answerNow();
    solved = null;
    pending = null;
    showBoxes();
    start();
    return answer;
  }
  // One at a time: a double-click or two forms sent together would otherwise
  // both wait for the same answer, and the second would get "" once the first
  // consumed it. Each waits for the one before, then for its own answer.
  let queue = Promise.resolve();
  const take = () => {
    const turn = queue.then(async () => {
      await start();
      const wait = readyIn();
      if (wait > 0 && wait !== Infinity) await new Promise((resolve) => setTimeout(resolve, wait));
      return consume();
    });
    queue = turn.catch(() => {});
    return turn;
  };

  function box() {
    const host = document.createElement("div");
    host.setAttribute("data-noanalytics", "");
    host.setAttribute("data-analytics-ignore", "");
    const root = host.attachShadow({ mode: "open" });
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    const spin = document.createElement("span");
    spin.className = "state spin";
    spin.setAttribute("aria-hidden", "true");
    const tick = document.createElement("span");
    tick.className = "state tick";
    tick.setAttribute("aria-hidden", "true");
    tick.textContent = "✓";
    const text = document.createElement("span");
    text.textContent = "I'm not a robot";
    const live = document.createElement("span");
    live.className = "sr";
    live.setAttribute("role", "status");
    label.append(input, spin, tick, text, live);
    styleBox(root);
    root.append(label);
    const entry = { host, label, live, ticked: false, nudged: false };
    input.addEventListener("change", (e) => {
      if (!e.isTrusted || !input.checked) return;
      signals.c = 1;
      entry.ticked = true;
      entry.nudged = false;
      showBoxes();
      start();
      refresh();
    });
    boxes.add(entry);
    showBoxes();
    return host;
  }

  // A protected form: the answer field, the trap and, in checkbox mode, the box.
  function protect(form) {
    if (form.querySelector("input[name='analytics-shield']")) return;
    const field = document.createElement("input");
    field.type = "hidden";
    field.name = "analytics-shield";
    field.value = answerNow();
    fields.add(field);
    // People never see or reach this; form-filling bots fill it.
    const trap = document.createElement("input");
    trap.type = "text";
    trap.name = `contact_${Math.random().toString(36).slice(2, 7)}`;
    trap.tabIndex = -1;
    trap.autocomplete = "off";
    trap.setAttribute("aria-hidden", "true");
    trap.setAttribute("data-analytics-ignore", "");
    trap.style.cssText = "position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0;";
    traps.add(trap);
    form.append(field, trap);
    if (mode !== "checkbox") return;
    const spot = form.querySelector("[data-analytics-shield-box]");
    const button = form.querySelector("button:not([type]),[type=submit]");
    const el = box();
    if (spot) spot.append(el);
    else if (button) button.before(el);
    else form.append(el);
  }

  // A trap inside the lead form widget (its own shadow root).
  const watchTrap = (input) => traps.add(input);

  // Boxes inside scope (a form), or all of them.
  const boxesIn = (scope) => [...boxes].filter((b) => !scope || scope.contains(b.host));
  function nudge(scope) {
    for (const b of boxesIn(scope)) b.nudged = true;
    showBoxes();
  }
  // Each form's own box must be ticked; a form without one (added before
  // checkbox mode was turned on) goes by any box on the page.
  function ticked(scope) {
    if (mode !== "checkbox") return true;
    const own = boxesIn(scope);
    return own.length ? own.some((b) => b.ticked) : signals.c === 1;
  }

  return {
    mode,
    start,
    take,
    consume,
    box,
    protect,
    watchTrap,
    nudge,
    answerNow,
    readyIn,
    ticked,
  };
}
