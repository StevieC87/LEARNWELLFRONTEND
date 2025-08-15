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

  // Always set these
  response.headers.set("x-full-url", request.url);
  response.headers.set("x-custom-pathname", pathname);

  return response;
}

export const config = {
  matcher: "/:path*",
};
