'use client';
import './loginregister.css'
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image from next/image
import customSessionStorage from '@/utilities/customSessionStorage';
import GoogleLoginButton from './GoogleLoginbutton'; // Import GoogleLoginButton component
import { useDispatch, useSelector } from 'react-redux';
import {
  setEnableUserRegistration
} from '@/redux/slices/DashSlice';

import { useNonce } from '@/hooks/useNonce'
export default function Login({ showForgotCallback }) {
  const nonce = useNonce()

  const router = useRouter();
  const dispatch = useDispatch();

  const { register, watch, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
  const [message, setMessage] = useState(null); // State for UI messages
  const showForgotPassword = false; // State to control the visibility of the forgot password component

  const enableuserregistration = useSelector((state) => state.DashSlice.enableuserregistration); // Access the enableuserregistration state from Redux
  //SET CONTEXT STATE TO EMAIL ON CHANGE

  useEffect(() => {



    //FETCH HERE TO SEE IF PUBLIC REGISTRATION IS ENABLED OR NOT 
    const asyncfetch = async () => {
      const fetchuserpublicreg = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/getuserpublicreg`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // This is importan t for cookies to be sent
        }
      )
      if (!fetchuserpublicreg.ok) {
        // console.log('Failed to fetch user public registration status');
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
    console.log(data);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include' // THIS is what allows Set-Cookie to work
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage({ type: 'error', text: "Login failed" });
        setError("apiError", { message: errorData.message || "Login failed" });
        return;

      }
      if (response.ok) {
        const data = await response.json();
        if (data.verifyotpredirect === true) {
          router.push('/users/verifyotp'); // Redirect to verify OTP page if two-factor authentication is enabled
        }
        else {
          console.log('Login successful:  ');
          router.push('/dash');
        }

      }

      // Handle login logic here, e.g., API call
    }

    catch (error) {
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
        <div className="card">
          {/* flex flex-col items-center justify-center h-screen */}
          <div className="flex items-center justify-center mb-8">
            <Image className="logocolor" src="/images/logo/logocolor.svg" alt="Logo" width={50} height={50} />
            <span className="poppinsSemiBold  text-black">Alpine<span className="logocolortest">Web</span></span>
          </div>


          <h4 className="pb-8 poppinsSemiBold text-center ">Login</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="fieldcombo">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="email"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                {...register("email", { required: "email is required" })}
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
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
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
            </div>
            {message && (
              <p className={`text mb-4 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {message.text}
              </p>
            )}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="button butt/*  */on-primary button-wide"
              >
                Login
              </button>
            </div>
          </form>
          {enableuserregistration && (
            <div><GoogleLoginButton /></div>
          )}

          <div className="pt-8 text-blue-500 text-xl text-right font-normal flex flex-row justify-between">
            <button onClick={() => showForgotCallback(true)} className="text-blue-500 hover:text-blue-700">Forgot Password</button>
            {enableuserregistration && (
              <button onClick={() => router.push('./register')} className="text-blue-500 hover:text-blue-700 rrregsiter">Register</button>
            )}

          </div>

        </div>
      </div>


    </>
  );
}