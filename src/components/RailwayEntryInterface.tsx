"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import useGradYear from "@/constants/gradYearList";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  setDoc,
  Timestamp,
  Firestore,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { error } from "console";
import { Value } from "@radix-ui/react-select";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { branches } from "@/constants/branches";
import { travelFromLocations } from "@/constants/travelFromLocations";
import { calculateAge } from "@/constants/AgeCalc";

const formSchema = z.object({
  branch: z.string().nonempty({ message: "Field is required." }),
  gradYear: z.string().nonempty({ message: "Field is required." }),
  email: z.string().email().nonempty({ message: "Field is required." }),
  firstName: z.string().nonempty({ message: "Field is required." }),
  middleName: z.string().optional(),
  lastName: z.string().nonempty({ message: "Field is required." }),
  gender: z.string().nonempty({ message: "Field is required." }),
  dob: z.date().refine(
    (date) => {
      // Check for undefined or null and return false if either is true
      if (date === undefined || date === null) {
        return false;
      }
      return true;
    },
    { message: "Field is required." }
  ),
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
  to: z.string(),
  certNo: z.string().nonempty({ message: "Field is required." }),
});

const RailwayEntryInterface = () => {
  const [emails, setEmails] = useState<any[]>([]);
  const [value, setValue] = useState<string>("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const gradYearList = useGradYear();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch: "",
      gradYear: "",
      email: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      dob: new Date(2003, 5, 1),
      phoneNum: "",
      address: "",
      class: "",
      duration: "",
      travelLane: "",
      from: "",
      to: "Bandra",
      certNo: "",
    },
  });
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const studentRef = collection(db, "Students ");
      const querySnapshot = await getDocs(studentRef);
      const emailArray = [];

      querySnapshot.forEach((doc) => {
        emailArray.push(doc.data().email);
      });

      setEmails(emailArray.sort());
    } catch (error) {
      toast({
        description: "Error while fetching emails",
        variant: "destructive",
      });
      console.log("Error while fetching emails", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmails();
  }, []);

  const setStudentData = async (value) => {
    if (value != "") {
      setLoading(true);
      try {
        const lowerCaseEmail = value.toLowerCase();

        const studentsRef = collection(db, "Students ");
        const querySnapshot = await getDocs(studentsRef);

        // Iterate through the query snapshot to find a case-insensitive match
        querySnapshot.forEach((doc) => {
          const studentData = doc.data();
          const storedEmail = studentData?.email?.toLowerCase(); // Convert stored email to lowercase for comparison

          if (storedEmail === lowerCaseEmail) {
            const studentId = doc?.id || "";
            const studentData = doc?.data();

            const name = studentData.Name.trim();
            const nameParts = name.split(" ");
            const firstName = nameParts[0] || "";
            const middleName = nameParts[1] || "";
            const lastName = nameParts[nameParts.length - 1] || "";

            form.setValue("firstName", firstName);
            form.setValue("middleName", middleName);
            form.setValue("lastName", lastName);
            form.setValue("branch", studentData.Branch);
            form.setValue("email", value);

            setStudentId(studentId);
          }
        });
      } catch (error) {
        toast({
          description: "Error fetching student data",
          variant: "destructive",
        });
        console.error("Error getting student document:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      form.reset();
    }
  };
  useEffect(() => {
    form.setValue("email", value);
    setStudentData(value);
  }, [value]);
  const createConcDetailsDoc = async (studentId, values) => {
    setLoading(true);
    try {
      const { ageYears, ageMonths } = calculateAge(values.dob);
      const { email, certNo, gradYear, phoneNum, ...formData } = values;

      //Fetching the gradYear based on "FE","SE",etc.
      const selectedGradYear = gradYearList.find(
        (item) => item.year === gradYear
      ).gradYear;
      const parsedPhoneNum = parseInt(phoneNum, 10);
      const concessionDetailsRef = doc(db, "ConcessionDetails", studentId);

      //Creating a doc in ConcessionDetails Collection
      await setDoc(concessionDetailsRef, {
        ...formData,
        ageYears,
        ageMonths,
        gradyear: selectedGradYear,
        phoneNum: parsedPhoneNum,
        idCardURL: "",
        previousPassURL: "",
        lastPassIssued: new Date(),
        status: "serviced",
        statusMessage: "Your request has been serviced",
      });

      // Successfully created concession request
      toast({
        description: "Concession request has been created!",
      });
    } catch (error) {
      toast({
        description: "Error while processing request!",
        variant: "destructive",
      });
      console.error(
        "Error while creating doc in ConcessionDetails collection",
        error
      );
    } finally {
      setLoading(false);
    }
  };
  const createConcRequestDoc = async (studentId, values) => {
    try {
      const concessionRequestRef = doc(db, "ConcessionRequest", studentId);

      //Creating a doc in ConcessionDetails Collection
      await setDoc(concessionRequestRef, {
        notificationTime: new Date(),
        passNum: values.certNo,
        status: "serviced",
        statusMessage: "Your request has been serviced",
        time: new Date(),
        uid: studentId,
      });

      // Successfully created concession request
    } catch (error) {
      toast({
        description: "Error while processing request!",
        variant: "destructive",
      });
      console.log(
        "Error while creating doc in ConcessionRequest collection",
        error
      );
    }
  };
  const appendFEDataInConcHistory = async (values) => {
    const concessionHistoryRef = doc(db, "ConcessionHistory", "History");
    setLoading(true);
    try {
      const { ageYears, ageMonths } = calculateAge(values.dob);
      const { email, certNo, gradYear, phoneNum, ...formData } = values;

      //  Fetching the gradYear based on "FE","SE",etc.
      const selectedGradYear = gradYearList.find(
        (item) => item.year === gradYear
      ).gradYear;
      const parsedPhoneNum = parseInt(phoneNum, 10);
      const formattedData = {
        ...formData,
        ageYears,
        ageMonths,
        gradyear: selectedGradYear,
        passNum: certNo,
        phoneNum: parsedPhoneNum,
        lastPassIssued: new Date(),
        status: "serviced",
        statusMessage: "Your request has been serviced",
      };
      await updateDoc(concessionHistoryRef, {
        history: arrayUnion(formattedData),
      });
      toast({
        description: "Concession request has been created!",
      });
    } catch (error) {
      toast({
        description: "Error while processing request!",
        variant: "destructive",
      });
      console.error("An error occurred while appending data", error);
    } finally {
      setLoading(false);
    }
  };
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.gradYear === "FE" && value === "") {
        await appendFEDataInConcHistory(values);
      } else {
        if (studentId !== "") {
          await createConcDetailsDoc(studentId, values);
          await createConcRequestDoc(studentId, values);
        } else {
          toast({
            description: "No such student found!",
            variant: "destructive",
          });
        }
      }
      form.reset();
      setValue("");
      setStudentId("");
    } catch (error) {
      toast({
        description: "An error occurred",
        variant: "destructive",
      });
      console.error("Error ", error);
    }
  };
  return (
    <>
      {" "}
      {loading && <p>Loading...</p>}
      <Card className="mx-auto max-w-[70%] ">
        <CardHeader>
          <CardTitle className="text-3xl">Railway Concession Entry</CardTitle>
        </CardHeader>
        <CardContent>
          {" "}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              method="post"
              className="space-y-8"
            >
              <div className="grid gap-4">
                {" "}
                <div className="grid gap-2 mt-[2.5%] mb-[2.5%]">
                  <Command className={cn(" h-[10rem] bg-gray-800")}>
                    <CommandInput placeholder="Search email..." />
                    <CommandList
                      style={{
                        overflow: "auto",
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                      className={cn("max-h-[100px] no-scrollbar")}
                    >
                      <CommandEmpty>
                        No such email found. Please enter all the fields
                        manually.
                      </CommandEmpty>
                      <CommandGroup>
                        {emails.map((email, index) => (
                          <CommandItem
                            key={index}
                            value={email}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === email ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>{" "}
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>{" "}
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                  </div>{" "}
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branches.map((branch, index) => {
                                return (
                                  <SelectItem key={index} value={branch}>
                                    {branch}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="gradYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {gradYearList.map((year, index) => {
                                return (
                                  <SelectItem key={index} value={year.year}>
                                    {year.year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>{" "}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    {" "}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                  </div>{" "}
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DOB</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal flex",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto  p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={new Date(2003, 5, 1)}
                                defaultMonth={new Date(2003, 5, 1)}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("2000-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="phoneNum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>{" "}
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter student address"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    {" "}
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="I">I</SelectItem>
                              <SelectItem value="II">II</SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                  </div>{" "}
                  <div className="grid gap-2">
                    {" "}
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pass duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                              <SelectItem value="Quarterly">
                                Quarterly
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>{" "}
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="travelLane"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Travel lane</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select travel lane" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Western">Western</SelectItem>
                              <SelectItem value="Central">Central</SelectItem>
                              <SelectItem value="Harbour">Harbour</SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                  </div>
                </div>{" "}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    {" "}
                    <FormField
                      control={form.control}
                      name="from"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select station" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {travelFromLocations.map((location, index) => (
                                <SelectItem key={index} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                  </div>
                  <div className="grid gap-2">
                    {" "}
                    <FormField
                      control={form.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <FormControl>
                            <Input
                              className="cursor-default"
                              readOnly
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="certNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate Number</FormLabel>
                        <FormControl>
                          <Input placeholder="eg., Z XXX" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
export default RailwayEntryInterface;
