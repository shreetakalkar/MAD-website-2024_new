
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import HydrationHandler from "../components/HydrationHandler"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://tsecdevsclub.com"),
  title: "Developers Club of TSEC | TSEC Devs Club",
  description: "Creators of the official TSEC App and innovative tech solutions for the TSEC community",
  keywords: "TSEC, developers club, tech, programming, coding, student developers",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://tsecdevsclub.com",
  },
  authors: [{ name: "TSEC Developers Club" }],
  openGraph: {
    title: "Developers Club of TSEC",
    description: "Explore our features, projects, and join the tech community at TSEC Developers Club",
    type: "website",
    url: "https://tsecdevsclub.com",
    siteName: "TSEC Developers Club",
    locale: "en_US",
    images: [
      {
        url: "/devsLogo.png",
        width: 1200,
        height: 630,
        alt: "TSEC Devs Club Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developers Club of TSEC",
    description: "Explore our features, projects, and join the tech community at TSEC Developers Club",
    images: ["/devsLogo.png"],
    creator: "@tsecdevsclub",
  },
  other: {
    "facebook-domain-verification": "[your-verification-code]",
    "og:type": "website",
    "og:locale": "en_US",
    "linkedin:owner": "tsecdevsclub",
    "instagram:creator": "tsecdevsclub",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/devBlackLogo.ico" />
        <link rel="canonical" href="https://tsecdevsclub.com/" />
        <link rel="alternate" href="https://tsecdevsclub.com/" hrefLang="en" />
        <link rel="me" href="https://linkedin.com/company/tsecdevsclub" />
        <link rel="me" href="https://instagram.com/tsecdevsclub" />
        <link rel="me" href="https://facebook.com/tsecdevsclub" />
        <meta name="robots" content="index, follow" />
        <meta property="og:site_name" content="TSEC Developers Club" />
        <meta property="og:url" content="https://tsecdevsclub.com" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="linkedin:profile" content="tsecdevsclub" />
      </head>
      <body className={inter.className}>
        <HydrationHandler>{children}</HydrationHandler>
      </body>
    </html>
  )
}