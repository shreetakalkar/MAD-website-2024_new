"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { branches } from "@/constants/branches";
import useDivisionList from "@/constants/divisionList";
import useBatchList from "@/constants/batchList";
import { db, storage } from "@/config/firebase";
import { getFirestore, doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ClipLoader from "react-spinners/ClipLoader";
import useGradYear from "@/constants/gradYearList";

function InputWithLabel({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-col h-[100%]">
      <div className="h-[35%] text-xs xl:text-sm font-[550] pt-1">
        {label}
      </div>
      <div className="h-[65%] overflow-auto">
        <input
          className="border-[0.5px] xl:text-sm flex items-center h-[80%] leading-none text-start py-[2%] px-[4%] w-[90%] rounded-lg text-[0.9rem]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label}`}
        />
      </div>
    </div>
  );
}

function Dropdown({ label, options, onChange, disabled = false }: { label: string; options: string[]; onChange?: (value: string) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-col h-[100%]">
      <div className="h-[35%] text-xs xl:text-sm font-[550] pt-1">
        {label}
      </div>
      <div className="h-[65%] overflow-auto">
        <select
          className="border-[0.5px] xl:text-sm flex items-center h-[80%] leading-none text-start py-[2%] px-[4%] w-[90%] rounded-lg text-[0.9rem]"
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function InputWithDate({ label, selectedDate, onDateChange }: { label: string; selectedDate: Date | null; onDateChange: (date: Date | null) => void }) {
  return (
    <div className="flex flex-col h-[100%]">
      <div className="h-[35%] text-xs xl:text-sm font-[550] pt-1">
        {label}
      </div>
      <div className="h-[65%] overflow-auto z-[100] bg-white">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(date: Date | undefined) => onDateChange(date || null)}
              initialFocus
              className="bg-white"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function Page() {
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

  const divisionOptions = useDivisionList(branch, currentYear);
  const batchOptions = useBatchList(div, branch);
  const gradYearList = useGradYear();

  // Options
  const yearOptions = ["All", "FE", "SE", "TE", "BE"];
  const branchOptions = ["All", ...branches];
  const divisionOptionsWithAll = ["All", ...divisionOptions];
  const batchOptionsWithAll = ["All", ...batchOptions];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const resetFormFields = () => {
    setCurrentYear("All");
    setBranch("All");
    setDivision("All");
    setBatch("All");
    setTitle("");
    setContent("");
    setStartDate(null);
    setEndDate(null);
    setFile(null);
    setdocURL(null);
  };
  

  const handleSubmit = async () => {
    let uploadeddocURL = docURL;
  
    if (file) {
      setLoading(true);
      const storageRef = ref(storage, `ImportantNotice/ExamTimeTable/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on('state_changed',
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
          let selectedGradYear
          if (currentYear!="All") {
            selectedGradYear = gradYearList.find((item) => item.year === currentYear)?.gradYear;
          } else {
            selectedGradYear = "All";
          }


          const data = {
            title,
            content: content,
            gradYear: selectedGradYear ,
            branch,
            div: div,
            batch: batch,
            startDate: startDate ? Timestamp.fromDate(startDate) : null,
            endDate: endDate ? Timestamp.fromDate(endDate) : null,
            docURL: uploadeddocURL
          };
  
          try {
            const docRef = doc(db, "ImportantNotice", "Content");
            await updateDoc(docRef, {
              content: arrayUnion(data),
            });
            console.log("Data successfully added!");
            resetFormFields(); // Reset form fields
          } catch (error) {
            console.error("Error adding data: ", error);
          }
        }
      );
    } else {
      // If no file was uploaded, proceed with just the other form data
      const data = {
        title,
        content: content,
        year: currentYear,
        branch,
        division: div,
        batch: batch,
        startDate: startDate ? Timestamp.fromDate(startDate) : null,
        endDate: endDate ? Timestamp.fromDate(endDate) : null,
        docURL
      };
  
      try {
        const docRef = doc(db, "ImportantNotice", "Content");
        await updateDoc(docRef, {
          content: arrayUnion(data),
        });
        console.log("Data successfully added!");
        resetFormFields(); // Reset form fields
      } catch (error) {
        console.error("Error adding data: ", error);
      }
    }
  };
  

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="h-[60%] w-1/2 border border-gray-200 p-2 rounded-lg">
        <div className="h-[26.666%] flex p-2">
          <div className="h-full w-1/2">
            <InputWithLabel label={`Title`} value={title} onChange={setTitle} />
          </div>
          <div className="h-full w-1/2">
            <InputWithLabel label={`Description`} value={content} onChange={setContent} />
          </div>
        </div>
        <div className="h-[26.666%] flex p-2">
          <div className="h-full w-full flex w">
            {/* Year Dropdown */}
            <div className="h-full w-1/3">
              <Dropdown
                label={`Year`}
                options={yearOptions}
                onChange={(value) => {
                  setCurrentYear(value);
                  setBranch("All"); // Reset branch and below
                  setDivision("All");
                }}
              />
            </div>

            {/* Conditionally Render Branch Dropdown */}
            {(currentYear !== "FE") && currentYear !== "All" && (
              <div className="h-full w-1/3">
                <Dropdown
                  label={`Branch`}
                  options={branchOptions}
                  onChange={(value) => {
                    setBranch(value);
                    setDivision("All"); // Reset division and below
                  }}
                />
              </div>
            )}

            {/* Division Dropdown */}
            {(currentYear === "FE" || branch !== "All") && (
              <div className="h-full w-1/3">
                <Dropdown 
                  label={`Division`} 
                  options={divisionOptionsWithAll}
                  onChange={(value) => {
                    setDivision(value);
                    setBatch("All");
                  }}
                />
              </div>
            )}

            {/* Batch Dropdown */}
            {(currentYear !== "FE" && div !== "All") && (
              <div className="h-full w-1/3">
                <Dropdown 
                  label={`Batch`} 
                  options={batchOptionsWithAll}
                  onChange={setBatch} 
                />
              </div>
            )}
          </div>
        </div>
        <div className="h-[26.666%] flex p-2">
          <div className="h-full w-1/2">
            <InputWithDate label={`Start Date`} selectedDate={startDate} onDateChange={setStartDate} />
          </div>
          <div className="h-full w-1/2">
            <InputWithDate label={`End Date`} selectedDate={endDate} onDateChange={setEndDate} />
          </div>
        </div>
        <div className="h-[26.666%] flex p-2">
          <div className="h-full w-1/2 flex flex-col">
            <div className="h-[35%] text-xs xl:text-sm font-[550] pt-1">
              Upload File
            </div>
            <div className="h-[65%] overflow-auto">
              <input
                type="file"
                className="border-[0.5px] xl:text-sm flex items-center h-[80%] leading-none text-start py-[2%] px-[4%] w-[90%] rounded-lg text-[0.9rem]"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="h-full w-1/2 flex items-center justify-center">
            {loading ? <ClipLoader size={35} color={"#123abc"} loading={loading} /> : <Button onClick={handleSubmit}>Submit</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
