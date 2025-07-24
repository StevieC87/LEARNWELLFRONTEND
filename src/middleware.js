import { NextResponse } from "next/server";

export default function middleware(request) {
  const fullURL = request.url;
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Update request headers (if needed)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-full-url", fullURL);
  requestHeaders.set("x-custom-pathname", pathname);

  if (
    pathname.startsWith("/dash") &&
    !request.cookies.get("token") &&
    !request.cookies.get("refreshToken")
  ) {
    return NextResponse.redirect(new URL("/users/login", request.url));
  }

  const cspDisabledRoutes = [
    "/route-without-csp",
    "/another-no-csp",
    // Add more as needed
  ];

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Only set CSP if not in the disabled list
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!cspDisabledRoutes.includes(pathname)) {
    const nonce = crypto.randomUUID();
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
      `style-src-elem 'self' 'nonce-${nonce}' 'unsafe-hashes' 'sha256-sHwQzC2ZsVrt1faUYCjF/eo8aIoBlQbGjVstzanL9CU=' 'sha256-Ylx4sWaDgn6RRamxe7jevX4yDhNtiSG3CQWrPAdPh6A=' 'sha256-TkUgajJ946/xb1R0Vfeuzb73k2VAKoEIF3sRGeX4aBU=' 'sha256-rZot9UVcdtXL99KiVSLfpDfxS3VtOsOY1PXjNX1ntxg=' 'sha256-k1m9MgjuV56OVgoQq43A5vLIpdJFJrlq/3ANCGJD4es=' 'sha256-m8dEh7VmKFRCO8jEWPbmkeO1mq4SIx8omtyx50rrS/M=' 'sha256-rZot9UVcdtXL99KiVSLfpDfxS3VtOsOY1PXjNX1ntxg=' 'sha256-fNQvmabDUct/Q8bVROR2oAMzjWD2CYHGuJj7V7Sxgfc='`,
      `style-src 'self' 'nonce-${nonce}' 'unsafe-hashes' 'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk=' 'sha256-sHwQzC2ZsVrt1faUYCjF/eo8aIoBlQbGjVstzanL9CU=' 'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk=' 'sha256-Ylx4sWaDgn6RRamxe7jevX4yDhNtiSG3CQWrPAdPh6A=' 'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk=' 'sha256-TkUgajJ946/xb1R0Vfeuzb73k2VAKoEIF3sRGeX4aBU=' 'sha256-rZot9UVcdtXL99KiVSLfpDfxS3VtOsOY1PXjNX1ntxg=' 'sha256-k1m9MgjuV56OVgoQq43A5vLIpdJFJrlq/3ANCGJD4es=' 'sha256-m8dEh7VmKFRCO8jEWPbmkeO1mq4SIx8omtyx50rrS/M=' 'sha256-fNQvmabDUct/Q8bVROR2oAMzjWD2CYHGuJj7V7Sxgfc='`,
      `connect-src 'self' ${apiUrl}`,
      `img-src 'self' ${apiUrl}`,
    ].join("; ");

    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("x-nonce", nonce);
  }

  // Always set these
  response.headers.set("x-full-url", request.url);
  response.headers.set("x-custom-pathname", pathname);

  return response;
}

export const config = {
  matcher: "/:path*",
};
