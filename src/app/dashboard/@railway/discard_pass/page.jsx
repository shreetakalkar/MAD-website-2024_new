"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadString } from "firebase/storage";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { dateFormat } from "@/constants/dateFormat";

export default function DiscardPass() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // ✅ Transfer valid data from Firestore to JSON on first load
  useEffect(() => {
    const requiredFields = [
      "address", "ageMonths", "ageYears", "branch", "certificateNumber", "class",
      "dob", "duration", "firstName", "from", "gender", "gradyear",
      "lastName", "lastPassIssued", "middleName", "passNum",
      "phoneNum", "status", "statusMessage", "to", "travelLane"
    ];

    const isValidObject = (obj) => {
      return requiredFields.every(field => {
        const value = obj[field];
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (typeof value === "number" && isNaN(value)) return false;
        return true;
      });
    };

    const checkAndTransferTempHistory = async () => {
      setLoading(true);
      try {
        const storage = getStorage();
        const fileRef = ref(storage, "RailwayConcession/concessionHistory.json");

        const tempHistoryRef = doc(db, "ConcessionTempHistory", "TempHistory");
        const tempHistorySnap = await getDoc(tempHistoryRef);

        if (!tempHistorySnap.exists()) return;

        const tempData = tempHistorySnap.data();
        const TempData = tempData.TempData || [];

        const validObjects = TempData.filter(isValidObject);

        if (validObjects.length > 0) {
          const url = await getDownloadURL(fileRef);
          const response = await fetch(url);
          const existingData = await response.json();
          const history = Array.isArray(existingData) ? existingData : [];

          const updatedHistory = [...history, ...validObjects];

          await uploadString(fileRef, JSON.stringify(updatedHistory, null, 2), "raw", {
            contentType: "application/json",
          });

          for (const obj of validObjects) {
            await updateDoc(tempHistoryRef, {
              TempData: arrayRemove(obj),
            });
          }

          console.log(`✅ Transferred ${validObjects.length} objects and removed them from Firestore.`);
        } else {
          console.log("ℹ️ No valid data found in TempData.");
        }
      } catch (err) {
        console.error("❌ Error transferring and cleaning up temp history:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAndTransferTempHistory();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const inputField = event.target.elements.passNum;
    const passNum = inputField.value.trim();

    if (!passNum) {
      toast({
        description: `Pass Number is Empty`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const storage = getStorage();
      const fileRef = ref(storage, "RailwayConcession/concessionHistory.json");

      const url = await getDownloadURL(fileRef);
      const response = await fetch(url);
      const existingData = await response.json();
      const history = Array.isArray(existingData) ? existingData : [];

      const newEntry = {
        passNum,
        certificateNumber: passNum,
        status: "cancelled",
        lastPassIssued: new Date().toISOString(),
      };

      history.push(newEntry);

      await uploadString(fileRef, JSON.stringify(history, null, 2), "raw", {
        contentType: "application/json",
      });

      // Update discard stats in Firestore
      const statRef = doc(db, "ConcessionHistory", "DailyStats");
      const statSnap = await getDoc(statRef);
      const currentDate = dateFormat(new Date());

      if (statSnap.exists()) {
        const statsArray = statSnap.data().stats || [];
        const dateIndex = statsArray.findIndex((entry) => entry.date === currentDate);

        if (dateIndex >= 0) {
          if (typeof statsArray[dateIndex].discardedPass !== "number") {
            statsArray[dateIndex].discardedPass = 0;
          }
          statsArray[dateIndex].discardedPass += 1;
        } else {
          statsArray.push({ date: currentDate, discardedPass: 1 });
        }

        await updateDoc(statRef, { stats: statsArray });
      } else {
        await setDoc(statRef, {
          stats: [{ date: currentDate, discardedPass: 1 }],
        });
      }

      toast({
        description: `Pass Number ${passNum} successfully discarded.`,
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("❌ Error updating document:", error);
      toast({
        title: "Failed to Discard Pass",
        description: "There was an issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 mt-[20vh]">
          <h2 className="mb-8 text-lg font-semibold text-center text-gray-700">
            <span className="text-3xl font-bold">Do You Want To Discard a Pass?</span>
            <p className="text-sm text-center text-gray-500 pt-2">
              Use this only when there is a pass missing in Excel and you want to cancel it.
            </p>
          </h2>

          <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md">
            <Input
              id="passNum"
              name="passNum"
              type="text"
              placeholder="Enter Pass Number"
              className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <Button
              type="submit"
              className="ml-5 px-5 py-3 font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              Submit
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
