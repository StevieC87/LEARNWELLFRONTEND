// Stored field HTML reaches Summernote, which writes it with jQuery .html(): a
// <script> in it is loaded by a script element jQuery creates itself, and the
// dashboard's nonce + strict-dynamic CSP lets that run. The backend cleans a
// field only when the schema says it's rich text at save time, so the editor
// cleans whatever it is given. DOMParser builds an inert document: nothing in
// it runs or loads while it's cleaned here.
const DROPPED = new Set([
  'script', 'style', 'link', 'meta', 'base', 'iframe', 'frame', 'frameset', 'object',
  'embed', 'applet', 'template', 'noscript', 'form', 'svg', 'math',
]);
const URL_ATTRIBUTES = new Set(['href', 'src', 'action', 'formaction', 'xlink:href', 'poster', 'background', 'data', 'srcset']);
// Summernote inserts uploaded images as data: URLs.
const DATA_IMAGE = /^data:image\/(png|gif|jpe?g|webp|avif|bmp);/i;
const SCRIPTABLE_URL = /^(javascript|vbscript|data):/i;

function unsafeUrl(name, value, tag) {
  // Browsers ignore whitespace and control characters inside a scheme.
  const url = value.replace(/[\u0000- \u007f]+/g, '');
  if (!SCRIPTABLE_URL.test(url)) return false;
  return !(tag === 'img' && name === 'src' && DATA_IMAGE.test(url));
}

export function sanitizeRichText(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  for (const el of [...doc.body.querySelectorAll('*')]) {
    const tag = el.localName;
    if (DROPPED.has(tag)) {
      el.remove();
      continue;
    }
    for (const { name, value } of [...el.attributes]) {
      if (name.startsWith('on') || name === 'srcdoc' || (URL_ATTRIBUTES.has(name) && unsafeUrl(name, value, tag))) {
        el.removeAttribute(name);
      }
    }
  }
  return doc.body.innerHTML;
}
