'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// The new-country email's "Wasn't you?" link (backend signIns.js). Opening
// the link does nothing: the button does, so a mail scanner that opens every
// link signs nobody out. No sign-in needed: the person may be locked out.
function SignOutEverywhere() {
  const token = useSearchParams()?.get('t') || '';
  const [state, setState] = useState({ status: 'idle', text: '' });

  const signOut = async () => {
    setState({ status: 'busy', text: '' });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signout-everywhere`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Couldn't sign out. Please try again.");
      setState({ status: 'done', text: '' });
    } catch (error) {
      setState({ status: 'error', text: error.message === 'Failed to fetch' ? "Couldn't reach the server. Please try again." : error.message });
    }
  };

  return (
    <div className="cardouterdiv">
      <div className="card cardpssword">
        <h1 className="cardh1">Sign out everywhere</h1>
        {state.status === 'done' ? (
          <div className="cardinputsdiv">
            <p>Done. Every browser is signed out, and any AI apps connected to your account are disconnected.</p>
            <p>
              Now change your password with &ldquo;Forgot Password&rdquo; on the login page. Until then, a new sign-in
              with your password also needs the code we email you.
            </p>
            <div className="flex flex-row justify-center">
              <Link className="ui-btn ui-btn-primary mt-8" href="/users/login">Go to login</Link>
            </div>
          </div>
        ) : (
          <div className="cardinputsdiv">
            <p>This signs your account out on every browser, this one too, and disconnects the AI apps you connected.</p>
            {state.status === 'error' && <p className="text-red-500 mb-5" role="status">{state.text}</p>}
            <div className="flex flex-row justify-center">
              <button type="button" className="ui-btn ui-btn-primary mt-8" disabled={!token || state.status === 'busy'} onClick={signOut}>
                {state.status === 'busy' ? 'Signing out…' : 'Sign out everywhere'}
              </button>
            </div>
            {!token && <p className="text-red-500 mb-5">This link isn&apos;t complete. Copy the whole link from the email.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignOutEverywhere />
    </Suspense>
  );
}
