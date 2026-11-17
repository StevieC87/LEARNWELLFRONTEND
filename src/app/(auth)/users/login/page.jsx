"use client"; // Add this line if you're using Next.js App Router and client-side hooks
import Login from '@/features/auth/Login';
import ForgotPassword from '@/features/auth/ForgotPassword';
import { useState } from 'react';
//imoprt sessionstoarge thing


export default function LoginPage() {

  //callback
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  //callback 
  const changeForgotCallback = (value) => {
    setShowForgotPassword(value);

  }

  return (
    <>

      {showForgotPassword ? (
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />

      ) : (
        <Login showForgotCallback={changeForgotCallback} />
      )}
    </>

  )
}