"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db, auth } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/Header";
import LeftSideLinks from "@/components/LeftSideLinks";
import { ModeToggle } from "@/components/modeToggle";
import Image from "next/image";
import DevsDark from "@/public/images/devs-dark.png";
import DevsLight from "@/public/images/devs-light.png";
import { useTheme } from "next-themes";
import ProtectionProvider from "@/providers/ProtectionProvider";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Home() {
  const { theme } = useTheme();
  const { user, setUser, setLoggedIn } = useUser();
  const router = useRouter();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async ({ uid }: { uid: string }) => {
      const facultyRef = doc(db, "Faculty", uid);
      const docSnap = await getDoc(facultyRef);
      setUserType(docSnap.data()?.type);
    };

    fetchUserType({ uid: "Kp7s1qw1LZfw9OW3euqfJg1SvFW2" });
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <ProtectionProvider>
      <div className={`grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ${theme}`}>
        {/* Left Side Block */}
        <div className={`hidden border-r md:block`}>
          <div className="flex h-full max-h-screen flex-col gap-2">
            {/* Mode Toggle */}
            <div className="h-[10%] flex justify-between">
              <div className="mt-2 ml-5">
                <Image src={theme == "dark" ? DevsDark : DevsLight} alt="logo" width={75} height={75} />
              </div>
              <div className="mt-5 mr-2">
                <ModeToggle />
              </div>
            </div>

            {/* Links */}
            <div className="flex-1 mt-5">
              <LeftSideLinks userType={userType ? userType : ""} />
            </div>
            <p>Welcome, {user?.name}!</p>

            {/* Logout Button */}
            <div className="p-4">
              <Button onClick={handleLogout} variant={"link"}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
            </div>
          </div>
        </div>

        {/* Right Side Block */}
        <div className="flex flex-col">
          <Header userType={userType ? userType : ""} />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
            </div>
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">You have no products</h3>
                <p className="text-sm text-muted-foreground">You can start selling as soon as you add a product.</p>
                <Button className="mt-4">Add Product</Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectionProvider>
  );
}
