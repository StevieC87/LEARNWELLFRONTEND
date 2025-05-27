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
        <Link href="#home" className="py-2 sidebartext">
          Home
        </Link>
        <Link href="/dash/analytics" className="py-2 sidebartext">
          Analytics
        </Link>
        <Link href="/dash/posts" className="py-2 sidebartext">
          Posts
        </Link>
        <Link href="/dash/pages2" className="py-2 sidebartext">
          Pages2
        </Link>
        <Link href="/dash/users" className="py-2 sidebartext">
          Users
        </Link>
        {userrole === 'superadmin' && (
          <Link href="/dash/settings" className="py-2 sidebartext">
            Settings
          </Link>
        )}
        <Link href="/dash/gptrender" className="py-2 sidebartext">
          AI UI Generator
        </Link>
        <LogoutButton />
      </nav>
    </div>
  );
}