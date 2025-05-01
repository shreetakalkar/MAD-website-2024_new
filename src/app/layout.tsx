"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { UserProvider } from "@/providers/UserProvider";
import { db } from "@/config/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import UnderMaintenancePage from "@/components/UnderMaintenancePage";

const inter = Inter({ subsets: ["latin"] });

// landing/page.tsx
const metadata: Metadata = {
  title: "Developers Club of TSEC | TSEC Devs Club",
  description: "Creators of the official TSEC App. Learn more about what we build, how we empower students, and download the TSEC app.",
  openGraph: {
    title: "Developers Club of TSEC",
    description: "Explore our features like timetable, events, placement, and more!",
    type: "website",
    url: "https://tsecdevsclub.com",
    images: [
      {
        url: "../public/devsLogo.png",
        width: 1200,
        height: 630,
        alt: "TSEC Devs Club Banner",
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      const docRef = doc(db, "Maintainance", "Web Maintenance"); // mujhse zada spelling mistake koi nhi karta hoga
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsUnderMaintenance(docSnap.data().underMaintenance);
      }
    };

    fetchMaintenanceStatus();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>{metadata.title as React.ReactNode}</title>
        <meta name="description" content={metadata.description ?? undefined} />
        <link rel="icon" href="../public/devBlackLogo.ico" sizes="any" />
        <link rel="canonical" href="https://tsecdevsclub.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Developers Club of TSEC",
              "alternateName": "TSEC Devs Club",
              "url": "https://tsecdevsclub.com",
              "logo": "https://tsecdevsclub.com/devBlackLogo.ico",
              "sameAs": [
                "https://github.com/TSEC-MAD-Club",
                "https://www.instagram.com/devsclubtsec/",
                "https://www.linkedin.com/in/developer-s-club-tsec/",
                "https://www.linkedin.com/company/devs-club-tsec/"

              ],
              "description": "Creators of the TSEC App for students of Thadomal Shahani Engineering College."
            }),
          }}
        />

      </head>
      <body className={`${inter.className} w-full h-screen overflow-auto`}>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {isUnderMaintenance ? <UnderMaintenancePage /> : children}
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
