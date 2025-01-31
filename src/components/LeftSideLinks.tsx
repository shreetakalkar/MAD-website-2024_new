import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart, Home, ClipboardEdit, FilePlus,
  FileStack, GitPullRequestClosed, Download,
  FileBadge, Bell, History, CalendarClock,
  HistoryIcon, Book, Cross, Ban
} from "lucide-react";
import { useTheme } from "next-themes";

const LeftSideLinks = ({ userType }: { userType: string }) => {
  const pathname = usePathname();
  const { theme } = useTheme();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    const isRailway = userType === "railway";

    return `
      relative flex items-center gap-1 md:gap-2 
      px-2 md:px-3 py-2 rounded-md
      font-medium text-xs md:text-sm transition-all duration-300
      ${isActive 
        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
        : "bg-gray-50 hover:bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      }
      group
      ${isRailway ? "" : "whitespace-nowrap"}
    `;
  };

  const iconClass = "h-4 w-4 transition-transform duration-300 group-hover:scale-110 flex-shrink-0";

  const NavLink = ({ href, icon: Icon, children }) => (
    <Link href={href} className={getLinkClasses(href)}>
      <Icon className={iconClass} />
      <span className={userType === "railway" ? "line-clamp-2" : "truncate"}>{children}</span>
    </Link>
  );

  return (
    <nav className="w-full">
      <div className={`
        flex items-center gap-1 md:gap-2 p-2
        ${userType === "railway" 
          ? "flex-wrap" 
          : "overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
        }
      `}>
        <NavLink href="/dashboard" icon={Home}>Home</NavLink>

        {(userType === "committee" || userType === "admin") && (
          <NavLink href="/dashboard/history-page" icon={History}>
            Past Events
          </NavLink>
        )}

        {userType === "railway" && (
          <>
            <NavLink href="/dashboard/create_pass" icon={FilePlus}>
              Create New Pass
            </NavLink>
            <NavLink href="/dashboard/pending_req" icon={FileStack}>
              Pending Requests
            </NavLink>
            <NavLink href="/dashboard/collected_pass" icon={FileBadge}>
              Collected Pass
            </NavLink>
            <NavLink href="/dashboard/update_pass" icon={ClipboardEdit}>
              Update Pass
            </NavLink>
            <NavLink href="/dashboard/approved_rejected" icon={GitPullRequestClosed}>
              Approved Passes
            </NavLink>
            <NavLink href="/dashboard/discard_pass" icon={Ban}>
              Discard Pass
            </NavLink>
            <NavLink href="/dashboard/downloads" icon={Download}>
              Download
            </NavLink>
          </>
        )}

        {(userType === "hod" || userType === "principal" || userType === "examdept") && (
          <NavLink href="/dashboard/history" icon={History}>
            Past Notifications
          </NavLink>
        )}

        {userType === "professor" && (
          <>
            <NavLink href="/dashboard/notification" icon={Bell}>
              Send Notification
            </NavLink>
            <NavLink href="/dashboard/notes_history" icon={Book}>
              Past Notes
            </NavLink>
            <NavLink href="/dashboard/notification_history" icon={History}>
              Past Notification
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default LeftSideLinks;