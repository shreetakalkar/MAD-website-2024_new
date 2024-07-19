import {
  ShoppingCart,
  Home,
  ClipboardEdit,
  FilePlus,
  FileStack,
  GitPullRequestClosed,
  Download,
  FileBadge,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const LeftSideLinks = ({ userType }: { userType: string }) => {
  return (
    <nav className="flex items-center px-2 text-sm font-medium lg:px-4 space-x-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>

      {userType === "faculty" && (
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
        <Link
          href="#"
          className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
        >
          <ShoppingCart className="h-4 w-4" />
          Create New Event
        </Link>
      )}
      {userType === "admin" && (
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
        >
          <ShoppingCart className="h-4 w-4" />
          Approve Events
        </Link>
      )}
      {userType === "railway" && (
        <>
          <Link
            href="/dashboard/create_pass"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <FilePlus className="h-4 w-4" />
            Create New Pass
          </Link>
          <Link
            href="/dashboard/pending_req"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <FileStack className="h-4 w-4" />
            Pending Requests
          </Link>
          <Link
            href="/dashboard/update_pass"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <ClipboardEdit className="h-4 w-4" />
            Update Pass
          </Link>
          <Link
            href="/dashboard/collected_pass"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <FileBadge className="h-4 w-4" />
            Collected Pass
          </Link>
          <Link
            href="/dashboard/approved_rejected"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <GitPullRequestClosed className="h-4 w-4" />
            Approved/Rejected Passes
          </Link>
          <Link
            href="/dashboard/downloads"
            className="flex items-center gap-2 px-2 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <Download className="h-4 w-4" />
            Download Files
          </Link>
        </>
      )}
      {(userType === "admin" ||
        userType === "faculty" ||
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
    </nav>
  );
};

export default LeftSideLinks;
