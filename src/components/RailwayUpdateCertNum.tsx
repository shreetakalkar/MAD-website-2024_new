"use client";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader } from "lucide-react";
import React, { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  setDoc
} from "firebase/firestore";
import { dateFormat } from "@/constants/dateFormat";
import { useToast } from "@/components/ui/use-toast";


type UpdateCertificateNumberProps = {
    setShowUpdateCertNum: React.Dispatch<React.SetStateAction<boolean>>;
  };

const UpdateCertificateNumber: React.FC<UpdateCertificateNumberProps> = ({
    setShowUpdateCertNum,
  }) => {
  const [loading, setLoading] = useState(false);
  const [currUser, setCurrUser] = useState<any | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [newCertificateNumber, setNewCertificateNumber] = useState("");
  const { toast } = useToast();


  const handleUpdatePassClick = () => {
    setShowUpdateCertNum(false); // Set the state to false to hide this component
  };

  const handleSearchForCertNum = async () => {
    if (!searchInput) return;

    setLoading(true);

    try {
      // Reference to the 'Concession History' collection and 'History' document
      console.log("UPDATE PASS NUM: ", searchInput)
      const historyDocRef = doc(db, "ConcessionHistory", "History");
      const historyDocSnap = await getDoc(historyDocRef);

      if (historyDocSnap.exists()) {
        const history = historyDocSnap.data()?.history as Array<any>;

        const matchedHistory = history
          .reverse()
          .find((entry) => entry.certificateNumber === searchInput);

        if (matchedHistory) {
          setCurrUser(matchedHistory);
          setNewCertificateNumber(matchedHistory.certificateNumber); // Set initial value
        } else {
          console.log("No matching certificate number found.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
        handleSearchForCertNum();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCertificateNumber(e.target.value);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSave = async () => {
    if (!currUser || !newCertificateNumber) return;

    setLoading(true);

    try {
      // Step 1: Update ConcessionHistory
      const concessionHistoryRef = doc(db, "ConcessionHistory", "History");
      const historyDocSnap = await getDoc(concessionHistoryRef);
      const historyData = historyDocSnap.data()?.history || [];

      let historyUpdated = false;

      // Reverse traverse the history array to find the matching certificate number
      for (let i = historyData.length - 1; i >= 0; i--) {
        const historyItem = historyData[i];
        if (historyItem.certificateNumber === currUser.certificateNumber) {
          // Update the history item
          historyItem.certificateNumber = newCertificateNumber;
          historyItem.passNum = newCertificateNumber;
          historyUpdated = true;
          break; // Once found, no need to check further
        }
      }

      // If we found the history item and updated it, save the changes back to Firestore
      if (historyUpdated) {
        await updateDoc(concessionHistoryRef, {
          history: historyData,
        });
      }

      // Step 2: Update ConcessionRequest collection
      const concessionRequestRef = collection(db, "ConcessionRequest");
      const qConcessionRequest = query(
        concessionRequestRef,
        where("passNum", "==", currUser.certificateNumber)
      );
      const concessionRequestSnapshot = await getDocs(qConcessionRequest);

      if (!concessionRequestSnapshot.empty) {
        concessionRequestSnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            passNum: newCertificateNumber,
          });
        });
      } else {
        console.log(
          "No ConcessionRequest found for certificateNumber:",
          currUser.certificateNumber
        );
      }

      // Step 3: Update ConcessionDetails collection
      const concessionDetailsRef = collection(db, "ConcessionDetails");
      const qConcessionDetails = query(
        concessionDetailsRef,
        where("certificateNumber", "==", currUser.certificateNumber)
      );
      const concessionDetailsSnapshot = await getDocs(qConcessionDetails);

      if (!concessionDetailsSnapshot.empty) {
        concessionDetailsSnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            certificateNumber: newCertificateNumber,
          });
        });
      } else {
        console.log(
          "No ConcessionDetails found for certificateNumber:",
          currUser.certificateNumber
        );
      }

      // Update Stats
      const concessionHistoryStatRef = doc(db, "ConcessionHistory", "DailyStats");
      const concessionHistorySnap = await getDoc(concessionHistoryStatRef);
      const currentDate = dateFormat(new Date())
  
      if (concessionHistorySnap.exists()) {
        const historyData = concessionHistorySnap.data();
        let statsArray = historyData.stats || [];
        const dateIndex = statsArray.findIndex((entry: any) => entry.date === currentDate);
  
        if (dateIndex >= 0) {
          if (typeof statsArray[dateIndex].updatedPass !== 'number') {
            statsArray[dateIndex].updatedPass = 0;
          }
          statsArray[dateIndex].updatedPass += 1;
        } else {
          statsArray.push({
            date: currentDate,
            updatedPass: 1,
          });
        }
  
        await updateDoc(concessionHistoryStatRef, { stats: statsArray });
      } else {
        await setDoc(concessionHistoryStatRef, {
          stats: [{
            date: currentDate,
            updatedPass: 1,
          }],
        });
      }

      // Show success message (using Toast or console)
      toast({description: "Certificate number updated successfully!",});
    } catch (error) {
      console.error("Error updating documents:", error);
      toast({
        description: "There was an error updating the certificate number.",
        variant: "destructive"
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleClose = () => {
    // Reset the new certificate number input field
    setNewCertificateNumber(currUser?.certificateNumber || "");
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className="h-[80vh] w-full flex flex-col items-center justify-center">
          <div className="h-[25%] w-full flex flex-col items-center justify-center">
            <div className="w-full h-1/2 flex items-center px-5 text-gray-700 relative">
                <button
                onClick={handleUpdatePassClick}
                className="absolute left-10 flex items-center gap-2 px-5 py-3 font-semibold text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
                >
                <ArrowLeft className="w-4 h-4" />
                Update Pass Data
                </button>
                <div className="mx-auto text-3xl font-bold">
                    Update Certificate Number
                    <p className="text-sm text-center text-gray-500 pt-50">
                        Use this only when there is a mistake in Certificate Number.
                    </p>
                </div>
            </div>


            <div className="w-full h-1/2 flex items-center justify-center p-5">
              <Input
                type="text"
                className="w-full max-w-sm p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                placeholder="Enter Certificate No"
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearchForCertNum}
                className="ml-5 px-5 py-3 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
              >
                Search
              </button>
            </div>
          </div>
          <div className="h-[75%] w-full flex flex-col items-center justify-center">
            {currUser ? (
              <>
                <div>
                  <div className="w-full p-4 border rounded-lg shadow-md bg-white">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            type="text"
                            value={`${currUser.lastName} ${currUser.firstName} ${currUser.middleName}`}
                            disabled
                            className="mt-1 block w-full px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            From
                          </label>
                          <input
                            type="text"
                            value={currUser.from}
                            disabled
                            className="mt-1 block w-full px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={currUser.lastName}
                            disabled
                            className="mt-1 block w-full px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md"
                          />
                        </div> */}
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700">
                            From
                          </label>
                          <input
                            type="text"
                            value={currUser.from}
                            disabled
                            className="mt-1 block w-full px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md"
                          />
                        </div> */}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Date of Issue
                          </label>
                          <input
                            type="text"
                            value={dateFormat(currUser.lastPassIssued.seconds)}
                            disabled
                            className="mt-1 block w-full px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Certificate Number
                          </label>
                          <input
                            type="text"
                            value={currUser.certificateNumber}
                            disabled
                            className="mt-1 block w-full px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {/* New Certificate Number */}
                          <b>New Certificate Number</b>
                        </label>
                        <input
                          type="text"
                          value={newCertificateNumber}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 text-sm text-gray-800 bg-yellow-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter new certificate number"
                        />
                      </div>
                      <div className="flex justify-end gap-4 mt-4">
                        <button
                          onClick={handleSave}
                          className="px-5 py-2 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={handleClose}
                          className="px-5 py-2 font-semibold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateCertificateNumber;
