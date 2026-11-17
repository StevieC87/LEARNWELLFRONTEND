'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import CodeBoxes from '@/features/auth/CodeBoxes';
import { safeNext } from '@/features/auth/safeNext';

// The second step of a login: the code from an authenticator app, or with
// ?via=email the one emailed to a browser we don't know yet.
export default function VerifyOTP() {
  const router = useRouter(); // Initialize the Next.js router for navigation
  const searchParams = useSearchParams(); // Get the search parameters from the URL]
  const byEmail = searchParams.get('via') === 'email';
  const [recoveryCode, setRecoveryCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [expired, setExpired] = useState(false);
  const [useRecovery, setUseRecovery] = useState(false);
  const [busy, setBusy] = useState(false);
  const [boxesKey, setBoxesKey] = useState(0); // A new key empties the boxes

  // True when the code was taken: the boxes empty themselves otherwise.
  const verifyOTP = async (code) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const path = byEmail ? 'verifylogincode' : useRecovery ? 'verifyrecoverycode' : 'verifyotplogin';
      const fetchpostverify = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(byEmail || useRecovery ? { code } : { otp: code }),
      });
      const data = await fetchpostverify.json().catch(() => ({}));
      if (!fetchpostverify.ok || data.success !== true) {
        setError(data.message || data.error || 'That code could not be verified.');
        setExpired(data.expired === true);
        return false;
      }
      if (data.recoveryused) {
        router.push('/dash/users/profile');
        return true;
      }
      const next = safeNext(searchParams.get('next'));
      if (data.setup2fa) {
        router.push(`/dash/users/profile/twofactor?required=1${next ? `&next=${encodeURIComponent(next)}` : ''}`);
        return true;
      }
      router.push(next || '/dash');
      return true;
    } catch {
      setError('We could not reach the server. Please try again.');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/resendlogincode`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.message || 'We could not send a new code.');
        setExpired(data.expired === true);
        return;
      }
      setNotice(data.sent ? 'A new code is on its way.' : 'We only just sent one. Give it a minute.');
      if (data.sent) setBoxesKey((key) => key + 1);
    } catch {
      setError('We could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="cardouterdiv">
      <div className="card flex flex-col items-center justify-center bg-gray-100" >

        <div className="">
          <h2 className="text-2xl font-bold pb-7 ">{byEmail ? 'Check your email' : 'Verify OTP'}</h2>
          {byEmail && (
            <p className="pb-4">We don&apos;t recognise this browser, so we emailed you a 6-digit code. You won&apos;t be asked again here.</p>
          )}
          {!byEmail && !useRecovery && (
            <p className="pb-4">Enter the 6-digit code from your authenticator app.</p>
          )}
          {expired ? null : useRecovery ? (
            <form onSubmit={(e) => { e.preventDefault(); verifyOTP(recoveryCode); }} className="space-y-4">
              <input
                type="text"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.trim())}
                placeholder="Enter a recovery code"
                autoComplete="off"
                maxLength={32}
                className="w-full p-2 border border-gray-300 rounded"
              />

              <button type="submit" disabled={busy} className="ui-btn ui-btn-primary w-full">Use recovery code</button>
            </form>
          ) : (
            <CodeBoxes key={boxesKey} onComplete={verifyOTP} autoFocus />
          )}
          {!byEmail && !expired && (
            <button type="button" className="ui-btn ui-btn-link mt-4" onClick={() => { setUseRecovery(!useRecovery); setRecoveryCode(''); setError(''); }}>
              {useRecovery ? 'Use my authenticator app' : 'Lost your phone? Use a recovery code'}
            </button>
          )}
          {useRecovery && (
            <p className="mt-4">No codes left? Email <a href="mailto:info@sitegoose.com">info@sitegoose.com</a> and we&apos;ll help.</p>
          )}
          {byEmail && !expired && (
            <button type="button" disabled={busy} onClick={resend} className="ui-btn ui-btn-link mt-4">
              Send a new code
            </button>
          )}
          {notice && <p className="mt-4 text-green-500" role="status">{notice}</p>}
          {error && <p className="mt-4 text-red-500" role="alert">{error}</p>}
          {expired && <p className="mt-4"><Link href="/users/login">Back to login</Link></p>}
        </div>
      </div>
    </div>
  );
}
