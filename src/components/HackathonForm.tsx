"use client";
import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface HackathonFormProps {
  handleSubmit: (data: any) => void;
  control: any;
  reset: any;
}

const HackathonForm: React.FC<HackathonFormProps> = ({
  handleSubmit,
  control,
  reset,
}: HackathonFormProps) => {
  const [imageError, setImageError] = useState<string | null>(null);

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        if (
          (width === 1080 && height === 1350) ||
          (width === 1080 && height === 680) ||
          (width === 1080 && height === 1080)
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isValid = await validateImageDimensions(file);
      if (isValid) {
        setImageError(null);
        field.onChange(file);
      } else {
        setImageError(
          "Invalid image dimensions. Please upload an image with dimensions 1080x1350, 1080x680, or 1080x1080."
        );
        e.target.value = ""; // Clear the input
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hackathon Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Hackathon Title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="eventLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hackathon Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Hackathon Location" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="eventDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hackathon Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter Hackathon Description"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="eventEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Image Upload</FormLabel>
                  <p className="text-gray-500 text-sm">
                    Size: 1080x1080 / 1080x1350 / 1080x680
                  </p>
                </div>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleImageChange(e, field)
                    }
                    placeholder="Upload Image"
                  />
                </FormControl>
                {imageError && <p className="text-red-500">{imageError}</p>}
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={control}
            name="eventRegistrationUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Registration URL" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="collegeOrganization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College/Organization</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter College/Organization Name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="eventRegistrationEnds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Ends</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Registration End Date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
  control={control}
  name="eventMode"
  render={({ field }) => (
    <FormItem className="mb-4">
      <FormLabel className="block text-sm font-semibold text-gray-700">Mode</FormLabel>
      <FormControl>
        <select
          {...field}
          className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" className="text-gray-500">Select Mode</option>
          <option value="online">Online</option>
          <option value="in-person">In-person</option>
          {/* Add more options as needed */}
        </select>
      </FormControl>
    </FormItem>
  )}
/>

        </div>

        <Button type="submit" className="w-full md:w-auto">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default HackathonForm;
