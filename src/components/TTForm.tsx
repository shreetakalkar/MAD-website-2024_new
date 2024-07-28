import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import useDivisionList from "@/constants/divisionList";
import useBatchList from "@/constants/batchList";
import useGradYear from "@/constants/gradYearList";
import { branches } from "@/constants/branches";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const TTForm = ({
  onSubmit,
  handleSubmit,
  control,
  additionalFields,
  reset,
}) => {
  const [currentYear, setCurrentYear] = useState<string>("All");
  const [branch, setBranch] = useState<string>("All");
  const [division, setDivision] = useState<string>("All");
  const [batch, setBatch] = useState<string>("All");

  const divisionOptions = useDivisionList(branch, currentYear);
  const batchOptions = useBatchList(division, branch);
  const gradYearList = useGradYear();

  const yearOptions = ["All", "FE", "SE", "TE", "BE"];
  const branchOptions = ["All", ...branches];
  const divisionOptionsWithAll = ["All", ...divisionOptions];
  const batchOptionsWithAll = ["All", ...batchOptions];
  const renderField = (field, type, placeholder, options) => {
    switch (type) {
      case "textarea":
        return <Textarea placeholder={placeholder} {...field} />;
      case "select":
        return (
          <Select
            onValueChange={(value) => {
              field.onChange(value);
            }}
            {...field}
          >
            <FormControl>
              <SelectTrigger>{field.value || placeholder}</SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal flex",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {" "}
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto  p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  {...field}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </>
        );
      case "file":
        return (
          <Input
            type="file"
            className="cursor-pointer"
            placeholder={placeholder}
            onChange={(e) => field.onChange(e.target.files[0])}
          />
        );
      default:
        return <Input placeholder={placeholder} {...field} />;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-4">
        <div className="grid gap-4 grid-cols-2 mb-[2%]">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
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
              <div>
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
                          setBranch("All");
                          setDivision("All");
                        }}
                        {...field}
                      >
                        <FormControl>
                          <SelectTrigger>{currentYear}</SelectTrigger>
                        </FormControl>
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
              </div>
              {currentYear !== "FE" && currentYear !== "All" && (
                <div>
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
                            setDivision("All");
                          }}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>{branch}</SelectTrigger>
                          </FormControl>
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
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(currentYear === "FE" || branch !== "All") && (
                <div>
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
                            setBatch("All");
                          }}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>{division}</SelectTrigger>
                          </FormControl>
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
                </div>
              )}
              {currentYear !== "FE" && division !== "All" && (
                <div>
                  <FormField
                    control={control}
                    name="batch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setBatch(value);
                          }}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>{batch}</SelectTrigger>
                          </FormControl>
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
                </div>
              )}
            </div>
          </div>
          {/* <div className="grid grid-rows-3 gap-2"> */}
          {additionalFields && (
            <div className="grid grid-cols-2 gap-4">
              {additionalFields.map(
                ({ name, label, placeholder, type, options }) => (
                  <div>
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
                  </div>
                )
              )}
            </div>
          )}
          {/* </div> */}
        </div>

        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

TTForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  additionalFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      type: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

export default TTForm;
