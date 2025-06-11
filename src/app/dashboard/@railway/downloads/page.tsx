"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { doc, getDoc, setDoc, Timestamp, updateDoc, arrayRemove } from "firebase/firestore"
import { db } from "@/config/firebase"
import { createExcelFile, downloadExcelFile } from "@/lib/excelUtils"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import DownloadTable from "@/components/DownloadTable"
import type { Enquiry } from "@/constants/types/userTypes"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader } from "lucide-react"
import { getStorage, ref, getDownloadURL, uploadString } from "firebase/storage"

export interface BatchElement {
  enquiries: Enquiry[]
  fileName: string
  lane: "Central" | "Western"
  isDownloaded: boolean
  date: Date | null
}

export interface Download {
  from: number
  to: number
  date: Date
  filename: string
}

interface PassBookRange {
  low: number
  high: number
}

interface PassBookRanges {
  [key: string]: PassBookRange
}

interface HistoryItem {
  passNum: string
}

// Moved outside component as it's a pure function
const parseKeyRanges = (data: any) => {
  return Object.keys(data).reduce((acc: any, key: string) => {
    const [start, end] = key.split("-")

    // remove prefix if exists in the ranges of the filename
    const low = Number.parseInt(start.replace(/^[A-Za-z]\s*/, ""))
    const high = Number.parseInt(end.replace(/^[A-Za-z]\s*/, ""))

    acc[key] = { low, high }
    return acc
  }, {})
}

// Moved outside component as it's a pure function
const makeBatches = (data: Enquiry[], downloadHistory: Download[], passBookRanges: PassBookRanges) => {
  const seenPassNums = new Set<string>()
  const uniqueData: Enquiry[] = []
  const batchedEnquiries: BatchElement[] = []

  // Get unique entries (latest first)
  for (let i = 0; i < data.length; i++) {
    const enquiry = data[i]
    if (!seenPassNums.has(enquiry.passNum)) {
      seenPassNums.add(enquiry.passNum)
      uniqueData.push(enquiry)
    }
  }

  const isDownloaded = (fileName: string) => {
    return downloadHistory.some((d) => d.filename === fileName)
  }

  const getDownloadDate = (fileName: string) => {
    const download = downloadHistory.find((d) => d.filename === fileName)
    return download ? new Date(download.date) : null
  }

  Object.entries(passBookRanges).forEach(([rangeKey, range]) => {
    const enquiriesInRange = uniqueData.filter((enquiry) => {
      const passNum = Number.parseInt(enquiry.passNum.replace(/^[A-Za-z]\s*/, ""))

      return (
        (enquiry.status === "serviced" || enquiry.status === "cancelled") &&
        passNum >= range.low &&
        passNum <= range.high
      )
    })

    if (enquiriesInRange.length > 0) {
      const fileName = rangeKey // Using the original range key as filename
      batchedEnquiries.push({
        enquiries: enquiriesInRange,
        fileName: fileName,
        lane: enquiriesInRange[0].travelLane as "Central" | "Western", // Taking first entry's lane
        isDownloaded: isDownloaded(fileName),
        date: getDownloadDate(fileName),
      })
    }
  })

  // Sort batches by filename
  const sortedBatches = batchedEnquiries.sort((a, b) => {
    // Extract numbers from filenames for proper numeric sorting
    const aNum = Number.parseInt(a.fileName.replace(/^[A-Za-z]\s*/, "").split("-")[0])
    const bNum = Number.parseInt(b.fileName.replace(/^[A-Za-z]\s*/, "").split("-")[0])
    return aNum - bNum
  })

  // console.log(sortedBatches);

  return sortedBatches
}

