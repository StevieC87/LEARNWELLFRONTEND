'use client';
import { useEffect, useState, useRef } from "react"
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, ShieldCheck } from "@/components/ui/icons.jsx";
import CopyButton from "@/components/ui/CopyButton.jsx";
import RecoveryCodes from "@/features/account/profile/RecoveryCodes";
import "@/features/account/profile/twofactor.css";
import { safeNext } from "@/features/auth/safeNext";

export default function TwoFactorPage() {
  // Sent here at login: an admin account has no admin rights until this is on.
  const searchParams = useSearchParams();
  const required = searchParams.get('required') === '1';
  // Where the login was going (an AI app's sign-in, say), carried on after this.
  const next = safeNext(searchParams.get('next'));
  const here = '/dash/users/profile/twofactor' + (required ? `?required=1${next ? `&next=${encodeURIComponent(next)}` : ''}` : '');
  const qrRef = useRef()
  //HERE WE FETCH THE AUTH CODE, QR STUFF ETC 
  const [manualEntryKey, setManualEntryKey] = useState('');
  const [otp, setOtp] = useState(''); // State to hold the OTP input
  const [otpverifysuccess, setOtpVerifySuccess] = useState(''); // State to hold OTP verification success
  const [loadState, setLoadState] = useState('loading'); // loading | ready | error
  const [verifying, setVerifying] = useState(false);
  const [alreadyOn, setAlreadyOn] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [codesSaved, setCodesSaved] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {

    function getCsrfToken() {
      if (typeof document !== 'undefined') {
        return document.cookie
          .split('; ')
          .find(row => row.startsWith('csrfToken='))
          ?.split('=')[1];
      }
      return null; // Return null if running on the server
    }

    // Usage:
    const csrfToken = getCsrfToken();
    //  console.log(object)

    const fetchfetch = async () => {
      // The encoder loads while the secret is fetched, not with the page.
      const qrcode = import('qrcode');
      const fetch2factor = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/generatetwofactor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRF-Token": csrfToken
        },
        credentials: 'include', // Include cookies for authenticationj
      });

      if (!fetch2factor.ok) {
        // 409: 2FA is already on, and a new authenticator needs it turned off first.
        if (fetch2factor.status === 409) setAlreadyOn(true);
        // 403: the session is too old to change this. Logging in again fixes it.
        if (fetch2factor.status === 403) setNeedsLogin(true);
        setLoadState('error');
        return;
      }
      const data = await fetch2factor.json();
      const { default: QRCode } = await qrcode;
      qrRef.current && QRCode.toCanvas(qrRef.current, data.qr, { errorCorrectionLevel: 'H', width: 184, margin: 1 })
      setManualEntryKey(data.manualEntryKey); // Assuming data.manualEntryKey contains the manual entry key
      setLoadState('ready');

    }
    fetchfetch();

  }, [])


  const verifyOTP = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (otp.length !== 6) {
      setOtpVerifySuccess('false');
      return;
    }
    setVerifying(true);
    const csrf = document.cookie.split('; ').find(c => c.startsWith('csrfToken='))?.slice('csrfToken='.length) || '';
    let fetchpostverify;
    try {
      fetchpostverify = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verifyotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf,
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({ otp: otp }),
      });
    } catch {
      setOtpVerifySuccess('offline');
      return;
    } finally {
      setVerifying(false);
    }
    if (!fetchpostverify.ok) {
      setOtpVerifySuccess('false');
      return;
    }
    const data = await fetchpostverify.json();
    setRecoveryCodes(data.recoveryCodes || []);
    setOtpVerifySuccess(data.verified === true ? 'true' : 'false');
  }

  // The key in groups of four, easier to read and type into an app.
  const groupedKey = manualEntryKey.replace(/(.{4})/g, '$1 ').trim();

  const codesUnsaved = otpverifysuccess === 'true' && recoveryCodes.length > 0 && !codesSaved;

  return (
    <div className="tfa-page">
      {!codesUnsaved && (
        <Link href="/dash/users/profile" className="tfa-back">
          <ArrowLeft size={14} aria-hidden="true" /> Back to profile
        </Link>
      )}

      <section className="ui-card">
        <header className="ui-card-head">
          <div>
            <h3><ShieldCheck size={18} aria-hidden="true" className="tfa-icon" /> Set up two-factor authentication</h3>
            <p>After this, signing in asks for a code from your phone as well as your password.</p>
            {required && <p role="alert"><strong>Admin accounts need this.</strong> Your admin rights stay off until it&apos;s set up.</p>}
          </div>
        </header>

        {otpverifysuccess === 'true' ? (
          <div className="ui-card-body">
            <div className="tfa-done">
              <span className="tfa-done-icon"><Check size={22} aria-hidden="true" /></span>
              <div>
                <h4>Two-factor authentication is on</h4>
                <p className="ui-help">Next time you sign in, enter the 6-digit code from your authenticator app.</p>
              </div>
            </div>
            <RecoveryCodes codes={recoveryCodes} onSaved={() => setCodesSaved(true)} />
            {!codesUnsaved && <div className="ui-actions">
              {required
                // A full load: the menu has to pick up the admin role.
                ? <button type="button" className="ui-btn ui-btn-primary" onClick={() => { window.location.href = next || '/dash'; }}>{next ? 'Continue' : 'Go to the dashboard'}</button>
                : <Link href="/dash/users/profile" className="ui-btn ui-btn-primary">Back to profile</Link>}
            </div>}
          </div>
        ) : (
          <ol className="tfa-steps">
            <li className="tfa-step">
              <span className="tfa-num">1</span>
              <div className="tfa-step-body">
                <h4>Install an authenticator app</h4>
                <p className="ui-help">
                  Any app works, such as Google Authenticator, Microsoft Authenticator, 1Password or Authy.
                </p>
              </div>
            </li>

            <li className="tfa-step">
              <span className="tfa-num">2</span>
              <div className="tfa-step-body">
                <h4>Scan the QR code</h4>
                <p className="ui-help">In the app, add an account and scan this code. Can&apos;t scan? Type the key instead.</p>
                {needsLogin ? (
                  <>
                    <p className="ui-status is-error">To confirm it&apos;s you, log in again. Your QR code will be here when you&apos;re back.</p>
                    <div className="ui-actions">
                      <Link href={`/users/login?next=${encodeURIComponent(here)}`} className="ui-btn ui-btn-primary">Log in again</Link>
                    </div>
                  </>
                ) : <div className="tfa-pair">
                  <div className={`tfa-qr${loadState !== 'ready' ? ' is-loading' : ''}`}>
                    <canvas ref={qrRef} aria-label="QR code for your authenticator app" />
                    {loadState === 'loading' && <span className="ui-help">Loading…</span>}
                  </div>
                  <div className="tfa-key">
                    <span className="ui-label">Setup key</span>
                    <code className="tfa-key-value">{groupedKey || '…'}</code>
                    <CopyButton text={manualEntryKey} label="Copy key" name="your setup key" disabled={!manualEntryKey} />
                    <p className="ui-help">Choose &quot;time-based&quot; if the app asks.</p>
                  </div>
                </div>}
                {loadState === 'error' && !needsLogin && (
                  <p className="ui-status is-error">
                    {alreadyOn
                      ? 'Two-factor authentication is already on. Turn it off on your profile first to move it to a new authenticator.'
                      : <>Couldn&apos;t create a setup code. Reload the page to try again.</>}
                  </p>
                )}
              </div>
            </li>

            <li className="tfa-step">
              <span className="tfa-num">3</span>
              <div className="tfa-step-body">
                <h4>Enter the 6-digit code</h4>
                <p className="ui-help">The app now shows a code that changes every 30 seconds. Enter the current one.</p>
                <form className="tfa-verify" onSubmit={verifyOTP}>
                  <label className="sr-only" htmlFor="tfa-code">6-digit code</label>
                  <input
                    id="tfa-code"
                    className="ui-input tfa-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setOtpVerifySuccess(''); }}
                  />
                  <button type="submit" className="ui-btn ui-btn-primary" disabled={verifying || otp.length !== 6}>
                    {verifying ? 'Checking…' : 'Verify and turn on'}
                  </button>
                </form>
                {otpverifysuccess === 'false' && (
                  <p className="ui-status is-error" role="alert">
                    That code didn&apos;t work. Check the app&apos;s clock is right and enter the newest code.
                  </p>
                )}
                {otpverifysuccess === 'offline' && (
                  <p className="ui-status is-error" role="alert">
                    Couldn&apos;t reach the server. Please try again.
                  </p>
                )}
              </div>
            </li>
          </ol>
        )}
      </section>
    </div>
  )
}
