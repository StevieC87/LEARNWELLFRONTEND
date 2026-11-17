'use client';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserRole, setSettings, setUserId, setEnableUserRegistration } from '@/redux/slices/DashSlice'; // Import the action to set user role
//refresh next smooth
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

// One refresh at a time per tab. Two at once rotate the token twice: one
// gets a 409, and a reload from it could cancel the winner's response before
// its new cookies were saved, which left the old token, another 409 and
// another reload, for a minute, until the firewall banned the address.
let refreshing = null;
function refreshSession(body) {
  if (!refreshing) {
    refreshing = fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    }).finally(() => { refreshing = null; });
  }
  return refreshing;
}

// A reload after a refresh happens once. Should the next page still ask for a
// refresh (the cookies weren't kept), the login page beats a reload loop.
const RELOADED_KEY = 'sessionRefreshReload';
function reloadOnce() {
  let last = 0;
  try { last = Number(sessionStorage.getItem(RELOADED_KEY)) || 0; } catch { /* storage off */ }
  if (Date.now() - last < 30 * 1000) {
    window.location.href = '/users/login';
    return;
  }
  try { sessionStorage.setItem(RELOADED_KEY, String(Date.now())); } catch { /* storage off */ }
  window.location.reload();
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Refreshes the session when its tokenExpiry cookie says it lapses within 20
// minutes. Reads a cookie and asks nothing of the server otherwise, so it can
// run on every filter click, where the full check below would cost two requests.
const checkAndRefresh = async () => {
  try {
    //get cookie TokenExpiry
    const tokenExpiry = getCookie('tokenExpiry');

    // The cookie expires with the token it describes, so a missing one
    // means the token has already lapsed: refresh now, on the way back to
    // the tab. Skipping it left the refresh to verifyToken on the next
    // click, which reloads the whole page.
    const now = new Date().getTime(); // Current time in milliseconds
    const exp = tokenExpiry ? new Date(decodeURIComponent(tokenExpiry)).getTime() : 0;
    //console.log('Token expiry time:', exp);
    if (exp - now < 20 * 60 * 1000) {
      //   console.log('tokenrefresh is about to expire, refreshing...');
      //wait fetch("/api/auth/refresh", { credentials: "include" });

      const makefetchrefreshbeforeexpiry = await refreshSession({ refreshtype: 'beforeexpiry' });

      // 409: another tab refreshed first and the new cookies are already set.
      if (!makefetchrefreshbeforeexpiry.ok && makefetchrefreshbeforeexpiry.status !== 409) {
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

  const lastPath = useRef('');
  const lastQuery = useRef('');
  const [urlchanged, setUrlChanged] = useState(0); // State to trigger useEffect when the page changes

  // The full check (verifyjwttoken, then getdataforredux) runs once per page,
  // not per query string: the dashboard keeps its filters and dates there, so
  // every filter click used to cost two requests. Within a page, the cookie
  // check still refreshes a session about to lapse, and a dashboard request
  // that finds it lapsed reloads the page (dashboardClient.js), which checks.
  useEffect(() => {
    const query = searchParams.toString();
    if (lastPath.current !== pathname) {
      setUrlChanged(prev => prev + 1); // Increment the state to trigger useEffect
      lastPath.current = pathname;
    } else if (lastQuery.current !== query) {
      checkAndRefresh();
    }
    lastQuery.current = query;
  }, [pathname, searchParams]);

  useEffect(() => {
    // if (effectRan3.current) return;
    //  effectRan3.current = true;
    if (typeof window === 'undefined') return;
    // The effect above counts the first page too, so 0 is the mount and the
    // check runs once per page instead of twice on every page load.
    if (urlchanged === 0) return;


    const verifyToken = async () => {
      // alert('trying to verify token');

      let fetchverifyjwttoken;
      let response;
      try {
        fetchverifyjwttoken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verifyjwttoken`, {
          method: 'GET',
          credentials: 'include', // This is important to include cookies in the request
          headers: {
            'Content-Type': 'application/json',
          },
        });
        response = await fetchverifyjwttoken.json();
      } catch (error) {
        // API unreachable (server down/restarting, CORS, offline) — skip this check
        console.warn('verifyjwttoken request failed:', error);
        return;
      }
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
        if (response.message === "tokenvalid") {
          //  console.log('token is valid');
          // Not on "refreshtrue": with no access token it can only answer 403,
          // and the reload after the refresh fetches it again.
          getuserroleverify();

          //SET THESE MAYBE REDUX 
          setShouldRefresh(false);
        }
        else if (response.message === "refreshtrue") {
          // alert('token expired, refreshing token');
          console.log('token expired, refreshing token');
          let refreshit = await refreshSession().catch(console.log);
          if (!refreshit) return; // network error, already logged
          // 409: another tab refreshed first and the new cookies are already set.
          if (!refreshit.ok && refreshit.status !== 409) {
            console.log('failed to refresh token');
            // Redirect to login page or handle accordingly
            window.location.href = '/users/login'; // Adjust the path as necessary
          }
          else {
            console.log('token refreshed successfully');
            //  setShouldRefresh(false);
            reloadOnce();
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
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        checkAndRefresh();
      }
    });
    window.addEventListener("focus", checkAndRefresh);


  }, []);


  let getuserroleverify = async () => {
    let response;
    try {
      response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/getdataforredux`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // this is what sends/receives cookie
      });
    } catch (error) {
      console.warn('getdataforredux request failed:', error);
      return;
    }
    if (!response.ok) {
      console.log("Failed to fetch user role");
      console.log(response, "response");
      // A reload or redirect can cancel the body mid-read (AbortError).
      const failmessage = await response.json().catch(() => ({}));
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
    const data = await response.json().catch(() => null);
    if (!data) return;
    //   console.log("User role fetched successfully:", data);
    dispatch(setUserRole(data.role)); // Dispatch the action to set user role in 
    dispatch(setSettings(data.settings)); // Dispatch the 
    dispatch(setUserId(data.userid));
    dispatch(setEnableUserRegistration(data.settings.publicuserregistration || false)); // Dispatch the action to set user registration setting

    // An admin without 2FA has a customer's rights until it's on.
    if (data.setup2fa && !window.location.pathname.startsWith('/dash/users/profile/twofactor')) {
      router.push('/dash/users/profile/twofactor?required=1');
    }

    // action to set settings in the Redux store
    // Redux store
    // You can use the user role data here if needed
  }



  return (
    <>
    </>
  )

}