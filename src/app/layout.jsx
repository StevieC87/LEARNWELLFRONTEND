// import ReduxProvider from "@/redux/ReduxProvider";
import { Providers } from "@/redux/ReduxWrapper";
import ThemeMetaUpdater from "@/hooks/ThemeMetaUpdater.jsx";
import { THEME_COOKIE, themeBootScript, themeClass, themeColorFor } from "@/lib/themeBoot.js";
import { tabStyleBootScript } from "@/components/layout/tabStyle.js";
import { appearanceBootScript } from "@/components/layout/appearance.js";
import { layoutWidthBootScript } from "@/components/layout/layoutWidthBoot.js";
import { sidebarBootScript } from "@/components/layout/Navbar/sidebarBoot.js";
import { OWN_SITE_ID } from "@/lib/api/visitHeader.js";
import Script from "next/script";

import { headers } from 'next/headers';
import localFont from "next/font/local";
//import { NonceProvider } from "../components/NonceContext";
import { cookies } from 'next/headers';
import "./globals.css";


import "../styles/typography.css";
import "../styles/variables.css";
import "../styles/layout.css";
import "../styles/base.css";
import "../styles/buttons.css";
import "../styles/ui.css";
import "../styles/kit.css";
import "../styles/extra/animations.css";
import "../styles/extra/effects.css";
import "../styles/extra/states.css";
import "../styles/extra/utilities.css";
import "../styles/forms.css";
import "../styles/stylescomponentspages.css";
// Unlayered and last: the viewer's Appearance picks replace values the layered sheets above set.
import "../components/layout/appearance.css";
import "../styles/dashboard.css";


if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("params should be awaited")
    )
      return;
    originalWarn(...args);
  };

  // override warning
}

// Only the faces every page draws by default are preloaded: Public Sans (the
// body, unless the viewer picked another), IBM Plex Sans (--casio-font, the
// dashboard's figures) and Mona Sans (the logo). The rest
// are Appearance picks (components/layout/appearance.js); a page fetches one
// only when its CSS uses it, instead of every visitor downloading all of them.
const sourceSans3 = localFont({
  src: "../fonts/SourceSans3-VariableFont_wght.woff2",
  path: ".",
  weight: "200 900",
  style: "normal",
  variable: "--font-source-sans-3",
  display: "block",
  preload: false,
});

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.woff2",
  path: ".",
  weight: "200 900",
  style: "normal",
  variable: "--satoshi",
  display: "block",
  preload: false,
});


const Geist = localFont({
  src: "../fonts/Geist.woff2",
  path: ".",
  weight: "200 900",
  style: "normal",
  variable: "--geist",
  display: "block",
  preload: false,
});


const IBMPlexSans = localFont({
  src: "../fonts/IBMPlexSans.woff2",
  path: ".",
  weight: "200 900",
  style: "normal",
  variable: "--IBMPlexSans",
  display: "block",
  preload: true,
});

const MonaSans = localFont({
  src: "../fonts/MonaSans.woff2",
  path: ".",
  weight: "200 900",
  style: "normal",
  variable: "--MonaSans",
  display: "block",
  preload: true,
});
const PlusJakartaSans = localFont({
  src: "../fonts/PlusJakartaSans.woff2",
  path: ".",
  weight: "200 900",
  style: "normal",
  variable: "--PlusJakartaSans",
  display: "block",
  preload: false,
});
const PublicSans = localFont({
  src: "../fonts/PublicSans.woff2",
  path: ".",
  weight: "200 900",
  style: "normal",
  variable: "--PublicSans",
  display: "block",
  preload: true,
});

// The same loader the Installation page hands out: the tracker waits for the page's "load" event.
// Links with a token in the address stay out: a live token shouldn't sit in our own page reports.
const trackerLoader = `(function () {
  var hasToken = ["/public/", "/security-report/", "/audit-report/", "/shared-report/"].some(function (path) {
    return location.pathname.indexOf(path) === 0;
  });
  if (hasToken) return;
  function load() {
    var s = document.createElement("script");
    s.src = "${process.env.NEXT_PUBLIC_COLLECTEXPRESS}/v1/track.js";
    s.async = true;
    s.setAttribute("data-domain", "${process.env.NEXT_PUBLIC_FRONTENDURL}");
    s.setAttribute("data-siteid", "${OWN_SITE_ID}");
    s.setAttribute("data-performance", "true");
    s.setAttribute("data-outbound-links", "false");
    s.setAttribute("data-file-downloads", "false");
    s.crossOrigin = "anonymous";
    document.body.appendChild(s);
  }
  if (document.readyState === "complete") load();
  else window.addEventListener("load", load);
})();`;

// Default tab title; any page with its own title overrides it.
export const metadata = { title: 'SiteGoose' };

// The colour of the browser's own bar: phones, Safari's tab bar and the installed app's title bar.
export async function generateViewport() {
  return { themeColor: themeColorFor((await cookies()).get(THEME_COOKIE)?.value) };
}

