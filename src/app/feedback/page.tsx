"use client";

import { useState } from "react";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { feedbackFormSchema, FeedbackFormData } from "@/lib/validation";


// export const feedbackFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, { message: "Name must be at least 2 characters long" }),
//   email: z.string().email({ message: "Please enter a valid email address" }),
//   topic: z.enum(["Suggestion", "Complaint", "Bug Report"], {
//     message: "Please select a valid topic",
//   }),
//   subject: z
//     .string()
//     .min(5, { message: "Subject must be at least 5 characters long" }),
//   message: z
//     .string()
//     .min(10, { message: "Message must be at least 10 characters long" }),
// });

// export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "Suggestion",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (data: FeedbackFormData) => {
    setIsLoading(true);

    try {
      await addDoc(collection(db, "Feedback"), {
        ...data,
        createdAt: new Date(),
      });
      toast({
        title: "Success",
        description: "Your feedback has been submitted successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Oops",
        description: "Something went wrong. Please try again later",
        variant: "destructive",
      });

      console.error("Error adding document: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2  bg-blue-400 dark:bg-slate-800">

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 max-w-4xl"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your opinion matters to us</CardTitle>
            <CardDescription>We&apos;d love to hear from you!</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Your Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full text-left"
                                >
                                  {field.value || "Select a topic"}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => field.onChange("Suggestion")}
                                >
                                  Suggestion
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => field.onChange("Complaint")}
                                >
                                  Complaint
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => field.onChange("Bug Report")}
                                >
                                  Bug Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your Message (min 10 characters)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading? <Loader className="mr-2 h-4 w-4 animate-spin" />:"Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
