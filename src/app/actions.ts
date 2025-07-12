"use server"

import { dbAdmin } from "@/lib/firebase-admin"

interface Lecture {
  lectureBatch: string
  lectureStartTime: string
  lectureEndTime: string
  lectureFacultyName: string
  lectureName: string
  lectureRoomNo: string | null
}

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"

interface TimetableData {
  Monday: Lecture[]
  Tuesday: Lecture[]
  Wednesday: Lecture[]
  Thursday: Lecture[]
  Friday: Lecture[]
}

export async function pushTimetableServerAction(
  year: string,
  division: string,
  timetable: Record<DayOfWeek, Lecture[]>,
) {
  try {
    const docId = `${year}-${division}`
    const docRef = dbAdmin.collection("TimeTable").doc(docId)

    const cleanedTimetable: Record<DayOfWeek, Lecture[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    }
    Object.entries(timetable).forEach(([day, lectures]) => {
      cleanedTimetable[day as DayOfWeek] = lectures.map(
        (rest) => ({
          ...rest,
          lectureBatch: rest.lectureBatch?.trim() === "" ? "All" : rest.lectureBatch,
        }),
      )
    })

    await docRef.set(cleanedTimetable)
    console.log(`✅ Timetable for ${docId} saved successfully!`)
    return { success: true, message: "Timetable saved successfully!" }
  } catch (error: any) {
    console.error("❌ Error pushing timetable:", error)
    return { success: false, message: `Failed to save timetable: ${error.message}` }
  }
}

export async function fetchExistingDocIdsServerAction() {
  try {
    const snapshot = await dbAdmin.collection("TimeTable").get()
    const docIds = snapshot.docs.map((doc) => doc.id)
    return { success: true, docIds }
  } catch (error: any) {
    console.error("❌ Error fetching existing doc IDs:", error)
    return { success: false, message: `Failed to fetch existing IDs: ${error.message}`, docIds: [] }
  }
}

export async function fetchProfessorsServerAction() {
  try {
    const snapshot = await dbAdmin.collection("Professors").get()
    const professors = snapshot.docs.map((doc) => doc.data().name)
    return { success: true, professors }
  } catch (error: any) {
    console.error("❌ Error fetching professors:", error)
    return { success: false, message: `Failed to fetch professors: ${error.message}`, professors: [] }
  }
}

export async function fetchSubjectsServerAction() {
  try {
    const snapshot = await dbAdmin.collection("Subjects").get()
    let subjectsList: string[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      subjectsList = [...subjectsList, ...(data.even_sem || []), ...(data.odd_sem || [])]
    })
    return { success: true, subjects: [...new Set(subjectsList)] }
  } catch (error: any) {
    console.error("❌ Error fetching subjects:", error)
    return { success: false, message: `Failed to fetch subjects: ${error.message}`, subjects: [] }
  }
}
