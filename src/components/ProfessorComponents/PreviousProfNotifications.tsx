import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useUser } from "@/providers/UserProvider";
import { Loader } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  topic: string;
  notificationTime: Timestamp;
  attachments: string;
  sentBy: string;
}

const PreviousProfNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const userName = user?.name;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userName) return;

      try {
        const q = query(
          collection(db, "notifications"),
          where("senderName", "==", userName)
        );
        const querySnapshot = await getDocs(q);
        const notificationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userName]);

  const handleView = (attachment: string) => {
    window.open(attachment);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100%]">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }
  return (
    <div
      style={{
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="h-full"
    >
      <div className="grid grid-cols-2 gap-x-4 pr-4">
        {notifications.length === 0 ? (
          <p className="text-white">No previous notifications found.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-muted flex flex-col gap-3 p-4 mb-4 rounded-lg"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-bold dark:text-white">
                  {notification.title}
                </h3>
                <p className="text-lg dark:text-white">
                  {notification.message}
                </p>
              </div>
              <span className="text-md dark:text-gray-400">
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(notification.notificationTime.toDate())}
              </span>
              <div className="flex gap-6 text-[0.9rem] dark:text-gray-400">
                <div>
                  <p>Topic: {notification.topic}</p>
                  <p>Sent By: {notification.sentBy}</p>
                </div>
              </div>
              {notification.attachments &&
                notification.attachments.length > 0 && (
                  <div className="flex gap-2 items-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      Attachments:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleView(notification.attachments)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm"
                      >
                        View Attachment
                      </button>
                    </div>
                  </div>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PreviousProfNotifications;
