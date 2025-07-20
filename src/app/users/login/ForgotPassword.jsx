import customSessionStorage from '@/utilities/customSessionStorage';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPassword({ onBack }) {
  const Fpfref = useRef('');
  const [emailstate, setEmailstate] = useState(() => customSessionStorage.getItem("email"));
  const [sending, setSending] = useState(false);
  const [successmessage, setSuccessmessage] = useState(null);

  const [errormessage, setErrormessage] = useState(null);
  useEffect(() => {
    const handler = () => setEmailstate(customSessionStorage.getItem("email"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const onchangeNothing = (e) => {
    setEmailstate(e.target.value);
    // customSessionStorage.setItem("email", e.target.value);

  }
  useEffect(() => {
    // Push a custom state to the history stack when the component mounts
    window.history.pushState({ isForgotPassword: true }, '');

    const handlePopState = (event) => {
      // Check if the state is from the ForgotPassword component
      if (event.state && event.state.isForgotPassword) {
        onBack(); // Trigger the callback to show the previous component
      }
    };

    // Listen for the browser's back button
    window.addEventListener('popstate', handlePopState);

    return () => {
      // Cleanup the event listener
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onBack]);

  //for whe nuser hits back / forward on browser history
  const submitPasswordForgot = async () => {
    setSending(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/forgotpasswordrequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: emailstate }),
    });
    /*  const response =
     {
       status: 200
     } */
    if (
      response.status === 429
    ) {
      setErrormessage("You tried too many times. Please try again later.");
    }
    if (
      response.status === 200
    ) {
      setSending(false);

      setSuccessmessage("If that email address exists in our system, we've sent a password reset link.");
      //setErrormessage("Reset link sent to your email");

    }
  }
  //BEST PRACTICES -> IF THAT EMAIL EXISTS, WE HAVE SENT THE LINK (we cannot cofirm for security reasons)

  return (
    <>

      <div className="cardouterdiv forgot-password-container loginouterdivhigherup pb-100">
        <div className="card cardpwordforgot">
          <h1 className="cardh1">Forgot Password</h1>
          <div className="flex flex-col gap-6">
            {!successmessage && (
              <>
                <p className="pb-4">Please enter your email address to reset your password.

                </p>


                <input ref={Fpfref} value={emailstate} type="email" placeholder="Email" required onChange={onchangeNothing} />
                <button className="button button-primary" type="submit"
                  onClick={submitPasswordForgot}
                >Send Reset Link</button>

                <p>Remembered your password? <strong className="cursor-pointer" onClick={onBack}> Login</strong></p>
              </>
            )}
            {errormessage && (
              <div className="text-red-500 text-center">
                {errormessage}
              </div>
            )}
            {successmessage && (
              <div className="text-green-500 text-center">
                {successmessage}
              </div>
            )}
          </div>
        </div>
      </div >
    </>
  );
}