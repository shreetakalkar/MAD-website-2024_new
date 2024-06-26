"use client";

import Link from "next/link";
import {
  Bell,
  Package2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "./Header";
import LeftSideLinks from "./leftSideLinks";


export default function Dashboard() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async ({ uid }: { uid: string }) => {
      const facultyRef = doc(db, "Faculty", uid);
      const docSnap = await getDoc(facultyRef);
      console.log(docSnap.data());
      setUserType(docSnap.data()?.type);
    };

    fetchUserType({ uid: "aZFJC56szEO7mfshzEVR75fxvu13" }); //railway
  }, []);
  console.log(userType);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-gray-100">

      {/* Left Side Block */}
      <div className="hidden border-r bg-white md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">

          {/* Logo/Notification */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-blue-600">
              <Package2 className="h-6 w-6" />
              <span className="">vrSafe</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>

          {/* Links */}
          <div className="flex-1">
            <LeftSideLinks userType={userType ? userType : ""}  />
          </div>

        </div>
      </div>

      {/* Right Side Block */}
      <div className="flex flex-col">

        <Header userType={userType ? userType : ""}  />

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no products
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start selling as soon as you add a product.
              </p>
              <Button className="mt-4">Add Product</Button>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
