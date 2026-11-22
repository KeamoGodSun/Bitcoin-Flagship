import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WalletProvider } from '@/components/wallet-provider';
import { WelcomePopup } from '@/components/welcome-popup';
import { StatusPill } from '@/components/status-pill';
import { StoryMenu } from '@/components/story-menu';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bitcoinflagship.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '₿itcoin Flagship — Bitcoin Adoption Community',
  description:
    'Bitcoin Flagship is a grassroots community driving Bitcoin adoption through meetups, education, murals, and social campaigns.',
  openGraph: {
    title: '₿itcoin Flagship — Bitcoin Adoption Community',
    description:
      'Driving Bitcoin adoption through meetups, education, murals, and social campaigns.',
    images: [{ url: '/logo.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/logo.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <WalletProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <WelcomePopup />
            <StatusPill />
            <StoryMenu />
          </WalletProvider>
        </div>
      </body>
    </html>
  );
}
