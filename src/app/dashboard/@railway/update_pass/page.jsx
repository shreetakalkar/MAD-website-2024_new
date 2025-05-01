"use client";
import React, { useState } from "react";
import { collection, doc, getDoc, query, where, onSnapshot, arrayRemove, updateDoc} from "firebase/firestore";
import { db } from "@/config/firebase";
import RailwayUpdateCard from "@/components/RailwayUpdateCard";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import UpdateCertificateNumber from "@/components/RailwayUpdateCertNum";
import { getStorage, ref, getDownloadURL, uploadString } from "firebase/storage";
import { useEffect } from "react";

const formSchema = z.object({
  branch: z.string(),
  gradyear: z.string(),
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  gender: z.string(),
  dob: z.date(),
  doi: z.date(),
  phoneNum: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().nonnegative().refine((val) => !isNaN(val), {
      message: "Phone number must be a valid number",
    })
  ),
  address: z.string(),
  class: z.string(),
  duration: z.string(),
  travelLane: z.string(),
  from: z.string(),
  to: z.string(),
  certNo: z.string(),
  uid: z.string(),
});

const RailwayUpdateConc = () => {

  // function to transfer data from Firestore to JSON file and clean ConcessionTempHistory
  useEffect(() => {
    const requiredFields = [
      "address", "ageMonths", "ageYears", "branch", "certificateNumber", "class",
      "dob", "duration", "firstName", "from", "gender", "gradyear", "idCardURL",
      "idCardURL2", "lastName", "lastPassIssued", "middleName", "passNum",
      "phoneNum", "previousPassURL", "status", "statusMessage", "to", "travelLane"
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
        const tempHistoryRef = doc(db, "ConcessionTempHistory", "TempHistory");
        const tempHistorySnap = await getDoc(tempHistoryRef);
  
        if (!tempHistorySnap.exists()) return;
  
        const tempData = tempHistorySnap.data();
        const TempData = tempData.TempData || [];
  
        const validObjects = TempData.filter(isValidObject);
  
        if (validObjects.length > 0) {
          // Fetch existing history.json data
          const url = await getDownloadURL(fileRef);
          const response = await fetch(url);
          const existingData = await response.json();
          const history = Array.isArray(existingData) ? existingData : [];
  
          const updatedHistory = [...history, ...validObjects];
  
          // Upload updated history
          await uploadString(fileRef, JSON.stringify(updatedHistory, null, 2), "raw", {
            contentType: "application/json",
          });
  
          // Delete valid objects from Firestore array
          for (const obj of validObjects) {
            await updateDoc(tempHistoryRef, {
              TempData: arrayRemove(obj)
            });
          }
  
          console.log(`Transferred ${validObjects.length} objects and removed them from Firestore.`);
        } else {
          console.log("No valid data found in TempData.");
        }
      } catch (err) {
        console.error("Error transferring and cleaning up temp history:", err);
      } finally {
        setLoading(false);
      }
    };
  
    checkAndTransferTempHistory();
  }, []);

  const storage = getStorage();
  const fileRef = ref(storage, "RailwayConcession/concessionHistory.json");

  const [pass, setPass] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [showUpdateCertNum, setShowUpdateCertNum] = useState(false); 

  const fetchPass = async (certNo) => {
    // console.log("Inside FetchPass: ", certNo)
    setLoading(true);
    try {
      const q = query(
        collection(db, "ConcessionDetails"),
        where("certificateNumber", "==", certNo),
        where("status", "in", ["serviced", "downloaded"])
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          // console.log(docSnap.id)
          const enquiry = docSnap.data();
          const requestDocSnap = await getDoc(doc(db, "ConcessionRequest", docSnap.id));
          if (requestDocSnap.exists()) {
            enquiry.certNo = requestDocSnap.data().passNum;
            enquiry.uid = requestDocSnap.data().uid;
            enquiry.dob = enquiry.dob.toDate();
            enquiry.doi = enquiry.lastPassIssued.toDate();
            enquiry.gradyear = enquiry.gradyear.toString();
            setPass(enquiry);
          }
        } else {
          setPass(null);
          toast({
            description: "No pass found.",
            variant: "destructive",
          });
        }
        // console.log(pass)
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching pass data", error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchInput) {
      // console.log("UPDATE PASS: ",searchInput)
      fetchPass(searchInput);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // console.log(searchInput)  
      handleSearch();
    }
  };

  const handleCertNumClick = () => {
    setShowUpdateCertNum(true); // Toggle visibility
  };


  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ): showUpdateCertNum ? (
        <UpdateCertificateNumber setShowUpdateCertNum={setShowUpdateCertNum}/>
      ) : (
        <div className="flex flex-col items-center justify-start min-h-[80vh] p-4 relative">
           <h2 className="mb-8 text-lg font-semibold text-center text-gray-700 flex">
            <span className="text-3xl font-bold">Extend Date, Change Data & Cancel Pass</span>
            <button
              onClick={handleCertNumClick}
              className="absolute right-2 flex items-center gap-2 px-5 py-3 font-semibold text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
            >
              Update Certificate Number
              <ArrowRight className="w-4 h-4"/>
            </button>
          </h2>
          <div className="flex items-center w-full max-w-md">
            <Input
              type="text"
              className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              placeholder="Enter Certificate No"
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              className="ml-5 px-5 py-3 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
          <div className="flex justify-center items-center mt-4">
            {pass && <RailwayUpdateCard key={pass.certNo} formSchema={formSchema} passData={pass} />}
          </div>
        </div>
      )}
    </>
  );
  
};

export default RailwayUpdateConc;
