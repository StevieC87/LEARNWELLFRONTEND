'use client';

// import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FieldRenderer from '@/features/cms/pages/edit/FieldRenderer';
import { useDispatch, useSelector } from "react-redux";
import { updateField } from '@/redux/slices/PagesSlice';
import ModalYesNo from "@/components/ui/ModalYesNo";
import { useRouter } from 'next/navigation';
import DeleteProfile from '@/features/account/profile/DeleteProfile';
import "@/features/account/profile/profile.css";
import { useShield } from "@/features/auth/useShield";
import Appearance from '@/features/account/profile/Appearance';
import RecoveryCodes from '@/features/account/profile/RecoveryCodes';
import SignInMethods from '@/features/account/profile/SignInMethods';
import RecentSignIns from '@/features/account/profile/RecentSignIns';
import { getCsrfTokenFromCookies } from '@/lib/api/dashboardClient';
import { ROLE_LABELS, grantableRoles, mayManage } from '@/lib/accountRoles';
import useTabParam from '@/hooks/useTabParam.js';
import TabIcon, { tabIconHue } from '@/components/layout/TabIcon.jsx';
import ReorderableTabs from '@/components/layout/ReorderableTabs.jsx';

// Dashboard, Appearance and Notifications are this browser's and this account's
// own, so those tabs only show on your own profile.
const TABS = [
  ['account', 'Account', 'person'],
  ['appearance', 'Appearance', 'card-image'],
  ['security', 'Security', 'shield-check'],
];
const OWN_TABS = ['dashboard', 'appearance', 'notifications'];


