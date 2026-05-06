'use client';

import { usePathname } from 'next/navigation';
import Header from './header';
import Footer from './footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminPanel = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPanel && <Header />}
      {children}
      {!isAdminPanel && <Footer />}
    </>
  );
}
