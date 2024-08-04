"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import TTForm from "../TTForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/components/ui/use-toast";
import { db, storage } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useGradYear from "@/constants/gradYearList";
import { ClipLoader } from "react-spinners";
import { useUser } from "@/providers/UserProvider";

const formSchema = z.object({
    attachments: z.instanceof(File).optional().nullable(),
    message: z.string().nullable(),
    notificationTime: z.string().nullable(),
    senderName: z.string().nullable(),
    sentBy: z.string().nullable(),
    title: z.string().nullable(),
    topic: z.string().nullable(),
    year: z.string().nullable(),
    branch: z.string().nullable(),
    div: z.string().nullable(),
    batch: z.string().nullable()
});

type FormData = z.infer<typeof formSchema>;

const ProfessorNotification = () => {
    const { toast } = useToast();
    const gradYearList = useGradYear();
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useUser();

    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            message: "",
            topic: "All",
            attachments: null
        },
    });

    const additionalFields = [
        {
            name: "attachments",
            label: "Upload File",
            placeholder: "Choose file",
            type: "file",
        },
    ];

    const handleFileUpload = async (file: File, title: string): Promise<string> => {


        if (!file) throw new Error("No file provided");
        if (!user?.uid) throw new Error("User ID is not available");
        console.log("ANDAR");
        const storageRef = ref(storage, `notifications/${user.uid}/${title}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("BAHAR");
        return downloadURL;
    };

    const handleUpload = async (data: FormData, fileUrl: string) => {
        const selectedGradYear =
            data.year !== "All"
                ? gradYearList.find((item) => item.year === data.year)?.gradYear || "All"
                : "All";

        const topicFormatted = [
            selectedGradYear,
            data.branch !== "All" ? data.branch : null,
            data.div !== "All" ? data.div : null,
            data.batch !== "All" ? data.batch : null,
        ].filter(Boolean).join("-");

        const uploadData = {
            attachments: [fileUrl],
            message: data.message,
            notificationTime: data.notificationTime || new Date().toISOString(),
            senderName: data.senderName,
            sentBy: data.sentBy,
            title: data.title,
            topic: topicFormatted,
        };

        try {
            const notificationsRef = collection(db, "notification");
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
        setLoading(true);

        try {
            const file = data.attachments as File;
            if (file) {
                const fileUrl = await handleFileUpload(file, data.title || "unnamed");
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
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-[100%] flex justify-center items-center">
                {loading && (
                    <div className="flex items-center justify-center h-screen">
                        <ClipLoader size={50} color={"#123abc"} loading={loading} />
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
                                <CardTitle className="text-3xl">Send Notification to a particular Batch</CardTitle>
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

export default ProfessorNotification;