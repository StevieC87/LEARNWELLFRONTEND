import { NextResponse } from "next/server";
import { STATUS_HOST, STATUS_PAGES_URL } from "@/lib/statusPages.js";

// All the status domain serves: the pages and what they load. Nothing that
// signs in or holds an account is ever on it (lib/statusPages.js).
const STATUS_HOST_PATHS = ["/status/", "/_next/", "/images/logo/goose.png", "/favicon.ico"];

export default function middleware(request) {
  const fullURL = request.url;
  const url = request.nextUrl;
  const pathname = url.pathname;

  const isDev = process.env.NODE_ENV !== "production";

  // Update request headers (if needed)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-full-url", fullURL);
  requestHeaders.set("x-custom-pathname", pathname);

  // Status pages on their own domain, and only them there.
  if (STATUS_HOST) {
    const onStatusHost = (request.headers.get("host") || "").toLowerCase() === STATUS_HOST;
    if (onStatusHost && !STATUS_HOST_PATHS.some((path) => pathname.startsWith(path))) {
      return new NextResponse("Not found", { status: 404, headers: { "Content-Type": "text/plain" } });
    }
    // An old link to a status page on the app's address moves for good.
    if (!onStatusHost && pathname.startsWith("/status/")) {
      return NextResponse.redirect(new URL(pathname + url.search, STATUS_PAGES_URL), 308);
    }
  }


  if (
    pathname.startsWith("/dash") &&
    !request.cookies.get("token") &&
    !request.cookies.get("refreshToken")
  ) {
    // Back to the page after login: an email's link (I'm on it, Stop emailing
    // me this) would otherwise be lost on the way.
    const login = new URL("/users/login", request.url);
    if (pathname !== "/dash") login.searchParams.set("next", pathname + url.search);
    return NextResponse.redirect(login);
  }

  const cspDisabledRoutes = [
    "/route-without-csp",
    "/another-no-csp",
    // Add more as needed
  ];

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const apiOrigin =
    apiUrl && apiUrl.startsWith("http") ? new URL(apiUrl).origin : "'self'";
  const collectorUrl = process.env.NEXT_PUBLIC_COLLECTEXPRESS || "";
  const collectorOrigin =
    collectorUrl.startsWith("http") ? new URL(collectorUrl).origin : "";

  // Only set CSP if not in the disabled list
  if (!cspDisabledRoutes.includes(pathname)) {
    const nonce = crypto.randomUUID();
    /* const csp = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
      `style-src-elem 'self' 'nonce-${nonce}' 'unsafe-hashes' 'sha256-sHwQzC2ZsVrt1faUYCjF/eo8aIoBlQbGjVstzanL9CU=' 'sha256-Ylx4sWaDgn6RRamxe7jevX4yDhNtiSG3CQWrPAdPh6A=' 'sha256-TkUgajJ946/xb1R0Vfeuzb73k2VAKoEIF3sRGeX4aBU=' 'sha256-rZot9UVcdtXL99KiVSLfpDfxS3VtOsOY1PXjNX1ntxg=' 'sha256-k1m9MgjuV56OVgoQq43A5vLIpdJFJrlq/3ANCGJD4es=' 'sha256-m8dEh7VmKFRCO8jEWPbmkeO1mq4SIx8omtyx50rrS/M=' 'sha256-rZot9UVcdtXL99KiVSLfpDfxS3VtOsOY1PXjNX1ntxg=' 'sha256-fNQvmabDUct/Q8bVROR2oAMzjWD2CYHGuJj7V7Sxgfc='`,
      `style-src 'self' 'nonce-${nonce}' 'unsafe-hashes' 'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk=' 'sha256-sHwQzC2ZsVrt1faUYCjF/eo8aIoBlQbGjVstzanL9CU=' 'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk=' 'sha256-Ylx4sWaDgn6RRamxe7jevX4yDhNtiSG3CQWrPAdPh6A=' 'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk=' 'sha256-TkUgajJ946/xb1R0Vfeuzb73k2VAKoEIF3sRGeX4aBU=' 'sha256-rZot9UVcdtXL99KiVSLfpDfxS3VtOsOY1PXjNX1ntxg=' 'sha256-k1m9MgjuV56OVgoQq43A5vLIpdJFJrlq/3ANCGJD4es=' 'sha256-m8dEh7VmKFRCO8jEWPbmkeO1mq4SIx8omtyx50rrS/M=' 'sha256-fNQvmabDUct/Q8bVROR2oAMzjWD2CYHGuJj7V7Sxgfc='`,
      `connect-src 'self' ${apiOrigin} http://localhost:4000`,
      `img-src 'self' ${apiOrigin} data: blob:`, 


    ].   */
    const csp = [
      "default-src 'self'",
      // React dev mode needs eval() for callstack reconstruction; production stays eval-free.
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,

      // In development, Next/React dev tooling can inject <style> tags without a nonce.
      // Allow it in dev only; keep nonce-only in production.
      isDev
        ? "style-src-elem 'self' 'unsafe-inline'"
        : `style-src-elem 'self' 'nonce-${nonce}'`,

      `style-src-attr 'unsafe-inline'`,
      // collectorOrigin is where the dashboard's own tracker (layout.jsx) sends to.
      `connect-src 'self' ${apiOrigin} http://localhost:4000 ${collectorOrigin}`.trimEnd(),
      // tpc.googlesyndication.com: competitors' Google ad previews (backend googleAds.js), that host only.
      `img-src 'self' ${apiOrigin} https://www.google.com https://t0.gstatic.com https://tpc.googlesyndication.com data: blob:`,
      // Only the dashboard itself may frame its pages (clickjacking), and
      // nothing a status page (framed, its name could dress up someone else's)
      // or an AI app's sign-in (a framed Allow could be clicked unseen).
      neverFramed(pathname) ? "frame-ancestors 'none'" : "frame-ancestors 'self'",
      // The worker that saves backup downloads (public/backup-download/sw.js),
      // and blob: for the login form's spam check (lib/shield.js), which finds
      // its answer in a worker made from its own code.
      "worker-src 'self' blob:",
      // No <base> may re-point the page's relative URLs, and no form posts
      // anywhere but here (none of ours does): injected markup can't send a
      // typed password away.
      "base-uri 'none'",
      "form-action 'self'",
    ].join("; ");

    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("x-nonce", nonce);
  }

  // Blank page the heatmap and replay iframes write visitor snapshots into.
  // Its own policy: the recorded site's inline styles, stylesheets, images and
  // fonts load from anywhere (the dashboard policy would block them, and
  // srcdoc/about:blank frames inherit it); scripts never run.
  if (pathname === "/snapshot-frame.html") {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'none'; style-src * data: blob: 'unsafe-inline'; img-src * data: blob:; font-src * data:; media-src * data: blob:; " +
        "form-action 'none'; base-uri 'none'; frame-ancestors 'self'",
    );
  }

  // The backup download worker's own policy, which governs what it fetches:
  // the presigned link to the file in our storage, which the page hands it.
  if (pathname.startsWith("/backup-download/")) {
    response.headers.set(
      "Content-Security-Policy",
      `default-src 'none'; script-src 'self'; connect-src https:${isDev ? " http:" : ""}; frame-ancestors 'self'`,
    );
  }

  if (neverFramed(pathname)) response.headers.set("X-Frame-Options", "DENY");

  // Always set these
  response.headers.set("x-full-url", request.url);
  response.headers.set("x-custom-pathname", pathname);

  return response;
}

function neverFramed(pathname) {
  return pathname.startsWith("/status/") || pathname.startsWith("/oauth/");
}

export const config = {
  matcher: "/:path*",
};
