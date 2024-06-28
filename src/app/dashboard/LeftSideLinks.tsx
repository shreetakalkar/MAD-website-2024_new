import { ShoppingCart, Home } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const LeftSideLinks = ({ userType }: { userType: string }) => {
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <Link
        href="#"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>

      {userType === "faculty" && (
        <>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <ShoppingCart className="h-4 w-4" />
            Create New Notes
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <ShoppingCart className="h-4 w-4" />
            Past Notes
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
            <ShoppingCart className="h-4 w-4" />
            Create New Pass
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <ShoppingCart className="h-4 w-4" />
            Update Pass
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
          >
            <ShoppingCart className="h-4 w-4" />
            Pending Requests
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
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
  )
}

export default LeftSideLinks
