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

  return (
    <div className="relative w-full">
      <ResizableNavbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <div className="flex items-center gap-4">
            <NavItems items={navItems} />
            <NavbarButton variant="primary" href="/auth">
              SIGN UP
            </NavbarButton>
            <NavbarButton variant="secondary">
              <ModeToggle />
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
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
                className="relative text-neutral-100 dark:text-neutral-100 font-light"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-80"
              >
                Login
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>

      {/* Navbar */}
    </div>
  );
  // const [isOpen, setIsOpen] = useState(false)
  // const pathname = usePathname()
  // const { resolvedTheme } = useTheme()

  // // 👇 Add mount check to prevent hydration mismatch
  // const [mounted, setMounted] = useState(false)

  // useEffect(() => {
  //   setMounted(true)
  // }, [])

  // return (
  //   <motion.header
  //     initial={{ y: -20, opacity: 0 }}
  //     animate={{ y: 0, opacity: 1 }}
  //     transition={{ duration: 0.5 }}
  //     className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md dark:bg-background/80"
  //   >
  //     <div className="container flex h-16 items-center justify-between">
  //       <Link href="/" className="flex items-center gap-2">
  //         {mounted && (
  //           <Image
  //             src={resolvedTheme === "dark" ? DevsDark : DevsLight}
  //             alt="logo"
  //             width={65}
  //             height={65}
  //             priority
  //           />
  //         )}
  //       </Link>
  //       <div className="flex items-center gap-6">
  //         <nav className="hidden md:block">
  //           <Button variant="ghost" className="hover:bg-accent">
  //             <Link href="/members" className="flex items-center">
  //               Members
  //             </Link>
  //           </Button>

  //           <Button variant="ghost" className="hover:bg-accent">
  //             <Link href="mailto:devsclubtsec@gmail.com" className="flex items-center">
  //               Contact us
  //             </Link>
  //           </Button>
  //         </nav>
  //         <div className="flex items-center gap-2">
  //           <motion.div
  //             whileHover={{ scale: 1.05 }}
  //             whileTap={{ scale: 0.95 }}
  //             className="hidden md:block"
  //           >
  //             <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
  //               <Link href="/auth">Sign In</Link>
  //             </Button>
  //           </motion.div>
  //           <ModeToggle />
  //         </div>
  //         <button
  //           className="md:hidden text-foreground"
  //           onClick={() => setIsOpen(!isOpen)}
  //         >
  //           {isOpen ? <X /> : <Menu />}
  //         </button>
  //       </div>
  //     </div>
  //     <AnimatePresence>
  //       {isOpen && (
  //         <motion.div
  //           initial={{ opacity: 0, height: 0 }}
  //           animate={{ opacity: 1, height: 'auto' }}
  //           exit={{ opacity: 0, height: 0 }}
  //           transition={{ duration: 0.3 }}
  //           className="border-t bg-background dark:bg-background md:hidden"
  //         >
  //           <nav className="container py-4">
  //             <ul className="flex flex-col gap-4">
  //               {['Members', 'Login', 'Contact Us'].map((item) => (
  //                 <motion.li
  //                   key={item}
  //                   whileHover={{ x: 5 }}
  //                   transition={{ duration: 0.2 }}
  //                 >
  //                   <Link
  //                     href={item === 'Members' ? '/members' : '#'}
  //                     className="text-sm text-muted-foreground hover:text-foreground"
  //                   >
  //                     {item}
  //                   </Link>
  //                 </motion.li>
  //               ))}
  //             </ul>
  //             <motion.div
  //               whileHover={{ scale: 1.05 }}
  //               whileTap={{ scale: 0.95 }}
  //               className="mt-4"
  //             >
  //               <Button className="w-full bg-[#4339F2] hover:bg-[#4339F2]/90 text-white rounded-full">
  //                 Get Started
  //               </Button>
  //             </motion.div>
  //           </nav>
  //         </motion.div>
  //       )}
  //     </AnimatePresence>
  //   </motion.header>
  // )
}
