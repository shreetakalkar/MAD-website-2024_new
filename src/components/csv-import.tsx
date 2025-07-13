"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, AlertCircle, Loader2, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Papa from "papaparse"
import EmailStatus from "@/components/email-status"

interface StudentData {
  name: string
  email: string
  branch: string
  year: string // e.g. "2029"
  division: string
  rollNumber: string
  gender: string
  firstName: string
  middleName: string
  lastName: string
  phoneNumber: string
  batch: string
  gradYear: string // e.g. "2029"
}

interface ImportResult {
  email: string
  name: string
  success: boolean
  error?: string // e.g., "Student already exists", "Email delivery failed"
}

// Returns FE/SE/TE/BE or empty string
function detectYearShort(filename: string): string {
  const upperFilename = filename.toUpperCase()
  if (upperFilename.includes("FE")) return "FE"
  if (upperFilename.includes("SE")) return "SE"
  if (upperFilename.includes("TE")) return "TE"
  if (upperFilename.includes("BE")) return "BE"
  return ""
}

function calculateGradYear(yearShort: string): string {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1-based (Jan=1)
  
  const baseYear = currentMonth >= 6 ? currentYear + 1 : currentYear
  switch (yearShort) {
    case "FE":
      return (baseYear + 3).toString()
    case "SE":
      return (baseYear + 2).toString()
    case "TE":
      return (baseYear + 1).toString()
    case "BE":
      return baseYear.toString()
    default:
      return ""
  }
}

function findColumnValue(row: any, keywords: string[]): string {
  const columns = Object.keys(row)
  for (const col of columns) {
    for (const keyword of keywords) {
      if (col.toLowerCase().includes(keyword.toLowerCase()) && row[col] && row[col].toString().trim()) {
        return row[col].toString().trim()
      }
    }
  }
  return ""
}

function detectBranch(filename: string): string {
  const upperFilename = filename.toUpperCase()
  if (upperFilename.includes("COMPS")) return "Comps"
  if (upperFilename.includes("AIDS") || upperFilename.includes("AI")) return "Aids"
  if (upperFilename.includes("EXTC")) return "Extc"
  if (upperFilename.includes("IT")) return "It"
  if (upperFilename.includes("CHEM")) return "Chem"
  return "Comps"
}

