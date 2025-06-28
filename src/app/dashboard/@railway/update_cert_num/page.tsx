"use client";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
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
} from "firebase/firestore";
import { Toast } from "@/components/ui/toast";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadString,
} from "firebase/storage";

const UpdateCertificateNumber = () => {
  const [loading, setLoading] = useState(false);
  const [currUser, setCurrUser] = useState<any | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [newCertificateNumber, setNewCertificateNumber] = useState("");

  const handleUpdatePassClick = () => {
    window.location.href = "/dashboard/update_pass";
  };

  const handleSearch = async () => {
    if (!searchInput) return;
  
    setLoading(true);
  
    try {
      const storage = getStorage();
      const fileRef = storageRef(storage, "RailwayConcession/concessionHistory.json");
  
      // Fetch the JSON file from Firebase Storage
      const url = await getDownloadURL(fileRef);
      const response = await fetch(url);
      const history = await response.json();
  
      if (Array.isArray(history)) {
        // Search for matching certificate number (latest first)
        const matchedHistory = [...history]
          .reverse()
          .find((entry) => entry.certificateNumber === searchInput);
  
        if (matchedHistory) {
          setCurrUser(matchedHistory);
          setNewCertificateNumber(matchedHistory.certificateNumber); // Set initial value
        } else {
          console.log("No matching certificate number found.");
        }
      } else {
        console.error("Invalid history data format in JSON.");
      }
    } catch (error) {
      console.error("Error fetching history from JSON:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
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

    const storage = getStorage();
    const fileRef = storageRef(storage, "RailwayConcession/concessionHistory.json");

    try {
      // Step 1: Update ConcessionHistory
      const url = await getDownloadURL(fileRef);
      const response = await fetch(url);
      const historyData = await response.json();

      if (!Array.isArray(historyData)) {
        console.error("Invalid history format in JSON file.");
        return;
      }

      let historyUpdated = false;

      // Step 2: Update all matching entries
      for (let i = historyData.length - 1; i >= 0; i--) {
        const item = historyData[i];
        if (item.certificateNumber === currUser.certificateNumber) {
          item.certificateNumber = newCertificateNumber;
          item.passNum = newCertificateNumber;
          historyUpdated = true;
        }
      }

      // Step 3: If updated, upload the new JSON
      if (historyUpdated) {
        await uploadString(
          fileRef,
          JSON.stringify(historyData, null, 2),
          "raw",
          {
            contentType: "application/json",
          }
        );
        console.log("✅ Certificate number updated in JSON.");
      } else {
        console.warn("No matching certificate number found.");
      }

      // Step 2: Update ConcessionRequest collection
      const concessionRequestRef = collection(db, "ConcessionRequest");
      const qConcessionRequest = query(
        concessionRequestRef,
        where("certificateNumber", "==", currUser.certificateNumber)
      );
      const concessionRequestSnapshot = await getDocs(qConcessionRequest);

      if (!concessionRequestSnapshot.empty) {
        concessionRequestSnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            certificateNumber: newCertificateNumber,
          });
        });
      } else {
        // console.log(
        //   "No ConcessionRequest found for certificateNumber:",
        //   currUser.certificateNumber
        // );
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
        // console.log(
        //   "No ConcessionDetails found for certificateNumber:",
        //   currUser.certificateNumber
        // );
      }

      // Show success message (using Toast or console)
      alert("Certificate number updated successfully!");
    } catch (error) {
      console.error("Error updating documents:", error);
      alert("There was an error updating the certificate number.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleCancel = () => {
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
        <div className="h-[80vh] w-full bg-green-50 flex flex-col items-center justify-center">
          <div className="bg-red-50 h-[25%] w-full flex flex-col items-center justify-center">
            <div className="w-full h-1/2 bg-purple-200 flex items-center justify-center">
              <div className="text-2xl font-bold flex justify-center items-center">
                Update Certificate Number
              </div>
              <button
                onClick={handleUpdatePassClick}
                className="ml-5 px-5 py-4 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
              >
                Update Pass
              </button>
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
                onClick={handleSearch}
                className="ml-5 px-5 py-4 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
              >
                Search
              </button>
            </div>
          </div>
          <div className="bg-yellow-50 h-[75%] w-full flex flex-col items-center justify-center">
            {currUser ? (
              <>
                <div>
                  <div className="max-w-sm p-4 border rounded-lg shadow-md bg-white">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={currUser.firstName}
                            disabled
                            className="mt-1 block w-full px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Middle Name
                          </label>
                          <input
                            type="text"
                            value={currUser.middleName}
                            disabled
                            className="mt-1 block w-full px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={currUser.lastName}
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
                            value={currUser.From}
                            disabled
                            className="mt-1 block w-full px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            To
                          </label>
                          <input
                            type="text"
                            value={currUser.to}
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
                          New Certificate Number
                        </label>
                        <input
                          type="text"
                          value={newCertificateNumber}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter new certificate number"
                        />
                      </div>
                      <div className="flex justify-end gap-4 mt-4">
                        <button
                          onClick={handleSave}
                          className="px-5 py-2 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-5 py-2 font-semibold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <span>Search the certificate number that is to be updated</span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateCertificateNumber;
