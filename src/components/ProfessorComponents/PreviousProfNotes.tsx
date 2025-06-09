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

interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  professor_name: string;
  attachments: string[];
  target_classes: {
    branch: string;
    division: string;
    year: string;
  }[];
  time: Timestamp;
}

const PreviousProfNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const userName = user?.name;

  useEffect(() => {
    const fetchNotes = async () => {
      if (!userName) return;

      try {
        const q = query(
          collection(db, "Notes"),
          where("professor_name", "==", userName)
        );
        const querySnapshot = await getDocs(q);
        const notesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Note[];
        setNotes(notesData);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [userName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  const handleView = (attachment: string) => {
    window.open(attachment);
  };

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
      <div className="grid grid-cols-2 pr-4">
        {notes.length === 0 ? (
          <p className="dark:text-white">No previous notes found.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-muted flex flex-col gap-3 p-4 mb-4 rounded-lg"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-bold dark:text-white">
                  {note.title}
                </h3>
                <p className="text-lg dark:text-white">{note.description}</p>
              </div>

              <span className="text-md  dark:text-gray-400">
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(note.time.toDate())}
              </span>
              <div className="flex gap-6 text-[0.9rem] dark:text-gray-400">
                <div>
                  <p>Subject: {note.subject}</p>
                  <p>Professor: {note.professor_name}</p>
                </div>
                <div>
                  <p>Target Classes:</p>
                  <p>
                    {note.target_classes
                      .map(
                        (targetClass, index) =>
                          `${targetClass.branch} - ${targetClass.division} - ${targetClass.year}`
                      )
                      .join(", ")}
                  </p>
                </div>
              </div>
              {note.attachments && note.attachments.length > 0 && (
                <div className="flex gap-2 items-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">
                    Attachments:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {note.attachments.map((attachment, index) => (
                      <>
                        <button
                          key={index}
                          onClick={() => handleView(attachment)}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm"
                        >
                          Attachment {index + 1}
                        </button>
                      </>
                    ))}
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

export default PreviousProfNotes;
