import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { PromoBanner } from '@/components/ui/PromoBanner';
import { TypographyInjector } from '@/components/layout/TypographyInjector';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'ZonaRo — Firme și Meșteri din Moldova și Estul României',
    template: '%s | ZonaRo',
  },
  description:
    'ZonaRo — directorul de firme și meșteri din Moldova și estul României. Găsește rapid servicii verificate în Iași, Galați, Bacău, Vaslui, Suceava și județele învecinate.',
  keywords: ['firme Moldova', 'mesteri Iasi', 'firme Galati', 'servicii Bacau', 'director firme est Romania'],
  authors: [{ name: 'ZonaRo' }],
  creator: 'ZonaRo',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zonaro.ro'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: '/',
    siteName: 'ZonaRo',
    title: 'ZonaRo — Firme și Meșteri din Moldova și Estul României',
    description: 'Găsește firme verificate în Iași, Galați, Bacău, Vaslui, Suceava și toată zona de est.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZonaRo — Firme și Meșteri din Estul României',
    description: 'Directorul firmelor din Moldova și estul României.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={inter.variable}>
      <head>
        <TypographyInjector />
      </head>
      <body className="min-h-screen flex flex-col">
        <PromoBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
