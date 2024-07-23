import {
  Bell,
  CircleUser,
  ClipboardEdit,
  Download,
  FileBadge,
  FilePlus,
  FileStack,
  GitPullRequestClosed,
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
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modeToggle";
import Image from "next/image";
import DevsDark from "@/public/images/devs-dark.png";
import DevsLight from "@/public/images/devs-light.png";
import { useTheme } from "next-themes";

const Header = ({ userType }: { userType: string }) => {
  const { theme } = useTheme();

  return (
    <header className="w-[100%]flex h-14 items-center gap-4 border-b  px-4 mt-3 lg:h-[60px] lg:px-6  md:hidden lg:hidden">
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
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            {/* Conditional Links */}
            {userType === "faculty" && (
              <>
                <Link
                  href="/dashboard/create_pass"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <FilePlus className="h-4 w-4" />
                  Create New Pass
                </Link>
                <Link
                  href="/dashboard/update_pass"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <ClipboardEdit className="h-4 w-4" />
                  Update Pass
                </Link>
                <Link
                  href="/dashboard/collected_pass"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <FileBadge className="h-4 w-4" />
                  Collected Pass
                </Link>
                <Link
                  href="/dashboard/pending_req"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <FileStack className="h-4 w-4" />
                  Pending Requests
                </Link>
                <Link
                  href="/dashboard/approved_rejected"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <GitPullRequestClosed className="h-4 w-4" />
                  Approved/Rejected Requests
                </Link>
                <Link
                  href="/dashboard/downloads"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Link>
              </>
            )}
            {userType === "committee" && (
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
              >
                <ShoppingCart className="h-4 w-4" />
                Create New Event
              </Link>
            )}
            {userType === "admin" && (
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
              >
                <ShoppingCart className="h-4 w-4" />
                Approve Events
              </Link>
            )}
            {userType === "railway" && (
              <>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <FilePlus className="h-4 w-4" />
                  Create New Pass
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <ClipboardEdit className="h-4 w-4" />
                  Update Pass
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <FileStack className="h-4 w-4" />
                  Pending Requests
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <GitPullRequestClosed className="h-4 w-4" />
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
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Create New Notifications
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Past Notifications
                </Link>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex float-right space-x-3">
        <Image
          src={theme == "dark" ? DevsDark : DevsLight}
          alt="logo"
          width={60}
          height={60}
          className="justify-end"
        />
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
