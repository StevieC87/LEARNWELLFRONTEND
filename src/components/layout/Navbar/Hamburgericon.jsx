
'use client'
import './css/hamburgericon.css';
import { setIsSideNavOpen } from '@/redux/slices/SlideMenu';
import { useDispatch, useSelector } from 'react-redux';
export default function HamburgerIcon() {
  const dispatch = useDispatch();
  const isSideNavOpen = useSelector((state) => state.SlideMenuSlice.isSideNavOpen);

  const openslidemenu = () => {
    dispatch(setIsSideNavOpen(!isSideNavOpen));
  }

  return (
    <>

      <svg onClick={(() => openslidemenu())} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list hamburgericoncolor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
      </svg>
    </>
  );
}