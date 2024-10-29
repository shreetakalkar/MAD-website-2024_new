"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useUser } from "@/providers/UserProvider";
import NoticeHistory from "./NoticeHistory";
import { Loader } from "lucide-react";

export interface Notice {
  id: string;
  title: string;
  content: {
    from: string;
    // Include other fields from the content object as needed
  };
  date: string;
  batch: string;
  branch: string;
  div: string;
  docURL: string;
  endDate: string;
  from: string;
  gradYear: string;
  startDate: string;
}

const ImportantNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); // Get user from custom hook
  const userType = user?.type || ""; // Default to empty string if user is undefined

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        console.log(userType);
        const noticeDocRef = doc(db, "ImportantNotice", "Content");
        const noticeSnapshot = await getDoc(noticeDocRef);

        if (noticeSnapshot.exists()) {
          const docData = noticeSnapshot.data();
          const content = docData["content"];
          let filteredContent = [];

          filteredContent = content.filter(
            (item: any) => item.from === userType
          );

          setNotices(filteredContent);
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
        console.error("Error fetching notices:", err);
      }
    };

    fetchNotices();
  }, []);

  console.log(notices);
  const [loading, setLoading] = useState<boolean>(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <NoticeHistory notices={notices} />
    </div>
  );
};

export default ImportantNotices;
