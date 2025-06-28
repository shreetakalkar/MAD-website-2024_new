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
import UnprotectedNavbar from "@/components/UnprotectedNavbar";

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
        instagramId: data.instagramId || null,
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
    <div className="container mx-auto px-4 py-4">
      <UnprotectedNavbar />
      <div className="flex justify-center px-4 py-6 sm:p-6 lg:p-10">
        <div className="w-full max-w-lg p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
          <div className="text-center mb-4">
            <b>Oh cool, did you unlock? What&#39;s your name?</b>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                />
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
                      <Input {...field} type="password" placeholder="Enter the code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LaunchForm;
