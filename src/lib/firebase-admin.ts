// lib/firebase-admin.ts
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
    console.log("✅ Firebase Admin initialized")
  } catch (error) {
    console.error("❌ Firebase Admin initialization failed:", error)
    throw new Error("Failed to initialize Firebase Admin")
  }
}

export const dbAdmin = getFirestore()
