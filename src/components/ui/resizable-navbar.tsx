"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import DevsDark from "@/public/images/devs-dark.png";
import DevsLight from "@/public/images/devs-light.png";
import React, { useState, useEffect } from "react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  scrolled?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  scrolled?: boolean;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose?: () => void;
}

export const ResizableNavbar = ({ children, className }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md"
          : "bg-transparent backdrop-blur-none",
        "border-none shadow-none",
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ scrolled?: boolean }>, {
              scrolled,
            })
          : child
      )}
    </div>
  );
};

export const NavBody = ({ children, className, scrolled }: NavBodyProps) => {
  return (
    <div
      className={cn(
        "relative z-[60] mx-auto flex max-w-7xl flex-row items-center justify-between px-4 py-3 transition-all duration-300",
        scrolled ? "py-2" : "py-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  return (
    <div
      className={cn(
        "hidden items-center space-x-6 text-sm font-medium lg:flex",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          key={`link-${idx}`}
          href={item.link}
          onClick={onItemClick}
          className={cn(
            "px-3 py-2 transition-colors duration-200",
            "text-neutral-700 hover:text-black",
            "dark:text-neutral-300 dark:hover:text-white"
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export const MobileNav = ({ children, className, scrolled }: MobileNavProps) => {
  return (
    <div
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between px-4 transition-all duration-300",
        scrolled ? "py-2" : "py-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn("flex w-full flex-row items-center justify-between", className)}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    isOpen && (
      <div
        className={cn(
          "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 bg-white px-4 py-6 dark:bg-neutral-900",
          className
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) {
            onClose();
          }
        }}
      >
        {children}
      </div>
    )
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <IconX className="h-6 w-6 text-black dark:text-white" onClick={onClick} />
  ) : (
    <IconMenu2 className="h-6 w-6 text-black dark:text-white" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  const { resolvedTheme } = useTheme();
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 px-2 py-1"
    >
      <Image
        src={resolvedTheme === "dark" ? DevsDark : DevsLight}
        alt="logo"
        width={60}
        height={60}
        priority
        className="h-10 w-auto"
      />
    </Link>
  );
};

export const NavbarButton = ({
  href,
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & React.ComponentPropsWithoutRef<"a">) => {
  const baseStyles = "px-5 py-2 rounded-full text-sm font-medium transition-all";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-transparent text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white",
    dark: "bg-neutral-900 text-white hover:bg-neutral-800",
    gradient:
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
  };

  return (
    <Link
      href={href || "#"}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
};
