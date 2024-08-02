"use client";
import React from "react";
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
                <FormLabel>Image Upload</FormLabel>
                <FormControl>
                  <Input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                      field.onChange(e.target.files[0]);
                    }
                  }} placeholder="Enter Image URL" />
                </FormControl>
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
