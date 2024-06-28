import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card"; // Replace with actual Card component import
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { z } from "zod";
import RailwayUpdateCard from "./RailwayUpdateCard";
import { toast } from "react-toastify";

const RailwayUpdateConc = () => {
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
    const fetchPassesWithRequestDocs = async () => {
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const concessionDetailsRef = collection(db, "ConcessionDetails");
        const q = query(
          concessionDetailsRef,
          where("lastPassIssued", ">=", sevenDaysAgo)
        );

        const unsubscribe = onSnapshot(
          q,
          async (snapshot) => {
            const fetchedPasses = [];

            for (const docSnap of snapshot.docs) {
              const enquiry = docSnap.data();
              const lastPassIssued = enquiry.lastPassIssued.toDate();

              if (lastPassIssued >= sevenDaysAgo) {
                const concessionRequestRef = doc(
                  db,
                  "ConcessionRequest",
                  docSnap.id
                );
                const requestDocSnap = await getDoc(concessionRequestRef);

                if (requestDocSnap.exists()) {
                  enquiry.certNo = requestDocSnap.data().passNum;
                  enquiry.uid = requestDocSnap.data().uid;
                  enquiry.dob = enquiry.dob.toDate();
                  enquiry.doi = enquiry.lastPassIssued.toDate();
                  enquiry.gradyear = enquiry.gradyear.toString();
                  fetchedPasses.push(enquiry);
                }
              }
            }

            setPasses(fetchedPasses);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching passes:", error);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        toast({ description: "There was an error in fetching recent passes" });
        console.error("Error fetching recent passes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPassesWithRequestDocs(); // Initial fetch when component mounts
  }, []);

  return (
    <div className="w-[75%] flex flex-col gap-[5rem]">
      {passes.map((pass, index) => (
        <RailwayUpdateCard formSchema={formSchema} passData={pass} />
      ))}
    </div>
  );
};
export default RailwayUpdateConc;
