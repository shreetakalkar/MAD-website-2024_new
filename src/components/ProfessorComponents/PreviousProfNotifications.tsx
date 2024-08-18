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

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  const handleView = (attachment: string) => {
    window.open(attachment);
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto pr-4">
        {notifications.length === 0 ? (
          <p className="text-white">No previous notifications found.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="bg-gray-800 flex flex-col gap-3 p-4 mb-4 rounded-lg">
              <div>
                <h3 className="text-2xl font-bold text-white">{notification.title}</h3>
                <p className="text-lg text-white">{notification.message}</p>
              </div>
              <span className="text-sm text-gray-400">
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(notification.notificationTime.toDate())}
              </span>
              <div className="flex gap-6 text-sm text-gray-400">
                <div>
                  <p>Topic: {notification.topic}</p>
                  <p>Sent By: {notification.sentBy}</p>
                </div>
              </div>
              {notification.attachments && notification.attachments.length > 0 && (
                <div>
                  <p className="text-gray-400 mb-1">Attachments:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleView(notification.attachments)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm"
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