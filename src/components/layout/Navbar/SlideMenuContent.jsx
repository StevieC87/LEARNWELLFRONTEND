'use client';
import './css/slidemenu.css';
import Link from 'next/link';
import LogoutButton from '@/app/users/components/Logout.jsx';
import Image from 'next/image'; // Import Image from next/image
export default function SlideMenu() {


  return (
    <div


    >

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
        <Link href="/dash/pages" className="py-2 sidebartext">
          Pages
        </Link>
        <Link href="/dash/pages2" className="py-2 sidebartext">
          Pages2
        </Link>
        <Link href="/dash/users" className="py-2 sidebartext">
          Users
        </Link>
        <Link href="/dash/settings" className="py-2 sidebartext">
          Settings
        </Link>
        <Link href="/dash/gptrender" className="py-2 sidebartext">
          AI UI Generator
        </Link>
        <LogoutButton />
      </nav>
    </div>
  );
}