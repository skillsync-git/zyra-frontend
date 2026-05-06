'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '../contexts/AuthContext';
import Header from './components/header';
import Footer from './components/footer';

export default function ClientProviders({ children }) {
  const pathname = usePathname();
  
  // Routes where header and footer should NOT be displayed
  const excludeRoutes = [
    '/adminlogin',
    '/admin',
    '/admincategories',
    '/adminco',
    '/admingift',
    '/admingiftcategory',
    '/adminlimitedsales',
    '/adminoffers'
  ];
  
  // Check if current path starts with any excluded route
  const shouldHideHeaderFooter = excludeRoutes.some(route => 
    pathname?.startsWith(route)
  );

  return (
    <AuthProvider>
      {!shouldHideHeaderFooter && <Header />}
      {children}
      {!shouldHideHeaderFooter && <Footer />}
    </AuthProvider>
  );
}
