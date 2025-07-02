import {
  ClipboardEdit,
  FilePlus,
  FileStack,
  GitPullRequestClosed,
  Home,
  LogOut,
  Menu,
  User,
  Bell,
  History,
  Lock,
  FileBadge,
  Download,
  Book,
  Ban,
  Bug
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useState } from "react";

const MobileHeader = ({ userType }: { userType: string }) => {
  const { resolvedTheme, systemTheme } = useTheme();
  const [logo, setLogo] = useState(DevsLight);
  const { user, setUser, setLoggedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Handle logo based on theme
  useEffect(() => {
    const currentTheme = resolvedTheme === 'system' ? systemTheme : resolvedTheme;
    setLogo(currentTheme === 'dark' ? DevsDark : DevsLight);
  }, [resolvedTheme, systemTheme]);

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

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b bg-background px-4 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <VisuallyHidden>Toggle navigation menu</VisuallyHidden>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-[280px] max-w-full">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          
          <div className="flex h-full flex-col">
            <div className="mb-6 mt-4 flex items-center space-x-2">
              <Image
                src={logo}
                alt="TSEC Devs Club Logo"
                width={40}
                height={40}
                priority
                onError={() => setLogo(resolvedTheme === 'dark' ? DevsDark : DevsLight)}
              />
              <span className="font-semibold">Dashboard</span>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              <Link href="/dashboard" className={getLinkClasses("/dashboard")} prefetch={false}>
                <Home className="h-4 w-4" />
                Home
              </Link>

              {(userType === "committee" || userType === "admin") && (
                <Link 
                  href="/dashboard/history-page" 
                  className={getLinkClasses("/dashboard/history-page")}
                  prefetch={false}
                >
                  <History className="h-4 w-4" />
                  Past Events
                </Link>
              )}

              {userType === "admin" && (
                <Link 
                  href="/dashboard/bugs-report" 
                  className={getLinkClasses("/dashboard/bugs-report")}
                  prefetch={false}
                >
                  <Bug className="h-4 w-4" />
                  Bug & Feedback Report
                </Link>
              )}

              {userType === "railway" && (
                <>
                  <Link
                    href="/dashboard/create_pass"
                    className={getLinkClasses("/dashboard/create_pass")}
                    prefetch={false}
                  >
                    <FilePlus className="h-4 w-4" />
                    Create New Pass
                  </Link>
                  <Link
                    href="/dashboard/pending_req"
                    className={getLinkClasses("/dashboard/pending_req")}
                    prefetch={false}
                  >
                    <FileStack className="h-4 w-4" />
                    Pending Requests
                  </Link>
                  <Link
                    href="/dashboard/collected_pass"
                    className={getLinkClasses("/dashboard/collected_pass")}
                    prefetch={false}
                  >
                    <FileBadge className="h-4 w-4" />
                    Collected Pass
                  </Link>
                  <Link
                    href="/dashboard/update_pass"
                    className={getLinkClasses("/dashboard/update_pass")}
                    prefetch={false}
                  >
                    <ClipboardEdit className="h-4 w-4" />
                    Update Pass
                  </Link>
                  <Link
                    href="/dashboard/approved_rejected"
                    className={getLinkClasses("/dashboard/approved_rejected")}
                    prefetch={false}
                  >
                    <GitPullRequestClosed className="h-4 w-4" />
                    Approved Passes
                  </Link>
                  <Link
                    href="/dashboard/discard_pass"
                    className={getLinkClasses("/dashboard/discard_pass")}
                    prefetch={false}
                  >
                    <Ban className="h-4 w-4" />
                    Discard Pass
                  </Link>
                  <Link
                    href="/dashboard/downloads"
                    className={getLinkClasses("/dashboard/downloads")}
                    prefetch={false}
                  >
                    <Download className="h-4 w-4" />
                    Download Files
                  </Link>
                </>
              )}

              {(userType === "hod" || userType === "principal" || userType === "examdept") && (
                <Link 
                  href="/dashboard/history" 
                  className={getLinkClasses("/dashboard/history")}
                  prefetch={false}
                >
                  <History className="h-4 w-4" />
                  Past Notifications
                </Link>
              )}

              {userType === "professor" && (
                <>
                  <Link 
                    href="/dashboard/notification" 
                    className={getLinkClasses("/dashboard/notification")}
                    prefetch={false}
                  >
                    <Bell className="h-4 w-4" />
                    Send Notification
                  </Link>
                  <Link 
                    href="/dashboard/notes_history" 
                    className={getLinkClasses("/dashboard/notes_history")}
                    prefetch={false}
                  >
                    <Book className="h-4 w-4" />
                    Past Notes
                  </Link>
                  <Link 
                    href="/dashboard/notification_history" 
                    className={getLinkClasses("/dashboard/notification_history")}
                    prefetch={false}
                  >
                    <History className="h-4 w-4" />
                    Past Notification
                  </Link>
                </>
              )}
            </nav>

            <div className="mt-auto py-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    {user?.name || "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/auth/change-password" className="w-full" prefetch={false}>
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
};

export default MobileHeader;