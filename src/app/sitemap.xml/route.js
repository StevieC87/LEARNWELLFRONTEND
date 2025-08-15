export async function GET() {
  // const posts = await fetchPosts(); // from DB, CMS, etc.
  //const pages = await fetchPages(); // static pages

  const fetchpagesposts = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/seo/sitemapdynamic`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!fetchpagesposts.ok) {
    // return new Response('Failed to fetch posts and pages', { status: 500 });
  }

  let data = await fetchpagesposts.json();
  let pages = data.pages || [];

  const changeDatetoYYYYMMDD = pages.map((page) => {
    console.log(page);

    const date = new Date(page.createdAt);
    page.updatedAt = date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    return page;
  });

  console.log("changeDatetoYYYYMMDD:", changeDatetoYYYYMMDD);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${changeDatetoYYYYMMDD
    .map(
      (entry) => `
  <url>
    <loc>${process.env.NEXT_PUBLIC_FRONTENDURL}${entry.slugpath}</loc>
    <lastmod>${entry.updatedAt}</lastmod>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
