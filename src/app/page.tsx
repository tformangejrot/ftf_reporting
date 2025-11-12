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

  return (
    <div className="min-h-screen bg-background">
      {!dashboardData && (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="mb-8 text-center">
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Fitness Studio Analytics
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Transform your data into actionable insights
                </p>
              </div>
            </div>
            <FileUpload onDataProcessed={handleDataProcessed} />

            <div className="mt-6 text-center">
              <div className="mb-3 text-sm text-muted-foreground">
                Or load the CSV files directly from the september-2025 folder:
              </div>
              <Button
                onClick={handleLoadCSVFiles}
                variant="outline"
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
          chartData={dashboardData.chartData}
          newMembersChartData={dashboardData.newMembersChartData}
          cumulativeMembersChartData={dashboardData.cumulativeMembersChartData}
          totalSalesChartData={dashboardData.totalSalesChartData}
        />
      )}
    </div>
  )
}