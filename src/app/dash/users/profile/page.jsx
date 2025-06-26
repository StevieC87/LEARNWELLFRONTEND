
'use client';

import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [userRole, setUserRole] = useState('');
  const [useremail, setUserEmail] = useState('');
  const onSubmit = data => {
    console.log(data)
  };
  const currentuserrole = useSelector((state) => state.DashSlice.userrole);
  useEffect(() => {
    const asyncfunctionfetchuserprofile = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/userprofile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        console.error('Failed to fetch user profile:', response.statusText);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        console.log('User profile data:', data);
        setValue('username', data.username);
        setValue('email', data.email);
        setUserEmail(data.email); // Set user email for display
        setValue('userrole', data.userrole);
        console.log(data.userrole, 'userrole from profile page');
        setUserRole(data.userrole); // Set user role for display
      } else {
        console.error('Failed to fetch user profile:', response.statusText);
      }
    }
    asyncfunctionfetchuserprofile();
  }, [setValue]);

  const changepassword = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/forgotpasswordrequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: useremail }),
    });
    if (
      response.status === 429
    ) {
      setErrormessage("You tried too many times. Please try again later.");
    }
    if (
      response.status === 200
    ) {
      setSending(false);
      setSuccessmessage("We have sent a password reset link.");
      //setErrormessage("Reset link sent to your email");

    }
  }

  return (
    <>
      <h1>User profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="userprofileform">
        <label htmlFor="username">Username</label>
        <input placeholder="Username" {...register("username", { required: true })} />
        <label htmlFor="email">Email Address</label>
        <input placeholder="Email Address" type="email" {...register("email", { required: true })} />

        <div>Role: {userRole}</div>

        {/* <select {...register("userrole", { required: true })}>
          <label htmlFor=""></label>
          <option value="">Select role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select> */}
        <button className="button button-primary" type="submit">Save</button>

        <button className="button button-outline changepassbutton" onClick={() => changepassword()}>Change password</button>
      </form>
      <style jsx>{`
          .userprofileform {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            max-width: 400px;
           
          }
          .changepassbutton {
            margin-top: 10px;}
     
      `}</style>

    </>

  )
}