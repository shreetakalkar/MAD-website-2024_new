"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';

interface Notice {
  id: string;
  title: string;
  content: string;
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

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticesCollectionRef = collection(db, 'ImportantNotice');
        const data = await getDocs(noticesCollectionRef);
        const noticesData = data.docs.map((doc: QueryDocumentSnapshot) => {
          const noticeContent = doc.data().content;
          if (!noticeContent) {
            throw new Error(`Notice content is missing in document with ID: ${doc.id}`);
          }
          return {
            id: doc.id,
            ...noticeContent
          };
        }) as Notice[];
        setNotices(noticesData);
      } catch (err) {
        setError(err.message || "Unknown error occurred");
        console.error("Error fetching notices:", err);
      }
    };

    fetchNotices();
  }, []);

  console.log(notices)

  return (
    <div>
      DATA FETCH HOCHUKA HAI GUYS in the variable 'notices'
    </div>
  );
};

export default ImportantNotices;
