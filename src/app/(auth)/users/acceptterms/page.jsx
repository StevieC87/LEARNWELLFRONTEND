"use client";

import '@/features/auth/loginregister.css'
import { useState } from 'react';
import Link from 'next/link';

import TermsAgreement from '@/features/auth/TermsAgreement';
import { safeNext } from '@/features/auth/safeNext';
import SiteGooseLogo from '@/components/ui/SiteGooseLogo.jsx';

// After a first Google or GitHub sign-in: the account is made here, once the
// terms are accepted. The cookie saying who the service vouched for comes with
// the request.
export default function AcceptTermsPage() {
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!accepted) {
      setProblem({ message: 'Please accept the terms to continue' });
      return;
    }
    setBusy(true);
    setProblem(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/oauthsignup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptedTerms: true }),
        credentials: 'include',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw Object.assign(new Error(data.error || 'Could not create your account'), { expired: data.expired });
      window.location.assign(safeNext(new URLSearchParams(window.location.search).get('next')) || '/dash');
    } catch (error) {
      setProblem({ message: error.message, expired: error.expired });
      setBusy(false);
    }
  };

  return (
    <div className="cardouterdiv">
      <div className="card flex flex-col gap-2 w-[280px]">
        <div className="flex items-center justify-center mb-8">
          <SiteGooseLogo size="lg" />
        </div>

        <h4 className="pb-8 poppinsSemiBold text-center">Create your account</h4>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TermsAgreement input={{ checked: accepted, onChange: (event) => setAccepted(event.target.checked) }} />
          {problem && (
            <p className="text text-red-500">
              {problem.message}{' '}
              {problem.expired && <Link href="/users/login" className="underline">Back to login</Link>}
            </p>
          )}
          <button className="ui-btn ui-btn-primary" type="submit" style={{ width: '100%' }} disabled={busy}>
            <strong>{busy ? 'Creating…' : 'Create account'}</strong>
          </button>
        </form>
      </div>
    </div>
  );
}
