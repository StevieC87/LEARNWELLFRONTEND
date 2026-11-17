'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCsrfTokenFromCookies } from '@/lib/api/dashboardClient';
import { SIGN_IN_PROVIDERS, signInMessage, signInUrl } from '@/features/auth/signInProviders';

// Profile → Security: a row per service that can sign this account in, to
// connect it or remove it. Connecting goes out to the service and comes back
// with ?signin=<result>. The server refuses to remove the last way in.
export default function SignInMethods({ methods, onChange }) {
  const signin = useSearchParams()?.get('signin');
  const [busy, setBusy] = useState('');
  const [status, setStatus] = useState(() => signInMessage(signin));

  // Shown once, then dropped from the address so a refresh doesn't repeat it.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('signin')) return;
    url.searchParams.delete('signin');
    window.history.replaceState(null, '', url);
  }, []);

  const remove = async (key, label) => {
    setBusy(key);
    setStatus(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signin/${key}/remove`, {
        method: 'POST',
        headers: { 'X-CSRF-Token': getCsrfTokenFromCookies() || '' },
        credentials: 'include',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Couldn't remove ${label}. Please try again.`);
      onChange(data.signInMethods);
      setStatus({ type: 'success', text: `${label} removed. It can't sign in to this account any more.` });
    } catch (error) {
      setStatus({ type: 'error', text: error.message === 'Failed to fetch' ? "Couldn't reach the server. Please try again." : error.message });
    } finally {
      setBusy('');
    }
  };

  return (
    <>
      {SIGN_IN_PROVIDERS.map(({ key, label, Mark }) => (
        <div className="profile-row" key={key}>
          <div>
            <span className="ui-label">
              <Mark /> {label}{' '}
              <span className={`ui-badge${methods?.[key] ? ' is-success' : ''}`}>{methods?.[key] ? 'Connected' : 'Not connected'}</span>
            </span>
            <p className="ui-help">Sign in with your {label} account.</p>
          </div>
          {methods?.[key] ? (
            <button type="button" className="ui-btn ui-btn-secondary" disabled={Boolean(busy)} onClick={() => remove(key, label)}>
              {busy === key ? 'Removing…' : 'Remove'}
            </button>
          ) : (
            // A plain <a>: it leaves for the service's own page.
            <a className="ui-btn ui-btn-secondary" href={signInUrl(key, { link: true })}>Connect</a>
          )}
        </div>
      ))}
      {status && (
        <p className={`ui-status ${status.type === 'error' ? 'is-error' : 'is-success'}`} role="status">{status.text}</p>
      )}
    </>
  );
}
