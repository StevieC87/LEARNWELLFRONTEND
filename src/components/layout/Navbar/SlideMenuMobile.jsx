'use client';
import './css/slidemenu.css';
import { useEffect } from 'react';
import CheckWidth from '@/hooks/CheckWidth';
import SlideMenuContent from './SlideMenuContent'; // Adjust the path as necessary
import { setIsSideNavOpen } from '@/redux/slices/SlideMenu';
import { useDispatch, useSelector } from 'react-redux';


export default function SlideMenuMobile() {
  const dispatch = useDispatch();
  const isSideNavOpen = useSelector((state) => state.SlideMenuSlice.isSideNavOpen);

  const maxpixelsnow = CheckWidth();

  const closeslidemenu = () => {
    // Logic to close the slide menu
    console.log("Slide menu closed");
    dispatch(setIsSideNavOpen(false));
  }

  useEffect(() => {

    if (maxpixelsnow > 768) {
      //document.documentElement.style.setProperty("--adminsidebarwidth", darkmodeOn ? "#333" : "#eee");
      //time out bit
      const timeout = setTimeout(() => {
        alert('123')
        dispatch(setIsSideNavOpen(true));

      }, 3000);


      return () => clearTimeout(timeout); // Cleanup the timeout on unmount
    }
    else {
      document.documentElement.style.setProperty("--adminsidebarwidth", "0px");
      document.documentElement.style.setProperty("--visibledefault", "block");
      dispatch(setIsSideNavOpen(false));
    }

  }, [maxpixelsnow]);

  return (
    <div
      className={`slidemenu ${isSideNavOpen ? 'open' : 'closed'} slidemenuouterdiv`}

    >
      <SlideMenuContent />
    </div>
  );
}