import {
  ClipboardEdit,
  FilePlus,
  FileStack,
  GitPullRequestClosed,
  Home,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  Bell,
  History,
  Lock,
  FileBadge,
  Download,
  Book,
  Cross,
  Ban
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modeToggle";
import Image from "next/image";
import DevsDark from "@/public/images/devs-dark.png";
import DevsLight from "@/public/images/devs-light.png";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useUser } from "@/providers/UserProvider";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const MobileHeader = ({ userType }: { userType: string }) => {
  const { theme } = useTheme();
  const { user, setUser, setLoggedIn } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const pathname = usePathname();
  const getLinkClasses = (path: string) => {
    return pathname === path
      ? "flex items-center gap-2 px-2 py-2 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-700 shadow-lg dark:shadow-blue-600/50 transition-all duration-300 ease-in-out"
      : "flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-in-out hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/50";
  };

  return (
    <header className="flex w-screen h-14 items-center justify-between gap-4 border-b  px-4 mt-3 lg:h-[60px] lg:px-6  md:hidden lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="flex flex-col w-[50%]">
          {/* Links */}

          <nav className="grid gap-2 text-sm font-medium mt-[20%] space-y-3">
            <Link href="/dashboard" className={getLinkClasses("/dashboard")}>
              <Home className="h-4 w-4" />
              Home
            </Link>

            {/* Conditional Links */}

            {userType === "committee" || userType === "admin" &&(
              <>
                <Link href="/dashboard/history-page" className={getLinkClasses("/dashboard/history-page")}>
                <History className="h-4 w-4" />
                Past Events
              </Link>
              </>
            )}

            {userType === "railway" && (
              <>
              <Link
                href="/dashboard/create_pass"
                className={getLinkClasses("/dashboard/create_pass")}
              >
                <FilePlus className="h-4 w-4" />
                Create New Pass
              </Link>
              <Link
                href="/dashboard/pending_req"
                className={getLinkClasses("/dashboard/pending_req")}
              >
                <FileStack className="h-4 w-4" />
                Pending Requests
              </Link>
              <Link
                href="/dashboard/collected_pass"
                className={getLinkClasses("/dashboard/collected_pass")}
              >
                <FileBadge className="h-4 w-4" />
                Collected Pass
              </Link>
              <Link
                href="/dashboard/update_pass"
                className={getLinkClasses("/dashboard/update_pass")}
              >
                <ClipboardEdit className="h-4 w-4" />
                Update Pass
              </Link>
              <Link
                href="/dashboard/approved_rejected"
                className={getLinkClasses("/dashboard/approved_rejected")}
              >
                <GitPullRequestClosed className="h-4 w-4" />
                Approved Passes
              </Link>
              <Link
                href="/dashboard/discard_pass"
                className={getLinkClasses("/dashboard/discard_pass")}
              >
                <Ban className="h-4 w-4" />
                Discard Pass
              </Link>
              <Link
                href="/dashboard/downloads"
                className={getLinkClasses("/dashboard/downloads")}
              >
                <Download className="h-4 w-4" />
                Download Files
              </Link>
            </>
            )}

            {(userType === "hod" ||
              userType === "principal" || userType === "examdept") && (
                <>
                  <Link href="/dashboard/history" className={getLinkClasses("/dashboard/history")}>
                    <History className="h-4 w-4" />
                    Past Notifications
                  </Link>
                </>
            )}

            {userType === "professor" && (
              <>
                <Link href="/dashboard/notification" className={getLinkClasses("/dashboard/notification")}>
                  <Bell className="h-4 w-4" />
                  Send Notification
                </Link>
                <Link href="/dashboard/notes_history" className={getLinkClasses("/dashboard/notes_history")}>
                  <Book className="h-4 w-4" />
                  Past Notes
                </Link>
                <Link href="/dashboard/notification_history" className={getLinkClasses("/dashboard/notification_history")}>
                  <History className="h-4 w-4" />
                  Past Notification
                </Link>
              </>
            )}
          </nav>

          {/* Account Dropdown */}
          <div className="mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="ml-4">
                  <User className="mr-2 h-4 w-4" />
                  {`${user?.name}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
              <DropdownMenuItem>
                <Link
                  href="/auth/change-password"
                  className="flex items-center"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Link>
              </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

export default MobileHeader;
