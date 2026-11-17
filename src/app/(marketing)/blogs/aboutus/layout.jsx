import { headers } from 'next/headers';

export async function generateMetadata({ params }) {
    const h = await headers();
    const fullUrl = h.get("x-full-url");
    const headerPath = h.get("x-custom-pathname");

    const proto = h.get("x-forwarded-proto") || "http";
    const host = h.get("x-forwarded-host") || h.get("host");
    // derive a safe pathname from header or params
    const resolvedPathname =
        headerPath ||
        (params ? `/${Object.values(params).flat().filter(Boolean).join('/')}` : "/aboutus");

    const urla = fullUrl || (proto && host && resolvedPathname ? `${proto}://${host}${resolvedPathname}` : "");

    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    const metadata = {
        title: "About Us",
        description: "Learn more about our team and mission.",
        robots: { index: true, follow: true },
        alternates: { canonical: urla || "/aboutus" },
    };

    if (!apiBase) return metadata;

    const fetchPath = resolvedPathname ? encodeURIComponent(resolvedPathname) : "";
    const url = `${apiBase.replace(/\/$/, "")}/seo/pagespecificseo/${fetchPath}`;

    try {
        const res = await fetch(url, {
            // next: { revalidate: 300 },
        });

        if (!res.ok) return metadata;

        const seo = await res.json();

        const absolutize = (src) => {
            if (!src) return undefined;
            if (/^https?:\/\//i.test(src)) return src;
            if (urla) {
                try {
                    return new URL(src, urla).toString();
                } catch {
                    return src;
                }
            }
            return src;
        };

        const canonical = seo?.canonical || urla || metadata.alternates.canonical;
        const ogImagesRaw = seo?.ogImage;
        const ogImages = Array.isArray(ogImagesRaw)
            ? ogImagesRaw.map(absolutize).filter(Boolean)
            : ogImagesRaw ? [absolutize(ogImagesRaw)].filter(Boolean) : undefined;

        return {
            title: seo?.title ?? metadata.title,
            description: seo?.description ?? metadata.description,
            robots: seo?.robots ?? metadata.robots,
            alternates: { canonical },
            openGraph: {
                title: seo?.ogTitle ?? seo?.title ?? metadata.title,
                description: seo?.ogDescription ?? seo?.description ?? metadata.description,
                url: canonical,
                images: ogImages,
            },
            twitter: seo?.twitter ? {
                card: seo.twitter.card ?? 'summary_large_image',
                title: seo.twitter.title ?? seo?.title ?? metadata.title,
                description: seo.twitter.description ?? seo?.description ?? metadata.description,
                images: seo.twitter.images
                    ? (Array.isArray(seo.twitter.images) ? seo.twitter.images.map(absolutize).filter(Boolean) : [absolutize(seo.twitter.images)].filter(Boolean))
                    : ogImages,
            } : undefined,
        };
    } catch (error) {
        return metadata;
    }
}

export default function AboutUsLayout({ children }) {
    return <section>{children}</section>;
}