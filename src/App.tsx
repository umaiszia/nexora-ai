import { useEffect } from 'react';
import { Router as WouterRouter, useLocation } from 'wouter';
import { SettingsProvider } from '@/lib/settings';
import { Customizer } from '@/components/Customizer';
import { Landing } from '@/pages/Landing';
import { AuthPage, DashboardPage, NotFound, Onboarding } from '@/pages/Workspace';

/** Jump to the top whenever the page (route) changes; hash links keep their native behaviour. */
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { if (!window.location.hash) window.scrollTo(0, 0); }, [location]);
  return null;
}

function RoutedApp() {
  const [location] = useLocation();
  let page: React.ReactNode;
  if (location === '/') page = <Landing />;
  else if (location === '/login') page = <AuthPage mode="login" />;
  else if (location === '/signup') page = <AuthPage mode="signup" />;
  else if (location === '/onboarding') page = <Onboarding />;
  else if (location.startsWith('/dashboard')) page = <DashboardPage section={location.split('/')[2] || 'dashboard'} />;
  else page = <NotFound />;
  return <><ScrollToTop />{page}<Customizer /></>;
}

export default function App() {
  return (
    <SettingsProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedApp /></WouterRouter>
    </SettingsProvider>
  );
}
