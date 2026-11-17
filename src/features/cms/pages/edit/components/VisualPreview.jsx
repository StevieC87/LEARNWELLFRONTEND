'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// The visual editor: the site's page (draft) in a frame, next to the fields ("split") or on
// its own ("page", where text is typed straight onto the page). Optionally also in a pop-out
// window that follows along live.
// The site runs backend/public/cms/preview.js, which talks to this by message:
//   site -> here:  ready { fields, blocks }, focus { name }, edit { name, content },
//                  pickmedia { name }, block { action, block: "<field>.<id>" }
//   here -> site:  init { mode: "edit" | "view", types }, fields { name: { type, content, url } }, highlight { name }
// formRef: the editor form (its inputs are named after the fields) - typing there shows here.
// values: the fields in redux. types: { name: type }. reloadKey changes after each save.
// layout: the sections' order - when it changes the page needs a save to show it.
// onEdit(name, content), onPickMedia(name), onBlock(action, field, id, type) - page mode only.

// where pages are shown: the site, or (default) this app's built-in renderer at /cms-preview
const PREVIEW_BASE = (process.env.NEXT_PUBLIC_CMS_PREVIEW_URL || `${process.env.NEXT_PUBLIC_FRONTENDURL || ''}/cms-preview`).replace(/\/$/, '');
const siteOrigin = (() => {
  try {
    return new URL(PREVIEW_BASE).origin;
  } catch {
    return '';
  }
})();

const DEVICES = [
  { id: 'desktop', label: 'Desktop', width: '100%' },
  { id: 'tablet', label: 'Tablet', width: '82rem' },
  { id: 'phone', label: 'Phone', width: '39rem' },
];

// medialibrary content is { imageidstring, ... }; the site needs the image address
const toPreview = (type, content) => {
  if (type !== 'medialibrary') return { type, content };
  const id = content?.imageidstring;
  return { type, url: id ? `${process.env.NEXT_PUBLIC_API_URL}/media/getmedia/${id}` : '' };
};

