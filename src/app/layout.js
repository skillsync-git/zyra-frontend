import { Inter } from 'next/font/google';
import './globals.css';
import ClientProviders from './ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Zyra - Premium Silk Sarees | Buy Online',
  description: 'Shop premium quality silk sarees, cotton sarees and more at Zyra.',
  verification: {
    google: 'RO3KmKO3KXY1GRi3C-8xW4R-82gddsaWY8yNSHY_WUI',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
