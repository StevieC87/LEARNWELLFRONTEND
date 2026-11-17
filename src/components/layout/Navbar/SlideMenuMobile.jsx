'use client';
import './css/slidemenu.css';
import { useEffect, useRef } from 'react';
import { Dialog } from 'radix-ui';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobileNavOpen } from '@/redux/slices/SlideMenu';
import SlideMenuContent from './SlideMenuContent';

export default function SlideMenuMobile() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.SlideMenuSlice.isMobileNavOpen);
  const openerRef = useRef(null);
  const setOpen = (value) => dispatch(setIsMobileNavOpen(value));

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1035px)');
    const update = () => {
      if (!query.matches) dispatch(setIsMobileNavOpen(false));
    };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [dispatch]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-nav-backdrop" />
        <Dialog.Content id="mobile-navigation" className="mobile-nav-drawer" aria-describedby={undefined}
          onOpenAutoFocus={() => { openerRef.current = document.activeElement; }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (openerRef.current?.isConnected) openerRef.current.focus();
          }}>
          <Dialog.Title className="sr-only">Main navigation</Dialog.Title>
          <Dialog.Close className="mobile-nav-close" aria-label="Close navigation">×</Dialog.Close>
          <SlideMenuContent drawer onNavigate={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
