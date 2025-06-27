
'use client';

import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


export default function UserProfile() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const searchParams = useSearchParams();
  const useridparams = searchParams.get('userid'); // Get user ID from URL parameters
  const [userRole, setUserRole] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [errorsave, setErrorSave] = useState('');

  const [errormessage, setErrormessage] = useState('');
  const [successmessage, setSuccessmessage] = useState('');

  const currentuserrole = useSelector((state) => state.DashSlice.userrole);
  useEffect(() => {
    const asyncfunctionfetchuserprofile = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/userprofile?userid=${useridparams}`, {
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
        setValue('userid', data._id); // Set user ID
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
      // setSending(false);
      setSuccessmessage("We have sent a password reset link to your email.");
      //setErrormessage("Reset link sent to your email");

    }
  }

  const onSubmit = async (data) => {

    const formData = new FormData();
    for (const key in data) {
      console.log("Appending key:", key, "with value:", data[key]);
      if (data) {
        formData.append(key, data[key])
        console.log(typeof data[key], 'typeofdata[key]');
      }
    }

    console.log(data, 'datasubmit');
    console.log(formData, 'formDatasubmit');
    console.log(typeof formData, 'typeofformData');
    let stringdata = JSON.stringify(data);
    console.log('stringdata', JSON.stringify(data));

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/updateuserprofile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: stringdata,
      credentials: 'include', // Include cookies in the request
    });

    if (!response.ok) {
      console.log('fetchnotok');
      setSaved(false);
      setErrorSave('Failed to update user profile. Please try again.');
      return;
    }
    if (response.ok) {
      console.log('fetchnook');
      setSaved(true);
      setErrorSave('');
      const data = await response.json();
      console.log('User profile updated successfully:', data);
      //timout
      setTimeout(() => {
        setSaved(false);
      }, 3000); // Reset saved state after 3 seconds
    }
  }

  return (
    <>


      <form onSubmit={handleSubmit(onSubmit)} className="userprofileform card">
        <div className="flex flex-row justify-between items-center align-center">
          <h1 className="pb-10"> User profile</h1>
          <button className="button button-primary " type="submit">
            {saved ? 'Saved!' : 'Save'}
            {errorsave && <span className="text-red-500">{errorsave}</span>}
          </button>
        </div>
        <label htmlFor="username">Username</label>
        <input placeholder="Username" {...register("username", {})} />
        <label htmlFor="email">Email Address</label>
        <input placeholder="Email Address" type="email" {...register("email", { required: true })} />
        <div >
          <label htmlFor="password">Password: </label>
          <button className="button button-outline changepassbutton" onClick={() => changepassword()}>Change password</button>
          <div><span className="text-green-500">{successmessage}</span>
            <span className="text-red-500"> {errormessage}</span>
          </div>

        </div>
        <div className="mt-4"><label htmlFor="role">Role:  </label> <span>{userRole}</span>
        </div>

        {/* */}
        {currentuserrole === 'admin' || currentuserrole === 'superadmin' && (
          <div>

            <label htmlFor="">Edit Role: </label>
            <select {...register("userrole")} >

              <option value="">Select role</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Editor</option>
              <option value="user">Author</option>
              <option value="contributor">Contributor</option>
              <option value="registered">Registered</option>
            </select>
          </div>
        )}
        <input type="hidden" {...register('userid')} />



      </form>
      <style jsx>{`
          .userprofileform {
            margin-top: 0px;
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