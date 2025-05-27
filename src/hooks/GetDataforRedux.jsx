'use client';
import { useDispatch, useSelector } from 'react-redux';
import { setUserRole } from '@/redux/slices/DashSlice'; // Import 
import { useEffect } from 'react';

export default function GetDataforRedux() {
  const dispatch = useDispatch();
  useEffect(() => {
    let getuserroleverify = async () => {
      const response = await fetch('http://localhost:3000/users/verifyjwtrole', {
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
      dispatch(setUserRole(data.role)); // Dispatch the action to set user role in Redux store
      // You can use the user role data here if needed
    }
    getuserroleverify();

  }, []);
  return null; // This component does not render anything

}