export default function UserProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const useridparams = searchParams.get('userid'); // Get user ID from URL parameters
  const [userRole, setUserRole] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [useremail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [saved, setSaved] = useState(false);
  const [errorsave, setErrorSave] = useState('');

  const [errormessage, setErrormessage] = useState('');
  // Staff moving someone else's email confirm it with their own authenticator code (the server asks).
  const [staffOtp, setStaffOtp] = useState('');
  const [askStaffOtp, setAskStaffOtp] = useState(false);
  const [successmessage, setSuccessmessage] = useState('');

  const [userschemafields, setUserschemafields] = useState(null);
  const [fieldsdata, setFieldsData] = useState(null);
  const [fieldswithdataifany, setFieldsWithDataIfAny] = useState(null);
  const currentuserrole = useSelector((state) => state.DashSlice.userrole);
  const currentuserid = useSelector((state) => state.DashSlice.userid);
  // Appearance is this browser's, so it only shows on your own profile, not
  // when an admin opens someone else's.
  const ownProfile = !useridparams || useridparams === currentuserid;
  // The role is someone else's to change, and only on an account this viewer
  // may manage, to a role they may give (the backend's mayManage, mayGrant).
  const storedRole = fieldsdata?.role;
  const canSetRole = !ownProfile && mayManage(currentuserrole, storedRole);
  const roleOptions = [...new Set([storedRole, ...grantableRoles(currentuserrole)])].filter((role) => ROLE_LABELS[role]);
  const tabs = ownProfile ? TABS : TABS.filter(([key]) => !OWN_TABS.includes(key));
  const [tab, setTab] = useTabParam(tabs.map(([key]) => key));

  const reduxfieldsdata = useSelector((state) => state.PagesSlice.fields);
  const [fieldsdatatosend, setFieldsDataForSend] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [triggerfetch, setTriggerFetch] = useState(0); // For re-fetching data

  const [twofactorenabled, setTwoFactorEnabled] = useState(false);
  const [recoveryLeft, setRecoveryLeft] = useState(0);
  const [signInMethods, setSignInMethods] = useState(null);
  // Just logged in with a recovery code: 2FA can go without another code.
  const [recovered, setRecovered] = useState(false);
  const [showModaldelete, setShowModaldelete] = useState(false);

  // const useridfromredux = useSelector((state) => state.DashSlice.userid); // Get user ID from Redux store


  //,FIRST WE FETCH SCHEMA AND FIELDS DATA
  useEffect(() => {

    const fetchprofile = async () => {
      try {
        const fetchprofile = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/getuserprofile?userid=${useridparams}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // This is important for cookies to be sent
          }
        );
        if (!fetchprofile.ok) {
          setErrormessage('Failed to fetch user profile');
          return;
        }
        setLoaded(true); // Set loaded to true after fetching data
        const data = await fetchprofile.json();
        setSubscription(data.subscription || null);
        setUserschemafields(data.schemaFields); // Set schema fields for display
        setFieldsData(data.fieldsdata); // Set fields data for display
        setUserEmail(data.fieldsdata.email); // Set user email for display
        setUserId(data.fieldsdata._id);
        setUserRole(data.fieldsdata.role); // Set user role for display
        setTwoFactorEnabled(data.fieldsdata.twoFactorEnabled || false); // Set two-factor authentication status
        setRecoveryLeft(data.fieldsdata.recoveryCodesLeft || 0);
        setSignInMethods(data.fieldsdata.signInMethods || null);
        setRecovered(data.recoveredWindow === true);
        // Set user ID for display
        /*      setUserEmail(data.email); // Set user email for display
             setUserRole(data.userrole); // Set user role for display
             setUsername(data.username); // Set username for display
             setUserId(data._id); // Set user ID for display */
      }
      catch (error) {
        setErrormessage('An error occurred while fetching user profile');
        console.log('Error fetching user profile:', error);
      }
    }
    fetchprofile();
  }, [triggerfetch, useridparams])


  //, THEN WE MERGE THEM TOGETHER AND SET THEM TO STATE AND REDUX
  useEffect(() => {
    if (!userschemafields || !fieldsdata) {
      return
    }
    if (userschemafields && fieldsdata) {
      const fieldsWithData = userschemafields.map(field => {
        const fieldData = fieldsdata[field.name];
        return {
          ...field,
          value: fieldData ? fieldData : ''
        };
      });
      setFieldsWithDataIfAny(fieldsWithData);

      //ADD THEM TO TEH REDUX - BECAUSE THAT'S HOW I SET UP THE FIELD RENDERER TO WORK 
      fieldsWithData.forEach((item) => {
        dispatch(updateField({
          name: item.name, content: item.value || '',
          type: item.type || '',
          required: item.required || false,
          placeholder: item.placeholder || '',
          label: item.label || item.name || '',
          // fields: item.fields || null
        }))
      });
    }


  }, [userschemafields, fieldsdata]);


  //, THEN WE GET LATEST FIELDS FROM REDUX - TO SEND EM
  useEffect(() => {

    if (!reduxfieldsdata) {
      return
    }
    let fieldswithdataifany2 = Object.values(reduxfieldsdata).map((field) => {
      return {
        name: field.name,
        content: field.content,
      }
    })
    //  setFieldsWithDataIfAny(fieldswithdataifany2);
  }, [reduxfieldsdata]);

  // Emails a reset link; the result shows next to the button.
  const [passwordState, setPasswordState] = useState({ status: '', text: '' });
  const shield = useShield();
  const changepassword = async () => {
    setPasswordState({ status: 'sending', text: '' });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/forgotpasswordrequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: useremail, shield: await shield.take() }),
      });
      if (response.status === 429) {
        setPasswordState({ status: 'error', text: 'You tried too many times. Please try again later.' });
      } else if (response.ok) {
        setPasswordState({ status: 'sent', text: `We sent a reset link to ${useremail}. It works for 1 hour.` });
      } else {
        const data = await response.json().catch(() => ({}));
        setPasswordState({ status: 'error', text: data.message || "Couldn't send the reset link. Please try again." });
      }
    } catch {
      setPasswordState({ status: 'error', text: "Couldn't reach the server. Please try again." });
    }
  }
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
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const sendfields = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/updateuserprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({
          fields: reduxfieldsdata,
          userId: userId,
          userRole: userRole,
          ...(askStaffOtp ? { otp: staffOtp } : {}),
        }),
        credentials: 'include', // Include cookies in the request
      });

      const data = await sendfields.json();
      if (!sendfields.ok) {
        if (data.code === 'staff_otp_required' || data.code === 'staff_2fa_off' || data.code === 'staff_otp_locked') {
          setAskStaffOtp(data.code === 'staff_otp_required');
          setStaffOtp('');
          setSuccessmessage('');
          setErrormessage(data.message);
          return;
        }
        if (data.error === 'DUPLICATE_VALUE') {
          setErrormessage(`Failed to update user profile - ${data.field} already exists`);
          return;
        }
        setSaved(false);
        setErrormessage('Failed to update user profile. Please try again.');
        setSuccessmessage('');
      }
      else {
        /*  if (!sendfields.ok) {
         console.warn('sendfieldsnotok') */
        /*  if (data?.code === 11000) {
           const field = Object.keys(data.keyPattern || {})[0];
           setErrorSave(`${field} already exists`);
         } else {
           setErrormessage(data?.message || 'Failed to update user profile. Please try again.');
         } */
        /*  console.log(sendfields, 'sendfiedsfrom if !ok')
         setSaved(false);
         setSuccessmessage('');
         return; */
        /*  ;
        
         return; */
        /*  } */

        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
        setSuccessmessage('User profile updated successfully');
        setAskStaffOtp(false);
        setStaffOtp('');
        setErrormessage('');
        setErrorSave('')
      }
    }

    catch (error) {
      console.error(error, 'error')
      if (error?.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        setErrorSave(`${field} already exists`);
        setSuccessmessage('');
        return;
      }
      console.log('Error updating user profile:', error);
      setSaved(false);
      setSuccessmessage('');
      setErrormessage('Failed to update user profile. Please try again.');
    }



  }

  const [showModal, setShowModal] = useState(false);
  // Turning 2FA off needs a current code from the app (the API refuses without one).
  const [askDisableCode, setAskDisableCode] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [useRecovery, setUseRecovery] = useState(false);
  const [askNewCodes, setAskNewCodes] = useState(false);
  const [newCodesOtp, setNewCodesOtp] = useState('');
  const [newCodes, setNewCodes] = useState(null);

  const getModalAnswer = (answer) => {
    if (answer) {
      setAskDisableCode(true);
      setShowModal(false);
    }
    else {
      //IF NO, CLOSE MODAL
      setShowModal(false);
    }
  }

  //,here do fetch disable 

  const disable2fa = async () => {
    const csrf = document.cookie.split('; ').find(c => c.startsWith('csrfToken='))?.slice('csrfToken='.length) || '';
    const fetchdisable2fa = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/disable2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrf,
      },
      body: JSON.stringify(!disableCode ? {} : useRecovery ? { recovery: disableCode.trim() } : { otp: disableCode.trim() }),
      credentials: 'include', // Include cookies in the request
    });
    const data = await fetchdisable2fa.json().catch(() => ({}));
    if (!fetchdisable2fa.ok) {
      setErrormessage(data.error || 'Failed to disable Two-factor Authentication');
      return;
    }
    setErrormessage('');
    setAskDisableCode(false);
    setDisableCode('');

    if (recovered) {
      router.push(data.setup2fa ? '/dash/users/profile/twofactor?required=1' : '/dash/users/profile/twofactor');
      return;
    }
    setTriggerFetch(triggerfetch + 1); // Increment trigger to re-fetch data


  }

  // A fresh set of recovery codes; the old ones stop working.
  const replaceCodes = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/recoverycodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfTokenFromCookies(),
      },
      body: JSON.stringify({ otp: newCodesOtp }),
      credentials: 'include',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setErrormessage(data.error || 'Could not make new recovery codes');
      return;
    }
    setErrormessage('');
    setAskNewCodes(false);
    setNewCodesOtp('');
    setNewCodes(data.recoveryCodes);
    setRecoveryLeft(data.recoveryCodes.length);
  }
  const [deleteError, setDeleteError] = useState('');
  // The server asks an account with no password or 2FA to sign in again with
  // Google or GitHub first, naming which.
  const [deleteReauth, setDeleteReauth] = useState([]);
  const deleteClick = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setDeleteError('');
    setShowModaldelete(true);

  }

  const deleteprofile = async ({ password, otp }) => {
    const csrf = document.cookie.split('; ').find(c => c.startsWith('csrfToken='))?.slice('csrfToken='.length) || '';
    let fetchdelete;
    try {
      fetchdelete = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/deleteuserprofile`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
          credentials: 'include',
          body: JSON.stringify({ password: password || undefined, otp: otp || undefined }),
        });
    } catch {
      setDeleteError("Couldn't reach the server. Please try again.");
      return;
    }
    if (!fetchdelete.ok) {
      const data = await fetchdelete.json().catch(() => ({}));
      setDeleteError(data.error || data.message || "Couldn't delete your profile. Please try again.");
      setDeleteReauth(Array.isArray(data.reauth) ? data.reauth : []);
      return;
    }
    setDeleteError('');
    const data = await fetchdelete.json();
    if (data.profiledeleted) router.push('/users/deletedconfirm');
  }

  const noPassword = signInMethods?.password === false;
  const statusMsg = errorsave || errormessage || successmessage;
  const statusTone = errorsave || errormessage ? ' is-error' : ' is-success';

  return (
    <>
      <ModalYesNo
        textchoice={`Are you sure you want to disable Two-factor Authentication?`}
        isOpen={showModal}
        changeOpen={setShowModal}
        getModalAnswer={getModalAnswer}
        buttontextconfirm="Yes"
        buttontextcancel="No"
        context="delete"
      />
      <DeleteProfile
        textchoice={`Are you sure you want to permanently delete your profile and all the analytics data? Type 'deleteprofile' to confirm.`}
        isOpen={showModaldelete}
        changeOpendelete={setShowModaldelete}
        onDelete={deleteprofile}
        askCode={twofactorenabled}
        error={deleteError}
        reauthWith={deleteReauth}
        hasPassword={signInMethods?.password !== false}
        email={useremail}
      />
      {!loaded && (errormessage
        ? <p className="ui-status is-error" role="alert">{errormessage}</p>
        : <p className="ui-help">Loading profile…</p>)}

      {fieldswithdataifany && fieldswithdataifany.length > 0 && (
        <div className="profile-page">
          <ReorderableTabs section="profile" className="ui-tabs" role="tablist" aria-label="Profile">
            {tabs.map(([key, label, icon]) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} data-tab-id={key} data-tab-label={label}
                className={`ui-tab${tab === key ? ' is-on' : ''}`} style={{ '--tab-icon-hue': tabIconHue(icon) }} onClick={() => setTab(key)}>
                <TabIcon name={icon} />
                {label}
              </button>
            ))}
          </ReorderableTabs>

          {/* Hidden rather than unmounted, so unsaved edits survive a tab switch. */}
          <form className="ui-card" onSubmit={onSubmit} hidden={tab !== 'account'}>
            <header className="ui-card-head">
              <div>
                <h3>Account</h3>
                <p>Your name and email address. Your email is also where reports and alerts are sent.</p>
              </div>
            </header>
            <div className="ui-card-body profile-fields">
              {fieldswithdataifany.map((field, index) => (
                <FieldRenderer
                  key={index}
                  name={field.name}
                  value={field.value || ''}
                  type={field.type}
                  required={field.required || ''}
                  placeholder={field.placeholder || ''}
                  label={field.label || field.name || ''}
                  source="userprofile"
                  fielddata={field}
                  onChange2={(name, value) => { }}
                />
              ))}
              {canSetRole && (
                <div className="ui-field">
                  <label className="ui-label" htmlFor="profile-role">Role</label>
                  <select id="profile-role" className="ui-input ui-input-sm profile-role" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                    {roleOptions.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
                  </select>
                  <p className="ui-help">What this account can do in the content manager. Saved with the profile.</p>
                </div>
              )}
              <input type="hidden" value={userId} onChange={() => { /* no-op */ }} />
            </div>
            <footer className="ui-card-foot">
              {statusMsg && <span className={`ui-status${statusTone}`} role="status">{statusMsg}</span>}
              {askStaffOtp && (
                <input
                  className="ui-input ui-input-sm"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6-digit code"
                  aria-label="Code from your own authenticator app"
                  value={staffOtp}
                  onChange={(e) => setStaffOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              )}
              <button type="submit" className="ui-btn ui-btn-primary" disabled={askStaffOtp && staffOtp.length !== 6}>{saved ? 'Saved' : 'Save changes'}</button>
            </footer>
          </form>

          {/* Your own plan and credits are on Billing; this is for staff looking at someone else. */}


          {tab === 'appearance' && <Appearance />}


          {tab === 'security' && <section className="ui-card">
            <header className="ui-card-head">
              <div>
                <h3>Security</h3>
                <p>How you sign in.</p>
              </div>
            </header>
            <div className="profile-rows">
              <div className="profile-row">
                <div>
                  <span className="ui-label">Password</span>
                  <p className="ui-help">
                    {noPassword
                      ? 'You sign in with Google or GitHub. We email you a link to choose a password as well.'
                      : 'We email you a link to choose a new password.'}
                  </p>
                  {passwordState.text && (
                    <p className={`ui-status ${passwordState.status === 'error' ? 'is-error' : 'is-success'}`} role="status">
                      {passwordState.text}
                    </p>
                  )}
                </div>
                <button type="button" className="ui-btn ui-btn-secondary" onClick={() => changepassword()}
                  disabled={passwordState.status === 'sending' || !useremail}>
                  {passwordState.status === 'sending' ? 'Sending…' : passwordState.status === 'sent' ? 'Send again' : noPassword ? 'Choose a password' : 'Change password'}
                </button>
              </div>
              {/* Connect and remove act on the signed-in account, like 2FA below. */}
              {ownProfile && signInMethods && <SignInMethods methods={signInMethods} onChange={setSignInMethods} />}
              <div className="profile-row">
                <div>
                  <span className="ui-label">
                    Two-factor authentication{' '}
                    <span className={`ui-badge${twofactorenabled ? ' is-success' : ''}`}>{twofactorenabled ? 'On' : 'Off'}</span>
                  </span>
                  <p className="ui-help">Ask for a code from your authenticator app as well as your password.</p>
                </div>
                {/* disable2fa and deleteuserprofile act on the signed-in account,
                    so on someone else's profile they'd hit the admin's own. */}
                {!ownProfile ? null : !twofactorenabled ? (
                  <button type="button" className="ui-btn ui-btn-primary" onClick={() => router.push('/dash/users/profile/twofactor')}>
                    Enable
                  </button>
                ) : askDisableCode ? (
                  <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); disable2fa(); }}>
                    <input
                      className="ui-input"
                      inputMode={useRecovery ? 'text' : 'numeric'}
                      autoComplete={useRecovery ? 'off' : 'one-time-code'}
                      maxLength={useRecovery ? 32 : 6}
                      placeholder={useRecovery ? 'Recovery code' : '6-digit code'}
                      aria-label={useRecovery ? 'Recovery code' : 'Code from your authenticator app'}
                      value={disableCode}
                      onChange={(e) => setDisableCode(useRecovery ? e.target.value : e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                    <button type="submit" className="ui-btn ui-btn-secondary" disabled={useRecovery ? disableCode.trim().length < 10 : disableCode.length !== 6}>
                      Turn off
                    </button>
                    <button type="button" className="ui-btn ui-btn-link" onClick={() => { setUseRecovery(!useRecovery); setDisableCode(''); }}>
                      {useRecovery ? 'Use my app' : 'Lost your phone?'}
                    </button>
                    <button type="button" className="ui-btn ui-btn-link" onClick={() => { setAskDisableCode(false); setDisableCode(''); setUseRecovery(false); }}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button type="button" className="ui-btn ui-btn-secondary" onClick={() => setShowModal(true)}>
                    Disable
                  </button>
                )}
              </div>
              {ownProfile && twofactorenabled && recovered && (
                <div className="profile-row">
                  <div>
                    <span className="ui-label">You logged in with a recovery code</span>
                    <p className="ui-help">Lost your phone? Turn this off, then set it up again on your new one.</p>
                  </div>
                  <button type="button" className="ui-btn ui-btn-primary" onClick={disable2fa}>Turn off and set up again</button>
                </div>
              )}
              {ownProfile && twofactorenabled && (
                <div className="profile-row">
                  <div>
                    <span className="ui-label">Recovery codes</span>
                    <p className="ui-help">{recoveryLeft} left. Each one gets you in once if you lose your phone.</p>
                  </div>
                  {askNewCodes ? (
                    <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); replaceCodes(); }}>
                      <input
                        className="ui-input"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="6-digit code"
                        aria-label="Code from your authenticator app"
                        value={newCodesOtp}
                        onChange={(e) => setNewCodesOtp(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                      />
                      <button type="submit" className="ui-btn ui-btn-secondary" disabled={newCodesOtp.length !== 6}>Get new codes</button>
                      <button type="button" className="ui-btn ui-btn-link" onClick={() => { setAskNewCodes(false); setNewCodesOtp(''); }}>Cancel</button>
                    </form>
                  ) : (
                    <button type="button" className="ui-btn ui-btn-secondary" onClick={() => setAskNewCodes(true)}>New codes</button>
                  )}
                </div>
              )}
              {newCodes && <RecoveryCodes codes={newCodes} onSaved={() => setNewCodes(null)} />}
            </div>
          </section>}
          {ownProfile && tab === 'security' && <RecentSignIns />}

          {ownProfile && tab === 'account' && <section className="ui-card profile-danger">
            <header className="ui-card-head">
              <div>
                <h3>Danger zone</h3>
              </div>
            </header>
            <div className="profile-rows">
              <div className="profile-row">
                <div>
                  <span className="ui-label">Delete profile</span>
                  <p className="ui-help">Permanently deletes your profile and all its analytics data. This can&apos;t be undone.</p>
                </div>
                <button type="button" className="ui-btn ui-btn-danger" onClick={(e) => deleteClick(e)}>Delete profile</button>
              </div>
            </div>
          </section>}
        </div>
      )}
    </>
  );
}
