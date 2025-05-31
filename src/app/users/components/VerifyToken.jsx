'use client';
import RefreshToken from './RefreshToken'
import { useEffect, useState, useRef } from 'react';

export default function VerifyToken() {

  const [shouldRefresh, setShouldRefresh] = useState(false); // State to manage token refresh
  let userrole;
  let email;
  const effectRan = useRef(false);

  //! MAYBE THIS SHOULD JUST SEND TO CHECKLOGIN, MOCK ROUTE AND THEN IF NOT LOGGED IN THEN REDIRECT TO LOGIN PAGE  
  //AND SET REDUX AND WHAT HAVE U TO SHOW UI 

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;
    if (typeof window === 'undefined') return;

    const verifyToken = async () => {
      const fetchverifyjwttoken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verifyjwttoken`, {
        method: 'GET',
        credentials: 'include', // This is important to include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );
      let response = await fetchverifyjwttoken.json();


      if (fetchverifyjwttoken.ok) {
        console.log('ok fetch worked')
        // userrole = response.role;
        // email = response.email;
        if (response.message === "tokenvalid") {
          console.log('token is valid');

          //SET THESE MAYBE REDUX 
          setShouldRefresh(false);
        }
        else if (response.message === "refreshtrue") {
          console.log('token expired, refreshing token');
          setShouldRefresh(true); // Set the flag to true if the token is expired
          console.log('Token expired, redirecting to login');
        }

      }
      else if (!fetchverifyjwttoken.ok) {
        console.log('token is invalid or expired');


      }

    }
    verifyToken();


  }, [])

  return (
    <>
      <RefreshToken shouldRefresh={shouldRefresh} />
    </>
  )

}