export default function VisualPreview({ mode = 'split', formRef, slugpath, values, types, layout, reloadKey, blockFields = [], blocktypes = [], onEdit, onPickMedia, onBlock }) {
  const frame = useRef(null);
  const popup = useRef(null);
  const typed = useRef({}); // unsaved keystrokes in the form, newer than redux (which updates on blur)
  const [src, setSrc] = useState('');
  const [shown, setShown] = useState(null); // field names the page marks, once it's ready
  const [error, setError] = useState('');
  const [device, setDevice] = useState('desktop');
  const [picker, setPicker] = useState(null); // { field, afterId } - choosing a section type to add

  // the message handler is set up once; it reads the current props through this
  const live = useRef({});
  live.current = { mode, types, onEdit, onPickMedia, onBlock };

  const post = useCallback((message, target) => {
    const targets = target ? [target] : [frame.current?.contentWindow, popup.current && !popup.current.closed ? popup.current : null];
    for (const w of targets.filter(Boolean)) w.postMessage({ source: 'cms-dashboard', ...message }, siteOrigin);
  }, []);

  const fieldsMessage = useCallback(() => {
    const fields = {};
    for (const [name, field] of Object.entries(values || {})) {
      fields[name] = toPreview(field?.type || types[name], field?.content);
    }
    for (const [name, content] of Object.entries(typed.current)) {
      fields[name] = toPreview(types[name] || 'text', content);
    }
    return { event: 'fields', fields };
  }, [values, types]);
  const sendAll = useCallback(() => post(fieldsMessage()), [post, fieldsMessage]);
  const fieldsMessageRef = useRef(fieldsMessage);
  fieldsMessageRef.current = fieldsMessage;

  // sections added, removed or moved since the frame loaded -> only a save shows that
  const loadedLayout = useRef(layout);
  const layoutChanged = shown !== null && layout !== loadedLayout.current;

  // a fresh preview token each load (they last 15 minutes)
  useEffect(() => {
    let cancelled = false;
    loadedLayout.current = layout;
    typed.current = {};
    setShown(null);
    (async () => {
      try {
        // a token opens only this page
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/createpreviewtoken?slugpath=${encodeURIComponent(slugpath || '/')}`, { credentials: 'include' });
        if (!res.ok) throw new Error();
        const { previewtoken } = await res.json();
        const path = !slugpath || slugpath === '/' ? '/' : slugpath.startsWith('/') ? slugpath : `/${slugpath}`;
        const url = new URL(PREVIEW_BASE + path);
        url.searchParams.set('preview', 'true');
        url.searchParams.set('previewtoken', previewtoken);
        url.searchParams.set('cmspreview', '1');
        if (cancelled) return;
        setSrc(url.toString());
        if (popup.current && !popup.current.closed) popup.current.location.href = url.toString();
      } catch {
        if (!cancelled) setError('Could not open the preview.');
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugpath, reloadKey]);

  // switching between split and page mode: the frame reloads in the other mode
  const [frameKey, setFrameKey] = useState(0);
  const lastMode = useRef(mode);
  useEffect(() => {
    if (mode === lastMode.current) return;
    lastMode.current = mode;
    setShown(null);
    setFrameKey((k) => k + 1);
  }, [mode]);

  // redux changed (blur, media picked, undo, typing on the page) -> resend
  useEffect(() => {
    typed.current = {};
    if (shown) sendAll();
  }, [shown, sendAll]);

  // keystrokes in the form, and which field is being edited
  useEffect(() => {
    const form = formRef?.current;
    if (!form) return;
    let timer;
    const onInput = (e) => {
      const name = e.target?.name;
      if (!name) return;
      typed.current[name] = e.target.value;
      clearTimeout(timer);
      timer = setTimeout(sendAll, 80);
    };
    const onFocus = (e) => {
      const name = e.target?.name;
      if (name) post({ event: 'highlight', name });
    };
    form.addEventListener('input', onInput);
    form.addEventListener('focusin', onFocus);
    return () => {
      clearTimeout(timer);
      form.removeEventListener('input', onInput);
      form.removeEventListener('focusin', onFocus);
    };
  }, [formRef, sendAll, post]);

  // messages from the page in the frame or the pop-out
  useEffect(() => {
    const onMessage = (e) => {
      const fromFrame = e.source === frame.current?.contentWindow;
      const fromPopup = !!popup.current && e.source === popup.current;
      if (e.origin !== siteOrigin || (!fromFrame && !fromPopup) || e.data?.source !== 'cms-preview') return;
      const { mode: m, types: t, onEdit: edit, onPickMedia: pick, onBlock: block } = live.current;
      const data = e.data;

      if (data.event === 'ready') {
        post({ event: 'init', mode: fromFrame && m === 'page' ? 'edit' : 'view', types: t }, e.source);
        post(fieldsMessageRef.current(), e.source);
        if (fromFrame) setShown(Array.isArray(data.fields) ? data.fields : []);
        return;
      }
      // editing only from the frame in page mode
      const editing = fromFrame && m === 'page';
      if (data.event === 'edit' && editing && typeof data.name === 'string' && typeof data.content === 'string') edit?.(data.name, data.content);
      if (data.event === 'pickmedia' && editing && typeof data.name === 'string') pick?.(data.name);
      if (data.event === 'block' && editing && typeof data.block === 'string') {
        const [field, id] = data.block.split('.');
        if (data.action === 'add') setPicker({ field, afterId: id });
        else if (['up', 'down', 'duplicate', 'remove'].includes(data.action)) block?.(data.action, field, id);
      }
      if (data.event === 'focus' && m === 'split' && typeof data.name === 'string') {
        const name = data.name;
        window.dispatchEvent(new CustomEvent('cms:open-field', { detail: name })); // opens a closed section
        setTimeout(() => {
          const form = formRef?.current;
          const target = form?.querySelector(`[name="${CSS.escape(name)}"]`)
            || form?.querySelector(`label[for="${CSS.escape(name)}"]`);
          if (!target) return;
          target.scrollIntoView({ block: 'center', behavior: 'smooth' });
          target.focus?.({ preventScroll: true });
        }, 60);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [formRef, post]);

  const openPopup = () => {
    if (src) popup.current = window.open(src, 'cms-preview');
  };

  const pickerOptions = picker
    ? (blocktypes || []).filter((b) => {
      const f = blockFields.find((x) => x.name === picker.field);
      return !f?.blocks?.length || f.blocks.includes(b.apiname);
    })
    : [];

  const unmarked = shown ? Object.keys(types).filter((name) => !shown.includes(name) && name !== 'slug' && name !== 'slugpath') : [];
  const width = DEVICES.find((d) => d.id === device)?.width || '100%';

  return (
    <div className={`vp ${mode === 'page' ? 'vp-page' : ''}`}>
      <div className="ui-row">
        <div className="ui-actions" role="group" aria-label="Screen size">
          {DEVICES.map((d) => (
            <button key={d.id} type="button" className={`ui-btn ui-btn-sm ${device === d.id ? 'ui-btn-primary' : 'ui-btn-secondary'}`} onClick={() => setDevice(d.id)} aria-pressed={device === d.id}>
              {d.label}
            </button>
          ))}
        </div>
        <div className="ui-actions">
          {mode === 'page' && blockFields.map((f) => (
            <button key={f.name} type="button" className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => setPicker({ field: f.name, afterId: null })}>
              + Add section{blockFields.length > 1 ? ` (${f.label || f.name})` : ''}
            </button>
          ))}
          <button type="button" className="ui-btn ui-btn-link ui-text-sm" onClick={openPopup}>Open in new window</button>
        </div>
      </div>

      {error && <p className="ui-status is-error">{error}</p>}
      {layoutChanged && <p className="ui-status is-warning">{mode === 'page' ? 'Updating the page…' : 'Sections changed. Save to see the new layout here.'}</p>}
      {mode === 'page' && shown && shown.length > 0 && (
        <p className="ui-help">Click text on the page to type. Click an image to change it. Hover a section for its tools.</p>
      )}

      {picker && (
        <div className="ui-note" role="dialog" aria-label="Add a section">
          <div>
            <p className="ui-note-title">Add a section{picker.afterId ? ' below' : ' at the end'}</p>
            <div className="ui-actions" style={{ marginTop: '0.8rem' }}>
              {pickerOptions.length === 0 && <span>No section types yet. Create a content type of kind &quot;Block&quot;.</span>}
              {pickerOptions.map((b) => (
                <button key={b.apiname} type="button" className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => { onBlock?.('add', picker.field, picker.afterId, b.apiname); setPicker(null); }}>
                  {b.name}
                </button>
              ))}
              <button type="button" className="ui-btn ui-btn-link ui-btn-sm" onClick={() => setPicker(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className={`vp-stage ${device !== 'desktop' ? 'is-device' : ''}`}>
        {src && <iframe key={frameKey} ref={frame} className="vp-frame" style={{ width }} src={src} title="Page preview" />}
      </div>

      {shown && shown.length === 0 && (
        <p className="ui-note">
          This page isn&apos;t set up for visual editing yet, so changes show here after you save. Add the preview
          script to the site and mark elements with data-cms-field=&quot;field name&quot;.
        </p>
      )}
      {shown && shown.length > 0 && unmarked.length > 0 && (
        <p className="ui-help">{mode === 'page' ? 'Not on the page (edit them in Fields view)' : 'Shown after saving'}: {unmarked.join(', ')}</p>
      )}
      <style>{`
        .vp-split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 2.4rem; align-items: start; }
        @media (max-width: 1100px) { .vp-split { grid-template-columns: minmax(0, 1fr); } }
        .vp { display: flex; flex-direction: column; gap: 1rem; position: sticky; top: 1.6rem; }
        .vp-page { position: static; margin-top: 1.6rem; }
        .vp-stage { display: flex; justify-content: center; border-radius: var(--ui-radius); }
        .vp-stage.is-device { padding: 1.6rem; background: var(--ui-subtle); }
        .vp-frame { max-width: 100%; height: calc(100vh - 16rem); border: 1px solid var(--ui-border); border-radius: var(--ui-radius); background: #fff; transition: width .2s; }
      `}</style>
    </div>
  );
}