export default function CSVImport() {
  const [csvData, setCsvData] = useState<StudentData[]>([])
  const [fileName, setFileName] = useState<string>("")
  const [detectedBranch, setDetectedBranch] = useState<string>("")
  const [detectedYear, setDetectedYear] = useState<string>("")
  const [detectedGradYear, setDetectedGradYear] = useState<string>("")
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 })
  const { toast } = useToast()
  const [detailedResults, setDetailedResults] = useState<ImportResult[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file && file.type === "text/csv") {
        setFileName(file.name)
        const branch = detectBranch(file.name)
        const yearShort = detectYearShort(file.name)
        const gradYear = calculateGradYear(yearShort)
        setDetectedBranch(branch)
        setDetectedYear(gradYear)
        setDetectedGradYear(gradYear)

        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data
              .map((row: any, index: number) => {
                const firstName = findColumnValue(row, ["first name"])
                const middleName = findColumnValue(row, ["middle name", "father name"])
                const lastName = findColumnValue(row, ["last name", "surname"])
                const fullName = `${firstName} ${middleName} ${lastName}`.trim()
                const division = findColumnValue(row, ["division", "class", "section"])
                const batch = findColumnValue(row, ["batch"])
                const phoneNumber = findColumnValue(row, ["phone", "mobile", "contact"])
                const email = findColumnValue(row, ["email"])
                const rollNumber = findColumnValue(row, ["roll number"])
                const gender = findColumnValue(row, ["gender"])
                return {
                  firstName,
                  middleName,
                  lastName,
                  name: fullName,
                  email: email,
                  division: division,
                  rollNumber: rollNumber,
                  gender: gender,
                  branch: branch,
                  year: gradYear, 
                  batch: batch,
                  phoneNumber: phoneNumber,
                  gradYear: gradYear,
                }
              })
              .filter((item) => item.email)
            setCsvData(parsedData)
            toast({
              title: "CSV Parsed Successfully",
              description: `Found ${parsedData.length} valid student records. Auto-detected: ${branch} ${gradYear}`,
              variant: "success",
              duration: 5000,
            })
          },
          error: (error) => {
            toast({
              title: "Error Parsing CSV",
              description: error.message,
              variant: "destructive",
              duration: 5000,
            })
          },
        })
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file",
          variant: "destructive",
          duration: 5000,
        })
      }
    },
    [toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  })

  const handleImport = async () => {
    if (csvData.length === 0) return

    setIsImporting(true)
    setImportProgress(0)
    setImportResults({ success: 0, failed: 0 })
    setDetailedResults([])

    try {
      const response = await fetch("/api/import-students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students: csvData }),
      })

      if (!response.ok) {
        throw new Error("Import failed")
      }

      for (let i = 0; i <= csvData.length; i++) {
        setImportProgress((i / csvData.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      const result = await response.json()
      setImportResults({ success: result.success, failed: result.failed })
      setDetailedResults(result.results || [])

      toast({
        title: "Import Completed",
        description: `Successfully imported ${result.success} students. ${result.failed} failed. Emails sent automatically.`,
        variant: "success",
        duration: 5000,
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "An error occurred during import",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsImporting(false)
    }
  }

  const clearData = () => {
    setCsvData([])
    setFileName("")
    setDetectedBranch("")
    setDetectedYear("")
    setDetectedGradYear("")
    setImportProgress(0)
    setImportResults({ success: 0, failed: 0 })
    setDetailedResults([])
    toast({
      title: "Data Cleared",
      description: "All uploaded data has been cleared.",
      variant: "info",
      duration: 3000,
    })
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the CSV file here...</p>
        ) : (
          <div>
            <p className="text-slate-600 mb-2">Drag and drop a CSV file here, or click to select</p>
            <p className="text-sm text-slate-500">Supports CSV files with student data</p>
          </div>
        )}
      </div>

      {/* File Info with Auto-Detection */}
      {fileName && (
        <div className="space-y-2">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Loaded file: <strong>{fileName}</strong> with {csvData.length} records
            </AlertDescription>
          </Alert>

          {detectedBranch && detectedYear && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Auto-detected:</strong> Branch:{" "}
                <span className="font-semibold text-blue-600">{detectedBranch}</span>, Graduation Year:{" "}
                <span className="font-semibold text-green-600">{detectedYear}</span>
                <br />
                <span className="text-sm text-slate-500">
                  Based on filename pattern. All students will be assigned these values.
                </span>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Preview Table and Results */}
      {csvData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Preview Data - All {csvData.length} Records</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearData}>
                Clear
              </Button>
              <Button onClick={handleImport} disabled={isImporting} className="min-w-[120px]">
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import to Firebase"
                )}
              </Button>
            </div>
          </div>

          {isImporting && (
            <div className="space-y-2">
              <Progress value={importProgress} className="w-full" />
              <p className="text-sm text-slate-600 text-center">Importing students... {Math.round(importProgress)}%</p>
            </div>
          )}

          {/* Email Status */}
          {(importResults.success > 0 || importResults.failed > 0) && <EmailStatus results={detailedResults} />}

          {/* Failed Records Section */}
          {importResults.failed > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-600">
                Failed Records - {importResults.failed} Students
              </h3>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  The following records could not be added. Review the errors below and correct the data or contact support.
                </AlertDescription>
              </Alert>
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailedResults
                        .filter((result) => !result.success)
                        .map((result, index) => (
                          <TableRow key={index}>
                            <TableCell>{result.name}</TableCell>
                            <TableCell>{result.email}</TableCell>
                            <TableCell className="text-red-600">
                              {result.error || "Unknown error"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="p-4 text-center text-sm text-slate-500 bg-slate-50 border-t">
                  Showing {detailedResults.filter((r) => !r.success).length} failed records
                </div>
              </div>
            </div>
          )}

          {/* Data Table - Show ALL records */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Grad Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{student.rollNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phoneNumber || <span className="text-slate-400">-</span>}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell className="font-medium">
                        {student.division ? (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                            {student.division}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.batch ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                            {student.batch}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                          {student.branch}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                          {student.gradYear}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-4 text-center text-sm text-slate-500 bg-slate-50 border-t">
              Showing all {csvData.length} records
            </div>
          </div>
        </div>
      )}

      {/* CSV Format Guide */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
  <strong>CSV Format:</strong> Your CSV should include columns: &quot;Division&quot;, &quot;Roll Number&quot;, &quot;Gender&quot;, &quot;First Name&quot;, &quot;Middle Name&quot;, &quot;Last Name&quot;, &quot;Student Email Id&quot;, <strong>optional:</strong> &quot;Phone Number&quot;, &quot;Batch&quot;
  <br />
  <strong>Filename Examples:</strong> COMPS_FE.csv, AIDS_SE.csv, EXTC_TE.csv, IT_BE.csv, CHEM_BE.csv
</AlertDescription>

      </Alert>
    </div>
  )
}