'use client';
import './css/slidemenu.css';
import Link from 'next/link';
import LogoutButton from '@/app/users/components/Logout.jsx';
import Image from 'next/image'; // Import Image from next/image
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserRole, setSettings } from '@/redux/slices/DashSlice'; // Import the action to set user role


export default function SlideMenu() {
  const dispatch = useDispatch();
  const userrole = useSelector((state) => state.DashSlice.userrole);

  useEffect(() => {
    let getuserroleverify = async () => {
      const response = await fetch('http://localhost:3000/getdataforredux', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // this is what sends/receives cookie
      });
      if (!response.ok) {
        console.log("Failed to fetch user role");
        return;
      }
      const data = await response.json();
      console.log("User role fetched successfully:", data);
      dispatch(setUserRole(data.role)); // Dispatch the action to set user role in 
      dispatch(setSettings(data.settings)); // Dispatch the action to set settings in the Redux store
      // Redux store
      // You can use the user role data here if needed
    }
    getuserroleverify();


  }, []);

  return (
    <div >

      <nav className="flex flex-col p-4">

        <div className="flex items-center justify-center mb-8">
          <Image className="logocolor" src="/images/logo/logocolor.svg" alt="Logo" width={30} height={30} />
          <span className="poppinsSemiBold  text-black text-xl">Alpine<span className="logocolortest">Web</span></span>
        </div>
        {/*   <div className="sidebarlinkforicon">



          <Link href="#home" className="sidebartext sidebarlinkforicon">
            Home
          </Link>
        </div> */}
        <div className="sidebarlinkforicon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
          </svg><Link href="/dash/analytics" className="py-2 sidebartext sidebarlinkforicon">
            Analytics
          </Link>
        </div>
        <div className="sidebarlinkforicon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-journal-text" viewBox="0 0 16 16">
            <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
          </svg>
          <Link href="/dash/posts" className="py-2 sidebartext ">
            Posts
          </Link>
        </div>
        <div className="sidebarlinkforicon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
          </svg>
          <Link href="/dash/pages" className="py-2 sidebartext ">
            Pages
          </Link>
        </div>
        <div className="sidebarlinkforicon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
          </svg>
          <Link href="/dash/users" className="py-2 sidebartext ">
            Users
          </Link>
        </div>
        <div className="sidebarlinkforicon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bullseye" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10m0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
            <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
            <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
          </svg>
          <Link href="/dash/seo" className="py-2 sidebartext ">
            SEO
          </Link>

        </div>
        {userrole === 'superadmin' && (
          <Link href="/dash/settings" className="py-2 sidebartext ">
            Settings
          </Link>
        )}

        <LogoutButton />

        <Link href="/dash/gptrender" className="py-2 sidebartext ">
          AI UI Generator
        </Link>
      </nav>
    </div>
  );
}