'use client';
import './css/slidemenu.css';
import { useEffect, useState } from 'react';
import CheckWidth from '@/hooks/CheckWidth';
import SlideMenuContent from './SlideMenuContent'; // Adjust the path as necessary

export default function SlideMenuDesktop() {
  const maxpixelsnow = CheckWidth();
  const [visibility, setVisibility] = useState(false);


  //make a settimeout function


  useEffect(() => {
    //adminwrapperflexiblegridtcolumns
    if (maxpixelsnow > 768) {
      //set timeout
      //time out bit

      document.documentElement.style.setProperty("--adminwrapperflexiblegridtcolumns", "150px 1fr");
      // document.documentElement.style.setProperty("--adminsidebarwidth", "150px");
      //  document.documentElement.style.setProperty("--visibledefault", "block");
      setVisibility(true);
    }
    else {
      document.documentElement.style.setProperty("--adminwrapperflexiblegridtcolumns", "1fr");
      // document.documentElement.style.setProperty("--adminsidebarwidth", "0px");
      // document.documentElement.style.setProperty("--visibledefault", "block");
      setVisibility(false);
    }

  }, [maxpixelsnow]);

  return (
    <div className="slidemenuouterdiv"
    >
      {visibility && (
        <SlideMenuContent />
      )}
    </div>
  );
}