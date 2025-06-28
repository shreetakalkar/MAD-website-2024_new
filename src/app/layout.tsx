import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import ClientAppWrapper from "@/components/ClientAppWrapper";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import Script from "next/script";
import type { Metadata } from "next";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://tsecdevsclub.com"),
  title: "Developers Club of TSEC | TSEC Devs Club",
  description: "Creators of the official TSEC App. Learn more about what we build, how we empower students, and download the TSEC app.",
  alternates: {
    canonical: "https://tsecdevsclub.com",
  },
  openGraph: {
    title: "Developers Club of TSEC",
    description: "Explore our features like timetable, events, placement, and more!",
    type: "website",
    url: "https://tsecdevsclub.com",
    images: [
      {
        url: "/devBlackLogo.ico",
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
    images: ["/devBlackLogo.ico"],
    creator: "@tsecdevsclub",
  },
  icons: {
    icon: "/devBlackLogo.ico",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Developers Club of TSEC",
  alternateName: "TSEC Devs Club",
  url: "https://tsecdevsclub.com",
  logo: "https://tsecdevsclub.com/devBlackLogo.ico",
  sameAs: [
    "https://github.com/TSEC-MAD-Club",
    "https://www.instagram.com/devsclubtsec/",
    "https://www.linkedin.com/in/developer-s-club-tsec/",
    "https://www.linkedin.com/company/devs-club-tsec/",
  ],
  description: "Creators of the TSEC App for students of Thadomal Shahani Engineering College.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" id="theme-root">
      <head>
        <link rel="icon" href="/devBlackLogo.ico" />
        <link rel="alternate" href="https://tsecdevsclub.com/" hrefLang="en" />
        <meta name="keywords" content="TSEC, Developers Club, TSEC App, Mumbai, Engineering, Student, Events, Placement, Timetable, College" />
        <meta name="author" content="TSEC Developers Club" />
        <meta property="og:image:alt" content="TSEC Devs Club Banner" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:image:alt" content="TSEC Devs Club Banner" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
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
