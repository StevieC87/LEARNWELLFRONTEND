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
        src={`${process.env.NEXT_PUBLIC_API_URL}/track.js`}
        strategy="afterInteractive"
        data-site="b26a56dc-8c4b-4d7b-9c42-739cd79b8cc1"
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
