'use client';
import { useState } from 'react';
import { getCsrfTokenFromCookies } from '@/lib/api/dashboardClient';

// For someone who lost their phone and their recovery codes. Superadmins only,
// and it takes your own authenticator code, so check who's asking first.
export default function Reset2fa({ userid, email, onDone }) {
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const close = () => {
    setOpen(false);
    setOtp('');
    setError('');
  };

  const reset = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reset2fa/${userid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfTokenFromCookies(),
        },
        credentials: 'include',
        body: JSON.stringify({ otp }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Could not turn it off');
        return;
      }
      close();
      onDone();
    } catch {
      setError('We could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button type="button" className="ui-btn ui-btn-link" onClick={() => setOpen(true)}>Turn off</button>
    );
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={reset}>
      <p className="ui-help">
        Only for {email}, once you&apos;re sure it&apos;s really them. They&apos;re logged out everywhere,
        and emailed about it.
      </p>
      <input
        className="ui-input"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="Your 6-digit code"
        aria-label="Your own authenticator code"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        autoFocus
      />
      <div className="flex items-center gap-2">
        <button type="submit" className="ui-btn ui-btn-secondary" disabled={busy || otp.length !== 6}>Turn off 2FA</button>
        <button type="button" className="ui-btn ui-btn-link" onClick={close}>Cancel</button>
      </div>
      {error && <p className="ui-status is-error" role="alert">{error}</p>}
    </form>
  );
}
