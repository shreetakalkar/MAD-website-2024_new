import { Inter } from "next/font/google"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ClientAppWrapper from "@/components/ClientAppWrapper"
import { ThemeInitializer } from "@/components/ThemeInitializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://tsecdevsclub.com"),
  title: "Developers Club of TSEC | TSEC Devs Club",
  description: "Creators of the official TSEC App and innovative tech solutions for the TSEC community",
  keywords: [
    "TSEC",
    "developers club",
    "tech",
    "programming",
    "coding",
    "student developers",
  ],
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
    "linkedin:owner": "tsecdevsclub",
    "instagram:creator": "tsecdevsclub",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" id="theme-root">
      <head>
        <link rel="icon" href="/devBlackLogo.ico" />
        <link rel="alternate" href="https://tsecdevsclub.com/" hrefLang="en" />
        <link rel="me" href="https://linkedin.com/company/tsecdevsclub" />
        <link rel="me" href="https://instagram.com/tsecdevsclub" />
        <link rel="me" href="https://facebook.com/tsecdevsclub" />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900 transition-colors duration-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <ThemeInitializer />
          <ClientAppWrapper>{children}</ClientAppWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}