"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  DocumentData,
} from "firebase/firestore";

interface Report {
  docId: string;
  index: number;
  id: string;
  title: string;
  description: string;
  userUid: string;
  isResolved: boolean;
  reportTime: string;
  attachments?: string[];
}

const BugReports = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Reports"));
        const data: Report[] = [];

        snapshot.forEach((docSnap) => {
          const allReports = docSnap.data().allReports || [];
          allReports.forEach((r: DocumentData, index: number) => {
            data.push({
              docId: docSnap.id,
              index,
              id: `${docSnap.id}-${index}`,
              title: r.title || "Untitled",
              description: r.description || "",
              userUid: r.userUid || "Unknown",
              isResolved: r.isResolved ?? false,
              reportTime: r.reportTime || "",
              attachments: r.attachments || [],
            });
          });
        });

        setReports(data);
      } catch (error) {
        console.error("❌ Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (value: string): string => {
    if (!value) return "N/A";
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? "Invalid Date" : parsed.toLocaleString();
  };

  const handleToggleResolved = async (report: Report) => {
    try {
      const ref = doc(db, "Reports", report.docId);
      const snapshot = await getDocs(collection(db, "Reports"));
      const targetDoc = snapshot.docs.find((d) => d.id === report.docId);

      if (!targetDoc) throw new Error("Report document not found.");

      const currentReports = targetDoc.data().allReports || [];

      if (report.index >= currentReports.length) {
        throw new Error("Invalid report index.");
      }

      currentReports[report.index].isResolved = !report.isResolved;

      await updateDoc(ref, { allReports: currentReports });

      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id ? { ...r, isResolved: !r.isResolved } : r
        )
      );
    } catch (error) {
      console.error("❌ Failed to update resolved status:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Bug Reports</h2>
      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Resolved</th>
              <th className="px-4 py-2 text-left">Attachments</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-4 py-2 max-w-xs">{report.title}</td>
                <td className="px-4 py-2 max-w-sm whitespace-pre-wrap">{report.description}</td>
                <td className="px-4 py-2">{formatDate(report.reportTime)}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleToggleResolved(report)}
                    className={`text-lg ${
                      report.isResolved ? "text-green-600" : "text-red-600"
                    } hover:opacity-80`}
                    title="Toggle resolved"
                  >
                    {report.isResolved ? "✅" : "❌"}
                  </button>
                </td>
                <td className="px-4 py-2">
                  {report.attachments?.length ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {report.attachments.map((url, i) =>
                        url.startsWith("http") ? (
                          <li key={i}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Attachment {i + 1}
                            </a>
                          </li>
                        ) : null
                      )}
                    </ul>
                  ) : (
                    "None"
                  )}
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BugReports;
