// The few request helpers the CMS uses. Written by cms-copy
// (overrides/frontend): the analytics project's own file is its report client.

export const getCsrfTokenFromCookies = () => {
  if (typeof document === "undefined") return null;
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrfToken="))
    ?.split("=")[1];
  return token || null;
};

// No public dashboards here: never a public page token.
export const publicPageToken = () => "";
