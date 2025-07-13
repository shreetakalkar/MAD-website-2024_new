"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Plus, Trash2, Eye, Copy, ArrowUpFromLine } from "lucide-react"
import {
  pushTimetableServerAction,
  fetchExistingDocIdsServerAction,
  fetchProfessorsServerAction,
  fetchSubjectsServerAction,
} from "@/app/actions" // Import the server actions

interface Lecture {
  lectureBatch: string
  lectureStartTime: string
  lectureEndTime: string
  lectureFacultyName: string
  lectureName: string
  lectureRoomNo: string | null
}

// UI-only fields for lecture rendering
interface UILecture extends Lecture {
  isFacultyFocused?: boolean
  isLectureNameFocused?: boolean
}

interface TimetableData {
  Monday: Lecture[]
  Tuesday: Lecture[]
  Wednesday: Lecture[]
  Thursday: Lecture[]
  Friday: Lecture[]
}

type DayOfWeek = keyof TimetableData
type PushStatus = "idle" | "loading" | "pushed" | "error"

const TimetableGenerator: React.FC = () => {
  const divisions: string[] = [
    "Aids-B1",
    "Aids-B2",
    "Chem-K",
    "Comps-C1",
    "Comps-C2",
    "Comps-C3",
    "Extc-A",
    "It-B1",
    "It-B2",
    "Aids-T1",
    "Aids-T2",
    "It-T1",
    "It-T2",
    "Aids-S1",
    "Aids-S2",
    "Comps-D",
    "Comps-E",
    "Comps-F",
    "Aids-A",
    "Aids-B",
    "Chem-C",
    "Extc-G",
    "It-H",
    "It-I",
    "It-S1",
    "It-S2",
  ]

  const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  const [timetable, setTimetable] = useState<Record<DayOfWeek, UILecture[]>>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  })

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Monday")
  const [showJson, setShowJson] = useState<boolean>(false)
  const [year, setYear] = useState<string>("")
  const [division, setDivision] = useState<string>("")
  const [isDivisionFocused, setIsDivisionFocused] = useState<boolean>(false)
  const [existingDocIds, setExistingDocIds] = useState<string[]>([])
  const [docIdExists, setDocIdExists] = useState<boolean>(true)
  const [message, setMessage] = useState<string>("Enter Passout Year and Branch-Division")
  const [professors, setProfessors] = useState<string[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [pushStatus, setPushStatus] = useState<PushStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const loadInitialData = async () => {
      setErrorMessage("")
      const [profRes, subjRes] = await Promise.all([fetchProfessorsServerAction(), fetchSubjectsServerAction()])

      if (profRes.success) {
        setProfessors(profRes.professors)
      } else {
        setErrorMessage(profRes.message || "Failed to load professors.")
      }

      if (subjRes.success) {
        setSubjects(subjRes.subjects)
      } else {
        setErrorMessage(subjRes.message || "Failed to load subjects.")
      }
    }
    loadInitialData()
  }, [])

  useEffect(() => {
    if (!year || !division) {
      setDocIdExists(true)
      setMessage("Enter Passout Year and Branch-Division")
      setPushStatus("idle")
      setErrorMessage("")
    }
  }, [year, division])

  const fetchDocIds = async () => {
    setErrorMessage("")
    if (!year || !division) {
      setDocIdExists(true)
      setMessage("Enter Passout Year and Branch-Division")
      return
    }

    try {
      const res: { success: boolean; docIds: string[]; message?: string } = await fetchExistingDocIdsServerAction()
      if (res.success) {
        setExistingDocIds(res.docIds)
        const docId = `${year}-${division}`
        if (res.docIds.includes(docId)) {
          setDocIdExists(true)
          setMessage("Already exists in the database")
        } else {
          setDocIdExists(false)
          setMessage("Ready to add lectures")
        }
      } else {
        setErrorMessage(res.message || "Failed to fetch existing document IDs.")
      }
    } catch (error: any) {
      console.error("Error fetching timetable:", error)
      setErrorMessage(`Failed to check existing timetables: ${error.message}`)
    }
  }

  const pushTimetable = async (): Promise<void> => {
    setPushStatus("loading")
    setErrorMessage("")

    try {
      const res = await pushTimetableServerAction(year, division, timetable)
      if (res.success) {
        setPushStatus("pushed")
        setExistingDocIds((prev) => [...prev, `${year}-${division}`])
        alert("Timetable saved successfully!") // Changed to alert
        setDocIdExists(true)
      } else {
        setPushStatus("error")
        setErrorMessage(res.message || "Failed to save timetable.")
      }
    } catch (error: any) {
      console.error("Error pushing timetable:", error)
      setPushStatus("error")
      setErrorMessage(`An unexpected error occurred: ${error.message}`)
    } finally {
      setTimeout(() => setPushStatus("idle"), 3000)
    }
  }

  // Utility function to capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Convert 24-hour time to 12-hour format
  const formatTime = (time: string): string => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "pm" : "am"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Add new lecture
  const addLecture = (): void => {
    const newLecture = {
      lectureBatch: "",
      lectureStartTime: "",
      lectureEndTime: "",
      lectureFacultyName: "",
      lectureName: "",
      lectureRoomNo: null,
    }
    setTimetable((prev) => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], newLecture],
    }))
  }

  // Update lecture field
  const updateLecture = (dayIndex: number, field: keyof Lecture, value: string): void => {
    setTimetable((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((lecture, index) => {
        if (index === dayIndex) {
          let updatedValue: string | null = value
          // Apply capitalization for faculty name, lecture name, and batch
          if (field === "lectureFacultyName" || field === "lectureName" || field === "lectureBatch") {
            updatedValue = capitalizeWords(value)
          }
          // Convert time format for start and end times
          if (field === "lectureStartTime" || field === "lectureEndTime") {
            updatedValue = formatTime(value)
          }
          // Handle room number - convert empty string to null
          if (field === "lectureRoomNo") {
            updatedValue = value.trim() === "" ? null : value
          }
          return {
            ...lecture,
            [field]: updatedValue,
          } as UILecture
        }
        return lecture
      }),
    }))
  }

  // Delete lecture
  const deleteLecture = (dayIndex: number): void => {
    setTimetable((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((_, index) => index !== dayIndex),
    }))
  }

  // Generate JSON output
  const generateJson = (): string => {
    // Filter out days with no lectures
    const filteredTimetable: Partial<TimetableData> = {}
    Object.entries(timetable).forEach(([day, lectures]) => {
      if (lectures.length > 0) {
        // Remove UI-only fields from each lecture
        const cleanedLectures = lectures.map(({ isLectureNameFocused, isFacultyFocused, ...rest }) => ({
          ...rest,
          lectureBatch: rest.lectureBatch?.trim() === "" ? "All" : rest.lectureBatch,
        }))
        filteredTimetable[day as DayOfWeek] = cleanedLectures
      }
    })
    return JSON.stringify(filteredTimetable, null, 2)
  }

  // Copy JSON to clipboard
  const copyToClipboard = () => {
    const jsonData = generateJson()
    navigator.clipboard.writeText(jsonData).then(() => {
      alert("JSON copied to clipboard!")
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Error Message */}
      {errorMessage && (
        <div className="max-w-6xl mx-auto px-7 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      <div className="max-w-6xl flex gap-10 px-7 py-4 mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter Year"
            className="w-40 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Division</label>
          <input
            type="text"
            value={division}
            onFocus={() => setIsDivisionFocused(true)}
            onBlur={() => setTimeout(() => setIsDivisionFocused(false), 200)}
            onChange={(e) => setDivision(e.target.value)}
            placeholder="Enter Division"
            className="w-40 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          {isDivisionFocused && (
            <div className="suggestions">
              <ul className="bg-white dark:bg-gray-800 border absolute border-gray-300 dark:border-gray-700 rounded-md mt-1 max-h-40 overflow-y-auto w-full z-10 text-gray-900 dark:text-gray-200">
                {divisions
                  .filter(
                    (d) =>
                      d.toLowerCase().includes(division.toLowerCase()) && d.toLowerCase() !== division.toLowerCase(),
                  )
                  .map((d) => (
                    <li
                      key={d}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        setDivision(d)
                        setIsDivisionFocused(false)
                      }}
                    >
                      {d}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-auto">
          <button
            onClick={fetchDocIds}
            disabled={!year || !division}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </div>

      {docIdExists && <div className="text-center text-2xl mt-10 text-gray-700 dark:text-gray-300">{message}</div>}

      {!docIdExists && (
        <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900">
          {/* Day Selection */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedDay === day
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {day}
                  {timetable[day].length > 0 && (
                    <span className="ml-2 text-xs text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-600 bg-opacity-30 px-1.5 py-0.5 rounded-full">
                      {timetable[day].length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Day Lectures */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{selectedDay} Lectures</h2>
              <button
                onClick={addLecture}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus size={16} />
                Add Lecture
              </button>
            </div>

            {timetable[selectedDay].length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No lectures scheduled for {selectedDay}</p>
                <p className="text-sm">Click &quot;Add Lecture&quot; to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {timetable[selectedDay].map((lecture, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Batch Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Batch</label>
                        <input
                          type="text"
                          value={lecture.lectureBatch}
                          onChange={(e) => updateLecture(index, "lectureBatch", e.target.value)}
                          placeholder="Enter batch"
                          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      {/* Start Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          onChange={(e) => updateLecture(index, "lectureStartTime", e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        {lecture.lectureStartTime && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Formatted: {lecture.lectureStartTime}
                          </p>
                        )}
                      </div>

                      {/* End Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          onChange={(e) => updateLecture(index, "lectureEndTime", e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        {lecture.lectureEndTime && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Formatted: {lecture.lectureEndTime}
                          </p>
                        )}
                      </div>

                      {/* Faculty Name */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Faculty Name
                        </label>
                        <input
                          type="text"
                          value={lecture.lectureFacultyName}
                          onFocus={() => {
                            setTimetable((prev) => ({
                              ...prev,
                              [selectedDay]: prev[selectedDay].map((lec, idx) =>
                                idx === index ? { ...lec, isFacultyFocused: true } : lec,
                              ),
                            }))
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              setTimetable((prev) => ({
                                ...prev,
                                [selectedDay]: prev[selectedDay].map((lec, idx) =>
                                  idx === index ? { ...lec, isFacultyFocused: false } : lec,
                                ),
                              }))
                            }, 200)
                          }}
                          onChange={(e) => updateLecture(index, "lectureFacultyName", e.target.value)}
                          placeholder="Enter faculty name"
                          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          autoComplete="off"
                        />
                        {lecture.isFacultyFocused && (
                          <ul className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 absolute z-10 rounded-md mt-1 max-h-24 overflow-y-auto w-full text-gray-900 dark:text-gray-200">
                            {professors
                              .filter(
                                (prof) =>
                                  prof.toLowerCase().includes((lecture.lectureFacultyName || "").toLowerCase()) &&
                                  prof.toLowerCase() !== (lecture.lectureFacultyName || "").toLowerCase(),
                              )
                              .map((prof) => (
                                <li
                                  key={prof}
                                  className="px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700"
                                  onMouseDown={(e) => {
                                    e.preventDefault()
                                    updateLecture(index, "lectureFacultyName", prof)
                                    setTimetable((prev) => ({
                                      ...prev,
                                      [selectedDay]: prev[selectedDay].map((lec, idx) =>
                                        idx === index
                                          ? {
                                              ...lec,
                                              isFacultyFocused: false,
                                            }
                                          : lec,
                                      ),
                                    }))
                                  }}
                                >
                                  {prof}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>

                      {/* Lecture Name */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Lecture Name
                        </label>
                        <input
                          type="text"
                          value={lecture.lectureName}
                          onFocus={() => {
                            setTimetable((prev) => ({
                              ...prev,
                              [selectedDay]: prev[selectedDay].map((lec, idx) =>
                                idx === index ? { ...lec, isLectureNameFocused: true } : lec,
                              ),
                            }))
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              setTimetable((prev) => ({
                                ...prev,
                                [selectedDay]: prev[selectedDay].map((lec, idx) =>
                                  idx === index ? { ...lec, isLectureNameFocused: false } : lec,
                                ),
                              }))
                            }, 200)
                          }}
                          onChange={(e) => updateLecture(index, "lectureName", e.target.value)}
                          placeholder="Enter lecture name"
                          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          autoComplete="off"
                        />
                        {lecture.isLectureNameFocused && (
                          <ul className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 absolute z-10 rounded-md mt-1 max-h-24 overflow-y-auto w-full text-gray-900 dark:text-gray-200">
                            {subjects
                              .filter(
                                (subj) =>
                                  subj.toLowerCase().includes((lecture.lectureName || "").toLowerCase()) &&
                                  subj.toLowerCase() !== (lecture.lectureName || "").toLowerCase(),
                              )
                              .map((subj) => (
                                <li
                                  key={subj}
                                  className="px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700"
                                  onMouseDown={(e) => {
                                    e.preventDefault()
                                    updateLecture(index, "lectureName", subj)
                                    setTimetable((prev) => ({
                                      ...prev,
                                      [selectedDay]: prev[selectedDay].map((lec, idx) =>
                                        idx === index
                                          ? {
                                              ...lec,
                                              isLectureNameFocused: false,
                                            }
                                          : lec,
                                      ),
                                    }))
                                  }}
                                >
                                  {subj}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>

                      {/* Room Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Room Number (Optional)
                        </label>
                        <input
                          type="text"
                          value={lecture.lectureRoomNo || ""}
                          onChange={(e) => updateLecture(index, "lectureRoomNo", e.target.value)}
                          placeholder="Enter room number or leave empty"
                          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty for null value</p>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => deleteLecture(index)}
                        className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Eye size={16} />
              {showJson ? "Hide JSON" : "Preview JSON"}
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Copy size={16} />
              Copy JSON
            </button>
            <button
              disabled={pushStatus === "loading"}
              onClick={pushTimetable}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                pushStatus === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : pushStatus === "pushed"
                    ? "bg-green-600"
                    : pushStatus === "error"
                      ? "bg-red-500"
                      : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              <ArrowUpFromLine size={16} />
              {pushStatus === "loading"
                ? "Pushing..."
                : pushStatus === "pushed"
                  ? "Pushed ✓"
                  : pushStatus === "error"
                    ? "Error ✗"
                    : "Push"}
            </button>
          </div>

          {/* JSON Preview */}
          {showJson && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
              <h3 className="text-lg font-semibold mb-2 text-white">Generated JSON:</h3>
              <pre className="text-sm font-mono whitespace-pre-wrap">{generateJson()}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TimetableGenerator
