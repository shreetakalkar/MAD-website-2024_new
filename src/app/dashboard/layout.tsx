"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "next-themes";
import ProtectionProvider from "@/providers/ProtectionProvider";
import { useUser } from "@/providers/UserProvider";
import Header from "@/components/Header";
import MobileHeader from "@/components/Mobile-Header";

export default function Home({
  admin,
  committee,
  hod,
  principal,
  student,
  railway,
  examdept,
  professor,
  tpo
}: {
  admin: React.ReactNode;
  committee: React.ReactNode;
  hod: React.ReactNode;
  principal: React.ReactNode;
  student: React.ReactNode;
  railway: React.ReactNode;
  examdept:React.ReactNode;
  professor: React.ReactNode;
  tpo: React.ReactNode;
}) {
  const { theme } = useTheme();
  const { user } = useUser();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    console.log(user);
    const fetchUserType = async ({ uid }: { uid: string }) => {
      if (!uid) return;
      let facultyRef = doc(db, "OfficialLogin", uid);
      let docSnap = await getDoc(facultyRef);
      console.log(docSnap.data()?.type);
      if (!docSnap.exists()) {
        facultyRef = doc(db, "Professors", uid);
        docSnap = await getDoc(facultyRef);
        console.log(docSnap.data());
        setUserType("professor"); 
      } else{
        setUserType(docSnap.data()?.type);
      };
    };

    fetchUserType({ uid: user?.uid || "" });
  }, []);

  return (
    <ProtectionProvider>
      <div className={`min-h-screen w-full ${theme}`}>
        <Header userType={userType ? userType : ""} />
        <MobileHeader userType={userType ? userType : ""} />
        <div className="min-h-screen flex flex-col mt-4">
          {userType == "admin" && admin}
          {userType == "committee" && committee}
          {userType == "hod" && hod}
          {userType == "principal" && principal}
          {userType == "student" && student}
          {userType == "railway" && railway}
          {userType == "examdept" && examdept}
          {userType == "professor" && professor}
          {userType == "tpo" && tpo}
        </div>
      </div>
    </ProtectionProvider>
  );
}
