import { Inter } from 'next/font/google';
import './globals.css';
import ClientProviders from './ClientProviders';
import JsonLd from './components/JsonLd';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Zyra - Premium Silk & Cotton Sarees | Buy Online India',
  description: 'Shop premium quality silk sarees, cotton sarees, art silk sarees and more at Zyra. Free shipping on all orders. Best prices guaranteed.',
  keywords: [
    'silk sarees online',
    'buy sarees online india',
    'cotton sarees',
    'art silk sarees',
    'premium sarees',
    'sarees india',
    'zyra sarees',
    'zyrastyllz',
    'wedding sarees',
    'festive sarees',
    'saree shop online'
  ],
  authors: [{ name: 'Zyra' }],
  creator: 'Zyra',
  publisher: 'Zyra',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.zyrastyllz.com',
    siteName: 'Zyra',
    title: 'Zyra - Premium Silk & Cotton Sarees | Buy Online India',
    description: 'Shop premium quality silk sarees, cotton sarees and more at Zyra. Free shipping on all orders.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zyra - Premium Silk & Cotton Sarees',
    description: 'Shop premium quality silk sarees online at Zyra.',
  },
  verification: {
    google: 'RO3KmKO3KXY1GRi3C-8xW4R-82gddsaWY8yNSHY_WUI',
  },
  alternates: {
    canonical: 'https://www.zyrastyllz.com',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <JsonLd />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}