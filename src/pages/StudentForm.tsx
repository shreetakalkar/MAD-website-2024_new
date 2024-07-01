"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "react-icons/calendar";
import { useState, useEffect } from "react";

// Define the schema for form validation using zod
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  // Add other form fields as needed
  gradYear: z.string().optional(),
  dob: z.date().optional(),
  // Add other fields here
});

export default function StudentForm() {
  const [students, setStudents] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  // Fetch student data from the backend API
  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch("/api/students");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students", error);
      }
    }

    fetchStudents();
  }, []);

  // Autofill form fields based on selected email
  useEffect(() => {
    if (selectedEmail) {
      const student = students.find(
        (student) => student.email === selectedEmail
      );
      if (student) {
        setValue("firstName", student.firstName);
        setValue("middleName", student.middleName);
        setValue("lastName", student.lastName);
        setValue("gradYear", student.gradYear);
        setValue("dob", student.dob ? new Date(student.dob) : null);
        // Set other form fields as needed
      }
    }
  }, [selectedEmail, students, setValue]);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Handle form submission
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">Email</label>
            <select
              id="email"
              {...register("email")}
              onChange={(e) => setSelectedEmail(e.target.value)}
            >
              <option value="">Select Email</option>
              {students.map((student) => (
                <option key={student._id} value={student.email}>
                  {student.email}
                </option>
              ))}
            </select>
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" {...register("firstName")} />
            {errors.firstName && <span>{errors.firstName.message}</span>}
          </div>
          <div>
            <label htmlFor="middleName">Middle Name</label>
            <input id="middleName" {...register("middleName")} />
            {errors.middleName && <span>{errors.middleName.message}</span>}
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" {...register("lastName")} />
            {errors.lastName && <span>{errors.lastName.message}</span>}
          </div>
          <div>
            <label htmlFor="gradYear">Graduation Year</label>
            <input id="gradYear" {...register("gradYear")} />
            {errors.gradYear && <span>{errors.gradYear.message}</span>}
          </div>
          <div>
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              {...register("dob", {
                valueAsDate: true,
              })}
            />
            {errors.dob && <span>{errors.dob.message}</span>}
          </div>
          {/* Add other form fields here */}
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}
