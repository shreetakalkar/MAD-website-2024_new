"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import CSVImport from "@/components/csv-import"
import ManualEntry from "@/components/manual-entry"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme() // Removed setTheme as toggle is handled elsewhere

  // Ensure the component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Student Data Import Utility</h1>
          <p className="text-slate-600 dark:text-slate-400">Import student data via CSV or add manually to Firebase</p>
        </div>

        <Tabs defaultValue="csv" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-200 dark:bg-slate-700">
            <TabsTrigger value="csv" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
              CSV Import
            </TabsTrigger>
            <TabsTrigger value="manual" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="csv">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">CSV Import</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Drag and drop your CSV file to preview and import student data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CSVImport />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">Manual Entry</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Add student data manually one by one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ManualEntry />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}