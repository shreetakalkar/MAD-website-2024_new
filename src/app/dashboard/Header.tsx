import {
    Bell,
    CircleUser,
    Home,
    LineChart,
    Menu,
    Package,
    Package2,
    Search,
    ShoppingCart,
    Users,
  } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Input } from "@/components/ui/input";
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from 'react'
import Link  from "next/link";
import { Button } from "@/components/ui/button";

const Header = ({ userType } : { userType: string }) => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">

              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-blue-600"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>

                {/* Conditional Links */}
                {userType === "faculty" && (
                  <>
                    <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-blue-600"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Create New Notes
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-blue-600"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Past Notes
                    </Link>
                  </>
                )}
                {userType === "committee" && (
                  <Link
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-blue-600"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Create New Event
                  </Link>
                )}
                {userType === "admin" && (
                  <Link
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-blue-600"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Approve Events
                  </Link>
                )}
                {userType === "railway" && (
                  <>
                    <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-blue-600"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Create New Pass
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-blue-600"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Update Pass
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-blue-600"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Pending Requests
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-blue-600"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Approved/Rejected Requests
                    </Link>
                  </>
                )}
                {(userType === "admin" ||
                  userType === "faculty" ||
                  userType === "principal") && (
                  <>
                    <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-blue-600"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Create New Notifications
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-blue-600"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Past Notifications
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2 top-2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-8"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
  )
}

export default Header