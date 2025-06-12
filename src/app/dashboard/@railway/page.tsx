"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Pie, PieChart, Label, Cell, Tooltip } from "recharts";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const fetchData = async () => {
  const docRef = doc(collection(db, "ConcessionHistory"), "DailyStats");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().stats || [];
  } else {
    return [];
  }
};

export default function Page() {
  const [stats, setStats] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  // useEffect(() => {
  //   const loadData = async () => {
  //     const data = await fetchData();
  //     setStats(data);
  //     const dates = data.map((stat: any) =>
  //       parse(stat.date, "dd/MM/yyyy", new Date())
  //     );
  //     setAvailableDates(dates);
  //     if (dates.length > 0) {
  //       setSelectedDate(dates[dates.length - 1]);
  //     }
  //   };
  //   loadData();
  // }, []);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      
      // Sort data by date in descending order
      const sortedData = data.sort((a: any, b: any) => 
        parse(b.date, "dd/MM/yyyy", new Date()).getTime() - parse(a.date, "dd/MM/yyyy", new Date()).getTime()
      );
      
      setStats(sortedData);
  
      // Map dates from sorted data
      const dates = sortedData.map((stat: any) =>
        parse(stat.date, "dd/MM/yyyy", new Date())
      );
      setAvailableDates(dates);
  
      // Set the most recent date as selectedDate
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    };
  
    loadData();
  }, []);
  
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "dd/MM/yyyy");
      const filteredData =
        stats.find((stat) => stat.date === formattedDate) || {};
      const chartData = [
        {
          name: "Approved",
          value: filteredData.approvedPass || 0,
          fill: "#4CAF50",
        }, // Green
        {
          name: "Cancelled",
          value: filteredData.cancelledPass || 0,
          fill: "#F44336",
        }, // Red
        {
          name: "Collected",
          value: filteredData.collectedPass || 0,
          fill: "#2196F3",
        }, // Blue
        {
          name: "Created",
          value: filteredData.createdPass || 0,
          fill: "#FFC107",
        }, // Amber
        {
          name: "Rejected",
          value: filteredData.rejectedPass || 0,
          fill: "#FF5722",
        }, // Deep Orange
        {
          name: "Updated",
          value: filteredData.updatedPass || 0,
          fill: "#9C27B0",
        }, // Purple
        {
          name: "Discarded",
          value: filteredData.discardedPass || 0,
          fill: "#C7171E",
        }, // Darker Red
      ];
      setChartData(chartData);
    }
  }, [selectedDate, stats]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  const isDateAvailable = (date: any) => {
    return availableDates.some((availableDate) =>
      isSameDay(date, availableDate)
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/2 p-4 shadow-lg rounded-lg">
          <div className="mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date: Date | undefined) =>
                    setSelectedDate(date || null)
                  }
                  disabled={(date) => !isDateAvailable(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button className="block text-sm font-medium text-gray-700">
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  selected={selectedDate || new Date()} // Set the selected date
                  onSelect={setSelectedDate} // Update selected date on change
                  filterDate={isDateAvailable}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary-500 bg-gray-50"
                  dateFormat="dd/MM/yyyy"
                />
              </PopoverContent>
            </Popover> */}
          </div>
          <Card className="flex flex-col shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-500 bg-opacity-50 p-4">
              <CardTitle>Concession Request Served Data</CardTitle>
              <CardDescription>
                {selectedDate
                  ? format(selectedDate, "dd/MM/yyyy")
                  : "No date selected"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ChartContainer
                config={{}}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <Tooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          const total = chartData.reduce(
                            (acc, entry) => acc + entry.value,
                            0
                          );
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-foreground text-3xl font-bold"
                            >
                              {total.toLocaleString()}
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="bg-gray-500 bg-opacity-50 p-4 text-sm">
              <div className="">
                Showing data for{" "}
                {selectedDate
                  ? format(selectedDate, "dd/MM/yyyy")
                  : "No date selected"}
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:w-1/2 p-4  shadow-lg rounded-lg">
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Approved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Rejected
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Collected
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Cancelled
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Discarded
                    </th>
                  </tr>
                </thead>
                <tbody className=" divide-y divide-gray-200">
                  {stats.map((stat) => (
                    <tr key={stat.date} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                        {stat.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {(stat.approvedPass || 0) +
                          (stat.cancelledPass || 0) +
                          (stat.collectedPass || 0) +
                          (stat.createdPass || 0) +
                          (stat.rejectedPass || 0) +
                          (stat.updatedPass || 0) +
                          (stat.discardedPass || 0) || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {stat.createdPass || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {stat.approvedPass || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {stat.rejectedPass || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {stat.collectedPass || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {stat.updatedPass || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {stat.cancelledPass || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {stat.discardedPass || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
