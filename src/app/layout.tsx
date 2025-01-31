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

const metadata: Metadata = {
  title: "DEVS CLUB WEBSITE",
  description: "Created by batch 2024-2025",
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
        <link rel="icon" href="../public/favicon.ico" sizes="any" />
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
