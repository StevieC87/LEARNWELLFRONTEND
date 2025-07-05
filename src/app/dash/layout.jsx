// DO NOT include 'use server' or 'use client'
export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
//import Sidenav from '@/components/layout/Sidenav/Sidenav';
import MainContent from '@/components/layout/MainContent';
import '@/app/globals.css';
//import '@/components/layout/layout.css'; // Adjust the path as necessary
import { verify } from 'jsonwebtoken';
import Script from 'next/script';


import BottomBar from '@/components/layout/Navbar/BottomBar';
import SlideMenuDesktop from '@/components/layout/Navbar/SlideMenuDesktop';
import VerifyToken from '../users/components/VerifyToken';
// import GDPR from '../../components/GDPRNanalytics/GDPR';
//import './layout.css';
export default async function Layout({ children }) {

  let userrole;
  let email;

  let shouldRefresh = false; // Flag to indicate if we should refresh the token

  //! IF IT'S THE FIRST TIME LOGGING IN , i.e. no cookies at all then DONT REDIRECT TO LOGIN IF FAILS - coz loop
  //, send request to verify JWT token




  return (
    <>
      
      {/* <Sidenav /> */}
      
      {/* note this always client side coz afterInteractive */}
      <Script
        src="http://localhost:3000/track.js"
        strategy="afterInteractive"
        data-site="abcd123"
      />
      <div className="outerlayoutdiv">
        <div className="adminwrapperdiv">
          <VerifyToken />
          <SlideMenuDesktop />
          <MainContent children1={children} />
        {/*   <GDPR /> */}
        </div>
        <BottomBar />
      </div>
    </>
  );
}



/*   
  // This will return an object with tokenverified, shouldRefresh, email, and role
  /* 
    // console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('111111111111111111111111111111')
    const cookieStore = await cookies(); // Valid in Server Component
    console.log('All cookies:', cookieStore.getAll());
  
    // console.log('cookieStore', cookieStore);
    const token = cookieStore.get('token')?.value;
    console.log('token', token);
    const refreshToken = cookieStore.get('refreshToken')?.value;
    console.log('refreshToken', refreshToken);
  
    //set up refresh logic 
    let shouldRefresh = false; */

  //INSTEAD OF ALL THIS -> WE DO FETCH TO CHECK TOKEN and return the data we need (e.g. userrole etc)
  /* 
    if (token) {
      const decoded = verify(token, process.env.JWT_SECRET);
      console.log('decoded1111111', decoded);
      //now refresh
  
      const decodedissuedat = decoded.iat;
      //in normal time
      const decodedissuedatDate = new Date(decodedissuedat * 1000);
      // console.log('decodedissuedatDate', decodedissuedatDate);
      //in UTC time
      const decodedissuedatUTC = new Date(decodedissuedatDate.getTime() + decodedissuedatDate.getTimezoneOffset() * 60000);
  
      const decodedexpiry = decoded.exp;
      //in normal time
      const decodedexpiryDate = new Date(decodedexpiry * 1000);
      // console.log('decodedexpiryDate', decodedexpiryDate);
      //in UTC time
      const decodedexpiryUTC = new Date(decodedexpiryDate.getTime() + decodedexpiryDate.getTimezoneOffset() * 60000);
      // console.log('decodedissuedatUTC', decodedissuedatUTC);
      // console.log('token present');
      try {
        let verifythis = verify(token, process.env.JWT_SECRET);
        if (verifythis) {
          console.log('token verified');
          //if token is valid, we can proceed
            // console.log('decoded', decoded);
            const decodedRole = decoded.role;
            // console.log('decodedRole', decodedRole);
            //check if user is superadmin
            if (decodedRole === 'superadmin') {
              console.log('user is superadmin');
              //set user role in redux store
              // dispatch(setUserRole(decodedRole));
            }
        }
      } catch (err) {
        console.log('Error verifying token:', err);
        if (err.name === 'TokenExpiredError') {
          // console.log('Token expired');
          shouldRefresh = true;
        } else {
          redirect('/users/login');
        }
      }
  
  
    } */
  /* 
   if (!token) {
    console.log('no token present')
    //check if refresh tooken is present
    if (refreshToken) {
      const decoded2 = verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
      console.log('decoded2', decoded2);
      const decoded2Issuedat = decoded2.iat;
      //in normal time
      const decoded2IssuedatDate = new Date(decoded2Issuedat * 1000);
      console.log('decoded2IssuedatDate', decoded2IssuedatDate);
      //in UTC time
      const decoded2IssuedatUTC = new Date(decoded2IssuedatDate.getTime() + decoded2IssuedatDate.getTimezoneOffset() * 60000);
 
      const decoded2expiry = decoded2.exp;
      //in normal time
      const decoded2expiryDate = new Date(decoded2expiry * 1000);
      console.log('decoded2expiryDate', decoded2expiryDate);
      //in UTC time
      const decoded2expiryUTC = new Date(decoded2expiryDate.getTime() + decoded2expiryDate.getTimezoneOffset() * 60000);
      //if refresh token is present, we can try to get a new token
      console.log('refreshing token set');
      shouldRefresh = true;
    } else {
      //if no refresh token, redirect to login
      console.log('no refresh token');
      redirect('/users/login');
    }
    //console.log('no token')
    // redirect('/login');
  } */

  //let triggergetglobaldataforredux = GetDataforRedux();
