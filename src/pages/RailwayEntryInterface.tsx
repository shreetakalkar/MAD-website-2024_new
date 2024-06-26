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
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

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
  phoneNum: z.string().nonempty({ message: "Field is required." }),
  address: z.string().nonempty({ message: "Field is required." }),
  class: z.string().nonempty({ message: "Field is required." }),
  duration: z.string().nonempty({ message: "Field is required." }),
  travelLane: z.string().nonempty({ message: "Field is required." }),
  from: z.string().nonempty({ message: "Field is required." }),
  to: z.string(),
  certNo: z.string().nonempty({ message: "Field is required." }),
});
const RailwayEntryInterface = () => {
  const [date, setDate] = React.useState<Date>();
  const [gradYearList, setGradYearList] = useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
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

    setGradYearList(() => years);
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

  const getStudentId = async (values) => {
    try {
      const studentsRef = query(
        collection(db, "Students "),
        where("email", "==", values.email)
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

  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();

    let ageYears = today.getFullYear() - dobDate.getFullYear();
    let ageMonths = today.getMonth() - dobDate.getMonth();

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }
    // console.log(ageMonths, ageYears);
    return { ageYears, ageMonths };
  };

  const createConcDetailsDoc = async (studentId, values) => {
    try {
      const { ageYears, ageMonths } = calculateAge(values.dob);
      const { email, certNo, gradYear, ...formData } = values;

      //Fetching the gradYear based on "FE","SE",etc.
      const selectedGradYear = gradYearList.find(
        (item) => item.year === gradYear
      ).gradYear;

      const concessionDetailsRef = doc(db, "ConcessionDetails", studentId);

      //Creating a doc in ConcessionDetails Collection
      await setDoc(concessionDetailsRef, {
        ...formData,
        ageYears,
        ageMonths,
        gradyear: selectedGradYear,
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
        description: "Student not found!",
      });
      console.error(
        "Error while creating doc in ConcessionDetails collection",
        error
      );
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
        description: "Student not found!",
      });
      console.log(
        "Error while creating doc in ConcessionRequest collection",
        error
      );
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const studentId = await getStudentId(values);
      createConcDetailsDoc(studentId, values);
      createConcRequestDoc(studentId, values);
    } catch (error) {
      toast({
        description: "An error occurred",
      });
      console.error("Error ", error);
    }
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
                  </div>
                </div>
                <div className="grid gap-2">
                  {/* <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                      >
                        {value
                          ? frameworks.find(
                              (framework) => framework.value === value
                            )?.label
                          : "Select framework..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0"> */}
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {frameworks.map((framework) => (
                          <CommandItem
                            key={framework.value}
                            value={framework.value}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === framework.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {framework.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  {/* </PopoverContent>
                  </Popover> */}
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
