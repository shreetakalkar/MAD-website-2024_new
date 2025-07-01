"use client"
export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import { db } from "@/config/firebase"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"
import Image from "next/image"

interface Report {
  docId: string
  index: number
  id: string
  title: string
  description: string
  userUid: string
  userName: string
  userEmail: string
  isResolved: boolean
  reportTime: string
  attachments?: string[]
}

const BugReports = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsSnapshot = await getDocs(collection(db, "Reports"))
        const studentsSnapshot = await getDocs(collection(db, "Students "))
        const reportsData: Report[] = []

        const studentsMap = new Map<string, any>()
        studentsSnapshot.forEach((studentDoc) => {
          studentsMap.set(studentDoc.id.trim(), studentDoc.data())
        })

        reportsSnapshot.forEach((docSnap) => {
          const allReports = docSnap.data().allReports || []
          allReports.forEach((r: any, index: number) => {
            const studentUid = r.userUid?.trim() || ""
            const studentData = studentsMap.get(studentUid) || {}
            
             console.log("Debug Student Data:", {
      uid: studentUid,
      document: studentData,
      foundName: studentData.Name,
      foundEmail: studentData.email
    })
            reportsData.push({
              docId: docSnap.id,
              index,
              id: `${docSnap.id}-${index}`,
              title: r.title || "Untitled",
              description: r.description || "",
              userUid: studentUid,
              userName: studentData.Name || "Unknown",
              userEmail: studentData.email || "Unknown",
              isResolved: r.isResolved ?? false,
              reportTime: r.reportTime || "",
              attachments: r.attachments || [],
            })
          })
        })

        setReports(reportsData)
      } catch (error) {
        console.error("Error fetching reports:", error)
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

      if (report.index >= currentReports.length) throw new Error("Invalid report index.")
      
      currentReports[report.index].isResolved = !report.isResolved
      await updateDoc(ref, { allReports: currentReports })
      setReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, isResolved: !r.isResolved } : r)))
    } catch (error) {
      console.error("Failed to update resolved status:", error)
    }
  }

  const handleImageClick = (url: string) => {
    if (!url?.startsWith("http")) {
      console.error("Invalid image URL:", url)
      return
    }
    setSelectedImage(url)
    setIsImageLoaded(false)
    setImageError(false)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
    setIsImageLoaded(false)
    setImageError(false)
  }

  const handleRetryLoad = () => {
    setImageError(false)
    setIsImageLoaded(false)
    setTimeout(() => setSelectedImage(selectedImage), 10)
  }

  return (
    <div className="p-6">
      {selectedImage && !isImageLoaded && !imageError && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-4xl max-h-[90vh] overflow-auto">
            <button onClick={handleCloseModal} className="absolute top-2 right-2 z-10 text-xl font-bold text-black hover:text-gray-500 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
              ✕
            </button>

            {imageError ? (
              <div className="w-full max-w-md mx-auto text-center py-8">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold mb-2">Failed to load image</h3>
                <div className="bg-gray-100 p-3 rounded mb-4 overflow-x-auto">
                  <code className="text-sm text-gray-800 break-all">{selectedImage}</code>
                </div>
                <button onClick={handleRetryLoad} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Retry
                </button>
              </div>
            ) : (
              <div className="relative w-full h-auto max-h-[80vh]">
                <Image
                  src={selectedImage}
                  alt="Attachment Preview"
                  width={800}
                  height={600}
                  className="rounded object-contain w-full h-auto max-h-[80vh]"
                  unoptimized={true}
                  priority={true}
                  onLoadingComplete={() => setIsImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Resolved</th>
              <th className="px-4 py-2 text-left">Attachments</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 max-w-xs">{report.title}</td>
                <td className="px-4 py-2 max-w-sm whitespace-pre-wrap">{report.description}</td>
                <td className="px-4 py-2">{report.userName}</td>
                <td className="px-4 py-2">{report.userEmail}</td>
                <td className="px-4 py-2">{formatDate(report.reportTime)}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleToggleResolved(report)}
                    className={`text-lg ${report.isResolved ? "text-green-600" : "text-red-600"} hover:opacity-80`}
                  >
                    {report.isResolved ? "✅" : "❌"}
                  </button>
                </td>
                <td className="px-4 py-2">
                  {report.attachments?.length ? (
                    <div className="flex flex-col gap-2">
                      {report.attachments.map((url, i) => (
                        url?.startsWith("http") ? (
                          <button
                            key={i}
                            onClick={() => handleImageClick(url)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm w-fit"
                          >
                            📎 Attachment {i + 1}
                          </button>
                        ) : (
                          <span key={i} className="text-red-500 text-xs">Invalid URL</span>
                        )
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">No reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BugReports