import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import useDivisionList from "@/constants/divisionList";
import useBatchList from "@/constants/batchList";
import useGradYear from "@/constants/gradYearList";
import { branches } from "@/constants/branches";

interface AdditionalField {
  name: string;
  label: string;
  placeholder?: string;
  type: string;
  options?: string[];
}

interface TTFormProps {
  additionalFields?: AdditionalField[];
  handleSubmit: (data: any) => void;
  control: any;
  reset: any;
}

const TTForm: React.FC<TTFormProps> = ({
  additionalFields,
  handleSubmit,
  control,
  reset,
}: TTFormProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [currentYear, setCurrentYear] = useState<string>("All");
  const [branch, setBranch] = useState<string>("All");
  const [div, setDivision] = useState<string>("All");
  // const [batch, setBatch] = useState<string>("All");

  const divisionOptions = useDivisionList(branch, currentYear);
  const batchOptions = useBatchList(div, branch);

  // Options
  const yearOptions = ["All", "FE", "SE", "TE", "BE"];
  const branchOptions = ["All", ...branches];
  const divisionOptionsWithAll = ["All", ...divisionOptions];
  const batchOptionsWithAll = ["All", ...batchOptions];

  const renderField = (
    field: any,
    type: string,
    placeholder?: string,
    options?: string[]
  ) => {
    switch (type) {
      case "textarea":
        return <Textarea placeholder={placeholder} {...field} />;
      case "select":
        return (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    " pl-3 text-left font-normal flex",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-5 h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      case "file":
        return (
          <Input
            type="file"
            ref={fileInputRef}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                field.onChange(e.target.files[0]);
              }
            }}
            className="cursor-pointer"
            placeholder={placeholder}
          />
        );
      default:
        return <Input placeholder={placeholder} {...field} />;
    }
  };

  return (
    <form
      onSubmit={(data) => {
        handleSubmit(data);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }}
      className="space-y-8"
      noValidate
    >
      <div className="grid gap-4">
        <div className="grid gap-4 grid-cols-2 mb-[2%]">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} defaultValue="" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2 grid-rows-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setCurrentYear(value);
                        setBranch("All"); // Reset branch and below
                        setDivision("All");
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {currentYear !== "FE" && currentYear !== "All" && (
                <FormField
                  control={control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setBranch(value);
                          setDivision("All"); // Reset division and below
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branchOptions.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(currentYear === "FE" || branch !== "All") && (
                <FormField
                  control={control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setDivision(value);
                          // setBatch("All");
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                        <SelectContent>
                          {divisionOptionsWithAll.map((division) => (
                            <SelectItem key={division} value={division}>
                              {division}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}

              {currentYear !== "FE" && div !== "All" && (
                <FormField
                  control={control}
                  name="batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                        <SelectContent>
                          {batchOptionsWithAll.map((batch) => (
                            <SelectItem key={batch} value={batch}>
                              {batch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          {additionalFields && (
            <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid gap-4">
              {additionalFields.map(
                ({ name, label, placeholder, type, options }) => (
                  <FormField
                    key={name}
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          {renderField(field, type, placeholder, options)}
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )
              )}
            </div>
          )}
        </div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default TTForm;
