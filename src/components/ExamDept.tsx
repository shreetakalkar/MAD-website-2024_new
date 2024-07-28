import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import TTForm from "./TTForm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import { db, storage } from "@/config/firebase";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ClipLoader from "react-spinners/ClipLoader";
import useGradYear from "@/constants/gradYearList";

const ExamDept = () => {
  const methods = useForm();
  const { toast } = useToast();
  const gradYearList = useGradYear();

  const [currentYear, setCurrentYear] = useState<string>("All");
  const [branch, setBranch] = useState<string>("All");
  const [div, setDivision] = useState<string>("All");
  const [batch, setBatch] = useState<string>("All");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [docURL, setdocURL] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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

  const handleUpload = async (data) => {
    let uploadeddocURL = docURL;
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
    const currentYear = year;
    if (file) {
      setLoading(true);
      const storageRef = ref(
        storage,
        `ImportantNotice/ExamTimeTable/${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle file upload progress here if needed
        },
        (error) => {
          console.error("Error uploading file: ", error);
          setLoading(false);
        },
        async () => {
          uploadeddocURL = await getDownloadURL(uploadTask.snapshot.ref);
          setdocURL(uploadeddocURL);
          setLoading(false);

          // After getting the file URL, proceed with Firestore update
          let selectedGradYear;
          if (currentYear != "All") {
            selectedGradYear = gradYearList.find(
              (item) => item.year === currentYear
            )?.gradYear;
          } else {
            selectedGradYear = "All";
          }

          const uploadData = {
            title,
            content: description,
            gradYear: selectedGradYear,
            branch: branch || "All",
            div: division || "All",
            batch: batch || "All",
            startDate: startDate ? Timestamp.fromDate(startDate) : null,
            endDate: endDate ? Timestamp.fromDate(endDate) : null,
            docURL: uploadeddocURL,
          };
          try {
            const docRef = doc(db, "ImportantNotice", "Content");
            await updateDoc(docRef, {
              content: arrayUnion(uploadData),
            });
            methods.reset(); // Reset the form fields
            console.log("Data successfully added!");
          } catch (error) {
            console.error("Error adding data: ", error);
          }
        }
      );
    } else {
      // If no file was uploaded, proceed with just the other form data
      const uploadData = {
        title,
        content: description,
        gradYear: currentYear,
        branch: branch || "All",
        div: division || "All",
        batch: batch || "All",
        startDate: startDate ? Timestamp.fromDate(startDate) : null,
        endDate: endDate ? Timestamp.fromDate(endDate) : null,
        docURL,
      };
      try {
        const docRef = doc(db, "ImportantNotice", "Content");
        await updateDoc(docRef, {
          content: arrayUnion(uploadData),
        });
        methods.reset(); // Reset the form fields
        console.log("Data successfully added!");
      } catch (error) {
        console.error("Error adding data: ", error);
      }
    }
  };

  const onSubmit = async (data) => {
    const missingFields = Object.keys(data).filter(
      (key) =>
        !data[key] || (Array.isArray(data[key]) && data[key].length === 0)
    );

    if (missingFields.length > 0) {
      toast({
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    handleUpload(data);
  };

  return (
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
              additionalFields={additionalFields}
              onSubmit={onSubmit}
              handleSubmit={methods.handleSubmit}
              control={methods.control}
              reset={methods.reset}
            />
          </CardContent>
        </Card>
      </FormProvider>
    </div>
  );
};

export default ExamDept;
