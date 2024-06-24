// import { Input } from "@/components/ui/input";
// import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import React from "react";

const RailwayEntryInterface = () => {
  const [date, setDate] = React.useState<Date>();

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
            <div className="grid gap-2">
              <Label htmlFor="branch">Branch</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectGroup> */}
                  {/* <SelectLabel>Fruits</SelectLabel> */}
                  <SelectItem value="comps">Comps</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  {/* </SelectGroup> */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grad-year">Grad Year</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select grad year" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectGroup> */}
                  {/* <SelectLabel>Fruits</SelectLabel> */}
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  {/* </SelectGroup> */}
                </SelectContent>
              </Select>
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
              <Label htmlFor="grad-year">Travel Lane</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select grad year" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectGroup> */}
                  {/* <SelectLabel>Fruits</SelectLabel> */}
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  {/* </SelectGroup> */}
                </SelectContent>
              </Select>
            </div>{" "}
            <div className="grid gap-2">
              <Label htmlFor="grad-year">Grad Year</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select grad year" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectGroup> */}
                  {/* <SelectLabel>Fruits</SelectLabel> */}
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  {/* </SelectGroup> */}
                </SelectContent>
              </Select>
            </div>{" "}
            <div className="grid gap-2">
              <Label htmlFor="grad-year">Grad Year</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select grad year" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectGroup> */}
                  {/* <SelectLabel>Fruits</SelectLabel> */}
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  {/* </SelectGroup> */}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with GitHub
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="#" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      {/* <h1>Railway Entry Interface</h1>
      <Input type="email" placeholder="Email" /> */}
    </>
  );
};
export default RailwayEntryInterface;
