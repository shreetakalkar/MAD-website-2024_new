"use client"

import { useEffect, useState } from "react"
import { db } from "@/config/firebase"
import { collection, getDocs, updateDoc, doc, type DocumentData } from "firebase/firestore"
import Image from "next/image"

interface Report {
  docId: string
  index: number
  id: string
  title: string
  description: string
  userUid: string
  isResolved: boolean
  reportTime: string
  attachments?: string[]
}

const BugReports = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Reports"))
        const data: Report[] = []

        snapshot.forEach((docSnap) => {
          const allReports = docSnap.data().allReports || []
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
            })
          })
        })

        setReports(data)
      } catch (error) {
        console.error("❌ Error fetching reports:", error)
      }
    }

    fetchReports()
  }, [])

  const formatDate = (value: string): string => {
    if (!value) return "N/A"
    const parsed = new Date(value)
    return isNaN(parsed.getTime()) ? "Invalid Date" : parsed.toLocaleString()
  }

  const handleToggleResolved = async (report: Report) => {
    try {
      const ref = doc(db, "Reports", report.docId)
      const snapshot = await getDocs(collection(db, "Reports"))
      const targetDoc = snapshot.docs.find((d) => d.id === report.docId)

      if (!targetDoc) throw new Error("Report document not found.")
      const currentReports = targetDoc.data().allReports || []

      if (report.index >= currentReports.length) {
        throw new Error("Invalid report index.")
      }

      currentReports[report.index].isResolved = !report.isResolved
      await updateDoc(ref, { allReports: currentReports })

      setReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, isResolved: !r.isResolved } : r)))
    } catch (error) {
      console.error("❌ Failed to update resolved status:", error)
    }
  }

  const handleImageClick = (url: string) => {
    setSelectedImage(url)
    setIsImageLoaded(false)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
    setIsImageLoaded(false)
  }

  return (
    <div className="p-6">
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          {!isImageLoaded ? (
            // Show only spinner until image is loaded
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
          ) : (
            // Show modal container only after image is loaded
            <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-4xl max-h-[90vh] overflow-auto">
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 z-10 text-xl font-bold text-black hover:text-gray-500 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
              >
                ✕
              </button>

              <div className="relative w-full h-auto max-h-[80vh]">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Attachment Preview"
                  width={800}
                  height={600}
                  className="rounded object-contain w-full h-auto max-h-[80vh]"
                  onError={() => {
                    console.error("Failed to load image:", selectedImage)
                    handleCloseModal()
                  }}
                  priority
                />
              </div>
            </div>
          )}

          <div className="hidden">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Preload"
              width={800}
              height={600}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => {
                console.error("Failed to preload image:", selectedImage)
                handleCloseModal()
              }}
              priority
            />
          </div>
        </div>
      )}

     
      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-gray-100">Title</th>
              <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-gray-100">Description</th>
              <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-gray-100">Time</th>
              <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-gray-100">Resolved</th>
              <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-gray-100">Attachments</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-2 max-w-xs text-gray-900 dark:text-gray-100">{report.title}</td>
                <td className="px-4 py-2 max-w-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                  {report.description}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{formatDate(report.reportTime)}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleToggleResolved(report)}
                    className={`text-lg ${
                      report.isResolved ? "text-green-600" : "text-red-600"
                    } hover:opacity-80 transition-opacity`}
                    title={`Mark as ${report.isResolved ? "unresolved" : "resolved"}`}
                  >
                    {report.isResolved ? "✅" : "❌"}
                  </button>
                </td>
                <td className="px-4 py-2">
                  {report.attachments?.length ? (
                    <div className="flex flex-col gap-2">
                      {report.attachments.map((url, i) =>
                        url.startsWith("http") ? (
                          <button
                            key={i}
                            onClick={() => handleImageClick(url)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm w-fit"
                          >
                            📎 Attachment {i + 1}
                          </button>
                        ) : null,
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BugReports
