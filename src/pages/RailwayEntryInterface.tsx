import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
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
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../src/config/firebase";

const RailwayEntryInterface = () => {
  const [date, setDate] = React.useState<Date>();
  const [gradYearArray, setGradYearArray] = useState<number[]>([]);

  useEffect(() => {
    generateGradYearArray();
    handleSubmit();
  }, []);

  const generateGradYearArray = () => {
    const currentYear = new Date().getFullYear();
    setGradYearArray(() =>
      Array.from({ length: 4 }, (val, i) => currentYear + i)
    );
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

  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      const concessionDetailsCollection = collection(db, "ConcessionDetails");
      console.log(concessionDetailsCollection);
      await addDoc(concessionDetailsCollection, {
        name: "Juhi",
        email: "test",
        createdAt: new Date(),
      });
    } catch (error) {}
  };

  return (
    <>
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">Railway Concession Entry</CardTitle>
          {/* <CardDescription>
            Enter your information to create an account
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="Max" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="middle-name">Middle name</Label>
                <Input id="middle-name" placeholder="Stephen" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Robinson" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger
                  // className="w-[180px]"
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectGroup> */}
                    {/* <SelectLabel>Fruits</SelectLabel> */}
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    {/* </SelectGroup> */}
                  </SelectContent>
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
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                <Select>
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
                <Select>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select grad year" />
                  </SelectTrigger>

                  <SelectContent>
                    {gradYearArray.map((year, index) => (
                      <SelectItem key={index} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>{" "}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phoneno">Phone Number</Label>
              <Input type="text" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea placeholder="Type your address here" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>
                <Select>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectGroup> */}
                    {/* <SelectLabel>Fruits</SelectLabel> */}
                    <SelectItem value="first-class">I</SelectItem>
                    <SelectItem value="second-class">II</SelectItem>
                    {/* </SelectGroup> */}
                  </SelectContent>
                </Select>
              </div>{" "}
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Select>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectGroup> */}
                    {/* <SelectLabel>Fruits</SelectLabel> */}
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    {/* </SelectGroup> */}
                  </SelectContent>
                </Select>
              </div>{" "}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="travel-lane">Travel Lane</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectGroup> */}
                  {/* <SelectLabel>Fruits</SelectLabel> */}
                  <SelectItem value="western">Western</SelectItem>
                  <SelectItem value="central">Central</SelectItem>
                  <SelectItem value="harbour">Harbour</SelectItem>
                  {/* </SelectGroup> */}
                </SelectContent>
              </Select>
            </div>{" "}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="from">From</Label>
                <Select>
                  <SelectTrigger className="">
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
            </div>
            <Button>Apply</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
export default RailwayEntryInterface;