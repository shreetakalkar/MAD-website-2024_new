"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "next-themes";
import ProtectionProvider from "@/providers/ProtectionProvider";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import MobileHeader from "@/components/Mobile-Header";

export default function Home({
  admin,
  committee,
  faculty,
  principal,
  student,
  railway,
}: {
  admin: React.ReactNode;
  committee: React.ReactNode;
  faculty: React.ReactNode;
  principal: React.ReactNode;
  student: React.ReactNode;
  railway: React.ReactNode;
}) {
  const { theme } = useTheme();
  const { user } = useUser();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async ({ uid }: { uid: string }) => {
      const facultyRef = doc(db, "Faculty", uid);
      const docSnap = await getDoc(facultyRef);
      setUserType(docSnap.data()?.type);
    };

    fetchUserType({ uid: user?.uid || "" });
  }, []);

  return (
    <ProtectionProvider>
      <div className={`min-h-screen j w-full ${theme}`}>
        <Header userType={userType ? userType : ""} />
        <MobileHeader userType={userType ? userType : ""} />
        <div className="min-h-screen flex flex-col mt-4">
          {userType == "admin" && admin}
          {userType == "committee" && committee}
          {userType == "faculty" && faculty}
          {userType == "principal" && principal}
          {userType == "student" && student}
          {userType == "railway" && railway}
        </div>
      </div>
    </ProtectionProvider>
  );
}
