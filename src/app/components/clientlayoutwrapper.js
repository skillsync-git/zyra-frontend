// 'use client';
// import { useEffect, useState } from 'react';
// import HeaderBeforeLogin from './bheader';

// import Footer from './footer';
// import Header from './header';

// export default function ClientLayoutWrapper({ children }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const user = localStorage.getItem('userLoggedIn');
//     setIsLoggedIn(!!user);
//   }, []);

//   return (
//     <>
//       {isLoggedIn ? <Header /> : <HeaderBeforeLogin />}
//       {children}
//       <Footer />
//     </>
//   );
// }