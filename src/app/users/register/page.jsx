"use client"; // Add this line if you're using Next.js App Router and client-side hooks

import '../login/loginregister.css'
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image from next/image
import { useSearchParams } from 'next/navigation';

import QuizInput from './Quizinput'; // Adjust the import path as necessary
import VerificationDigits from './Verificationdigits'; // Adjust the import path as necessary



export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm();
  const [message, setMessage] = useState(null); // State for UI messages
  const password = watch('password');

  const [showsixdigitsverify, setshowsixdigitsverify] = useState(false);
  const [disableresubmit, setdisableresubmit] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [submitbuttonloading, setSubmitButtonLoading] = useState(false);

  const token = searchParams.get('token') || "";
  const emailquery = searchParams.get('email');
  const [useremail, setUserEmail] = useState(emailquery);

  useEffect(() => {
    setStartTime(Date.now());

  }, []);


  useEffect(() => {
    setUserEmail(watch("email") || "");

  }, [watch('email')]);

  useEffect(() => {
    console.log(captchaPassed, "captchaPassed");
    if (captchaPassed) {
      setdisableresubmit(false);
    }
    else {
      setdisableresubmit(true);
    }

  }, [captchaPassed]);

  //--------- CAPTCHA CHILD LOGIC ------------------

  const getAnswerfromQuiz = (value) => {
    //e.preventDefault();
    console.log("getAnswerfromQuiz", value);
    setCaptchaPassed(value);
    if (value === true) {
      setCaptchaPassed(true);
      console.log("captcha passed");
    }
    else {
      setCaptchaPassed(false);
      console.log("captcha failed");
    }
    // Proceed with actual form logic
  };
  // ---------- SUBMIT FETCH REGISTER-------------------

  const onSubmit = async (data) => {
    setdisableresubmit(true);
    if (!captchaPassed) {
      setdisableresubmit(false);
      return setError("captcha", { message: "Captcha failed22" });

    }
    if (!disableiftoofast()) return console.log("Form submission rejected: sent too quickly");
    //PREVENT FORM BEING SENT TOO QUICKLY - like bot
    const currentTime = Date.now();
    if (currentTime - startTime < 2500) {
      setMessage({ type: 'error', text: "Login failed" });
      setError("apiError", { message: errorData.message || "Login failed" });
      setdisableresubmit(false);
      return;
    }

    data.token = token;

    console.log(data);
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
        // Handle rate limiting
        setSubmitButtonLoading(false);
        setMessage({ type: 'error', text: "Rate limit exceeded. Please try again later." });
        setError("apiError", { message: "Rate limit exceeded. Please try again later." });
        setdisableresubmit(false);
        return;
      }

      else if (!response.ok) {
        setSubmitButtonLoading(false);
        const errorData = await response.json();
        if (errorData.error == "Email already exists") {
          setMessage({ type: 'error', text: "Email already exists" });
        }
        else {
          setMessage({ type: 'error', text: "Registration failed" });
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
        if (!token) {
          setshowsixdigitsverify(true);
        }
        else {
          //redirect to login page
          setTimeout(() => {
            setSubmitButtonLoading(false);
            setMessage({ type: 'success', text: "Verification successful. Please log in." });
          }, 2000); // Optional: Delay for better UX
          router.push('/users/login');
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

          <div className="card">
            {/*  <span> {captchaPassed ? 'true' : 'false'}  </span> */}
            {/* flex flex-col items-center justify-center h-screen */}

            <div className="flex items-center justify-center mb-8">
              <Image className="logocolor" src="/images/logo/logocolor.svg" alt="Logo" width={50} height={50} />
              <span className="poppinsSemiBold  text-black">Alpine<span className="logocolortest">Web</span></span>
            </div>

            <h4 className="cardh1">Create an account</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="fieldcombo">
                <input type="hidden" value={token} onChange={() => {
                  //do nothing
                }} />

                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="email"
                  defaultValue={emailquery || ""}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                  {...register("email", { required: "email is required" })}
                />
                {errors.email && <p className="text-red-500 italic">{errors.email.message}</p>}
                {message && (
                  <p className={`mb-4 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                    {message.text}
                  </p>
                )}
              </div>
              <div className="fieldcombo">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <p className="text-red-500  italic">{errors.password.message}</p>}
              </div>
              <div className="fieldcombo">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="passwordconfirm"
                  placeholder="Confirm Password"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.passwordconfirm ? 'border-red-500' : ''}`}
                  {...register("passwordconfirm",
                    { required: "Confirm your Password", validate: value => value === password || 'Passwords do not match', })}
                />
                {errors.passwordconfirm && <p className="text-red-500  italic">{errors.passwordconfirm.message}</p>}
              </div>
              <div id="quiz">
                <QuizInput getquizanswer={getAnswerfromQuiz} />
              </div>
              <div className="">
                <input type="hidden" className="" id="hid" {...register('hid', { required: false })} aria-hidden="true"></input>
                <input type="text" id="hid2" {...register('hid2', { required: false })} hidden aria-hidden="true" className="" />
              </div>
              <div className="flex items-center justify-between">
                <button

                  className="button button-primary button-wide"
                  disabled={disableresubmit}
                >
                  {submitbuttonloading ? 'Creating' : 'Create account'}
                </button>
              </div>
            </form>

          </div>
        )}
      </div>

    </>
  )

  function disableiftoofast() {
    const currentTime = Date.now();
    if (currentTime - startTime < 5000) {
      console.log("Form submission rejected: sent too quickly");
      return;
    }
    else {
      return true;
    }
  }

}