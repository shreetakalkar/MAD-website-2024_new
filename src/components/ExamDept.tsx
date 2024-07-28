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
import { ClipLoader } from "react-spinners";

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

const ExamDept = () => {
  const { toast } = useToast();
  const gradYearList = useGradYear();
<<<<<<< HEAD

  const [currentYear, setCurrentYear] = useState<string>("All");
  const [branch, setBranch] = useState<string>("All");
  const [division, setDivision] = useState<string>("All");
  const [batch, setBatch] = useState<string>("All");
  const [docURL, setDocURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

=======
  const [loading, setLoading] = useState<boolean>(false);

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

>>>>>>> e73250722bbd3f0fd49e5992e00be48b8eec6736
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

<<<<<<< HEAD
  const handleUpload = async (data: any) => {
    setLoading(true);

=======
  const handleUpload = async (data: FormData) => {
>>>>>>> e73250722bbd3f0fd49e5992e00be48b8eec6736
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

<<<<<<< HEAD
    let uploadeddocURL = docURL;
    const currentYear = year;

    if (file) {
      try {
        const storageRef = ref(
          storage,
          `ImportantNotice/ExamTimeTable/${file.name}`
        );
        const uploadTask = await uploadBytesResumable(storageRef, file);

        uploadeddocURL = await getDownloadURL(uploadTask.snapshot.ref);
        setDocURL(uploadeddocURL);
      } catch (error) {
        console.error("Error uploading file: ", error);
        toast({
          description: "Error uploading file.",
          variant: "destructive",
        });
        setLoading(false);
=======
    let uploadedDocURL = null;

    if (file) {
      const storageRef = ref(
        storage,
        `ImportantNotice/ExamTimeTable/${file.name}`
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
>>>>>>> e73250722bbd3f0fd49e5992e00be48b8eec6736
        return;
      }
    }

<<<<<<< HEAD
    let selectedGradYear;
    if (currentYear !== "All") {
      selectedGradYear = gradYearList.find(
        (item) => item.year === currentYear
      )?.gradYear;
    } else {
      selectedGradYear = "All";
    }
=======
    const selectedGradYear =
      year !== "All"
        ? gradYearList.find((item) => item.year === year)?.gradYear || "All"
        : "All";
>>>>>>> e73250722bbd3f0fd49e5992e00be48b8eec6736

    const uploadData = {
      title,
      content: description,
      gradYear: selectedGradYear,
      branch: branch || "All",
      div: division || "All",
      batch: batch || "All",
      startDate: startDate ? Timestamp.fromDate(startDate) : null,
      endDate: endDate ? Timestamp.fromDate(endDate) : null,
<<<<<<< HEAD
      docURL: uploadeddocURL,
=======
      docURL: uploadedDocURL,
>>>>>>> e73250722bbd3f0fd49e5992e00be48b8eec6736
    };

    try {
      const docRef = doc(db, "ImportantNotice", "Content");
      await updateDoc(docRef, {
        content: arrayUnion(uploadData),
      });
<<<<<<< HEAD
      methods.reset();
      toast({
        description: "Data successfully added!",
        variant: "success",
=======

      toast({
        description: "Data successfully added!",
        variant: "default",
>>>>>>> e73250722bbd3f0fd49e5992e00be48b8eec6736
      });
    } catch (error) {
      console.error("Error adding data: ", error);
      toast({
<<<<<<< HEAD
        description: "Error adding data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: any) => {
    const missingFields = Object.keys(data).filter(
      (key) =>
        !data[key] || (Array.isArray(data[key]) && data[key].length === 0)
    );
=======
        description: "Error adding data. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log(loading);
  }, [loading]);
>>>>>>> e73250722bbd3f0fd49e5992e00be48b8eec6736

  const onSubmit = (data: FormData) => {
    setLoading(true);

    console.log(data);
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

  return (
<<<<<<< HEAD
    <div className="w-[100%] flex justify-center items-center">
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
            <CardTitle className="text-3xl">Exam Department Form</CardTitle>
          </CardHeader>
          <CardContent>
            <TTForm
              currentYear={currentYear}
              setCurrentYear={setCurrentYear}
              branch={branch}
              setBranch={setBranch}
              division={division}
              setDivision={setDivision}
              batch={batch}
              setBatch={setBatch}
              additionalFields={additionalFields}
              onSubmit={onSubmit}
              handleSubmit={methods.handleSubmit}
              control={methods.control}
              reset={methods.reset}
              loading={loading}
            />
          </CardContent>
        </Card>
      </FormProvider>
    </div>
=======
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
                <CardTitle className="text-3xl">Exam Department Form</CardTitle>
              </CardHeader>
              <CardContent>
                <TTForm
                  additionalFields={additionalFields}
                  handleSubmit={methods.handleSubmit(onSubmit)}
                  control={methods.control}
                  reset={methods.reset}
                />
              </CardContent>
            </Card>
          </FormProvider>
        )}
      </div>
    </>
>>>>>>> e73250722bbd3f0fd49e5992e00be48b8eec6736
  );
};

export default ExamDept;
