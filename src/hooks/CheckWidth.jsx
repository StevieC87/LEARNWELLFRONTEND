//import { useDispatch } from "react-redux";
//import { setActiveSize, setIsMobilePortrait } from "../../redux/slices/Utilsslice";
'use client'
import { useState, useEffect } from "react";



export default function CheckWidth() {
  //const dispatch = useDispatch();
  const [label, setLabel] = useState(false);
  //const [mobile, setmobile] = useState(false);
  const [maxpixelsnow, setmaxpixelsnow] = useState(0);
  //or we return a pixel number that way i CAN TARGET if  < 


  useEffect(() => {
    const mediaQueries = [

      { query: "(max-width: 375px)", label: "miniMobile" },
      { query: "(min-width: 376px) and (max-width: 464px)", label: "mobile" },
      { query: "(min-width: 465px) and (max-width: 768px)", label: "mobileLandscape" },
      { query: "(min-width: 769px) and (max-width: 1024px)", label: "tablet" },
      { query: "(min-width: 1025px)", label: "desktop" }



    ]
    const listeners = [];
    if (typeof window !== 'undefined') {
      const checkScreenSize = () => {
        for (const { query, label } of mediaQueries) {
          if (window.matchMedia(query).matches) {
            // alert(label);
            if (label == 'miniMobile') {
              //     setmaxpixelsnow(375);
            }
            else
              if (label == 'mobile') {
                //     setmaxpixelsnow(464);
              }
              else if (label == 'mobileLandscape') {
                //     setmaxpixelsnow(768);
              }
              else if (label == 'tablet') {
                //      setmaxpixelsnow(1024);
              }
              else if (label == 'desktop') {
                //      setmaxpixelsnow(1025);
              }

            //   console.log(label, 'label');

            //dispatch(setActiveSize(label));
            //return; // Exit loop after first match
          }
        }
      };
      checkScreenSize();

      // Add event listeners
      const listeners = mediaQueries.map(({ query }) => {
        const mediaQuery = window.matchMedia(query);
        const handleChange = () => checkScreenSize();
        mediaQuery.addEventListener("change", handleChange);
        return { mediaQuery, handleChange };
      });


      return () => {
        listeners.forEach(({ mediaQuery, handleChange }) => {
          mediaQuery.removeEventListener("change", handleChange);
        });
      };
    }
  }, []);

  useEffect(() => {
    const updateScreenSize = () => {
      setmaxpixelsnow(window.innerWidth); // Set the current screen width
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