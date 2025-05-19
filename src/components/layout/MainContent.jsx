
'use client'
import CheckWidth from '@/hooks/CheckWidth';
import { useEffect, useState } from 'react';
// import { hello } from "../../redux/slices/SlideMenu";
//useselector
//import slice

import { useDispatch, useSelector } from "react-redux";
import { setIsSideNavOpen } from '@/redux/slices/SlideMenu';
export default function MainContent(props) {
  const dispatch = useDispatch();
  const { children1 } = props;
  const isSideNavOpen = useSelector((state) => state.SlideMenuSlice.isSideNavOpen);

  const hello = useSelector((state) => state.SlideMenuSlice.hello);
  const maxpixelsnow = CheckWidth();
  const [ismobile, setIsMobile] = useState(false);
  // const { isOpen, setIsOpen } = useNavContext();


  /* NOT WHEN IS SET MOBILE - WHEN THE THING IS OPEN ON DEKSTOP
   */

  useEffect(() => {
    if (maxpixelsnow > 769) {
      //document.documentElement.style.setProperty("--adminsidebarwidth", darkmodeOn ? "#333" : "#eee");
      document.documentElement.style.setProperty("--adminsidebarwidth", "200px");
      document.documentElement.style.setProperty("--visibledefault", "none");
      setIsMobile(false);
    }
    else {
      document.documentElement.style.setProperty("--adminsidebarwidth", "50px");
      document.documentElement.style.setProperty("--visibledefault", "block");
      setIsMobile(true);
    } //

  }, [maxpixelsnow]);

  /* SO WE WANT IT TO SHIFT - but then it's gonna maybe shift to the right 
  CHANGE THE POSITION MAYBE TRY FROM PO
  */

  const closeSidemenuonClickBlur = () => {
    // Logic to close the slide menu
    if (isSideNavOpen) {
      console.log("Slide menu closed");
      dispatch(setIsSideNavOpen(false));
    }
  }

  return (
    <>

      <main onClick={() => closeSidemenuonClickBlur()} className={`maincontent ${setIsMobile ? '' : 'maincontent-mobile'} ${isSideNavOpen ? 'maincontent-blur' : ''}`}>

        {children1}
        {/*  <span>{hello}</span> */}

      </main>

    </>
  );



}

/* 
const WrappedMainContent = (props) => {
  return (
    <ReduxProvider>
      <MainContent {...props} />
    </ReduxProvider>
  );
};
export default WrappedMainContent; */