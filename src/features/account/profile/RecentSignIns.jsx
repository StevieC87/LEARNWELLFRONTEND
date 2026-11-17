'use client';
import { useEffect, useState } from 'react';
import { getCsrfTokenFromCookies } from '@/lib/api/dashboardClient';
import Skeleton from '@/components/ui/Skeleton.jsx';

// Profile → Security → Recent sign-ins (backend signIns.js): the last 20,
// where from and how, which is this browser and which are still signed in,
// and Sign out everywhere (/users/logout-everywhere), this browser too.
const HOW = {
  password: 'Password',
  '2fa': 'Password and authenticator',
  email_code: 'Password and emailed code',
  recovery_code: 'Recovery code',
  google: 'Google',
  github: 'GitHub',
  activation: 'Activation link',
};
const API = process.env.NEXT_PUBLIC_API_URL;
const when = (at) => new Date(at).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function RecentSignIns() {
  const [signIns, setSignIns] = useState(null);
  const [error, setError] = useState('');
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [outError, setOutError] = useState('');

  useEffect(() => {
    let live = true;
    fetch(`${API}/users/signins`, { credentials: 'include' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.message || "Couldn't load your sign-ins.");
        return d;
      })
      .then((d) => live && setSignIns(d.signIns || []))
      .catch((err) => live && setError(err.message === 'Failed to fetch' ? "Couldn't reach the server." : err.message));
    return () => { live = false; };
  }, []);

  const signOut = async () => {
    setBusy(true);
    setOutError('');
    try {
      const r = await fetch(`${API}/users/logout-everywhere`, {
        method: 'POST', credentials: 'include', headers: { 'X-CSRF-Token': getCsrfTokenFromCookies() || '' },
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).message || "Couldn't sign out. Please try again.");
      // A full load, so nothing of the signed-out session stays in memory.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign('/users/login');
    } catch (err) {
      setOutError(err.message === 'Failed to fetch' ? "Couldn't reach the server. Please try again." : err.message);
      setBusy(false);
    }
  };

  return (
    <section className="ui-card">
      <header className="ui-card-head">
        <div>
          <h3>Recent sign-ins</h3>
          <p>Your last 20. A sign-in from a country your account never used before is emailed to you.</p>
        </div>
      </header>
      <div className="profile-rows">
        {error && <p className="ui-status is-error">{error}</p>}
        {!error && !signIns && <Skeleton kind="table" rows={3} cols={2} />}
        {signIns && !signIns.length && <p className="ui-help">Your sign-ins are listed from your next one on.</p>}
        {signIns?.map((s, i) => (
          <div className="profile-row" key={`${s.at}-${i}`}>
            <div>
              <span className="ui-label">
                {[s.city, s.country_name].filter(Boolean).join(', ') || 'Unknown place'}{' '}
                {s.this_browser && <span className="ui-badge is-success">This browser</span>}
                {!s.this_browser && s.signed_in && <span className="ui-badge">Still signed in</span>}
              </span>
              <p className="ui-help">
                {[when(s.at), [s.browser, s.os].filter(Boolean).join(' on '), HOW[s.how], s.ip].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        ))}
        <div className="profile-row">
          <div>
            <span className="ui-label">Sign out everywhere</span>
            <p className="ui-help">
              Every browser, this one too, and the AI apps you connected. Each browser then asks for the emailed code with your password.
            </p>
            {outError && <p className="ui-status is-error" role="status">{outError}</p>}
          </div>
          {asking ? (
            <div className="flex items-center gap-2">
              <button type="button" className="ui-btn ui-btn-primary" disabled={busy} onClick={signOut}>{busy ? 'Signing out…' : 'Sign out everywhere'}</button>
              <button type="button" className="ui-btn ui-btn-link" disabled={busy} onClick={() => setAsking(false)}>Cancel</button>
            </div>
          ) : (
            <button type="button" className="ui-btn ui-btn-secondary" onClick={() => setAsking(true)}>Sign out everywhere</button>
          )}
        </div>
      </div>
    </section>
  );
}
