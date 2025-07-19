
'use client';
import { useState } from 'react';
import './modal.css'
export default function ModalInvite(props) {

  const { isOpen, changeOpen } = props;

  if (!isOpen) return null;
  const [invitesent, setInviteSent] = useState(false);
  const callbackConfirmCancel = (confirmcancel) => {
    if (confirmcancel === 'confirm') {
      getModalAnswer(true);
    } else if (confirmcancel === 'cancel') {
      getModalAnswer(false);
    }
  }

  const onClickoutside = (e) => {
    if (e.target.className === 'modalouterdiv') {
      changeOpen(false);
    }
  }

  const [emailvalue, setEmailValue] = useState('');
  const [rolevalue, setRoleValue] = useState('');

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

    setInviteSent(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/inviteuser`;
    const response = await fetch(url, {
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
    if (!response.ok) {
      console.log("response not ok");
      console.log(response, "response");
    }
    else if (response.ok) {
      console.log("response ok");
      const data = await response.json();
      console.log(data, "data222");
      setInviteSent(true);
      setTimeout(() => {
        setInviteSent(false);
        changeOpen(false); // Close the modal after sending invite

      }, 3000); // Reset invite sent state after 3 seconds
    }

  }
  //FUNISH FUNCTONALITY
  //ADD AN X BUTTON

  return (
    <div className="modalouterdiv" onClick={(e) => onClickoutside(e)}>
      <div className="modalinner">
        <div className="flex flex-row justify-between">
          <h5>Invite Users to Manage your app</h5>

          <svg onClick={() => changeOpen(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-lg cursor-pointer" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>

        </div>
        <div className="flex flex-col">
          <span>Give other users (such as coworkers) ability to edit your app</span>
          <strong className="py-5">Invite via email</strong>
          <form className="flex flex-col" >

            <label htmlFor="email">Email address</label>
            <input type="email" name="email" onChange={(e) => setEmailValue(e.target.value)} value={emailvalue} />
            <label htmlFor="role">Role</label>
            <select name="role" id="role" onChange={(e) => setRoleValue(e.target.value)} value={rolevalue}>
              <option value="" disabled>Select a role</option>
              <option value="superadmin">Superadmin</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="author">Author</option>
              <option value="contributor">Contributor</option>
              <option value="registered">Registered</option>

            </select>
            <div className="flex flex-row justify-end">
              <button type="submit" onClick={(e) => inviteusersend(e)} className={`button button-primary ${invitesent ? 'bg-green-500' : ''} `}>
                {invitesent ? 'Invite Sent!' : 'Send Invite'}
              </button>

            </div>
          </form>
        </div>


        <div className="flex flex-row justify-between pt-5">
          {/* <button className={context === "delete" ? "button button-danger" : "button button-primary"}
        onClick={() => callbackConfirmCancel('confirm')}>

       
        </button> */}

        </div>
      </div>
    </div>
  );
}
