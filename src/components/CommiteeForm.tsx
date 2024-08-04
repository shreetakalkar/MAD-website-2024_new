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

interface CommiteeFormProps {
  handleSubmit: (data: any) => void;
  control: any;
  reset: any;
}

const CommiteeForm: React.FC<CommiteeFormProps> = ({
  handleSubmit,
  control,
  reset,
}: CommiteeFormProps) => {
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isValid = await validateImageDimensions(file);
      if (isValid) {
        setImageError(null);
        field.onChange(file);
      } else {
        setImageError("Invalid image dimensions. Please upload an image with dimensions 1080x1350, 1080x680, or 1080x1080.");
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
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Event Name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="eventLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Event Location" {...field} />
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
              <FormLabel>Event Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Event Description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
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
            name="eventTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
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
                  <p className="text-gray-500 text-sm">Size: 1080x1080 / 1080x1350 / 1080x680</p>
                </div>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e, field)}
                    placeholder="Upload Image"
                  />
                </FormControl>
                {imageError && <p className="text-red-500">{imageError}</p>}
              </FormItem>
            )}
          />
        </div>

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

        <Button type="submit" className="w-full md:w-auto">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default CommiteeForm;
