"use client";

import React from "react";
import { ModeToggle } from "./modeToggle";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import DevsDark from "@/public/images/devs-dark.png";
import DevsLight from "@/public/images/devs-light.png";
import { useTheme } from "next-themes";

export default function UnprotectedNavbar() {
  const { theme } = useTheme();

  return (
    <nav className="sticky top-0 shadow-md z-50 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Image
              src={theme === "dark" ? DevsDark : DevsLight}
              alt="logo"
              width={50}
              height={50}
              className="rounded-md"
            />
            <Link href="/about" className="text-xl font-semibold text-gray-800 dark:text-white">
              {`Developer's Club of TSEC`}
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Button variant={"link"}>
              <Link href="mailto:devsclubtsec@gmail.com" className="flex items-center">
                Contact us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant={"link"} className="hover:underline">
              <Link href="/about" className="flex items-center text-gray-600 dark:text-gray-300">
                About Us
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
