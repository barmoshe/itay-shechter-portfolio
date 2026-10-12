import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Heebo } from 'next/font/google';
import { seo } from '@/content/site';
import { VideoProvider } from '@/components/interactive/VideoDialog';
import { ContactProvider } from '@/components/interactive/ContactDialog';
import { Effects } from '@/components/Effects';
import '@/styles/index.css';

// Heebo, self-hosted by Next at build time (no request to Google from the
// visitor). Variable weight 100..900: the kinetic headlines animate "wght".
const heebo = Heebo({ subsets: ['hebrew', 'latin'], variable: '--font-heebo', display: 'swap' });

const ogImage = new URL(seo.ogImage.path, seo.url).href;

export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: seo.title,
  description: seo.description,
  authors: [{ name: seo.author }],
  alternates: { canonical: seo.url },
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
  openGraph: {
    type: 'website',
    siteName: seo.siteName,
    title: seo.title,
    description: seo.description,
    url: seo.url,
    images: [{ url: ogImage, width: seo.ogImage.width, height: seo.ogImage.height, alt: seo.ogImage.alt }],
    locale: seo.locale,
  },
  twitter: { card: 'summary_large_image', title: seo.title, description: seo.description, images: [ogImage] },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: seo.themeColor };

const { sameAs, ...person } = seo.person;
const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  ...person,
  url: seo.url,
  image: ogImage,
  sameAs,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        <canvas id="bg-shader" aria-hidden="true" />
        <div id="prog">
          <div id="prog-bar" />
        </div>
        <VideoProvider>
          <ContactProvider>{children}</ContactProvider>
        </VideoProvider>
        <Effects />
      </body>
    </html>
  );
}
