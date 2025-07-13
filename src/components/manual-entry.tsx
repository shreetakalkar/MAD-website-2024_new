"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, UserPlus } from "lucide-react"

interface StudentForm {
  firstName: string
  middleName: string
  lastName: string
  email: string
  branch: string
  gradyear: string
  division: string
  batch: string
  rollNumber: string
  phoneNo: string
  gender: string
}

const initialForm: StudentForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  branch: "",
  gradyear: "",
  division: "",
  batch: "",
  rollNumber: "",
  phoneNo: "",
  gender: "",
}

const branches = [
  { value: "Comps", label: "Computer Engineering (Comps)" },
  { value: "Aids", label: "AI & Data Science (AIDS)" },
  { value: "Extc", label: "Electronics & Telecom (EXTC)" },
  { value: "It", label: "Information Technology (IT)" },
  { value: "Chem", label: "Chemical Engineering (Chem)" },
]

const generateYears = () => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const startYear = currentMonth >= 7 ? currentYear + 1 : currentYear
  return Array.from({ length: 4 }, (_, i) => {
    const year = startYear + i
    return {
      value: year.toString(),
      label: `${year} (${getYearLabel(year)})`,
    }
  })
}

const getYearLabel = (year: number): string => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  if (currentMonth >= 7) {
    if (year === currentYear + 4) return "FE - First Year"
    if (year === currentYear + 3) return "SE - Second Year"
    if (year === currentYear + 2) return "TE - Third Year"
    if (year === currentYear + 1) return "BE - Final Year"
  } else {
    if (year === currentYear + 4) return "FE - First Year"
    if (year === currentYear + 3) return "SE - Second Year"
    if (year === currentYear + 2) return "TE - Third Year"
    if (year === currentYear + 1) return "BE - Final Year"
  }
  return "Invalid Year"
}

function calcGradYear(gradyear: string | undefined): string {
  if (!gradyear || !Number.parseInt(gradyear)) return "Invalid Graduation Year"
  const graduationYear = Number.parseInt(gradyear)
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  if (currentMonth >= 7) {
    if (graduationYear === currentYear + 4) return "FE"
    if (graduationYear === currentYear + 3) return "SE"
    if (graduationYear === currentYear + 2) return "TE"
    if (graduationYear === currentYear + 1) return "BE"
  } else {
    if (graduationYear === currentYear + 4) return "FE"
    if (graduationYear === currentYear + 3) return "SE"
    if (graduationYear === currentYear + 2) return "TE"
    if (graduationYear === currentYear + 1) return "BE"
  }
  return "Invalid Graduation Year"
}

function calcDivisionList(gradyear: string, branch: string): string[] {
  const currentAcdYear = calcGradYear(gradyear)
  if (currentAcdYear === "FE") return ["A", "B", "C", "D", "E", "F", "G", "H", "I"]
  if (["SE", "TE", "BE"].includes(currentAcdYear)) {
    if (branch === "Comps") return ["C1", "C2", "C3"]
    if (branch === "It" || branch === "Aids")
      return currentAcdYear === "SE" ? ["S1", "S2"] : currentAcdYear === "TE" ? ["T1", "T2"] : ["B1", "B2"]
    if (branch === "Extc") return ["A"]
    if (branch === "Chem") return ["K"]
  }
  return []
}

export default function ManualEntry() {
  const [form, setForm] = useState<StudentForm>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([])
  const { toast } = useToast()

 useEffect(() => {
  if (form.gradyear && form.branch) {
    const divisions = calcDivisionList(form.gradyear, form.branch)
    setAvailableDivisions(divisions)
    if (form.division && !divisions.includes(form.division)) {
      setForm((prev) => ({ ...prev, division: "", batch: "" }))
    }
  } else {
    setAvailableDivisions([])
  }
}, [form.gradyear, form.branch, form.division]) 


  const handleInputChange = (field: keyof StudentForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.firstName || !form.lastName || !form.email) {
      toast({
        title: "Missing Fields",
        description: "Please fill in first name, last name, and email.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    if (!form.gradyear || calcGradYear(form.gradyear) === "Invalid Graduation Year") {
      toast({
        title: "Invalid Graduation Year",
        description: "Please select a valid graduation year.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const studentData = {
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        name: `${form.firstName} ${form.middleName} ${form.lastName}`.trim(),
        email: form.email,
        branch: form.branch,
        year: form.gradyear,
        division: form.division,
        batch: form.batch,
        rollNumber: form.rollNumber,
        phoneNo: form.phoneNo,
        gender: form.gender,
      }

      const response = await fetch("/api/import-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: [studentData] }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Failed to add student")
      }

      if (result.success > 0) {
        toast({
          title: "Student Added",
          description: `${studentData.name} has been added and login credentials sent via email.`,
          variant: "success",
          duration: 5000,
        })
        setForm(initialForm)
        setAvailableDivisions([])
      } else {
        throw new Error(result.results?.[0]?.error || "Failed to add student.")
      }
    } catch (error) {
      toast({
        title: "Add Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm(initialForm)
    setAvailableDivisions([])
    toast({
      title: "Form Reset",
      description: "The form has been reset to its initial state.",
      variant: "info",
      duration: 3000,
    })
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Student
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={form.middleName}
                onChange={(e) => handleInputChange("middleName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="branch">Branch</Label>
              <Select
                value={form.branch}
                onValueChange={(value) => handleInputChange("branch", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gradyear">Graduation Year</Label>
              <Select
                value={form.gradyear}
                onValueChange={(value) => handleInputChange("gradyear", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {generateYears().map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="division">Division</Label>
              <Select
                value={form.division}
                onValueChange={(value) => handleInputChange("division", value)}
                disabled={!form.branch || !form.gradyear}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Division" />
                </SelectTrigger>
                <SelectContent>
                  {availableDivisions.map((division) => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="batch">Batch</Label>
              <Input
                id="batch"
                value={form.batch}
                onChange={(e) => handleInputChange("batch", e.target.value)}
                disabled={!form.division}
              />
            </div>
            <div>
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                value={form.rollNumber}
                onChange={(e) => handleInputChange("rollNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phoneNo">Phone Number</Label>
              <Input
                id="phoneNo"
                type="tel"
                value={form.phoneNo}
                onChange={(e) => handleInputChange("phoneNo", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}