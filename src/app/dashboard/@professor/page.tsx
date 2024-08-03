"use client";
import { db } from "@/config/firebase";
import { useUser } from "@/providers/UserProvider";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import ProfessorDetails from "@/components/ProfessorComponents/ProfessorDetails";
import UploadDocs  from "@/components/ProfessorComponents/UploadDocs";
import { Separator } from "@/components/ui/separator";

export default function page() {
  const { user } = useUser();
  const [userData, setUserData] = React.useState<any>(null);

  useEffect(() => {
    console.log(user);
    const fetchUserType = async ({ uid }: { uid: string }) => {
      if (!uid) return;
      let facultyRef = doc(db, "Professors", uid);
      let docSnap = await getDoc(facultyRef);
      console.log(docSnap.data());
      setUserData(docSnap.data());
    };
    console.log(user?.uid);

    fetchUserType({ uid: user?.uid || "" });
  }, []);

  return (
<div className="w-full max-w-8xl mx-auto px-4 md:px-6 py-8 md:py-12">
  <div className="grid grid-cols-1 md:grid-cols-8 gap-8">
    <div className="col-span-1 md:col-span-3">
      {userData && <ProfessorDetails professor={userData} />}
    </div>
    <div className="col-span-1 md:col-span-5">
      {userData && <UploadDocs name={userData.name} />}
    </div>
  </div>
</div>
  );
}
