"use client";
import CreateNewPass from "@/components/CreateNewPass";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader } from "lucide-react";
const RailwayEntryInterface = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const formSchema = z.object({
    branch: z.string().nonempty({ message: "Field is required." }),
    gradYear: z.string().nonempty({ message: "Field is required." }),
    email: z.string().email().nonempty({ message: "Field is required." }),
    firstName: z.string().nonempty({ message: "Field is required." }),
    middleName: z.string().optional(),
    lastName: z.string().nonempty({ message: "Field is required." }),
    gender: z.string().nonempty({ message: "Field is required." }),
    dob: z.date().refine((date) => date !== undefined && date !== null, {
      message: "Field is required.",
    }),
    phoneNum: z
      .string()
      .refine((val) => val.trim() !== "", {
        message: "Phone number must not be empty",
      })
      .refine(
        (val) => {
          const parsed = Number(val);
          return !isNaN(parsed) && parsed >= 0 && val.length === 10;
        },
        { message: "Phone number must be a valid 10-digit number" }
      ),
    address: z.string().nonempty({ message: "Field is required." }),
    class: z.string().nonempty({ message: "Field is required." }),
    duration: z.string().nonempty({ message: "Field is required." }),
    travelLane: z.string().nonempty({ message: "Field is required." }),
    from: z.string().nonempty({ message: "Field is required." }),
    to: z.string().optional(),
    certNo: z.string().nonempty({ message: "Field is required." }),
  });

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const studentRef = collection(db, "Students ");
      const querySnapshot = await getDocs(studentRef);
      const emailArray: string[] = [];
      querySnapshot.forEach((doc) => {
        emailArray.push(doc.data().email);
      });
      setEmails(emailArray.sort());
    } catch (error) {
      toast({
        description: "Error while fetching emails",
        variant: "destructive",
      });
      console.error("Error while fetching emails", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      )}
      {!loading && (
        <div
          style={{
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="flex justify-center p-10"
        >
          <CreateNewPass formSchema={formSchema} emails={emails} />
        </div>
      )}
    </>
  );
};

export default RailwayEntryInterface;
