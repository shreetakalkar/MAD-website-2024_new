"use client";

import { useState, useEffect } from "react";
import {
  ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { ModeToggle } from "../modeToggle";

export function Navbar() {
  const navItems = [
    {
      name: "Members",
      link: "/members",
    },
    {
      name: "Contact Us",
      link: "mailto:devsclubtsec@gmail.com",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024); // lg breakpoint
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <ResizableNavbar className="border-none shadow-none">
      {/* Show either desktop or mobile nav based on screen size */}
      {!isMobileView ? (
        // Desktop Navigation
        <NavBody>
          <NavbarLogo />
          <div className="flex items-center gap-4">
            <NavItems items={navItems} />
            <NavbarButton variant="primary" href="/auth">
              SIGN IN
            </NavbarButton>
            <NavbarButton variant="secondary">
              <ModeToggle />
            </NavbarButton>
          </div>
        </NavBody>
      ) : (
        // Mobile Navigation
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-4">
              <NavbarButton variant="secondary">
                <ModeToggle />
              </NavbarButton>
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-800 dark:text-neutral-100 font-normal"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
                href="/auth"
              >
                SIGN IN
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      )}
    </ResizableNavbar>
  );
}
