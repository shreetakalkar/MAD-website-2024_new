"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/providers/UserProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ModeToggle } from "@/components/modeToggle";
import { db } from "@/config/firebase";
import { collection, doc, getDoc } from "firebase/firestore";

interface Student {
  name: string;
  year: string;
  branch: string;
}

const TableDemo = () => {
  const { user } = useUser();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "Launch", "launch");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStudents(data.students || []);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 w-[100vw]">
      <nav className="sticky top-0 shadow-sm z-50 bg-white dark:bg-slate-950">
        <div className="mx-auto">
          <div className="flex justify-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <ModeToggle />
              {user?.name ? (
                <Button variant={"link"}>
                  <Link href="/dashboard">Dashboard</Link>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button variant={"link"}>
                  <Link href="/">Sign In</Link>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex justify-center p-10">
        <div className="w-[85vw] max-h-[85vh] overflow-y-auto rounded-[1.2rem] border-[0.1rem] dark:border-muted-foreground border-muted-950">
          <Table>
            <TableCaption className="p-4">
              Students Who Decoded the Launch Screen
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Branch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TableDemo;
