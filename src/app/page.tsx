"use client"

import { useState } from "react"
import { Dashboard } from "@/components/dashboard"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { ProcessedCSVData } from "@/lib/csv-processor"

export default function Home() {
  const [dashboardData, setDashboardData] = useState<ProcessedCSVData | null>(null)
  const [selectedDate, setSelectedDate] = useState({ month: "September", year: 2025 })

  const handleDataProcessed = (data: ProcessedCSVData, dateSelection?: { month: string; year: number }) => {
    setDashboardData(data)
    if (dateSelection) {
      setSelectedDate(dateSelection)
    }
  }

  const handleLoadCSVFiles = async () => {
    try {
      const response = await fetch('/api/process-csv')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        console.error('Failed to load CSV files')
      }
    } catch (error) {
      console.error('Error loading CSV files:', error)
    }
  }

  // Sample data - fallback when no CSV data is processed
  const sampleData = {
    month: "September",
    year: 2025,
    summary: "The work put in to convert intros to memberships is paying off (up nearly 40%!). While there's an increase in leads (solid numbers here!), intro sales aren't following (but maybe they trail by a few week?). This seems like a really solid swing and good momentum for October.",
    metrics: {
      newMembers: { value: 29, change: 26 },
      leadToIntroConversion: { value: 24.8, change: -3 },
      introsSold: { value: 66, change: 0 },
      introToMemberConversion: { value: 22.1, change: 39 },
      totalSales: { value: 38874, change: 14 },
      avgLeadsPerDay: { value: 8.6, change: 28 },
      introToPackConversion: { value: 14.9, change: -6 }
    }
  }

  const currentData = dashboardData || sampleData

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {!dashboardData && (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="mb-12 text-center">
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Fitness Studio Analytics
                </h1>
                <p className="mt-3 text-lg text-gray-600">
                  Transform your data into actionable insights
                </p>
              </div>
            </div>
            <FileUpload onDataProcessed={handleDataProcessed} />
            
            <div className="mt-8 text-center">
              <div className="mb-4 text-sm text-gray-600">
                Or load the CSV files directly from the september-2025 folder:
              </div>
              <Button 
                onClick={handleLoadCSVFiles}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                Load CSV Files from Folder
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {dashboardData && (
        <Dashboard 
          month={selectedDate.month}
          year={selectedDate.year}
          summary={dashboardData.summary}
          metrics={dashboardData.metrics}
        />
      )}
    </div>
  )
}