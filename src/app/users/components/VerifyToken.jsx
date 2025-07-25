'use client';
//import RefreshToken from './RefreshToken'
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserRole, setSettings, setUserId, setEnableUserRegistration } from '@/redux/slices/DashSlice'; // Import the action to set user role
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
      if (!fetchverifyjwttoken.ok) {
        console.log('token is invalid or expired');
        if (response.message === "Unauthorizedaaa") {
          //redirect to login 
          router.push('/users/login'); // Redirect to login page
        }
      }
      else if (fetchverifyjwttoken.ok) {
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
          let refreshit = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/refresh-token`, {
            method: 'POST',
            credentials: 'include',
          }).catch(console.log);
          if (!refreshit.ok) {
            console.log('failed to refresh token');
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



    }
    verifyToken();


  }, [urlchanged])

  useEffect(() => {
    if (!window) return; // Ensure this runs only in the browser
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const checkAndRefresh = async () => {
      try {
        //get cookie TokenExpiry
        const tokenExpiry = getCookie('tokenExpiry');

        if (!tokenExpiry) {
          //  console.log('Tokenexpiry cookie not found tokenrefresh');
          return;
        }
        // console.log('Tokenexpiry tokenrefresh:', tokenExpiry);
        let decodetoken = decodeURIComponent(tokenExpiry);
        // console.log('Decoded tokenexpiry tokenrefresh:', decodetoken);
        const now = new Date().getTime(); // Current time in milliseconds
        // console.log('Current time:', now);
        const exp = new Date(decodetoken).getTime(); // Convert to milliseconds
        //console.log('Token expiry time:', exp);
        if (exp - now < 20 * 60 * 1000) {
          //   console.log('tokenrefresh is about to expire, refreshing...');
          //wait fetch("/api/auth/refresh", { credentials: "include" });

          const makefetchrefreshbeforeexpiry = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/refresh-token`, {
            method: 'POST',
            credentials: 'include', // Include cookies in the request
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshtype: 'beforeexpiry',
            }),
          });

          if (!makefetchrefreshbeforeexpiry.ok) {
            console.log('Failed to tokenrefresh beforeexpiry');
            // Redirect to login page or handle accordingly
            window.location.href = '/users/login'; // Adjust the path as necessary
          }
          else {
            // console.log('Tokenrefres successfully beforeexpiry');

          }
        }
        else {
          //  console.log('tokenrefresh is still valid, no need to refresh');
          //display time left
          //  const timeLeft = Math.ceil((exp - now) / 1000 / 60); // Convert to minutes
          // console.log(`tokenrefresh is valid for another ${timeLeft} minutes`);
        }

      }
      catch (error) {
        console.error('Error checking token expiry:', error);
      }


    };
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        checkAndRefresh();
      }
    });
    window.addEventListener("focus", checkAndRefresh);


  }, []);


  let getuserroleverify = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/getdataforredux`, {
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
    dispatch(setUserId(data.userid));
    dispatch(setEnableUserRegistration(data.settings.publicuserregistration || false)); // Dispatch the action to set user registration setting

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