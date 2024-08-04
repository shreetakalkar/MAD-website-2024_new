"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface ProfessorDetailsProps {
  professor: {
    experience: string;
    designation: string;
    email: string;
    phd_guide: string;
    name: string;
    area_of_specialization: string;
    image: string;
    qualification: string;
  };
}

const ProfessorDetails: React.FC<ProfessorDetailsProps> = ({ professor }) => {
  return (
      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={professor?.image} alt="Professor Avatar" />
            <AvatarFallback>{professor?.name.split(" ")[0][0]}{professor?.name.split(" ")[1][0]}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1 text-center">
            <h1 className="text-2xl font-bold">{professor?.name}</h1>
            <p className="text-muted-foreground">{professor?.designation}</p>
            <p className="text-muted-foreground">{professor?.email}</p>
          </div>
        </div>
        <div className="grid gap-4">
        <div className="grid gap-1">
            <h2 className="text-lg font-semibold">Years of Experience</h2>
            <p className="text-muted-foreground">{professor?.experience}</p>
          </div>

          <div className="grid gap-1">
            <h2 className="text-lg font-semibold">Qualifications</h2>
            <p className="text-muted-foreground">{professor?.qualification}</p>
          </div>
          <div className="grid gap-1">
            <h2 className="text-lg font-semibold">Phd Guide</h2>
            <p className="text-muted-foreground">{professor?.phd_guide}</p>
          </div>
          <div className="grid gap-1">
            <h2 className="text-lg font-semibold">Area of Specialization</h2>
            <p className="text-muted-foreground">
{professor?.area_of_specialization}            </p>
          </div>
        </div>
      </div>
  );
};

export default ProfessorDetails;
