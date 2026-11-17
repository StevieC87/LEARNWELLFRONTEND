//import { useDispatch } from "react-redux";
//import { setActiveSize, setIsMobilePortrait } from "../../redux/slices/Utilsslice";
'use client'
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTotalWidth } from "@/redux/slices/UISlice";


export default function CheckWidth() {
  const dispatch = useDispatch();
  const [maxpixelsnow, setmaxpixelsnow] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : null));

  useEffect(() => {
    const updateScreenSize = () => {
      setmaxpixelsnow(window.innerWidth); // Set the current screen width
      dispatch(setTotalWidth(window.innerWidth)); // Dispatch the width to the Redux store
    };

    if (typeof window !== 'undefined') {
      updateScreenSize(); // Set initial screen size
      window.addEventListener("resize", updateScreenSize); // Update on resize
    }

    return () => {
      window.removeEventListener("resize", updateScreenSize); // Cleanup listener
    };
  }, []);


  return maxpixelsnow;
}