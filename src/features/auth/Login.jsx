'use client';
import './loginregister.css'
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import customSessionStorage from '@/lib/customSessionStorage';
import SocialLoginButtons from './SocialLoginButtons';
import PasswordInput from './PasswordInput';
import { signInMessage } from './signInProviders';
import { useDispatch, useSelector } from 'react-redux';
import {
  setEnableUserRegistration
} from '@/redux/slices/DashSlice';
import { useNonce } from '@/hooks/useNonce'
import { useShield } from './useShield';
import { safeNext } from './safeNext';
import SiteGooseLogo from '@/components/ui/SiteGooseLogo.jsx';
export default function Login({ showForgotCallback }) {
  const nonce = useNonce()
  const shield = useShield();

  const router = useRouter();
  const dispatch = useDispatch();

  const { register, watch, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
  const [message, setMessage] = useState(null); // State for UI messages
  const showForgotPassword = false; // State to control the visibility of the forgot password component

  const enableuserregistration = useSelector((state) => state.DashSlice.enableuserregistration); // Access the enableuserregistration state from Redux


  // The activation link in the sign-up email lands here, and so does a
  // Google or GitHub sign-in that didn't work.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('activated') === '1') {
      setMessage({ type: 'success', text: 'Your email is verified. You can log in now.' });
    } else if (params.get('error') === 'activation_invalid') {
      setMessage({ type: 'error', text: 'That activation link has expired or was already used. Log in and we will email you a new one.' });
    } else {
      const signIn = signInMessage(params.get('error'));
      if (signIn) setMessage(signIn);
    }
  }, []);
  //SET CONTEXT STATE TO EMAIL ON CHANGE

  useEffect(() => {



    //FETCH HERE TO SEE IF PUBLIC REGISTRATION IS ENABLED OR NOT 
    const asyncfetch = async () => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/users/getuserpublicreg`;
      console.log(url, 'url getuserpublic');
      const fetchuserpublicreg = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

        },
        credentials: 'include' // This is importan t for cookies to be sent
      }
      )
      if (!fetchuserpublicreg.ok) {
        // console.log('Failed to fetch user public registration status');
        console.log('failed fetch');
        console.log(fetchuserpublicreg, 'fetchfailed');
        return;
      }
      console.log(fetchuserpublicreg, 'fetchuserpublicreg')
      const data = await fetchuserpublicreg.json();
      console.log(data, 'data from getuserpublicreg');
      let ispublicregyes = data.publicuserregistration

      console.log(ispublicregyes, 'ispublicregyes from getuserpublicreg');
      dispatch(setEnableUserRegistration(ispublicregyes)); // Dispatch action to set enableuserregistration state in Reduxc

    }
    asyncfetch();
  }, []);


  useEffect(() => {

    // Save email to session storage
    customSessionStorage.setItem("email", watch("email") || "");

  }, [watch('email')]);

  const onSubmit = async (data) => {

    let url
    try {
      url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/users/login`);
      console.log('Constructed URL:', url.toString());
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // With spam protection's answer, checked before the password.
        body: JSON.stringify({ ...data, shield: await shield.take() }),
        credentials: 'include' // THIS is what allows Set-Cookie to work
      });
      console.log(response, 'response');

      if (!response.ok) {
        console.log('issue with fetch');
        const errorData = await response.json().catch(() => ({}));
        const showServerMessage = errorData.error === "shield" || errorData.error === "firewall" || response.status === 429 || errorData.status === "emailnotverified" || errorData.status === "codenotsent";
        setMessage({ type: 'error', text: showServerMessage ? errorData.message : "Login failed" });
        setError("apiError", { message: errorData.message || "Login failed" });
        return;

      }
      if (response.ok) {
        console.log('Login response ok ');
        const data = await response.json();
        // e.g. back to a team invitation; it has to survive the code page too.
        const next = safeNext(new URLSearchParams(window.location.search).get('next'));
        const nextParam = next ? `next=${encodeURIComponent(next)}` : '';
        if (data.verifyotpredirect === true) {
          router.push(`/users/verifyotp${nextParam ? `?${nextParam}` : ''}`); // Redirect to verify OTP page if two-factor authentication is enabled
        }
        else if (data.verifyemailcode === true) {
          router.push(`/users/verifyotp?via=email${nextParam ? `&${nextParam}` : ''}`);
        }
        else if (data.setup2fa === true) {
          router.push(`/dash/users/profile/twofactor?required=1${nextParam ? `&${nextParam}` : ''}`);
        }
        else {
          console.log('Login successful:  ');
          router.push(next || '/dash');
        }

      }
      // Handle login logic here, e.g., API call
    }

    catch (error) {
      console.log('an error occurred', error);
      setMessage({ type: 'error', text: "An unexpected error occurred" });
      setError("apiError", { message: "An unexpected error occurred" });
    } finally {
      // Clear the error state to allow resubmission
      setTimeout(() => {
        setMessage(null);
        clearErrors("apiError");
      }, 3000); // Optional: Clear after 3 seconds
    }
  }

  return (
    <>

      <div className="cardouterdiv">
        <div className="auth-card">
          <div className="flex items-center justify-center mb-6">
            <SiteGooseLogo size="lg" />
          </div>

          <h4 className="auth-title poppinsSemiBold">Sign in</h4>
          <p className="auth-subtitle">Welcome back.</p>

          <SocialLoginButtons />
          <div className="auth-divider" role="separator">or</div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="fieldcombo">
              <label className="auth-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                autoComplete="username"
                placeholder=""
                className={`auth-input${errors.email ? ' is-invalid' : ''}`}
                {...register("email", { required: "email is required" })}
              />
              {errors.email && <p className="auth-error">{errors.email.message}</p>}
            </div>
            <div className="fieldcombo">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                invalid={!!errors.password}
                input={register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="auth-error">{errors.password.message}</p>}
            </div>
            {message && (
              <p className={`text ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {message.text}
              </p>
            )}
            <button className="ui-btn ui-btn-primary auth-submit" type="submit">
              <strong>Sign in</strong>
            </button>
          </form>

          <div className="auth-switch is-split">

            <button type="button" onClick={() => showForgotCallback(true)} className="ui-btn ui-btn-link rrforgotpass">
              Forgot password?
            </button>
            {
              enableuserregistration && (

                <button type="button" onClick={() => router.push(`./register${window.location.search}`)} className="ui-btn ui-btn-link rrregsiter">
                  Create account
                </button>
              )
            }
          </div >

        </div >
      </div >


    </>
  );
}