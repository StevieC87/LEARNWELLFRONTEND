// The dashboard's shell. Written by cms-copy (overrides/frontend): the
// analytics project's own adds the site notices, plan banners and its tracker.
export const dynamic = 'force-dynamic';
import MainContent from '@/components/layout/MainContent';
import '@/app/globals.css';
import Header from '@/components/layout/Header';
import SlideMenuDesktop from '@/components/layout/Navbar/SlideMenuDesktop';
import SlideMenuMobile from '@/components/layout/Navbar/SlideMenuMobile';
import CommandPalette from '@/components/layout/Navbar/CommandPalette';
import VerifyToken from '@/features/auth/VerifyToken';
import ApiOffline from '@/components/layout/ApiOffline';
import AppearanceSync from '@/components/layout/AppearanceSync';
import TabSlide from '@/components/ui/TabSlide';
import DashTitle from '@/components/layout/DashTitle';

export const metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Dashboard',
  },
};

export default function Layout({ children }) {
  return (
    <div className="outerlayoutdiv">
      <Header />
      <div className="adminwrapperdiv">
        <VerifyToken />
        <ApiOffline />
        <SlideMenuDesktop />
        <SlideMenuMobile />
        <CommandPalette />
        <AppearanceSync />
        <TabSlide />
        <DashTitle />
        <MainContent children1={children} />
      </div>
    </div>
  );
}
