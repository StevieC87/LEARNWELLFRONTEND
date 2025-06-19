'use client';
//import RefreshToken from './RefreshToken'
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserRole, setSettings, setUserId } from '@/redux/slices/DashSlice'; // Import the action to set user role
//refresh next smooth
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
export default function VerifyToken() {
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const router = useRouter();
  const dispatch = useDispatch();
  const effectRan = useRef(false);
  const effectRan2 = useRef(false);
  const effectRan3 = useRef(false);
  const [shouldRefresh, setShouldRefresh] = useState(false); // State to manage token refresh

  const userrole = useSelector((state) => state.DashSlice.userrole);
  let pagetypeparam = searchParams.get('pagetype'); // Get the 'pagetype' query parameter

  const lastUrl = useRef('');
  const [urlchanged, setUrlChanged] = useState(0); // State to trigger useEffect when URL changes


  useEffect(() => {

    const currentUrl = pathname + '?' + searchParams.toString();
    if (lastUrl.current === currentUrl) return;
    else {
      // alert('URL changed: ');
      setUrlChanged(prev => prev + 1); // Increment the state to trigger useEffect
      lastUrl.current = currentUrl; // Update the lastUrl reference
    }
    // lastUrl.current = currentUrl;

    // your fetch logic here
  }, [pathname, searchParams]);

  useEffect(() => {
    // if (effectRan3.current) return;
    //  effectRan3.current = true;
    if (typeof window === 'undefined') return;


    const verifyToken = async () => {
      // alert('trying to verify token');

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
        //  alert('fetch worked');
        // console.log('ok fetch worked')
        // userrole = response.role;
        getuserroleverify();
        if (response.message === "tokenvalid") {
          //  console.log('token is valid');

          //SET THESE MAYBE REDUX 
          setShouldRefresh(false);
        }
        else if (response.message === "refreshtrue") {
          // alert('token expired, refreshing token');
          console.log('token expired, refreshing token');
          let refreshit = await fetch('http://localhost:3000/users/refresh-token', {
            method: 'POST',
            credentials: 'include',
          }).catch(console.error);
          if (!refreshit.ok) {
            console.log('failed to refresh token');
            alert('failed to refresh token, redirecting to login');
            // Redirect to login page or handle accordingly
            window.location.href = '/users/login'; // Adjust the path as necessary
          }
          else {
            console.log('token refreshed successfully');
            //  setShouldRefresh(false);
            window.location.reload();

            getuserroleverify();
          }
          // setShouldRefresh(true);

          // Set the flag to true if the token is expired
          //  console.log('Token expired, redirecting to login');
        }

      }
      else if (!fetchverifyjwttoken.ok) {
        console.log('token is invalid or expired');


      }
    }
    verifyToken();


  }, [urlchanged])




  let getuserroleverify = async () => {
    const response = await fetch('http://localhost:3000/settings/getdataforredux', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // this is what sends/receives cookie
    });
    if (!response.ok) {
      console.log("Failed to fetch user role");
      console.log(response, "response");
      const failmessage = await response.json();
      console.log(failmessage, "failmessage");
      console.log(response.status, "response.status");
      if (response.status === 403) {
        console.log("Forbidden: You are not authorized to access this resource.");
        console.log()
        if (failmessage.action === 'redirecttologin') {
          // Handle redirection to login page
          window.location.href = '/users/login'; // Redirect to login page
        }
        else if (failmessage.action === 'refreshpage') {

          // Handle refreshing the page
          //  router.refresh(); // Use Next.js router to refresh the page
          //    window.location.reload(); // Refresh the current page
        }

        // Handle unauthorized access, e.g., redirect to login page
        // window.location.href = '/users/login'; // Redirect to login page
      }
      return;
    }
    const data = await response.json();
    //   console.log("User role fetched successfully:", data);
    dispatch(setUserRole(data.role)); // Dispatch the action to set user role in 
    dispatch(setSettings(data.settings)); // Dispatch the 
    dispatch(setUserId(data.userid))
    // action to set settings in the Redux store
    // Redux store
    // You can use the user role data here if needed
  }

  return (
    <>
      {/*  <RefreshToken shouldRefresh={shouldRefresh} /> */}
    </>
  )

}