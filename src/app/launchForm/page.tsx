"use client";

import Link from "next/link";
import { useUser } from "@/providers/UserProvider";
import { ArrowRight } from "lucide-react";
import { ModeToggle } from "@/components/modeToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import bcrypt from "bcryptjs";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import DevsDark from "@/public/images/devs-dark.png";
import DevsLight from "@/public/images/devs-light.png";
import { useTheme } from "next-themes";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  year: z.enum(["FE", "SE", "TE", "BE"], {
    required_error: "Please select a year.",
  }),
  branch: z.enum(["Comps", "Aids", "It", "Extc", "Chem"], {
    required_error: "Please select a branch.",
  }),
  code: z.string().min(1, "Code is required"),
  instagramId: z.string().optional(),
});

const LaunchForm = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const launchDocRef = doc(db, "Launch", "launch");
      const launchDoc = await getDoc(launchDocRef);
      if (!launchDoc.exists()) {
        throw new Error("Launch document not found");
      }

      const launchData = launchDoc.data();
      const encryptedCode = launchData?.ans;
      const unlocked = launchData.unlocked;

      if (!encryptedCode) {
        throw new Error("Code not found in document");
      }

      const isMatch = await bcrypt.compare(data.code, encryptedCode);
      if (!isMatch) {
        throw new Error("Invalid code");
      }

      const studentData = {
        name: data.name,
        branch: data.branch,
        year: data.year,
        instagramId: data.instagramId,
      };

      await updateDoc(launchDocRef, {
        students: arrayUnion(studentData),
        unlocked: unlocked + 1,
      });

      toast({
        title: "Success",
        description: "Code verified and student added successfully.",
      });

      router.push("/launchDashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
        });
      }
    }
  }

  const { user } = useUser();
  
  return (
    <div className="container mx-auto p-4">
    <nav className="sticky top-0 shadow-md z-50 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Image
              src={theme === "dark" ? DevsDark : DevsLight}
              alt="logo"
              width={50}
              height={50}
              className="rounded-md"
            />
            <Link href="/about" className="text-xl font-semibold text-gray-800 dark:text-white">
              {`Developer's Club of TSEC`}
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Button variant={"link"}>
              <Link href="mailto:devsclubtsec@gmail.com" className="flex items-center">
                Contact us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant={"link"} className="hover:underline">
              <Link href="/about" className="flex items-center text-gray-600 dark:text-gray-300">
                About Us
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
      <div className="flex justify-center p-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FE">FE</SelectItem>
                        <SelectItem value="SE">SE</SelectItem>
                        <SelectItem value="TE">TE</SelectItem>
                        <SelectItem value="BE">BE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Comps">Comps</SelectItem>
                        <SelectItem value="Aids">Aids</SelectItem>
                        <SelectItem value="It">It</SelectItem>
                        <SelectItem value="Extc">Extc</SelectItem>
                        <SelectItem value="Chem">Chem</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
            </div>
            <FormField
              control={form.control}
              name="instagramId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram ID (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your Instagram ID (optional)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter the code"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LaunchForm;
