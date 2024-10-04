"use client"; 
import { useEffect, useState } from "react"; // Added useState import
import { doc, getDoc } from "firebase/firestore";
import { app, db } from "@/config/firebase";

const RedirectPage = () => {
  const [error, setError] = useState(false); // Added state for error handling

  useEffect(() => {
    const fetchURLFromFirestore = async () => {
      const docRef = doc(db, "QRLink", "qrlink"); // Specify your collection
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const url = docSnap.data().url;
        window.location.href = url;
      } else {
        console.error("No such document!");
        setError(true); // Set error state to true
      }
    };

    fetchURLFromFirestore();
  }, []);

  return (
    <p className="text-2xl font-bold text-white mb-4">
      {error ? "Oops ... Unable to redirect : (" : "Redirecting . . ."} // Conditional rendering based on error state
    </p>
  );
};

export default RedirectPage;
