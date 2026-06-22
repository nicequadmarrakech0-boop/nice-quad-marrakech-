import type { Metadata, Viewport } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Montserrat, Poppins, Noto_Kufi_Arabic } from "next/font/google";
import { OrganizationSchema } from "@/components/seo/structured-data";
import { WhatsAppPopup } from "@/components/ui/whatsapp-popup";
import { ConvexClientProvider } from "./providers";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins',
});

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: '--font-noto-kufi-arabic',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nicequadmarrakech.com'),
  title: {
    default: "Nice Quad Marrakech | Quad & Buggy Rentals in Marrakech",
    template: "%s | Nice Quad Marrakech"
  },
  description: "Experience the ultimate adventure in Marrakech with our premium quad bikes, buggies, and motocross rentals. Includes camel ride, hotel pickup, breakfast & photos. Book your desert adventure today!",
  keywords: [
    "quad marrakech",
    "buggy marrakech",
    "quad rental marrakech",
    "buggy rental marrakech",
    "desert adventure marrakech",
    "atv marrakech",
    "quad biking marrakech",
    "marrakech adventure",
    "nice quad marrakech",
    "motocross marrakech",
    "can-am marrakech",
    "polaris marrakech",
    "yamaha raptor marrakech",
    "camel ride marrakech",
    "camel marrakech",
    "desert camel ride",
    "quad and camel marrakech"
  ],
  authors: [{ name: "Nice Quad Marrakech" }],
  creator: "Nice Quad Marrakech",
  publisher: "Nice Quad Marrakech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Canonical URL to avoid duplicate content issues
  alternates: {
    canonical: 'https://nicequadmarrakech.com',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nicequadmarrakech.com",
    siteName: "Nice Quad Marrakech",
    title: "Nice Quad Marrakech | Premium Quad & Buggy Rentals",
    description: "Experience the ultimate adventure in Marrakech with our premium quad bikes, buggies, and motocross rentals. Includes camel ride, hotel pickup, breakfast & photos.",
    images: [
      {
        url: "https://nicequadmarrakech.com/logo.png",
        width: 512,
        height: 512,
        alt: "Nice Quad Marrakech Logo"
      },
      {
        url: "https://ik.imagekit.io/momh2323/can%20am%201%20.jpeg",
        width: 1200,
        height: 630,
        alt: "Nice Quad Marrakech - Adventure Rentals"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nice Quad Marrakech | Premium Quad & Buggy Rentals",
    description: "Experience the ultimate adventure in Marrakech with our premium quad bikes, buggies, and motocross rentals. Includes camel ride, hotel pickup, breakfast & photos.",
    images: [
      "https://nicequadmarrakech.com/logo.png",
      "https://ik.imagekit.io/momh2323/can%20am%201%20.jpeg"
    ],
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
  // Icons configuration
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/logo.png',
      },
    ],
  },
  // TODO: Replace with your actual Google Search Console verification code
  // Get it from: https://search.google.com/search-console -> Settings -> Ownership verification -> HTML tag method
  verification: {
    google: 'your-google-site-verification-code',
  },
};

// Viewport configuration for mobile-first indexing (Google requirement 2025)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ea580c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
    >
      <html lang="en">
        <head>
          <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#ea580c" />
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://api.fontshare.com/v2/css?f[]=sentient@400,500,700,300&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className={`${montserrat.variable} ${poppins.variable} ${notoKufiArabic.variable} font-poppins bg-orange-50`}>
          <ConvexClientProvider>
            <OrganizationSchema />
            {children}
            <WhatsAppPopup />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