export default async function RootLayout({
  children,
}) {

  const headersList = await headers()
  const noncea = headersList.get('x-nonce') || ''
  //console.log(noncea, ' noncefromheaders in RootLayout');

  // Returning visitors carry their theme in a cookie, so the very first byte of HTML
  // already has the right class and there is nothing to repaint. First visit has no
  // cookie: themeBootScript below settles it before any content is parsed.
  const storedTheme = (await cookies()).get(THEME_COOKIE)?.value
  const initialThemeClass = storedTheme === 'dark' || storedTheme === 'light'
    ? themeClass(storedTheme === 'dark')
    : ''

  return (
    <html lang="en"
      suppressHydrationWarning
      className={`${initialThemeClass} ${sourceSans3.variable} ${satoshi.variable} ${Geist.variable} ${IBMPlexSans.variable} ${MonaSans.variable} ${PlusJakartaSans.variable} ${PublicSans.variable}`}
    >
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="nonce" content={noncea} />
      </head>
      <body suppressHydrationWarning className={initialThemeClass}>
        <script nonce={noncea} dangerouslySetInnerHTML={{ __html: themeBootScript + tabStyleBootScript + appearanceBootScript + layoutWidthBootScript + sidebarBootScript }} />
        {/* Explicit nonce: Script's automatic one comes from a server-only context, so the client hydrates with none. */}
        <Script id="analytics-queue" strategy="beforeInteractive" nonce={noncea}>{`
window.analytics = window.analytics || {};
window.analytics.q = window.analytics.q || [];
["track", "identify", "consent", "reset", "captureException"].forEach(function (m) {
  window.analytics[m] = window.analytics[m] || function () { window.analytics.q.push([m, [].slice.call(arguments)]); };
});
`}</Script>
        {/* A plain script, not next/script: that leaves the tag only in the serialized page data, which the security check's domain proof can't count (DOMAIN_PROOF.md). */}
        <script nonce={noncea} dangerouslySetInnerHTML={{ __html: trackerLoader }} />
        <Providers>
          <ThemeMetaUpdater />

          {children}
        </Providers>
      </body>
    </html>
  );
}

/* export const metadata = () => ({
  title: "Create Next App",
  description: "Generated by create next app",
}); */


//console.log("hello");


/* export async function generateMetadata({ params }) {
  const allHeaders = await headers();
  const fullUrl = allHeaders.get('x-full-url');
  const pathname = allHeaders.get('x-custom-pathname');
  let slugsinurl = pathname.split("/").filter(Boolean);;
  //console.log(fullUrl, "fullUrl from headers");
  //console.log(pathname, "pathname from headers");
  //console.log(slugsinurl, "slugsinurl from headers");
  let slugsinurlcount = slugsinurl.length;
  let slugpath;
  if (slugsinurlcount === 0) {
    slugpath = 'homepage';
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/monolingualmetadata/${slugpath}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let fieldsdata;
  // let headertitle = "";
  // <meta name="description" content="Default Description">
  if (!response.ok) {

  } else if (response.ok) {
    const data = await response.json();
    console.log(data, "data");
    // fieldsdata = data.pagefields;
    // console.log(fieldsdata, "fieldsdata");

    const metadata = data.metadata;
    console.log(metadata, "metadata from monolingual metadata API");

    let robotsobject

    if (metadata.robots == 'index, follow') {
      robotsobject = {
        index: true,
        follow: true,
      }
    }
    else if (metadata.robots == 'noindex, nofollow') {
      robotsobject = {
        index: false,
        follow: false,
      }

    } else if (metadata.robots == 'noindex, follow') {
      robotsobject = {
        index: false,
        follow: true,
      }
    }
    else if (metadata.robots == 'index, nofollow') {
      robotsobject = {
        index: true,
        follow: false,
      }


    } else {
      robotsobject = {
        index: true,
        follow: true,
      }
    }

    return {
      title: metadata.metatitle || "1234",
      description: metadata.metadescription || "Default Description",
      hreflang: metadata.hreflang || "en",
      openGraph: {
        title: metadata.metatitle || "Default Title",
        description: metadata.metadescription || "Default Description",
        //url: fullUrl,
        url: metadata.canonicalurl || fullUrl, // Use the canonical URL if available
        siteName: metadata.ogsitename,
        //! PUT FULL URL FOR IMAGE HERE
        images: [
          {

            // url: `${fullUrl}/og-image.png`, // Adjust the image URL as needed
            url: metadata.ogimage || `${fullUrl}/og-image.png`, // Use the ogimage from data or default
            width: 1200,
            height: 630,
            alt: "Open Graph Image",
          },
        ],
        //ogtype
        type: metadata.ogtype || "website", // Use the ogtype from data or default to "website"
      },
      twitter: {
        card: "summary_large_image",
        title: metadata.metatitle || "Default Title",
        description: metadata.metadescription || "Default Description",
        images: [metadata.ogimage], // Adjust the image URL as needed
      },
      //robots, ando
      robots: robotsobject,
    }
   */
