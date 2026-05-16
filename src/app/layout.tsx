import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Roboto, Space_Mono } from "next/font/google";
import SiteLoader from "./_components/SiteLoader";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://savehxpe.com";
const siteTitle = "saveHXPE | Recording Artist, Producer & Creative Director";
const siteDescription =
  "saveHXPE is Tokonye Tshepo Matthias Motolo, a South African-born and Lesotho-raised recording artist, producer, creative director, and founder of Outworld.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "saveHXPE",
    images: [
      {
        url: "/brand/hero/hero_image.webp",
        width: 1200,
        height: 1200,
        alt: "saveHXPE brand visual",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/brand/hero/hero_image.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const artistJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "saveHXPE",
  description: siteDescription,
  jobTitle: "Recording artist, producer, and creative director",
  alternateName: "Tokonye Tshepo Matthias Motolo",
  birthPlace: {
    "@type": "Place",
    name: "South Africa",
  },
  homeLocation: {
    "@type": "Place",
    name: "Lesotho",
  },
  sameAs: ["https://www.instagram.com/savehxpe/"],
  subjectOf: [
    {
      "@type": "Organization",
      name: "Outworld",
    },
    {
      "@type": "CreativeWork",
      name: "3.3M Spotify streams",
    },
    {
      "@type": "CreativeWork",
      name: "3.2M short-form views",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${spaceMono.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/brand/hero/hero_image.webp" />
        <link rel="preload" as="image" href="/brand/logos/outworld_logo.webp" />
        <link rel="preload" as="image" href="/cover_art.webp" />
        <Script id="loader-seen-check" strategy="beforeInteractive">
          {`try { if (sessionStorage.getItem('savehxpe-loader-seen-v1') === '1') { document.documentElement.dataset.loaderSeen = '1'; } } catch (e) {}`}
        </Script>
      </head>
      <body className="min-h-screen bg-[#050B18] text-[#dce2f5] antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artistJsonLd) }} />
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
