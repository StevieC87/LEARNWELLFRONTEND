// middleware.js
import { NextResponse } from "next/server";

export default async function Middleware(request) {
  const fullURL = request.url;
  const url = await request.nextUrl;
  const pathname = url.pathname; // Get the current pathname+

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-full-url", fullURL);
  requestHeaders.set("x-custom-pathname", pathname);
  // const response = NextResponse.next();
  // response.headers.set("x-custom-pathname", pathname); // Add pathname to headers

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: "/:path*",
};

/* import { NextResponse } from "next/server";



export async function middleware(request) {
  // Get the full URL of the incoming request
  const fullURL = request.url;
  // console.log(fullURL, "fullURLbbbbbbbbbbbbbbbb");
  // Create a response
  const response = NextResponse.next(); // Create a new response
  response.headers.set("x-full-url", fullURL); // Set the custom header
  console.log(response.headers.get("x-full-url"), "Header Set in Middleware"); // Confirm header is set 
  // Clone the request and add the custom header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-full-url", fullURL);
  requestHeaders.set("x-hello-from-middleware1", "hello");
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("x-hello-from-middleware2", "hello");
  return response;
}

// Apply to every route
export const config = {
  matcher: "/:path*", // Matches all paths
};
 */
/* import { NextResponse } from 'next/server'
 
export function middleware(request) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-middleware1', 'hello')
 
  // You can also set request headers in NextResponse.next
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  })
 
  // Set a new response header `x-hello-from-middleware2`
  response.headers.set('x-hello-from-middleware2', 'hello')
  return response
} */
