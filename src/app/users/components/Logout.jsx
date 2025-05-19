
'use client';
import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    const response = await fetch('http://localhost:3000/users/logout', {
      method: 'POST',
      credentials: 'include',
    })
    if (response.ok) {
      const data = await response.json();
      console.log("Logged out successfully");
      // Optionally, you can redirect the user to the login page or home page
      // window.location.href = '/login';
      router.push("/users/login");
    } else {
      console.error("Failed to log out");
      router.push("/users/login");
    }
    // router.push("/login");

  }


  return (
    <button

      onClick={() => handleLogout()}
      className="sidebartext btn btn-danger text-black text-xl text-left"
    >
      Log Out
    </button>
  );
}