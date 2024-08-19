import {
  ShoppingCart,
  Home,
  ClipboardEdit,
  FilePlus,
  FileStack,
  GitPullRequestClosed,
  Download,
  FileBadge,
  Bell,
  History,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const LeftSideLinks = ({ userType }: { userType: string }) => {
  const pathname = usePathname();
  const getLinkClasses = (path: string) => {
    return pathname === path
      ? "flex items-center gap-2 px-2 py-2 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-700 shadow-lg dark:shadow-blue-600/50 transition-all duration-300 ease-in-out"
      : "flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-in-out hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/50";
  };

  return (
    <nav className="flex items-center px-2 text-sm font-medium lg:px-4 space-x-6">
      <Link href="/dashboard" className={getLinkClasses("/dashboard")}>
        <Home className="h-4 w-4" />
        Home
      </Link>

      {userType === "hod" && (
        <>
          <Link
            href="#"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <ShoppingCart className="h-4 w-4" />
            Create New Notes
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <ShoppingCart className="h-4 w-4" />
            Past Notes
          </Link>
        </>
      )}
      {userType === "committee" && (
        <>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <ShoppingCart className="h-4 w-4" />
            Create New Event
          </Link>
          <Link
            href="/dashboard/history-page"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <ShoppingCart className="h-4 w-4" />
            History
          </Link>
        </>
      )}
      {userType === "admin" && (
        <>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <ShoppingCart className="h-4 w-4" />
            Approve Events
          </Link>
          <Link
            href="/dashboard/history-page"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <ShoppingCart className="h-4 w-4" />
            History
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
            href="/dashboard/downloads"
            className={getLinkClasses("/dashboard/downloads")}
          >
            <Download className="h-4 w-4" />
            Download Files
          </Link>
        </>
      )}
      {(userType === "admin" ||
        userType === "hod" ||
        userType === "principal") && (
          <>
            <Link
              href="#"
              className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
            >
              <ShoppingCart className="h-4 w-4" />
              Create New Notifications
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
            >
              <ShoppingCart className="h-4 w-4" />
              Past Notifications
            </Link>
          </>
        )}
      {userType === "professor" && (
        <>
          <Link
            href="/dashboard/notification"
            className={getLinkClasses("/dashboard/notification")}
          >
            <Bell className="h-4 w-4" />
            Send Notification
          </Link>
          <Link
            href="/dashboard/history"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <History className="h-4 w-4" />
            History
          </Link>
        </>
      )}
    </nav>
  );
};

export default LeftSideLinks;
