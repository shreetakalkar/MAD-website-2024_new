"use client";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import TTForm from "../TTForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/components/ui/use-toast";
import { db, storage } from "@/config/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import useGradYear from "@/constants/gradYearList";
import { ClipLoader } from "react-spinners";
import { useUser } from "@/providers/UserProvider";

// Define the schema for form validation
const formSchema = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  year: z.string().nullable(),
  branch: z.string().nullable(),
  division: z.string().nullable(),
  batch: z.string().nullable(),
  attachment: z.instanceof(File).optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

const YeLeBhai = () => {
  const { toast } = useToast();
  const gradYearList = useGradYear();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      year: "All",
      branch: "All",
      division: "All",
      batch: "All",
    },
  });

  const additionalFields = [
    {
      name: "attachment",
      label: "Upload File",
      placeholder: "Choose file",
      type: "file",
    },
  ];

  const handleFileUpload = async (
    file: File,
    title: string
  ): Promise<string> => {
    if (!file) throw new Error("No file provided");
    if (!user?.uid) throw new Error("User ID is not available");
    console.log("ANDAR");
    const storageRef = ref(storage, `notification/${user.uid}/${title}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("BAHAR");
    return downloadURL;
  };

  const handleUpload = async (data: FormData, fileUrl: string) => {
    const selectedGradYear =
      data.year !== "All"
        ? gradYearList.find((item) => item.year === data.year)?.gradYear ||
          "All"
        : "All";

    const topicFormatted = [
      selectedGradYear,
      data.branch !== "All" ? data.branch : null,
      data.division !== "All" ? data.division : null,
      data.batch !== "All" ? data.batch : null,
    ]
      .filter(Boolean)
      .join("-");

    const uploadData = {
      attachments: [fileUrl],
      message: data.description,
      notificationTime: new Date().toISOString(),
      //   senderName: data.senderName,
        //   sentBy: data.sentBy,
      
      //Idhar kya ddalna hai @FAHED??????
      title: data.title,
      topic: topicFormatted,
    };

    try {
      const notificationsRef = collection(db, "notifications");
      await addDoc(notificationsRef, uploadData);

      toast({
        description: "Notification successfully added!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding notification: ", error);
      throw error;
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true); // Start loading spinner or state
    let allFieldsValid = true;

    // Check if any required field is empty or null
    Object.entries(data).forEach(([_, value]) => {
      if (value === "" || value === null) {
        toast({
          description: "Please fill all required fields.",
          variant: "destructive",
        });
        allFieldsValid = false;
      }
    });

    if (allFieldsValid) {
      try {
        const file = data.attachment as File;
        let fileUrl = "";

        // Handle file upload if a file is present
        if (file) {
          fileUrl = await handleFileUpload(file, data.title || "unnamed");
          await handleUpload(data, fileUrl);
        } else {
          await handleUpload(data, "");
        }
        methods.reset();
        toast({
          description: "Notification successfully added!",
          variant: "default",
        });
      } catch (error) {
        console.error("Error submitting form: ", error);
        toast({
          description: "Error adding notification. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false); // Stop loading spinner or state
      }
    } else {
      setLoading(false); // Stop loading state if validation fails
    }
  };

  return (
    <>
      <div className="w-[100%] flex justify-center items-center">
        {loading && (
          <div className="flex items-center justify-center h-screen">
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
            {/* <p>Loading...</p> */}
          </div>
        )}

        {!loading && (
          <FormProvider {...methods}>
            <Card
              style={{
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="w-[95%] no-scrollbar"
            >
              <CardHeader>
                <CardTitle className="text-3xl">Send Notification</CardTitle>
              </CardHeader>
              <CardContent>
                <TTForm
                  additionalFields={additionalFields}
                  handleSubmit={methods.handleSubmit(onSubmit)}
                  control={methods.control}
                  reset={methods.reset}
                  lockTitle={false}
                />
              </CardContent>
            </Card>
          </FormProvider>
        )}
      </div>
    </>
  );
};

export default YeLeBhai;
