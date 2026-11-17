// What is wrong with a typed value, in words for the line under the field, or
// '' when nothing is. An empty field is never wrong here: whether it may be
// empty is the form's question, asked when it is sent. The server checks every
// one of these again; these only say it sooner.

// The host the server keeps from what was typed (siteFields.js normaliseHost):
// scheme, path, a pasted "you@" and www are dropped.
export const hostFrom = (value) => String(value || '').trim().toLowerCase()
  .replace(/^https?:\/\//, '').replace(/[/?#].*$/, '').replace(/^.*@/, '').replace(/^www\./, '');

const LABEL = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/;

// A domain in its own letters (bücher.de) is checked in the form the
// browser sends it in (xn--bcher-kva.de); the server takes either.
const asciiHost = (host) => {
  if (/^[ -~]*$/.test(host)) return host;
  try { return new URL(`http://${host}`).hostname; } catch { return host; }
};

export function domainProblem(value) {
  const typed = String(value || '').trim();
  if (!typed) return '';
  // The server drops only http:// and https://; anything else would be kept.
  const scheme = typed.match(/^([a-z][a-z0-9+.-]*):\/\//i);
  if (scheme && !/^https?$/i.test(scheme[1])) return `Leave out ${scheme[0]}: just the domain, like example.com.`;
  const typedHost = hostFrom(value);
  if (/\s/.test(typedHost)) return 'A domain has no spaces.';
  if (typedHost.includes(':')) return 'Leave out the port: just the domain, like example.com.';
  const host = asciiHost(typedHost);
  const labels = host.split('.');
  if (labels.length < 2 || !labels.at(-1)) return 'Add the ending, like example.com.';
  if (!labels.every((label) => LABEL.test(label))) return 'Use letters, numbers, dots and dashes only, like example.com.';
  if (!/^[a-z]{2,}$|^xn--/.test(labels.at(-1))) return 'That ending doesn\'t look right. Check for a typo.';
  return '';
}

// "Saved as example.com" when the server will keep less than was typed.
export function domainNote(value) {
  const typed = String(value || '').trim().toLowerCase();
  const host = hostFrom(value);
  return typed && host && host !== typed && !domainProblem(value) ? `Saved as ${host}` : '';
}

export function urlProblem(value, { https = false } = {}) {
  const typed = String(value || '').trim();
  if (!typed) return '';
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(typed)) return `Start with ${https ? 'https://' : 'https:// or http://'}.`;
  let url;
  try { url = new URL(typed); } catch { return 'That isn\'t a full address. Check for a typo.'; }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return 'Use an https:// address.';
  if (https && url.protocol !== 'https:') return 'This has to be an https:// address.';
  if (!url.hostname.includes('.') && url.hostname !== 'localhost') return 'Add the domain\'s ending, like .com.';
  return '';
}

export function emailProblem(value) {
  const typed = String(value || '').trim();
  if (!typed) return '';
  if (/\s/.test(typed)) return 'An email address has no spaces.';
  if (!typed.includes('@')) return 'Add the @ and the part after it.';
  if (!/^[^@]+@[^@]+\.([a-z]{2,}|xn--[a-z0-9-]+)$/i.test(typed)) return 'Check the part after the @, like name@example.com.';
  return '';
}
