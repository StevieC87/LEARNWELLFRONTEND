
'use client'
import './css/hamburgericon.css';
import { setIsMobileNavOpen } from '@/redux/slices/SlideMenu';
import { useDispatch, useSelector } from 'react-redux';
import CheckWidth from '@/hooks/CheckWidth';
export default function HamburgerIcon() {
  const dispatch = useDispatch();
  const isMobileNavOpen = useSelector((state) => state.SlideMenuSlice.isMobileNavOpen);
  const maxpixelsnow = CheckWidth();

  const openslidemenu = () => {
    if (maxpixelsnow != null && maxpixelsnow <= 1035) {
      dispatch(setIsMobileNavOpen(!isMobileNavOpen));
      return;
    }
  }

  return (
    <button type="button" className="mobile-nav-trigger" aria-label="Open navigation" aria-expanded={isMobileNavOpen} aria-controls="mobile-navigation" onClick={openslidemenu}>
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="cursor-pointer" viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
