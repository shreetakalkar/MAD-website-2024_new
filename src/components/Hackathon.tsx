"use client";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import HackathonForm from "./HackathonForm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "@/components/ui/use-toast";
import { db, storage } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Loader } from "lucide-react";
import { useUser } from "@/providers/UserProvider";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const formSchema = z.object({
  eventName: z.string().min(1, "Event Name is required"),
  eventLocation: z.string().min(1, "Event Location is required"),
  eventDate: z.string().min(1, "Event Date is required"),
  eventTime: z.string().min(1, "Event Time is required"),
  eventDescription: z.string().min(1, "Event Description is required"),
  eventRegistrationUrl: z.string().url("Invalid URL").min(1, "Registration URL is required"),
  image: z.instanceof(File).optional().nullable(),
  status:z.enum(["pending","accepted","rejected"])
});

type FormData = z.infer<typeof formSchema>;

function formatDate(dateString:any) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const Hackathon = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      eventLocation: "",
      eventDate: "",
      eventTime: "",
      eventDescription: "",
      eventRegistrationUrl: "",
      image: null,
      status: "pending"
    },
  });

  const handleImageUpload = async (file: File, eventName: string): Promise<string> => {
    if (!file) throw new Error("No file provided");
    if (!user?.name) throw new Error("User name is not available");

    const storageRef = ref(storage, `events/${user.uid}/${eventName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleUpload = async (data: FormData,imageUrl: string) => {
    // console.log("submitting data");
    // console.log("data",data);
    const eventDate = formatDate(data.eventDate)
    
    try {
      const docRef = collection(db, "TempEvents");
      // console.log("docRef",docRef);
      await addDoc(docRef, {
        "Committee Name": user?.name,
        "Image url": imageUrl,
        "Event Name": data.eventName,
        "Event Location": data.eventLocation,
        "Event Date": eventDate,
        "Event Time": data.eventTime,
        "Event description": data.eventDescription,
        "Event registration url": data.eventRegistrationUrl,
        "Status": "pending"
    });
      // console.log("data",data);
      toast({
        description: "Event successfully added!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding event: ", error);
      toast({
        description: "Error adding event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const imageFile = data.image as unknown as File;
      if (imageFile) {
        const imageUrl = await handleImageUpload(imageFile, data.eventName);
        await handleUpload(data,imageUrl);
      }

      methods.reset();
      toast({
        description: "Event successfully added!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast({
        description: "Error adding event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-[100%] flex justify-center items-center">
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
                <CardTitle className="text-3xl mx-auto">{user?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <HackathonForm
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
  );
};

export default Hackathon;
