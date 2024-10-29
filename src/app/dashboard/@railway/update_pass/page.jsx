"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { z } from "zod";
import RailwayUpdateCard from "@/components/RailwayUpdateCard";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

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
  const [passes, setPasses] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Custom debounce function
  const debounceFetch = (callback, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    };
  };

  const fetchPasses = debounceFetch(async (searchTerm) => {
    setLoading(true);
    const q = query(
      collection(db, "ConcessionDetails"),
      where("status", "in", ["serviced", "downloaded"]),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedPasses = (
        await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const enquiry = docSnap.data();
            const requestDocSnap = await getDoc(doc(db, "ConcessionRequest", docSnap.id));
            if (
              requestDocSnap.exists() &&
              requestDocSnap.data().passCollected?.collected?.toString() === "1"
            ) {
              enquiry.certNo = requestDocSnap.data().passNum;
              enquiry.uid = requestDocSnap.data().uid;
              enquiry.dob = enquiry.dob.toDate();
              enquiry.doi = enquiry.lastPassIssued.toDate();
              enquiry.gradyear = enquiry.gradyear.toString();
              return enquiry;
            }
          })
        )
      ).filter(Boolean);

      setPasses(
        fetchedPasses.filter((pass) =>
          pass.certNo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, 500);

  useEffect(() => {
    fetchPasses(searchInput);
  }, [searchInput]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className="w-[99%] flex flex-col gap-[5rem] p-4">
          <div className="flex w-full max-w-sm items-center ml-[1%]">
            <Input
              type="text"
              className="shadow-box mt-10"
              placeholder="Certificate No"
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {passes.map((pass) => (
            <RailwayUpdateCard key={pass.certNo} formSchema={formSchema} passData={pass} />
          ))}
        </div>
      )}
    </>
  );
};

export default RailwayUpdateConc;
