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
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { error } from "console";
import { Value } from "@radix-ui/react-select";

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
  phoneNo: z.string().nonempty({ message: "Field is required." }),
  address: z.string().nonempty({ message: "Field is required." }),
  classType: z.string().nonempty({ message: "Field is required." }),
  duration: z.string().nonempty({ message: "Field is required." }),
  travelLane: z.string().nonempty({ message: "Field is required." }),
  from: z.string().nonempty({ message: "Field is required." }),
  to: z.string(),
  certNo: z.string().nonempty({ message: "Field is required." }),
});
const RailwayEntryInterface = () => {
  const [date, setDate] = React.useState<Date>();
  const [gradYear, setGradYear] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    generateGradYear();
    // handleSubmit();
  }, []);

  const generateGradYear = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-based index

    let feGradYear = currentYear + 4;
    if (currentMonth < 6) {
      feGradYear = currentYear + 3;
    }

    const years = [
      { id: 1, year: "FE", gradYear: feGradYear },
      { id: 2, year: "SE", gradYear: feGradYear - 1 },
      { id: 3, year: "TE", gradYear: feGradYear - 2 },
      { id: 4, year: "BE", gradYear: feGradYear - 3 },
    ];

    setGradYear(() => years);
  };

  const branches = ["Computer", "IT", "AI & DS", "EXTC"];
  const travelFromLocations = [
    "Airoli",
    "Aman Lodge",
    "Ambernath",
    "Ambivli",
    "Andheri",
    "Apta",
    "Asangaon",
    "Atgaon",
    "Badlapur",
    "Bamandongri",
    "Bandra",
    "Bhandup",
    "Bhayandar",
    "Bhivpuri Road",
    "Bhiwandi Road",
    "Boisar",
    "Borivali",
    "Byculla",
    "CBD Belapur",
    "Charni Road",
    "Chembur",
    "Chhatrapati Shivaji Terminus",
    "Chikhale",
    "Chinchpokli",
    "Chouk",
    "Chunabhatti",
    "Churchgate",
    "Cotton Green",
    "Currey Road",
    "Dadar",
    "Dahanu Road",
    "Dahisar",
    "Dativali",
    "Dighe",
    "Diva Junction",
    "Dockyard Road",
    "Dolavli",
    "Dombivli",
    "Ghansoli",
    "Ghatkopar",
    "Goregaon",
    "Govandi",
    "Grant Road",
    "Guru Tegh Bahadur Nagar",
    "Hamrapur",
    "Jite",
    "Jogeshwari",
    "Juchandra",
    "Juinagar",
    "Jummapatti",
    "Kalamboli",
    "Kalwa",
    "Kalyan Junction",
    "Kaman Road",
    "Kandivli",
    "Kanjurmarg",
    "Karjat",
    "Kasara",
    "Kasu",
    "Kelavli",
    "Kelve Road",
    "Khadavli",
    "Khandeshwar",
    "Khar Road",
    "Kharbao",
    "Khardi",
    "Kharghar",
    "Kharkopar",
    "Khopoli",
    "King's Circle",
    "Kopar",
    "Kopar Khairane",
    "Kurla",
    "Lower Parel",
    "Lowjee",
    "Mahalaxmi",
    "Mahim Junction",
    "Malad",
    "Mankhurd",
    "Mansarovar",
    "Marine Lines",
    "Masjid",
    "Matheran",
    "Matunga",
    "Matunga Road",
    "Mira Road",
    "Mohope",
    "Mulund",
    "Mumbai Central",
    "Mumbra",
    "Nagothane",
    "Nahur",
    "Naigaon",
    "Nallasopara",
    "Navde Road",
    "Neral Junction",
    "Nerul",
    "Nidi",
    "Nilaje",
    "Palasdari",
    "Palghar",
    "Panvel",
    "Parel",
    "Pen",
    "Prabhadevi",
    "Rabale",
    "Ram Mandir",
    "Rasayani",
    "Reay Road",
    "Roha",
    "Sandhurst Road",
    "Sanpada",
    "Santacruz",
    "Saphale",
    "Seawoods–Darave",
    "Sewri",
    "Shahad",
    "Shelu",
    "Sion",
    "Somtane",
    "Taloje Panchnand",
    "Thakurli",
    "Thane",
    "Thansit",
    "Tilak Nagar",
    "Titwala",
    "Turbhe",
    "Ulhasnagar",
    "Umbermali",
    "Umroli",
    "Vadala Road",
    "Vaitarna",
    "Vangani",
    "Vangaon",
    "Vasai Road",
    "Vashi",
    "Vasind",
    "Vidyavihar",
    "Vikhroli",
    "Vile Parle",
    "Virar",
    "Vithalwadi",
    "Water Pipe",
    "Dronagiri",
    "Gavan",
    "Nhava Sheva",
    "Ranjanpada",
    "Sagar Sangam",
    "Targhar",
    "Uran City",
  ];
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
      dob: new Date(2000, 0, 1),
      phoneNo: "",
      address: "",
      classType: "",
      duration: "",
      travelLane: "",
      from: "",
      to: "Bandra",
      certNo: "",
    },
  });

  const getStudentId = async (formData) => {
    try {
      const studentsRef = query(
        collection(db, "Students "),
        where("email", "==", formData.email)
      );

      const querySnapshot = await getDocs(studentsRef);
      const studentDoc = querySnapshot.docs[0];

      const studentId = studentDoc?.id || "";
      console.log(studentId);
      return studentId;
    } catch (error) {
      console.error("Error getting student document:", error);
      throw error;
    }
  };

  const createConcessionDetails = async (studentId, values) => {
    try {
      //if no student found, then what to do?

      const concessionDetailsRef = doc(db, "ConcessionDetails", studentId);
      console.log("hello");
      await setDoc(concessionDetailsRef, {
        // Add other fields as needed
        ...values,
      });
      console.log("Created");
    } catch (error) {
      console.error("Error while creating new concession request", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const studentId = await getStudentId(values);
      console.log("hi");

      createConcessionDetails(studentId, values);
    } catch {
      console.error("Error in fetching the doc");
    }
    console.log(values);
  };

  return (
    <>
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">Railway Concession Entry</CardTitle>
        </CardHeader>
        <CardContent>
          {" "}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {gradYear.map((year, index) => {
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
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
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
                                selected={field.value}
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
                    name="phoneNo"
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
                      name="classType"
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
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">
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
                            <SelectItem value="western">Western</SelectItem>
                            <SelectItem value="central">Central</SelectItem>
                            <SelectItem value="harbour">Harbour</SelectItem>
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
                {/* </div> */}
                {/* <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select {...register("branch")}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
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
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="grad-year">Graduation Year</Label>
                    <Select {...register("gradYear")}>
                      {" "}
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select grad year" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradYear.map((year, index) => {
                          return (
                            <SelectItem key={index} value={year.year}>
                              {year.year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>{" "}
                </div>
                <div className="grid gap-4">
                  {" "}
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    id="email"
                    placeholder="Email Address"
                  />{" "}
                  {errors.email && <span>{errors.email.message}</span>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      {...register("firstName")}
                      id="first-name"
                      placeholder="Max"
                    />
                    {errors.firstName && (
                      <span>{errors.firstName.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="middle-name">Middle name</Label>
                    <Input
                      {...register("middleName")}
                      id="middle-name"
                      placeholder="Stephen"
                    />
                    {errors.middleName && (
                      <span>{errors.middleName.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      {...register("lastName")}
                      id="last-name"
                      placeholder="Robinson"
                    />
                    {errors.lastName && <span>{errors.lastName.message}</span>}{" "}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select {...register("gender")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectGroup> */}
                {/* <SelectLabel>Fruits</SelectLabel> */}
                {/* <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem> */}
                {/* </SelectGroup> */}
                {/* </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneno">Phone Number</Label>
                  <Input
                    {...register("phoneNo")}
                    id="phoneno"
                    placeholder="Phone Number"
                  />
                  {errors.phoneNo && <span>{errors.phoneNo.message}</span>}{" "}
                </div> */}
                {/* <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    {...register("address")}
                    id="address"
                    placeholder="Type your address here"
                  />
                  {errors.address && <span>{errors.address.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {" "}
                  <div className="grid gap-2">
                    <Label htmlFor="class">Class</Label>
                    <Select {...register("classType")}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectGroup> */}
                {/* <SelectLabel>Fruits</SelectLabel> */}
                {/* <SelectItem value="first-class">I</SelectItem>
                        <SelectItem value="second-class">II</SelectItem> */}
                {/* </SelectGroup> */}
                {/* </SelectContent>
                    </Select>
                  </div>{" "}
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select {...register("duration")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent> */}
                {/* <SelectGroup> */}
                {/* <SelectLabel>Fruits</SelectLabel> */}
                {/* <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem> */}
                {/* </SelectGroup> */}
                {/* </SelectContent>
                    </Select>
                  </div>{" "}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="travel-lane">Travel Lane</Label>
                  <Select {...register("travelLane")}>
                    <SelectTrigger>
                      {" "}
                      <SelectValue placeholder="Select" />
                    </SelectTrigger> */}
                {/* <SelectContent> */}
                {/* <SelectGroup> */}
                {/* <SelectLabel>Fruits</SelectLabel> */}
                {/* <SelectItem value="western">Western</SelectItem>
                      <SelectItem value="central">Central</SelectItem>
                      <SelectItem value="harbour">Harbour</SelectItem> */}
                {/* </SelectGroup> */}
                {/* </SelectContent>
                  </Select>
                </div>{" "}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="from">From</Label>
                    <Select {...register("from")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {travelFromLocations.map((location, index) => (
                          <SelectItem key={index} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>{" "}
                  <div className="grid gap-2">
                    <Label htmlFor="to">To</Label>
                    <Input
                      type="text"
                      value="Bandra"
                      className="cursor-default"
                      readOnly
                    />
                  </div>
                  <div className="grid gap-4">
                    {" "}
                    <Label htmlFor="cert-no">Certificate Number</Label>
                    <Input
                      {...register("certNo")}
                      id="cert-no"
                      placeholder="eg., Z XXX"
                    />
                    {errors.certNo && <span>{errors.certNo.message}</span>}
                  </div>
                </div>
                <Button type="submit" variant={"default"}>
                  Submit
                </Button> */}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
export default RailwayEntryInterface;