const Downloads: React.FC = () => {
  const { theme } = useTheme()
  const { toast } = useToast()
  const [batchedEnquiries, setBatchedEnquiries] = useState<BatchElement[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredBatches, setFilteredBatches] = useState<BatchElement[]>([])
  const [isTransferComplete, setIsTransferComplete] = useState(false)

  // For adding new Pass Book
  const [rangeStart, setRangeStart] = useState("")
  const [rangeEnd, setRangeEnd] = useState("")
  const [travelLane, setTravelLane] = useState("Select Lane")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(Boolean)

  const storage = getStorage()
  const fileRef = ref(storage, "RailwayConcession/concessionHistory.json")

  // To Save New Pass Book
  const handleSave = async () => {
    if (!rangeStart.trim() || !rangeEnd.trim()) {
      toast({
        description: "All fields are required.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const docRef = doc(db, "ConcessionHistory", "PassBook")

      const newEntry = {
        [`${rangeStart}-${rangeEnd}`]: {
          date: Timestamp.now(),
          travelLane: travelLane,
        },
      }

      await updateDoc(docRef, newEntry)

      toast({
        description: "Input saved successfully.",
      })

      setRangeStart("")
      setRangeEnd("")
      setTravelLane("Western")
      setLoading(false)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving input:", error)
      toast({
        description: "Failed to save input. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchDownloadHistory = useCallback(async () => {
    try {
      const concessionHistoryRef = doc(db, "ConcessionHistory", "History")
      const docSnap = await getDoc(concessionHistoryRef)
      if (docSnap.exists() && docSnap.data().downloaded) {
        return docSnap.data().downloaded
      }
      return []
    } catch (error) {
      console.error("Error fetching download history:", error)
      return []
    }
  }, []) // Removed 'db'

  const fetchPassBookDetails = useCallback(async () => {
    try {
      const passBookRef = doc(db, "ConcessionHistory", "PassBook")
      const docSnap = await getDoc(passBookRef)
      if (docSnap.exists() && docSnap.data()) {
        return docSnap.data()
      }
      return []
    } catch (error) {
      console.error("Error fetching pass book details:", error)
      return []
    }
  }, []) // Removed 'db'

  const handleDownloadBatchExcel = async (batch: BatchElement) => {
    try {
      const excelContent = await createExcelFile(batch)

      if (!excelContent) {
        toast({
          title: "Error",
          description: "Failed to generate Excel content.",
        })
        return
      }

      downloadExcelFile(excelContent, batch.fileName)

      const newDownload = {
        from: batch?.enquiries[0].passNum,
        to: batch?.enquiries[batch?.enquiries?.length - 1].passNum,
        date: new Date().toISOString(),
        filename: batch.fileName,
      }

      batch.date = new Date()
      batch.isDownloaded = true

      const concessionHistoryRef = doc(db, "ConcessionHistory", "History")

      // Fetch the current document
      const docSnap = await getDoc(concessionHistoryRef)

      if (docSnap.exists()) {
        const downloadedArray = docSnap.data().downloaded || []
        const existingIndex = downloadedArray.findIndex((item: any) => item.filename === newDownload.filename)

        if (existingIndex !== -1) {
          downloadedArray[existingIndex] = newDownload
        } else {
          downloadedArray.push(newDownload)
        }

        await updateDoc(concessionHistoryRef, {
          downloaded: downloadedArray,
        })
      } else {
        await setDoc(concessionHistoryRef, {
          downloaded: [newDownload],
        })
      }

      //updating local state
      const updateBatches = (batches: BatchElement[]) =>
        batches.map((b) => (b.fileName === batch.fileName ? { ...b, isDownloaded: true, date: new Date() } : b))

      setBatchedEnquiries(updateBatches(batchedEnquiries))
    } catch (error) {
      console.error("Error handling Excel download:", error)
      toast({
        title: "Error",
        description: "Failed to download Excel file. Please try again later.",
      })
    }
  }

  const fetchEnquiries = useCallback(async () => {
    try {
      const concessionHistoryRef = doc(db, "ConcessionHistory", "History")
      const docSnap = await getDoc(concessionHistoryRef)
      const downloadHistory = await fetchDownloadHistory()
      const passBookDetails = await fetchPassBookDetails()

      // FireStrorage
      const url = await getDownloadURL(fileRef)
      const response = await fetch(url)
      const historyData: Enquiry[] = await response.json()

      if (!docSnap.exists() || !historyData.length) {
        setFilteredBatches([])
        return
      }

      if (!passBookDetails) {
        toast({
          title: "Error",
          description: "Failed to fetch passbook ranges.",
        })
        return
      }

      const keyRangeMap = parseKeyRanges(passBookDetails)

      const sortedData = historyData
        .sort((a, b) => {
          const aClean = a.passNum.replace(/^[A-Za-z]\s*/, "")
          const bClean = b.passNum.replace(/^[A-Za-z]\s*/, "")
          return bClean.localeCompare(aClean)
        })
        .reverse()

      console.log("Sorted Data", sortedData)

      const batches = makeBatches(sortedData, downloadHistory, keyRangeMap)
      setBatchedEnquiries(batches)
      setFilteredBatches(batches)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again later.",
      })
    }
  }, [toast, fetchDownloadHistory, fetchPassBookDetails, fileRef, setBatchedEnquiries, setFilteredBatches]) // Removed 'db'

  // function to transfer data from Firestore to JSON file and clean ConcessionTempHistory
  useEffect(() => {
    const requiredFields = [
      "address",
      "ageMonths",
      "ageYears",
      "branch",
      "certificateNumber",
      "class",
      "dob",
      "duration",
      "firstName",
      "from",
      "gender",
      "gradyear",
      "lastName",
      "lastPassIssued",
      "middleName",
      "passNum",
      "phoneNum",
      "status",
      "statusMessage",
      "to",
      "travelLane",
    ]

    const isValidObject = (obj: any) => {
      return requiredFields.every((field) => {
        const value = obj[field]
        if (value === null || value === undefined) return false
        if (typeof value === "string" && value.trim() === "") return false
        if (typeof value === "number" && isNaN(value)) return false
        return true
      })
    }

    const checkAndTransferTempHistory = async () => {
      setLoading(true)
      try {
        const tempHistoryRef = doc(db, "ConcessionTempHistory", "TempHistory")
        const tempHistorySnap = await getDoc(tempHistoryRef)

        if (!tempHistorySnap.exists()) return

        const tempData = tempHistorySnap.data()
        const TempData = tempData.TempData || []

        const validObjects = TempData.filter(isValidObject)

        if (validObjects.length > 0) {
          // Fetch existing history.json data
          const url = await getDownloadURL(fileRef)
          const response = await fetch(url)
          const existingData = await response.json()
          const history = Array.isArray(existingData) ? existingData : []

          const updatedHistory = [...history, ...validObjects]

          // Upload updated history
          await uploadString(fileRef, JSON.stringify(updatedHistory, null, 2), "raw", {
            contentType: "application/json",
          })

          // Delete valid objects from Firestore array
          for (const obj of validObjects) {
            await updateDoc(tempHistoryRef, {
              TempData: arrayRemove(obj),
            })
          }

          console.log(`Transferred ${validObjects.length} objects and removed them from Firestore.`)
        } else {
          console.log("No valid data found in TempData.")
        }
      } catch (err) {
        console.error("Error transferring and cleaning up temp history:", err)
      } finally {
        setLoading(false)
        setIsTransferComplete(true)
      }
    }

    checkAndTransferTempHistory()
  }, [fileRef, setLoading, setIsTransferComplete]) // Removed 'db'

  useEffect(() => {
    if (!isTransferComplete) return
    fetchEnquiries()
  }, [isTransferComplete, fetchEnquiries])

  useEffect(() => {
    const allBatches = batchedEnquiries

    const filtered = allBatches.filter((batch) => batch.fileName.toLowerCase().includes(searchTerm.toLowerCase()))

    setFilteredBatches(filtered)
  }, [searchTerm, batchedEnquiries])

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className={`container mx-auto p-4 ${theme === "dark" ? "dark" : ""}`}>
          <div
            style={{
              color: "red",
              fontWeight: "bold",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            Download Excel Files ONLY when All passes are collected. If there are few passes which are not Collected
            then Cancel those passes from Update Pass.
          </div>
          <div className="flex items-center justify-between mb-4 p-5">
            <div className="flex w-full justify-between flex-wrap items-center">
              <h2 className="text-2xl max-sm:text-xl font-semibold mr-4">Downloads</h2>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="ml-5 px-5 py-3 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add New Pass Book
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Pass Book</DialogTitle>
                    <DialogDescription>Enter the details of the Railway Pass Book</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rangeStart" className="text-right">
                        Book Start
                      </Label>
                      <Input
                        id="rangeStart"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rangeEnd" className="text-right">
                        Book End
                      </Label>
                      <Input
                        id="rangeEnd"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Travel Lane</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="col-span-3">
                            {travelLane}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setTravelLane("Western")}>Western</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTravelLane("Central")}>Central</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      className="ml-5 px-5 py-3 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={handleSave}
                    >
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex space-x-4 relative">
                <div className="relative flex items-center">
                  <span className="absolute inset-y-0 left-2 flex items-center text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm8-2l4 4"
                      />
                    </svg>
                  </span>
                  <Input
                    className="pl-10 ring-1 ring-gray-400 focus:ring-gray-400"
                    type="text"
                    placeholder="Search batch names..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DownloadTable
            batches={filteredBatches}
            handleDownloadBatchExcel={handleDownloadBatchExcel}
            theme={theme || "dark"}
          />
        </div>
      )}
    </>
  )
}

export default Downloads
