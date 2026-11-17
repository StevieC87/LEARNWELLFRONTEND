// next.config.js
const path = require("path");

const nextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  poweredByHeader: false,
  // Where the build goes. infra/deploy/deploy.sh builds into whichever of
  // .next-a / .next-b isn't being served, so the running site keeps its files
  // until the reload. Unset (dev, or a build by hand) it's the usual .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    // Force Turbopack to treat the frontend folder as the workspace root so module resolution
    // (e.g. tailwindcss) is looked up from this package instead of the monorepo parent.
    root: __dirname,
  },
  // The link builder, the saved-links page and Link previews each used to be a
  // page of their own. They now live inside Tracking links and Search rankings,
  // so the old addresses (bookmarks, docs, older menus) point at the new homes.
  async redirects() {
    return [
      { source: "/dash/share-links", destination: "/dash/tracking-links", permanent: false },
      { source: "/dash/docs/link-builder", destination: "/dash/tracking-links", permanent: false },
      { source: "/dash/link-preview", destination: "/dash/search-rankings?tab=previews", permanent: false },
      // Health's tabs were views of Analytics (?view=uptime…); emailed alerts
      // and reports still link there. The rest of the query comes along.
      {
        source: "/dash/analytics",
        has: [{ type: "query", key: "view", value: "(?<view>performance|developer|errors|scripts|uptime|server)" }],
        destination: "/dash/health/:view",
        permanent: false,
      },
      // Broken links, Accessibility and Privacy moved from Health to Site
      // audit, and Crawlers to Off-site.
      {
        source: "/dash/analytics",
        has: [{ type: "query", key: "view", value: "(?<view>links|a11y|consent|crawlers)" }],
        destination: "/dash/seo/:view",
        permanent: false,
      },
      { source: "/dash/health/:view(links|a11y|content|consent|crawlers)", destination: "/dash/seo/:view", permanent: false },
      // Tracking moved from Health to Settings → Installation.
      {
        source: "/dash/analytics",
        has: [{ type: "query", key: "view", value: "tracking" }],
        destination: "/dash/sites/settings?tab=installation&part=check",
        permanent: false,
      },
      { source: "/dash/health/tracking", destination: "/dash/sites/settings?tab=installation&part=check", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5100",
        pathname: "/media/getmedia/**",
      },
    ],
  },
};

module.exports = nextConfig;
