import React, { use, useEffect, useState } from "react";
import { Card } from "@/components/ui/card"; // Replace with actual Card component import
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const RailwayUpdateConc = () => {
  const [passes, setPasses] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPasses, setFilteredPasses] = useState([]);
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
            setFilteredPasses(fetchedPasses);
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

    fetchAllRecentPasses(); // Initial fetch when component mounts
  }, []);

  // useEffect(() => {
  //   setFilteredPasses(passes);
  //   console.log(passes);
  // }, [passes]);
  const handleSearchRequest = () => {
    if (searchInput.trim() === "") {
      toast({
        description: "Please enter a search value",
        variant: "destructive",
      });
      return;
    }

    const filteredPassArray = passes.filter((pass) =>
      pass.certNo.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredPasses(filteredPassArray);
  };
  // const handleSearchRequest = () => {
  //   console.log(searchInput);
  //   if (searchInput.trim() === "") {
  //     toast({
  //       description: "Please enter a search value",
  //       variant: "destructive",
  //     });
  //   }

  //   const filteredPassArray = [];
  //   passes.map((pass, index) => {
  //     if (pass.certNo.toLowerCase().includes(searchInput.toLowerCase())) {
  //       console.log("found you", pass);

  //       filteredPassArray.push(pass);
  //     } else {
  //       console.log("No match", pass);
  //     }
  //   });
  //   console.log(filteredPassArray);
  //   setFilteredPasses(filteredPassArray);
  // };

  useEffect(() => {
    console.log(filteredPasses);
  }, [filteredPasses]);
  return (
    <div className="w-[75%] flex flex-col gap-[5rem]">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Certificate No"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSearchRequest();
          }}
        >
          Search
        </Button>
      </div>
      {filteredPasses.map((filteredPass, index) => (
        <RailwayUpdateCard
          key={index}
          formSchema={formSchema}
          passData={filteredPass}
        />
      ))}
    </div>
  );
};
export default RailwayUpdateConc;
