'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ModeToggle } from '../modeToggle'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import DevsDark from "@/public/images/devs-dark.png"
import DevsLight from "@/public/images/devs-light.png"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const { theme, systemTheme, resolvedTheme } = useTheme();
  // console.log(resolvedTheme);
   

  // 👇 Add mount check to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md dark:bg-background/80"
    >
      <div className="container flex h-16 items-center justify-between">
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
        <div className="flex items-center gap-6">
          <nav className="hidden md:block">
            <Button variant="ghost" className="hover:bg-accent">
              <Link href="/members" className="flex items-center">
                Members
              </Link>
            </Button>

            <Button variant="ghost" className="hover:bg-accent">
              <Link href="mailto:devsclubtsec@gmail.com" className="flex items-center">
                Contact us
              </Link>
            </Button>
          </nav>
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                <Link href="/auth">Sign In</Link>
              </Button>
            </motion.div>
            <ModeToggle />
          </div>
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t bg-background dark:bg-background md:hidden"
          >
            <nav className="container py-4">
              <ul className="flex flex-col gap-4">
                {['Members', 'Login', 'Contact Us'].map((item) => (
                  <motion.li
                    key={item}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item === 'Members' ? '/members' : '#'}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4"
              >
                <Button className="w-full bg-[#4339F2] hover:bg-[#4339F2]/90 text-white rounded-full">
                  Get Started
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}