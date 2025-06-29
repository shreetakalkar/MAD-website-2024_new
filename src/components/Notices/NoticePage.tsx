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
import { Loader2 as Loader } from "lucide-react";


import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export interface Notice {
  id: string;
  title: string;
  content: {
    from: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const userType = user?.type || "";

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticeDocRef = doc(db, "ImportantNotice", "Content");
        const noticeSnapshot = await getDoc(noticeDocRef);

        if (noticeSnapshot.exists()) {
          const docData = noticeSnapshot.data();
          const content = docData["content"] as Notice[];
          const filteredContent = content.filter(
            (item) => item.from === userType
          );

          setNotices(filteredContent);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [userType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <NoticeHistory notices={notices} />
    </div>
  );
};

export default ImportantNotices;