import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { Footer } from '../components/Footer';
import { validateEnv } from '../lib/env';
import { generateWebsiteJsonLd } from '../lib/jsonld';
import { generateMetadata } from '../lib/metadata';
import './globals.scss';

validateEnv();

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateWebsiteJsonLd();

  return (
    <html lang='en'>
      <head>
        <link
          rel='preload'
          as='image'
          href='/img/pokenext_logo.webp'
          fetchPriority='high'
        />
        <Script
          id='jsonld-website'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
