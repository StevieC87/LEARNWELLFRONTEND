"use client"; // Add this line if you're using Next.js App Router and client-side hooks

import '@/features/auth/loginregister.css'
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import VerificationDigits from '@/features/auth/Verificationdigits';
import TermsAgreement from '@/features/auth/TermsAgreement';
import SocialLoginButtons from '@/features/auth/SocialLoginButtons';
import { safeNext } from '@/features/auth/safeNext';
import { useShield } from '@/features/auth/useShield';
import { PASSWORD_LENGTH_MESSAGE, PASSWORD_MAX, PASSWORD_MIN } from '@/features/auth/passwordRules';
import PasswordInput from '@/features/auth/PasswordInput';
import SiteGooseLogo from '@/components/ui/SiteGooseLogo.jsx';



const formatWait = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm();
  const [message, setMessage] = useState(null); // State for UI messages
  const password = watch('password');

  const [showsixdigitsverify, setshowsixdigitsverify] = useState(false);
  const [disableresubmit, setdisableresubmit] = useState(false);
  const [submitbuttonloading, setSubmitButtonLoading] = useState(false);
  // Turned away by the sign-up limit: the button stays off until the time is up.
  const [waitseconds, setWaitSeconds] = useState(0);
  const waituntil = useRef(0);
  const waiting = waitseconds > 0;
  const shield = useShield('checkbox');

  const token = searchParams.get('token') || "";
  // From a site team invitation: the account joins that site once created.
  const teaminvite = searchParams.get('teaminvite') || "";
  const emailquery = searchParams.get('email');
  const [useremail, setUserEmail] = useState(emailquery);
  // Sent here by a plan's button on the pricing page: say checkout comes next.
  const planKey = (() => {
    const next = safeNext(searchParams.get('next'));
    if (!next?.startsWith('/pricing?')) return '';
    const query = new URLSearchParams(next.slice('/pricing?'.length));
    return query.get('checkout') === '1' ? (query.get('plan') || '') : '';
  })();
  const planName = /^[a-z]+$/.test(planKey) ? planKey[0].toUpperCase() + planKey.slice(1) : '';


  useEffect(() => {
    setUserEmail(watch("email") || "");

  }, [watch('email')]);

  useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(() => {
      setWaitSeconds(Math.max(0, Math.ceil((waituntil.current - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [waiting]);




  // ---------- SUBMIT FETCH REGISTER-------------------

  const onSubmit = async (data) => {
    if (!shield.ticked()) {
      shield.nudge();
      setMessage({ type: 'error', text: "Please tick \u201cI'm not a robot\u201d." });
      return;
    }
    setdisableresubmit(true);
    // Spam protection's answer; the server checks it before anything else.
    data.shield = await shield.take();

    data.token = token;
    if (teaminvite) data.teaminvite = teaminvite;

    try {
      setSubmitButtonLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include' // THIS is what allows Set-Cookie to work
      });

      if (response.status === 429) {
        // Handle rate limiting: the server says how long is left.
        const { retryAfter } = await response.json().catch(() => ({}));
        const seconds = Number(retryAfter) || 60;
        waituntil.current = Date.now() + seconds * 1000;
        setWaitSeconds(seconds);
        setSubmitButtonLoading(false);
        setMessage(null);
        setdisableresubmit(false);
        return;
      }

      else if (!response.ok) {
        setSubmitButtonLoading(false);
        const errorData = await response.json();
        if (errorData.error == "Email already exists") {
          setMessage({ type: 'error', text: "Email already exists" });
        }
        else if (errorData.error === "shield") {
          setMessage({ type: 'error', text: errorData.message });
          setdisableresubmit(false);
          return;
        }
        else {
          setMessage({ type: 'error', text: errorData.message || "Registration failed" });
          setError("apiError", { message: errorData.message || "Registration failed" });
          setdisableresubmit(false);
          return;

        }
      }

      else if (response.ok) {
        //SHOW THE VERIFICATION SCREEN FOR THE USER TO ENTER THE 6 DIGIT CODE
        // Maybe show a timer on that sucker too
        //when expires 
        console.log('Register successful:  ');
        if (!token && !teaminvite) {
          setshowsixdigitsverify(true);
        }
        else {
          //redirect to login page
          setTimeout(() => {
            setSubmitButtonLoading(false);
            setMessage({ type: 'success', text: "Verification successful. Please log in." });
          }, 2000); // Optional: Delay for better UX
          // Keep ?next= (e.g. back to /pricing to finish choosing a plan).
          const next = safeNext(searchParams.get('next')) || (teaminvite ? '/dash' : '');
          router.push(next ? `/users/login?next=${encodeURIComponent(next)}` : '/users/login');
        }
        // router.push('/dash');

      }


      // Handle login logic here, e.g., API call
    }
    catch (error) {
      setSubmitButtonLoading(false);
      setMessage({ type: 'error', text: "An unexpected error occurred" });
      setError("apiError", { message: "An unexpected error occurred" });
    } finally {
      // Clear the error state to allow resubmission
      setTimeout(() => {
        setMessage(null);
        clearErrors("apiError");
        setdisableresubmit(false);
      }, 5000); // Optional: Clear after 3 seconds */
    }
  }


  // ------------------------------------------------

  return (
    <>

      <div className="cardouterdiv">

        {showsixdigitsverify && (
          <VerificationDigits email={useremail || 'test@test.com'} />
        )}
        {!showsixdigitsverify && (

          <div className="auth-card">

            <div className="flex items-center justify-center mb-6">
              <SiteGooseLogo size="lg" />
            </div>

            <h4 className="auth-title poppinsSemiBold">{teaminvite ? 'Create an account to join your team' : 'Create an account'}</h4>
            {planName && !teaminvite && !token ? (
              <p className="auth-subtitle">Then you&apos;ll go straight to paying for {planName}.</p>
            ) : !teaminvite && !token ? (
              <p className="auth-subtitle">Free for 3 sites. No card needed.</p>
            ) : (
              <div className="mb-4" />
            )}

            {/* Invitations are for the address they were sent to, so only a plain sign-up offers Google and GitHub. */}
            {!teaminvite && !token && (
              <>
                <SocialLoginButtons verb="Sign up" />
                <div className="auth-divider" role="separator">or</div>
              </>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <div className="fieldcombo">
                <input type="hidden" value={token} onChange={() => {
                  //do nothing
                }} />

                <label className="auth-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  autoComplete="username"
                  placeholder=""
                  defaultValue={emailquery || ""}
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
                  autoComplete="new-password"
                  minLength={PASSWORD_MIN}
                  maxLength={PASSWORD_MAX}
                  invalid={!!errors.password}
                  input={register("password", { required: "Password is required", minLength: { value: PASSWORD_MIN, message: PASSWORD_LENGTH_MESSAGE }, maxLength: { value: PASSWORD_MAX, message: PASSWORD_LENGTH_MESSAGE } })}
                />
                {errors.password && <p className="auth-error">{errors.password.message}</p>}
              </div>
              <div className="fieldcombo">
                <label className="auth-label" htmlFor="passwordconfirm">
                  Confirm Password
                </label>
                <PasswordInput
                  id="passwordconfirm"
                  autoComplete="new-password"
                  minLength={PASSWORD_MIN}
                  maxLength={PASSWORD_MAX}
                  invalid={!!errors.passwordconfirm}
                  input={register("passwordconfirm",
                    { required: "Confirm your Password", validate: value => value === password || 'Passwords do not match', })}
                />
                {errors.passwordconfirm && <p className="auth-error">{errors.passwordconfirm.message}</p>}
              </div>

              <TermsAgreement
                note={false}
                input={register('acceptedTerms', { required: 'Please accept the terms to continue' })}
                error={errors.acceptedTerms?.message}
              />

              {/* Traps: off screen, so people never fill them; form-filling bots do. */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                <input type="text" id="hid" tabIndex={-1} autoComplete="off" {...register('hid', { required: false })} />
                <input type="text" id="hid2" tabIndex={-1} autoComplete="off" {...register('hid2', { required: false })} />
              </div>
              <div ref={shield.boxRef} className="shieldbox" />
              {message && (
                <p className={`text ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {message.text}
                </p>
              )}
              {waiting && (
                <p className="text text-red-500">
                  Too many sign-up attempts from your network. Try again in {formatWait(waitseconds)}.
                </p>
              )}
              <button className="ui-btn ui-btn-primary auth-submit" type="submit" disabled={disableresubmit || waiting}>
                <strong>{submitbuttonloading ? 'Creating…' : 'Create account'}</strong>
              </button>
              <p className="auth-footnote">We&apos;ll send a few emails to help you get set up. You can turn them off any time. How we handle your own data is in our <a href="/privacy" target="_blank" rel="noopener">privacy policy</a>.</p>
            </form>

            <div className="auth-switch">
              <span className="ui-help">Already have an account?</span>
              <button type="button" onClick={() => router.push(`./login${window.location.search}`)} className="ui-btn ui-btn-link rrforgotpass">
                Log in
              </button>
            </div>

          </div>
        )}
      </div>

    </>
  )

}