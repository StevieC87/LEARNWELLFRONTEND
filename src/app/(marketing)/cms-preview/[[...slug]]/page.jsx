import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

// A plain page that shows any CMS page (or its draft, in preview) with every field and section
// marked for the visual editor. It's where the page editor's preview opens unless
// NEXT_PUBLIC_CMS_PREVIEW_URL points at a real site. /cms-preview/<slug path>, or /cms-preview for the home page.

export const dynamic = 'force-dynamic';

const API = process.env.NEXT_PUBLIC_API_URL;
const SKIP = ['slug', 'slugpath'];

const mediaUrl = (v) => (v?.imageidstring ? `${API}/media/getmedia/${v.imageidstring}` : '');
const toList = (fields) => (Array.isArray(fields) ? fields : Object.entries(fields || {}).map(([name, f]) => ({ ...f, name: f?.name ?? name })));

// one value; type from the page field, or from the section's own types (saved with its values).
// Only rich text (sanitised on save) is HTML: an untyped value is shown as text, never guessed.
function Value({ name, type, content, heading }) {
  if (type === 'medialibrary' || (content && typeof content === 'object' && 'imageidstring' in content)) {
    const url = mediaUrl(content);
    return <div className="cp-img" data-cms-field={name} style={url ? { backgroundImage: `url("${url}")` } : undefined} />;
  }
  if (type === 'wysi') {
    // rich text is sanitised on save
    return <div className="cp-rich" data-cms-field={name} dangerouslySetInnerHTML={{ __html: content || '' }} />;
  }
  if (type === 'boolean') return <p className="cp-meta">{name.split('.').pop()}: {content ? 'Yes' : 'No'}</p>;
  if (content !== null && typeof content === 'object') return null;
  if (heading) return <h1 data-cms-field={name}>{content ?? ''}</h1>;
  return <p className={type === 'textarea' ? 'cp-multi' : undefined} data-cms-field={name}>{content ?? ''}</p>;
}

export default async function CmsPreviewPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const ispreview = query?.preview === 'true' && query?.previewtoken;
  const path = slug?.length ? slug.join('*') : 'homepage'; // the API takes / as *

  const url = ispreview
    ? `${API}/api/monolingualpreview/${encodeURIComponent(path)}?previewtoken=${encodeURIComponent(query.previewtoken)}`
    : `${API}/api/monolingual/${encodeURIComponent(path)}`;
  const res = await fetch(url, { cache: 'no-store' }).catch(() => null);
  if (!res?.ok) notFound();
  const { pagedata } = await res.json();
  const fields = toList(pagedata?.fields).filter((f) => !SKIP.includes(f.name));
  const nonce = (await headers()).get('x-nonce') || undefined;

  return (
    <main className="cp">
      {fields.map((f) => {
        if (f.type !== 'blocks') {
          return <Value key={f.name} name={f.name} type={f.type} content={f.content} heading={f.name === 'title'} />;
        }
        const blocks = Array.isArray(f.content) ? f.content : [];
        return (
          <div key={f.name} className="cp-sections">
            {blocks.map((b) => (
              <section key={b.id} className="cp-section" data-cms-block={`${f.name}.${b.id}`}>
                <p className="cp-meta">{b.type}</p>
                {Object.entries(b.values || {}).map(([sub, v]) => (
                  <Value key={sub} name={`${f.name}.${b.id}.${sub}`} type={b.types?.[sub]} content={v} />
                ))}
              </section>
            ))}
            {blocks.length === 0 && <p className="cp-meta">No sections yet. Use &quot;+ Add section&quot; above the preview.</p>}
          </div>
        );
      })}

      <style nonce={nonce}>{`
        .cp { max-width: 96rem; margin: 0 auto; padding: 4.8rem 2.4rem; display: flex; flex-direction: column; gap: 1.6rem; font-size: 1.7rem; line-height: 1.6; color: #111827; background: #fff; min-height: 100vh; }
        .cp h1 { font-size: 4rem; line-height: 1.15; font-weight: 700; margin: 0; }
        .cp p { margin: 0; }
        .cp-multi { white-space: pre-line; }
        .cp-rich > * + * { margin-top: 1rem; }
        .cp-img { min-height: 24rem; border-radius: 1.2rem; background: #f1f5f9 center / cover no-repeat; }
        .cp-img:not([style])::after { content: 'Click to choose an image'; display: grid; place-items: center; height: 24rem; color: #64748b; font-size: 1.4rem; }
        .cp-sections { display: flex; flex-direction: column; gap: 2.4rem; }
        .cp-section { display: flex; flex-direction: column; gap: 1.2rem; padding: 3.2rem; border-radius: 1.6rem; background: #f8fafc; }
        .cp-section:nth-child(even) { background: #eef6fb; }
        .cp-meta { color: #64748b; font-size: 1.3rem; text-transform: uppercase; letter-spacing: .06em; }
        .cp [data-cms-field]:empty::before { content: 'Click to add text'; color: #94a3b8; }
      `}</style>
      <script src={`${API}/cms/preview.js`} data-dashboard={process.env.NEXT_PUBLIC_FRONTENDURL} nonce={nonce} defer />
    </main>
  );
}
