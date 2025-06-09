"use client";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import TTForm from "./TTForm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "@/components/ui/use-toast";

import { db, storage } from "@/config/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useGradYear from "@/constants/gradYearList";
import { Loader } from "lucide-react";
import { useUser } from "@/providers/UserProvider";

// Define the schema for form validation

const formSchema = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  year: z.string().nullable(),
  branch: z.string().nullable(),
  division: z.string().nullable(),
  batch: z.string().nullable(),
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
  file: z.instanceof(File).optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

const PrincipalHodInterface = () => {
  const { toast } = useToast();
  const gradYearList = useGradYear();
  const [loading, setLoading] = useState<boolean>(false);
  const {user} = useUser();
  

  const methods = useForm<FormData>({

    resolver: zodResolver(formSchema),
    defaultValues: {
      title: `Notice by ${user?.name}`,
      description: "",
      year: "All",
      branch: "All",
      division: "All",
      batch: "All",
    },
  });

  const additionalFields = [
    {
      name: "startDate",
      label: "Start Date",
      placeholder: "Select date",
      type: "date",
    },
    {
      name: "endDate",
      label: "End Date",
      placeholder: "Select date",
      type: "date",
    },
    {
      name: "file",
      label: "Upload File",
      placeholder: "Choose file",
      type: "file",
    },
  ];

  const handleUpload = async (data: FormData) => {
    const {
      title,
      description,
      year,
      branch,
      division,
      batch,
      startDate,
      endDate,
      file,
    } = data;

    let uploadedDocURL = null;

    if (file) {
      const storageRef = ref(
        storage,
        `ImportantNotice/${user?.name}/${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        await uploadTask;
        uploadedDocURL = await getDownloadURL(uploadTask.snapshot.ref);
      } catch (error) {
        console.error("Error uploading file: ", error);
        toast({
          description: "Error uploading file. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    const selectedGradYear =
      year !== "All"
        ? gradYearList.find((item) => item.year === year)?.gradYear || "All"
        : "All";

    const uploadData = {
      title,
      content: description,
      gradYear: selectedGradYear,
      branch: branch || "All",
      div: division || "All",
      batch: batch || "All",
      startDate: startDate ? Timestamp.fromDate(startDate) : null,
      endDate: endDate ? Timestamp.fromDate(endDate) : null,
      docURL: uploadedDocURL,
      from: user?.type,
    };

    try {
      const docRef = doc(db, "ImportantNotice", "Content");
      await updateDoc(docRef, {
        content: arrayUnion(uploadData),
      });

      toast({
        description: "Data successfully added!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding data: ", error);
      toast({
        description: "Error adding data. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // console.log(loading);
  }, [loading]);

  const onSubmit = (data: FormData) => {
    setLoading(true);

    // console.log(data);
    let flag = true;
    Object.entries(data).forEach(([_, value]) => {
      if (value === "" || value === null) {
        toast({
          description: "Please fill all required fields.",
          variant: "destructive",
        });
        flag = false;
      }
    });
    if (flag) {
      handleUpload(data);
      methods.reset();
    }
    setLoading(false);
  };

  const capitalieFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <div className="w-full flex justify-center items-center">
        {loading && (
          <div className="flex items-center justify-center h-screen">
            <Loader className="w-10 h-10 animate-spin" />
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
                <CardTitle className="text-3xl">{user?.name}&apos;s Announcement Form</CardTitle>
              </CardHeader>
              <CardContent>
                <TTForm
                  additionalFields={additionalFields}
                  handleSubmit={methods.handleSubmit(onSubmit)}
                  control={methods.control}
                  reset={methods.reset}
                  lockTitle={!!user && (user?.type === "principal" || user?.type === "hod")}
                />
              </CardContent>
            </Card>
          </FormProvider>
        )}
      </div>
    </>
  );
};

export default PrincipalHodInterface;
