import "./globals.css";
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import ClientAppWrapper from "@/components/ClientAppWrapper";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import type { Metadata } from "next";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap'
});


const BASE_URL = "https://tsecdevsclub.com";
const logoUrl = `${BASE_URL}/devBlackLogo.ico`;
const bannerUrl = `${BASE_URL}/devsLogo.png`;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Developers Club of TSEC",
  "alternateName": "TSEC Devs Club",
  "url": BASE_URL,
  "logo": logoUrl,
  "sameAs": [
    "https://github.com/TSEC-MAD-Club",
    "https://www.instagram.com/devsclubtsec/",
    "https://www.linkedin.com/in/developer-s-club-tsec/",
    "https://www.linkedin.com/company/devs-club-tsec/",
  ],
  "description": "Creators of the TSEC App for students of Thadomal Shahani Engineering College.",
  "foundingDate": "1983", 
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Thadomal Shahani Engineering College",
    "addressLocality": "Mumbai",
    "addressRegion": "Maharashtra",
    "postalCode": "400050",
    "addressCountry": "IN"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": BASE_URL,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${BASE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Developers Club of TSEC | TSEC Devs Club",
  description: "Creators of the official TSEC App. Learn more about what we build, how we empower students, and download the TSEC app.",
  keywords: "TSEC, Developers Club, TSEC App, Mumbai, Engineering, Student, Events, Placement, Timetable, College",
  authors: [{ name: "TSEC Developers Club" }],
  robots: "index, follow",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "Developers Club of TSEC",
    description: "Explore our features like timetable, events, placement, and more!",
    type: "website",
    url: BASE_URL,
    siteName: "TSEC Devs Club",
    images: [
      {
        url: bannerUrl,
        width: 1200,
        height: 630,
        alt: "TSEC Devs Club Banner",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developers Club of TSEC",
    description: "Explore our features like timetable, events, placement, and more!",
    images: [bannerUrl],
    creator: "@tsecdevsclub",
    site: "@tsecdevsclub",
  },
  icons: { 
    icon: logoUrl,
    apple: logoUrl,
  },
  other: {
    "theme-color": "#000000",

    "json-ld": JSON.stringify([organizationSchema, websiteSchema]),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" id="theme-root">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900 transition-colors duration-200`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeInitializer />
          <ClientAppWrapper>{children}</ClientAppWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}