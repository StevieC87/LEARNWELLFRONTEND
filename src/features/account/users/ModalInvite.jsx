
'use client';
import { useState } from 'react';
import SoftModal from '@/components/ui/SoftModal.jsx';
import { useSelector } from 'react-redux';
import { ROLE_LABELS, grantableRoles } from '@/lib/accountRoles';
import { useFieldCheck } from '@/hooks/useFieldCheck.js';
import { emailProblem } from '@/lib/fieldChecks.js';

export default function ModalInvite(props) {

  const { isOpen, changeOpen } = props;

  const [invitesent, setInviteSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [emailvalue, setEmailValue] = useState('');
  const [rolevalue, setRoleValue] = useState('');
  const emailCheck = useFieldCheck(emailvalue, emailProblem);
  // Only the roles this person may hand out (the backend's mayGrant).
  const userrole = useSelector((state) => state.DashSlice.userrole);
  const roles = grantableRoles(userrole);

  function getCsrfToken() {
    if (typeof document !== 'undefined') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrfToken='))
        ?.split('=')[1];
    }
    return null; // Return null if running on the server
  }
  const csrfToken = getCsrfToken();


  const inviteusersend = async (e) => {
    e.preventDefault()

    setInviteError('');
    if (!emailvalue.trim()) return setInviteError('Enter their email address.');
    if (!emailCheck.check()) return;
    setSending(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/inviteuser`;
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        credentials: 'include', // this is what sends/receives cookie
        body: JSON.stringify({
          email: emailvalue,
          role: rolevalue,
        }),
      });
    } catch {
      setInviteError("Couldn't reach the server. Please try again.");
      return;
    } finally {
      setSending(false);
    }
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setInviteError(data.message || "Couldn't send the invite. Please try again.");
    }
    else {
      setInviteSent(true);
      setTimeout(() => {
        setInviteSent(false);
        changeOpen(false); // Close the modal after sending invite

      }, 3000); // Reset invite sent state after 3 seconds
    }

  }
  return (
    <SoftModal open={Boolean(isOpen)} onClose={() => changeOpen(false)} title="Invite users to manage your app" width={480}>
      <p>Give other users (such as coworkers) ability to edit your app</p>
      <form className="flex flex-col gap-3" onSubmit={inviteusersend}>
        <div className="ui-field">
          <label className="ui-label" htmlFor="email">Email address</label>
          <input type="email" name="email" id="email" className="ui-input" data-autofocus onChange={(e) => setEmailValue(e.target.value)} value={emailvalue} {...emailCheck.input} />
          {emailCheck.error && <span className="ui-field-error" role="alert">{emailCheck.error}</span>}
        </div>
        <div className="ui-field">
          <label className="ui-label" htmlFor="role">Role</label>
          <select name="role" id="role" className="ui-input" onChange={(e) => setRoleValue(e.target.value)} value={rolevalue}>
            <option value="" disabled>Select a role</option>
            {roles.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
          </select>
        </div>
        <div className="flex flex-row justify-end">
          <button type="submit" disabled={sending || invitesent} className={`ui-btn ui-btn-primary ${invitesent ? 'bg-green-500' : ''} `}>
            {invitesent ? 'Invite Sent!' : sending ? 'Sending…' : 'Send Invite'}
          </button>
        </div>
        {inviteError && <span className="ui-status is-error" role="alert">{inviteError}</span>}
      </form>
    </SoftModal>
  );
}
