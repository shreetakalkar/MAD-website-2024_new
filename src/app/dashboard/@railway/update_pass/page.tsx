"use client";
import React, { use, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import "@/app/globals.css";
import { db } from "@/config/firebase";
import { z } from "zod";
import RailwayUpdateCard from "@/components/RailwayUpdateCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

const RailwayUpdateConc = () => {
  const [passes, setPasses] = useState<any[]>([]);
  const [passArrayLength, setPassArrayLength] = useState<number | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    branch: z.string(),
    gradyear: z.string(),
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    gender: z.string(),
    dob: z.date().refine(
      (date) => {
        // Check for undefined or null and return false if either is true
        if (date === undefined || date === null) {
          return false;
        }
        return true;
      },
      { message: "Field is required." }
    ),
    doi: z.date().refine(
      (date) => {
        // Check for undefined or null and return false if either is true
        if (date === undefined || date === null) {
          return false;
        }
        return true;
      },
      { message: "Field is required." }
    ),
    phoneNum: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          if (val.trim() === "") {
            return undefined;
          }
          return NaN;
        }
        return Number(val);
      },
      z
        .number()
        .nonnegative()
        .refine(
          (value) => !isNaN(value) && value !== null && value !== undefined,
          {
            message:
              "Phone number cannot be a string and must be a valid number",
          }
        )
    ),
    address: z.string(),
    class: z.string(),
    duration: z.string(),
    travelLane: z.string(),
    from: z.string(),
    to: z.string(),
    certNo: z.string(),
  });

  useEffect(() => {
    const fetchAllRecentPasses = async () => {
      setLoading(true);
      try {
        const concessionDetailsRef = collection(db, "ConcessionDetails");
        const q = query(
          concessionDetailsRef,
          where("status", "in", ["serviced", "downloaded"])
        );
        const unsubscribe = onSnapshot(
          q,
          async (snapshot) => {
            const fetchedPasses = [];

            for (const docSnap of snapshot.docs) {
              const enquiry = docSnap.data();

              const concessionRequestRef = doc(
                db,
                "ConcessionRequest",
                docSnap.id
              );
              const requestDocSnap = await getDoc(concessionRequestRef);

              if (
                requestDocSnap.exists() &&
                requestDocSnap.data().passCollected?.collected?.toString() ===
                  "1"
              ) {
                enquiry.certNo = requestDocSnap.data().passNum;
                enquiry.uid = requestDocSnap.data().uid;
                enquiry.dob = enquiry.dob.toDate();
                enquiry.doi = enquiry.lastPassIssued.toDate();
                enquiry.gradyear = enquiry.gradyear.toString();

                fetchedPasses.push(enquiry);
              }
            }

            let filteredPasses = fetchedPasses;

            if (searchInput.trim() === "") {
              setPasses(filteredPasses);
            } else {
              filteredPasses = fetchedPasses.filter((pass) =>
                pass.certNo.toLowerCase().includes(searchInput.toLowerCase())
              );
              setPasses(filteredPasses);
            }

            setPassArrayLength(filteredPasses.length);
          },
          (error) => {
            console.error("Error fetching passes:", error);
          }
        );
        if (!loading) return () => unsubscribe();
      } catch (error) {
        toast({ description: "There was an error in fetching recent passes" });
        console.error("Error fetching recent passes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecentPasses();
  }, [searchInput]);

  useEffect(() => {
    if (passArrayLength == 0) {
      toast({ description: "No Passes to update", variant: "destructive" });
    }
  }, [passArrayLength]);

  return (
    <>
      {loading && <p>Loading...</p>}
      <div className="w-[99%] flex flex-col gap-[5rem] p-4">
        {( passArrayLength && (passArrayLength>0) ) ? (
          <div className="flex w-full max-w-sm items-center ml-[1%]">
            <Input
              type="text"
              className="shadow-box mt-10"
              placeholder="Certificate No"
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <Loader className="w-10 h-10 animate-spin" />
            </div>
        )}
        {passes.map((pass, index) => {
          return (
            <div key={pass.certNo}>
              <RailwayUpdateCard formSchema={formSchema} passData={pass} />
            </div>
          );
        })}
      </div>
    </>
  );
};
export default RailwayUpdateConc;