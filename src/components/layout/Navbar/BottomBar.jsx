
'use client';
import Image from 'next/image';
import './css/navbar.css'; // Adjust the path as necessary
import Hamburgericon from './Hamburgericon'; // Adjust the path as necessary
import SlideMenuMobile from './SlideMenuMobile'; // Adjust the path as necessary
import CheckWidth from '@/hooks/CheckWidth';
import { useEffect, useState } from 'react';


export default function BottomBar() {
  const maxpixelsnow = CheckWidth();
  // console.log(maxpixelsnow, 'maxpixelsnow');
  const isOpen = true;
  const [ismobile, setIsMobile] = useState(false);
  useEffect(() => {

    if (maxpixelsnow > 768) {
      //document.documentElement.style.setProperty("--adminsidebarwidth", darkmodeOn ? "#333" : "#eee");
      document.documentElement.style.setProperty("--adminsidebarwidth", "200px");
      // document.documentElement.style.setProperty("--navbargridtohide", "none");
      setIsMobile(false);
    }
    else if (maxpixelsnow <= 768) {
      document.documentElement.style.setProperty("--adminsidebarwidth", "50px");
      // document.documentElement.style.setProperty("--navbargridtohide", "grid");
      setIsMobile(true);
    } //

  }, [maxpixelsnow]);


  /* 
  */
  return (
    <>
      {ismobile && (
        <>
          <nav className="navbar1">
            <div className="navlogoarea">
              {/*  <div className="navlogoimgdiv">
            <Image src="/graphics/logo2.png" alt="Logo" width={50} height={50} /></div>
          <div className="navlogotextdiv">lpineWeb
          </div> */}
            </div>
            <div className="navlinksarea">
              <a href="#ho me">Home</a>
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="hamburgericondiv">
              <Hamburgericon />
            </div>
          </nav >
          <SlideMenuMobile />
        </>

      )}
    </>
  );

}
