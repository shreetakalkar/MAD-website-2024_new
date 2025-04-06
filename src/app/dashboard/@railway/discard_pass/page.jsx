"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase";
import { arrayUnion, doc, updateDoc, Timestamp, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { Loader } from "lucide-react";
import { dateFormat } from "@/constants/dateFormat";
import { getStorage, ref, getDownloadURL, uploadString } from "firebase/storage";


export default function DiscardPass() {

  const storage = getStorage();
  const fileRef = ref(storage, "RailwayConcession/concessionHistory.json");

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

      // Update Stats
      const concessionHistoryStatRef = doc(db, "ConcessionHistory", "DailyStats");
      const concessionHistorySnap = await getDoc(concessionHistoryStatRef);
      const currentDate = dateFormat(new Date())
  
      if (concessionHistorySnap.exists()) {
        const historyData = concessionHistorySnap.data();
        let statsArray = historyData.stats || [];
        const dateIndex = statsArray.findIndex((entry) => entry.date === currentDate);
  
        if (dateIndex >= 0) {
          if (typeof statsArray[dateIndex].discardedPass !== 'number') {
            statsArray[dateIndex].discardedPass = 0;
          }
          statsArray[dateIndex].discardedPass += 1;
        } else {
          statsArray.push({
            date: currentDate,
            discardedPass: 1,
          });
        }
  
        await updateDoc(concessionHistoryStatRef, { stats: statsArray });
      } else {
        await setDoc(concessionHistoryStatRef, {
          stats: [{
            date: currentDate,
            discardedPass: 1,
          }],
        });
      }

      toast({
        // title: "Success",
        description: `Pass Number ${passNum} successfully discarded.`,
        variant: "default",
        className: "bg-green-500 text-white", 
      });
    } catch (error) {
      console.error("Error updating document:", error);
      toast({
        title: "Failed to Discard Pass",
        description: "There was an issue. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <> 
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
          <div className="flex flex-col items-center justify-center min-h-screenflex flex-col items-center justify-center min-h-[80vh] p-4 mt-[20vh]">
          <h2 className="mb-8 text-lg font-semibold text-center text-gray-700">
            <span className="text-3xl font-bold">Do You Want To Discard a Pass?</span>
            <p className="text-sm text-center text-gray-500 pt-50">
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
        )
      }
    </>
    
  );
}
