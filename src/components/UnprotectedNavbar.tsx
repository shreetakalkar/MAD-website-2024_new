"use client";

import React, { useEffect, useState } from "react";
import { ModeToggle } from "./modeToggle";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import DevsDark from "@/public/images/devs-dark.png";
import DevsLight from "@/public/images/devs-light.png";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export default function UnprotectedNavbar() {
  const { theme, systemTheme, resolvedTheme } = useTheme();
  // console.log(resolvedTheme);
  
  const [mounted, setMounted] = useState(false)
  
    useEffect(() => {
      setMounted(true)
    }, [])
  const pathname = usePathname();

  // Same approach that is used in navbar component
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {/* Render both images and toggle visibility */}
            <div className="relative w-[50px] h-[50px]">
            <Link href="/" className="flex items-center gap-2">
              {mounted && (
                <Image
                  src={resolvedTheme === "dark" ? DevsDark : DevsLight}
                  alt="logo"
                  width={50}
                  height={50}
                  className="rounded-md"
                  priority
                />
              )}
            </Link>
            </div>
          </div>

          {pathname === "/auth/change-password" && (
            <Button variant={"link"}>
              <Link href="/dashboard" className="flex items-center">
                <ArrowLeft className="ml-2 h-4 w-4"/>
                Dashboard
              </Link>
            </Button>
          )}

          <div className="flex ml-auto">
            <Button variant={"link"}>
              <Link href="mailto:devsclubtsec@gmail.com" className="flex items-center">
                Contact us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            {pathname === "/" ? (
              <Button variant={"link"}>
                <Link href="/auth" className="flex items-center">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant={"link"}>
                <Link href="/" className="flex items-center">
                  About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}