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
import { branches } from "@/constants/branches";
import { travelFromLocations } from "@/constants/travelFromLocations";
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
import React, { use, useEffect, useState } from "react";
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
  getDoc,
  limit,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { error } from "console";
import { Value } from "@radix-ui/react-select";
import { Check, ChevronsUpDown } from "lucide-react";
import { userTypes } from "@/constants/types/userTypes";
import { UserContext } from "@/app/layout";
import { useRouter } from "next/router";
import useGradYear from "@/constants/gradYearList";

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
  doi: z.date().refine(
    (date) => {
      // Check for undefined or null and return false if either is true
      if (date === undefined || date === null) {
        return false;
      }
      return true;
    },
    { message: "Field is required." }
  ),
  phoneNum: z.string().nonempty({ message: "Field is required." }),
  address: z.string().nonempty({ message: "Field is required." }),
  class: z.string().nonempty({ message: "Field is required." }),
  duration: z.string().nonempty({ message: "Field is required." }),
  travelLane: z.string().nonempty({ message: "Field is required." }),
  from: z.string().nonempty({ message: "Field is required." }),
  to: z.string(),
  certNo: z.string().nonempty({ message: "Field is required." }),
});

const UpdatePassDetails = () => {
  const { toast } = useToast();
  const gradYearList = useGradYear();
  const [Name, setName] = useState("");
  // const { user } = React.useContext(UserContext);
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  // const router = useRouter();

  const keys = ["firstName"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) =>
        item[key].toString().toLowerCase().includes(Name.toLowerCase())
      )
    );
  };

  const fetchAllPasses = async () => {
    try {
      const concessionDetailsRef = collection(db, "ConcessionDetails");
      const concessionRequestRef = collection(db, "ConcessionRequest");

      // Get requests with status "serviced" or "downloaded"
      const requestsSnapshot = await getDocs(
        query(
          concessionRequestRef,
          where("status", "in", ["serviced", "downloaded"])
          // limit(10)
        )
      );

      const fetchedPasses = [];
      console.log(requestsSnapshot.docs);
      // Iterate through requests
      for (const requestDoc of requestsSnapshot.docs) {
        const concessionDetailsId = requestDoc.data().uid;
        console.log(concessionDetailsId);

        if (concessionDetailsId) {
          const concessionDetailsDoc = await getDoc(
            doc(concessionDetailsRef, concessionDetailsId)
          );

          if (concessionDetailsDoc.exists()) {
            const enquiry = concessionDetailsDoc.data();
            fetchedPasses.push(enquiry);
          }
        }
      }

      setPasses(fetchedPasses);

      console.log(fetchedPasses);
    } catch (error) {
      console.error("Error fetching recent passes:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllPasses();
  }, []);

  useEffect(() => {
    console.log(passes);
  }, [passes]);
  // useEffect(() => {
  //   if (!user.type.trim() || !(user.type == userTypes.RAILWAY)) {
  //     router.push("/");
  //   }
  // }, [user]);

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
      doi: new Date(),
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

  const toggleEditMode = () => {
    setIsEditable(!isEditable);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // const studentId = await getStudentId(values);
      // createConcDetailsDoc(studentId, values);
      // createConcRequestDoc(studentId, values);
      console.log("Hi");
    } catch (error) {
      toast({
        description: "An error occurred",
      });
      console.error("Error ", error);
    }
  };

  return (
    <>
      <div className="w-[75%] flex flex-col gap-[5rem]">
        {passes.map((pass, index) => (
          <Card className="mx-auto ml-[1%]  mt-2">
            <CardContent className="p-6">
              {" "}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid gap-4 ">
                    <div className="card-head-wrapper w-[100%]  flex justify-between items-center">
                      <div className="flex gap-2 w-[55%]">
                        {" "}
                        <div className="grid gap-2">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input
                                    defaultValue={pass.firstName}
                                    readOnly={!isEditable}
                                    //  {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />{" "}
                        </div>{" "}
                        <div className="grid gap-2">
                          <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Middle Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Steve" {...field} />
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
                                  <Input placeholder="Walker" {...field} />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="grid gap-2">
                          <FormField
                            control={form.control}
                            name="certNo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Certifcate Number</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>{" "}
                      </div>
                    </div>
                    <div className="card-other-details flex justify-between">
                      <div className="personal-details gap-6">
                        <div className="grid grid-cols-3 gap-2 w-[100%] mb-2">
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
                                    defaultValue={field.value}
                                    readOnly
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Male">Male</SelectItem>
                                      <SelectItem value="Female">
                                        Female
                                      </SelectItem>
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
                                <FormItem className="">
                                  <FormLabel>Date of Birth</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl className="flex items-center justify-center">
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            " text-center font-normal ",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
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
                          <div className="grid gap-2">
                            <FormField
                              control={form.control}
                              name="doi"
                              render={({ field }) => (
                                <FormItem className="">
                                  <FormLabel>Date of Issue</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl className="flex items-center justify-center">
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            " text-center font-normal",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto  p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={new Date()}
                                        defaultMonth={new Date()}
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
                          </div>{" "}
                        </div>{" "}
                        <div className="grid grid-cols-2 gap-2 w-[80%] mb-2">
                          <div className="grid gap-2">
                            <FormField
                              control={form.control}
                              name="branch"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Branch</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select branch" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {branches.map((branch, index) => {
                                        return (
                                          <SelectItem
                                            key={index}
                                            value={branch}
                                          >
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
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select year" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {gradYearList.map((year, index) => {
                                        return (
                                          <SelectItem
                                            key={index}
                                            value={year.year}
                                          >
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
                          </div>
                        </div>
                        <div className="grid gap-2 w-[50%] mb-2">
                          <FormField
                            control={form.control}
                            name="phoneNum"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="" {...field} />
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
                                    placeholder=""
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
                      <div className="rail-details w-[40%] flex flex-col  justify-between	">
                        <div>
                          <div className="grid grid-cols-2 gap-4 mb-2">
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
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {travelFromLocations.map(
                                          (location, index) => (
                                            <SelectItem
                                              key={index}
                                              value={location}
                                            >
                                              {location}
                                            </SelectItem>
                                          )
                                        )}
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
                          </div>{" "}
                          <div className="grid grid-cols-2 gap-4 mb-2">
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
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select" />
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
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Monthly">
                                          Monthly
                                        </SelectItem>
                                        <SelectItem value="Quarterly">
                                          Quarterly
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
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
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Western">
                                        Western
                                      </SelectItem>
                                      <SelectItem value="Central">
                                        Central
                                      </SelectItem>
                                      <SelectItem value="Harbour">
                                        Harbour
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />{" "}
                          </div>{" "}
                        </div>
                        <div className="buttons w-[100%] flex justify-end gap-4">
                          <Button type="button" onClick={toggleEditMode}>
                            Edit Details
                          </Button>{" "}
                          <Button type="button">Extend Date</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
              {/* <Input defaultValue={"jhgjhg"} /> */}
              {/* <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {" "}
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
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
                            <Input placeholder="Steve" {...field} />
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
                            <Input placeholder="Walker" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {/* {branches.map((branch, index) => {
                                return (
                                  <SelectItem key={index} value={branch}>
                                    {branch}
                                  </SelectItem>
                                );
                              })} */}
              {/* </SelectContent>
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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent> */}
              {/* {gradYearList.map((year, index) => {
                                return (
                                  <SelectItem key={index} value={year.year}>
                                    {year.year}
                                  </SelectItem>
                                );
                              })} */}
              {/* </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="eg., xyz@gmail.com" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )} */}
              {/* />{" "}
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
                                    "w-[240px] pl-3 text-left font-normal",
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
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="phoneNum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
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
                            placeholder=""
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    {" "}
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select */}
              {/* onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
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
                  </div>
                </div>{" "} */}
              {/* <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="travelLane"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travel lane</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {/* {travelFromLocations.map((location, index) => ( */}
              {/* <SelectItem key={index} value={location}>
                                  {location}
                                </SelectItem>
                              ))} */}
              {/* </SelectContent>
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
                      </FormItem> */}
              {/* )}
                  />
                </div>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form> */}
            </CardContent>
          </Card>
        ))}{" "}
      </div>
      {/* <Input
        type="text"
        placeholder="eee"
        // className="border-none  focus-visible:ring-transparent"
      /> */}
    </>
  );
};
export default UpdatePassDetails;
