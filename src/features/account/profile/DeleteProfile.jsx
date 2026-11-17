'use client';
import { useState } from 'react';
import SoftModal from '@/components/ui/SoftModal.jsx';
import { SIGN_IN_PROVIDERS, signInUrl } from '@/features/auth/signInProviders';

// Deleting the profile asks for the password (and the authenticator code when
// two-factor is on) as well as the typed confirmation: the server refuses a
// session on its own. An account with neither (Google or GitHub only) is asked
// to sign in with one of those again first, and comes back here (reauthWith:
// the services the server named).
export default function DeleteProfile(props) {

  const { textchoice, isOpen, changeOpendelete, onDelete, askCode, error, reauthWith = [], email, hasPassword } = props;

  const [inputdeletetext, setinputdeletetext] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleteinputsitenameerror, setDeleteInputSiteNameError] = useState(false);

  const callbackConfirmCancel = async (confirmcancel) => {
    if (confirmcancel === 'confirm') {
      if (inputdeletetext !== 'deleteprofile') {
        setDeleteInputSiteNameError(true);
        return;
      }
      setDeleteInputSiteNameError(false);
      setBusy(true);
      try {
        await onDelete({ password, otp });
      } finally {
        setBusy(false);
      }
    }
    else if (confirmcancel === 'cancel') {
      changeOpendelete(false);
    }
  }

  return (
    <SoftModal open={Boolean(isOpen)} onClose={() => changeOpendelete(false)} title={textchoice} width={440}
      foot={(
        <>
          <button type="button" className="ui-btn ui-btn-danger" disabled={busy}
            onClick={() => callbackConfirmCancel('confirm')}>{busy ? 'Deleting…' : 'Confirm Delete'}
          </button>
          <button type="button" className="ui-btn ui-btn-secondary" onClick={() => callbackConfirmCancel('cancel')}>Cancel
          </button>
        </>
      )}>
      <div className="flex flex-col justify-between gap-3">
        {/* Without a username field the browser takes the confirm box for one and
            fills in whichever saved login it likes, not this account's. */}
        <input type="email" autoComplete="username" value={email || ''} readOnly hidden />
        <input type="text" className="ui-input" name="confirm-delete" autoComplete="off" data-1p-ignore data-lpignore="true" data-autofocus
          aria-label="Type deleteprofile to confirm" onChange={(e) => setinputdeletetext(e.target.value)} />
        {hasPassword && (
          <label className="flex flex-col gap-1">
            <span className="ui-label">Password</span>
            <input type="password" className="ui-input" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        )}
        {askCode && (
          <label className="flex flex-col gap-1">
            <span className="ui-label">Code from your authenticator app</span>
            <input
              className="ui-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
          </label>
        )}
        {deleteinputsitenameerror && (
          <span className="ui-status is-error">Please type deleteprofile to confirm deletion.</span>
        )}
        {error && !deleteinputsitenameerror && (
          <span className="ui-status is-error" role="alert">{error}</span>
        )}
        {SIGN_IN_PROVIDERS.filter(({ key }) => reauthWith.includes(key)).map(({ key, label }) => (
          <a key={key} className="ui-btn ui-btn-secondary"
            href={`${signInUrl(key)}?next=${encodeURIComponent('/dash/users/profile')}`}>
            Sign in with {label} again
          </a>
        ))}
      </div>
    </SoftModal>
  );
}
