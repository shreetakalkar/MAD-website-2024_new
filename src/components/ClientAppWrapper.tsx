"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import UnderMaintenancePage from "@/components/UnderMaintenancePage";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/providers/UserProvider";

export default function ClientAppWrapper({ children }: { children: React.ReactNode }) {
  const [isUnderMaintenance, setIsUnderMaintenance] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const docRef = doc(db, "Maintainance", "Web Maintenance");
        const docSnap = await getDoc(docRef);
        setIsUnderMaintenance(docSnap.exists() ? docSnap.data().underMaintenance : false);
      } catch (err) {
        console.error("Error fetching maintenance status:", err);
        setIsUnderMaintenance(false);
      }
    };

    fetchMaintenanceStatus();
  }, []);

  if (isUnderMaintenance === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <UserProvider>
      {isUnderMaintenance ? <UnderMaintenancePage /> : children}
      <Toaster />
    </UserProvider>
  );
}
