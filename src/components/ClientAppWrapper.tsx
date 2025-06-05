// components/ClientAppWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import UnderMaintenancePage from "@/components/UnderMaintenancePage";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/providers/UserProvider";

export default function ClientAppWrapper({ children }: { children: React.ReactNode }) {
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      const docRef = doc(db, "Maintainance", "Web Maintenance");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsUnderMaintenance(docSnap.data().underMaintenance);
      }
    };
    fetchMaintenanceStatus();
  }, []);

  return (
    <UserProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {isUnderMaintenance ? <UnderMaintenancePage /> : children}
        <Toaster />
      </ThemeProvider>
    </UserProvider>
  );
}
