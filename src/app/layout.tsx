// layout.tsx (no "use client" here)
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import ClientAppWrapper from "@/components/ClientAppWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Developers Club of TSEC | TSEC Devs Club",
  description: "Creators of the official TSEC App...",
  openGraph: {
    title: "Developers Club of TSEC",
    description: "Explore our features...",
    type: "website",
    url: "https://tsecdevsclub.com",
    images: [
      {
        url: "/devsLogo.png",
        width: 1200,
        height: 630,
        alt: "TSEC Devs Club Banner",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
  <html lang="en" suppressHydrationWarning>
    <head>
      <link rel="icon" href="/devBlackLogo.ico" />
      <link rel="canonical" href="https://tsecdevsclub.com/" />
    </head>
    <body className={inter.className}>
      <ClientAppWrapper>
        {children}
      </ClientAppWrapper>
    </body>
  </html>
);

}
