'use client'
import { useState } from "react";
//redirect client compnent impor t
import { useRouter } from "next/navigation";
import CodeBoxes from "./CodeBoxes";
import { safeNext } from "./safeNext";

const NOT_REACHED = 'We could not reach the server. Please try again.';

export default function VerificationDigits({ email }) {
  const router = useRouter();

  const [errormessagecontent, setErrorMessageContent] = useState('');
  const [expiredshowbtton, setExpiredShowButton] = useState(false);
  const [switchscreensonsuccessshow, setSwitchScreenOnSuccessShow] = useState(false);
  const [messagereissue, setMessageReissue] = useState(false);
  const [boxesKey, setBoxesKey] = useState(0); // A new key empties the boxes

  //! we will do fetch when complete
  async function whenCompleteVerify(alldigitsString) {
    setErrorMessageContent('');
    setMessageReissue(false);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verifyrandom6digits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Sends the sign-up browser's cookie, and takes the session back.
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          digits: alldigitsString
        }),
      });
      if (response.ok) {
        setExpiredShowButton(false);
        const result = await response.json().catch(() => ({}));
        if (result.loggedIn) {
          // Signed in by the code: straight on, to checkout when a plan was picked.
          router.push(safeNext(new URLSearchParams(window.location.search).get('next')) || '/dash');
          return true;
        }
        setSwitchScreenOnSuccessShow(true);
        // Keep ?next= (e.g. back to /pricing to finish choosing a plan).
        setTimeout(() => {
          router.push(`/users/login${window.location.search.includes('next=') ? window.location.search : ''}`);
        }, 2000);
        return true;
      }
      const data = await response.json().catch(() => ({}));
      if (data.error === 'codeexpired') {
        setErrorMessageContent(data.message === '6 digit code expired' || !data.message ? 'Code expired. Please request a new code.' : data.message);
        setExpiredShowButton(true);
      } else if (response.status === 400) {
        setErrorMessageContent("That code didn't work. Please check it and try again.");
      } else if (response.status === 429 && data.message) {
        // Too many tries: saying the code is wrong would have them keep retyping it.
        setErrorMessageContent(data.message);
      } else {
        setErrorMessageContent('Something went wrong on our side. Please try again.');
      }
    } catch {
      setErrorMessageContent(NOT_REACHED);
    }
    return false;
  }

  const Triggerfreshdigits = async () => {
    setErrorMessageContent('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reissueverifydigits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      if (!response.ok) {
        setErrorMessageContent("We couldn't send a new code. Please try again in a few minutes.");
        return;
      }
      setMessageReissue(true);
      setExpiredShowButton(false);
      setBoxesKey((key) => key + 1);
    } catch {
      setErrorMessageContent(NOT_REACHED);
    }
  };

  return (
    <div className="verifycard">
      {switchscreensonsuccessshow && (
        <p className="text-green-500  text-center pt-5">Verification successful. Redirecting to login page.</p>
      )}
      {!switchscreensonsuccessshow && (
        <>
          <h2 className="pb-5">Verify your email address</h2>
          <p className="pb-5">We have sent a 6 digit code to  {email}. Please enter it below to verify your account.</p>
          {/* A taken address gets this same screen; the email tells its owner to log in instead. */}
          <p className="pb-5 text-sm">Already have an account with this address? Then we've emailed you how to log in instead.</p>

          <CodeBoxes key={boxesKey} onComplete={whenCompleteVerify} />

          {errormessagecontent && (
            <p className="text-red-500 italic text-center pt-5" role="alert">{errormessagecontent}</p>
          )}
          {expiredshowbtton && (
            <button type="button" className="ui-btn ui-btn-link underline" onClick={() => Triggerfreshdigits()}>Request a new code</button>
          )}
          {messagereissue && (
            <p className="text-green-500 italic text-center pt-5">New code sent to {email}</p>
          )}
        </>
      )}
    </div>
  );
}
