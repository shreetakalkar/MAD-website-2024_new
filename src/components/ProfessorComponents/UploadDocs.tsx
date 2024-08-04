"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileCheck, Loader } from "lucide-react";
import { db, storage } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { branches } from "@/constants/branches";
import useDivisionList from "@/constants/divisionList";
import { useUser } from "@/providers/UserProvider";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import useGradYear from "@/constants/gradYearList";
import { useToast } from "@/components/ui/use-toast";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
});

const UploadDocs = ({ name }: { name: string }) => {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [currentYear, setCurrentYear] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [div, setDivision] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const divisionOptions = useDivisionList(branch, currentYear);
  const { toast } = useToast();
  useEffect(() => {
    const getSubjects = async () => {
      setLoading(true);
      const pathSegment = new Date().getMonth() > 6 ? "odd_sem" : "even_sem";
      try {
        const docRef = doc(db, "Subjects", `${currentYear}_${branch}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const subjects = data[pathSegment];
          setSubjects(subjects || []);
        } else {
          console.log("No such document!");
          setSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (branch && currentYear) {
      getSubjects();
    }
  }, [branch, currentYear]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = schema.safeParse({ title, description });
    if (!validation.success) {
      alert("Title and description must be at least 3 characters long");
      return;
    }
    if (file) {
      try {
        setLoading(true);
        const storageRef = ref(
          storage,
          `notes_attachments/${user?.uid}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, "Notes"), {
          title,
          description,
          attachments: [downloadURL],
          professor_name: user?.name,
          subject: selectedSubject,
          target_classes: [
            {
              branch,
              division: div,
              year: currentYear,
            },
          ],
          time: new Date(),
        });

        toast({
          title: "Note uploaded",
          description: "Note uploaded successfully!",
          variant: "default",
        });
      } catch (error) {
        console.error("Error uploading note:", error);
        toast({
          title: "Error uploading note",
          description: "Error uploading note. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="grid gap-4 overflow-y-auto">
      <h2 className="text-lg font-semibold">Upload Notes</h2>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Select onValueChange={setCurrentYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {useGradYear().map((year) => (
                  <SelectItem key={year.year} value={year.year}>
                    {year.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="branch">Branch</Label>
            <Select onValueChange={setBranch}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              disabled={!currentYear || !branch}
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="division">Division</Label>
            <Select
              disabled={!currentYear || !branch}
              onValueChange={setDivision}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                {divisionOptions.map((division) => (
                  <SelectItem key={division} value={division}>
                    {division}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>         
        </div>
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter note description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="file">Upload Notes</Label>
          <div
            className="h-32 rounded-md border-2 border-dashed border-muted-foreground flex items-center justify-center text-muted-foreground hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer p-2 text-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <p>Drag and drop files here or click to upload</p>
            <Input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {file && (
            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <FileCheck size={16} />
              {file.name}
            </div>
          )}
        </div>
        <Button
          type="submit"
          className="mt-4"
          disabled={
            !file ||
            !title ||
            !description ||
            !selectedSubject ||
            !currentYear ||
            !branch ||
            !div ||
            loading
          }
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Upload"}
        </Button>
      </form>
    </div>
  );
};

export default UploadDocs;
