'use client'
//get query from url]

import { useSearchParams } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
//redirect
import { useRouter } from 'next/navigation';


export default function ResetPassword() {
  //get email and token from url
  const router = useRouter();
  const emailref = useRef();
  //const tokenref = useRef();
  const newpasswordref = useRef();
  const newpasswordconfirmref = useRef();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [passnotmatch, setpassnotmatch] = useState(false);
  const [errormessage, setErrormessage] = useState(null);
  const [successmessage, setSuccessmessage] = useState('');
  //redirect


  const onSubmit = async (e) => {
    e.preventDefault();

    //first compare two passwords 
    if (newpasswordref.current.value.length === 0) {
      // alert('Password must be at least 8 characters long');
      // setpassnotmatch(true);
      setpassnotmatch(true);

      setErrormessage("Password can't be empty");
      return
    }
    if (newpasswordref.current.value !== newpasswordconfirmref.current.value) {
      // alert('Passwords do not match');
      setpassnotmatch(true);
      setErrormessage("Passwords do not match");
      return;
    }
    setpassnotmatch(false);
    setErrormessage(null);


    const data = {
      email: email,
      password: newpasswordref.current.value,
      token: token,
      //passwordconfirm: newpasswordconfirmref.current.value,
    };
    console.log(data);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/forgotpasswordchange`;
    console.log(url, "url");
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {

      console.log('New password request sent successfully');
      setSuccessmessage('Your password has been reset successfully. Redirecting to login page...');
      //timeout
      setTimeout(() => {
        router.push('/users/login');
        setSuccessmessage('');

      }, 5000);
    }
    else {
      console.log('Error resetting password');
      console.log(result.message);
      // Handle error here, e.g., show an alert or message to the user
      //  alert('Error resetting password');
    }
  }

  return (
    <>


      <div className="cardouterdiv">
        <div className="card cardpssword">

          <h1 className="cardh1">Reset Password</h1>
          <div className="cardinputsdiv">

            <label htmlFor="password">New Pasword</label>
            <input type="password" name="password" placeholder="" required ref={newpasswordref} />
            <label htmlFor="passwordconfirm">Confirm Password</label>
            <input className="smallmarginbottominput" type="password" name="passwordconfirm" placeholder="" required ref={newpasswordconfirmref} />
            <div >
              {successmessage.length > 0 && <p className="text-base text-red-500 mb-5">{successmessage}</p>}
              {passnotmatch && <p className="text-red-500 mb-5" >{errormessage}</p>}
            </div>
            <div className="flex flex-row justify-center">
              <button className="button button-primary mt-8 " onClick={(e) => onSubmit(e)} type="submit">Reset Password</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )

}

