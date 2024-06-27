"use client";

import React, { useState, useEffect, createContext } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import SessionProvider from "@/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "TSEC WEBSITE",
  description: "Created by batch 2024-2025",
};

export const UserContext = createContext({
  loggedIn: false,
  setLoggedIn: (value: boolean) => {},
  user: { type: "", email: "", name: "" },
  setUser: (user: { type: string; email: string; name: string }) => {},
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({
    type: "",
    email: "",
    name: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setLoggedIn(true);
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>{metadata.title as React.ReactNode}</title>
        <meta name="description" content={metadata.description ?? undefined} />
      </head>
      <body className={`${inter.className} w-screen h-screen`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UserContext.Provider
              value={{ loggedIn, setLoggedIn, user, setUser }}
            >
              {children}
              <Toaster />
            </UserContext.Provider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
