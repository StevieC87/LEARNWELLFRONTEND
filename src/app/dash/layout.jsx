// DO NOT include 'use server' or 'use client'
export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
//import Sidenav from '@/components/layout/Sidenav/Sidenav';
import MainContent from '@/components/layout/MainContent';
import '@/app/globals.css';
import '@/components/layout/layout.css'; // Adjust the path as necessary
import { verify } from 'jsonwebtoken';
import RefreshToken from '../users/components/RefreshToken'
import BottomBar from '@/components/layout/Navbar/BottomBar';
import SlideMenuDesktop from '@/components/layout/Navbar/SlideMenuDesktop';
import './layout.css';
export default async function Layout({ children }) {
  // console.log('JWT_SECRET:', process.env.JWT_SECRET);

  const cookieStore = await cookies(); // Valid in Server Component
  // console.log('All cookies:', cookieStore.getAll());

  // console.log('cookieStore', cookieStore);
  const token = cookieStore.get('token')?.value;
  // console.log('token', token);
  const refreshToken = cookieStore.get('refreshToken')?.value;
  //console.log('refreshToken', refreshToken);

  //set up refresh logic 
  let shouldRefresh = false;
  if (token) {
    const decoded = verify(token, process.env.JWT_SECRET);
    //  console.log('decoded', decoded);
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
      verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        // console.log('Token expired');
        shouldRefresh = true;
      } else {
        redirect('/users/login');
      }
    }


  }
  else if (!token) {
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
  }


  return (
    <div className="outerlayoutdiv">
      <div className="adminwrapperdiv">
        <RefreshToken shouldRefresh={shouldRefresh} />
        <SlideMenuDesktop />
        <MainContent children1={children} />

      </div>
      <BottomBar />
    </div>

  );
}
