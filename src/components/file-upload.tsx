"use client"

import { useState, useCallback, type ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"
import type { ProcessedCSVData } from "@/lib/csv-processor"

interface FileUploadProps {
  onDataProcessed: (data: ProcessedCSVData, dateSelection?: { month: string; year: number }) => void
}

interface DateSelection {
  month: string
  year: number
}

const REQUIRED_FILES = [
  {
    key: 'membershipSales',
    name: 'Membership Sales (No Renewals)',
    filename: 'momence--membership-sales-export-norenewals.csv',
    description: 'For new members count'
  },
  {
    key: 'membershipSalesWithRenewals',
    name: 'Membership Sales (With Renewals)',
    filename: 'momence--membership-sales-export-withrenewals.csv',
    description: 'For total membership count including renewals'
  },
  {
    key: 'introSales',
    name: 'Intro Offers Sales',
    filename: 'momence-intro-offers-sales-report.csv',
    description: 'For intro sales count'
  },
  {
    key: 'leadsCustomers',
    name: 'New Leads and Customers',
    filename: 'momence-new-leads-and-customers.csv',
    description: 'For leads and conversion metrics'
  },
  {
    key: 'introConversions',
    name: 'Intro Offers Conversions',
    filename: 'momence-intro-offers-conversions-report.csv',
    description: 'For intro to member/package conversions'
  },
  {
    key: 'payments',
    name: 'Latest Payments',
    filename: 'momence-latest-payments-report.csv',
    description: 'For total sales calculation'
  }
] as const

type RequiredFileKey = typeof REQUIRED_FILES[number]['key']

interface FileStatus {
  name: RequiredFileKey
  status: 'pending' | 'uploaded' | 'error'
  content?: string
  error?: string
}

export function FileUpload({ onDataProcessed }: FileUploadProps) {
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [dateSelection, setDateSelection] = useState<DateSelection>({
    month: "September",
    year: 2025
  })

  const handleFileUpload = useCallback((event: ChangeEvent<HTMLInputElement>, fileKey: RequiredFileKey) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      
      setFileStatuses(prev => {
        const updated = [...prev]
        const existingIndex = updated.findIndex(f => f.name === fileKey)
        
        if (existingIndex >= 0) {
          updated[existingIndex] = {
            name: fileKey,
            status: 'uploaded',
            content
          }
        } else {
          updated.push({
            name: fileKey,
            status: 'uploaded',
            content
          })
        }
        
        return updated
      })
    }

    reader.onerror = () => {
      setFileStatuses(prev => {
        const updated = [...prev]
        const existingIndex = updated.findIndex(f => f.name === fileKey)
        
        if (existingIndex >= 0) {
          updated[existingIndex] = {
            name: fileKey,
            status: 'error',
            error: 'Failed to read file'
          }
        } else {
          updated.push({
            name: fileKey,
            status: 'error',
            error: 'Failed to read file'
          })
        }
        
        return updated
      })
    }

    reader.readAsText(file)
  }, [])

  const processFiles = async () => {
    setIsProcessing(true)

    try {
      const { processCSVData, getMonthNumber } = await import('@/lib/csv-processor')

      const fileContents = fileStatuses.reduce<Partial<Record<RequiredFileKey, string>>>((acc, file) => {
        if (file.status === 'uploaded' && file.content) {
          acc[file.name] = file.content
        }
        return acc
      }, {})

      const missingFiles = REQUIRED_FILES.filter(file => !fileContents[file.key])
      if (missingFiles.length > 0) {
        throw new Error(`Missing files: ${missingFiles.map(f => f.name).join(', ')}`)
      }

      const {
        membershipSales,
        introSales,
        leadsCustomers,
        introConversions,
        payments,
        membershipSalesWithRenewals
      } = fileContents

      if (
        !membershipSales ||
        !introSales ||
        !leadsCustomers ||
        !introConversions ||
        !payments ||
        !membershipSalesWithRenewals
      ) {
        throw new Error('Unable to read one or more required CSV files')
      }

      const monthNumber = getMonthNumber(dateSelection.month)

      const processedData = processCSVData(
        membershipSales,
        introSales,
        leadsCustomers,
        introConversions,
        payments,
        membershipSalesWithRenewals,
        monthNumber,
        dateSelection.year
      )

      onDataProcessed(processedData, dateSelection)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error processing files:', error)
      alert(`Error processing files: ${message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const allFilesUploaded = REQUIRED_FILES.every(file => 
    fileStatuses.some(f => f.name === file.key && f.status === 'uploaded')
  )

  const getFileStatus = (fileKey: RequiredFileKey) => {
    return fileStatuses.find(f => f.name === fileKey)?.status || 'pending'
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  return (
    <div className="space-y-8">
      {/* Date Selection */}
      <Card className="bg-gradient-to-br from-[rgba(15,23,42,0.9)] to-[rgba(15,23,42,0.96)] border-[rgba(148,163,255,0.12)] shadow-[0_0_0_1px_rgba(148,163,255,0.12),0_35px_80px_rgba(15,23,42,0.8)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-[#f5f7ff]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#7dd3ff] to-[#a78bfa] text-[#05060a]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            Select Report Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#cbd5f5]">Month</label>
              <select
                value={dateSelection.month}
                onChange={(e) => setDateSelection(prev => ({ ...prev, month: e.target.value }))}
                className="w-full rounded-lg border border-[rgba(148,163,255,0.3)] bg-[rgba(15,23,42,0.5)] px-3 py-2 text-sm text-[#f5f7ff] focus:border-[#7dd3ff] focus:outline-none focus:ring-1 focus:ring-[#7dd3ff]"
              >
                {months.map(month => (
                  <option key={month} value={month} className="bg-[rgba(15,23,42,0.9)]">{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#cbd5f5]">Year</label>
              <select
                value={dateSelection.year}
                onChange={(e) => setDateSelection(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className="w-full rounded-lg border border-[rgba(148,163,255,0.3)] bg-[rgba(15,23,42,0.5)] px-3 py-2 text-sm text-[#f5f7ff] focus:border-[#7dd3ff] focus:outline-none focus:ring-1 focus:ring-[#7dd3ff]"
              >
                {years.map(year => (
                  <option key={year} value={year} className="bg-[rgba(15,23,42,0.9)]">{year}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-3 text-sm text-[#9ca3ff]">
            Report will be generated for <span className="font-semibold text-[#f5f7ff]">{dateSelection.month} {dateSelection.year}</span>
          </p>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="bg-gradient-to-br from-[rgba(15,23,42,0.9)] to-[rgba(15,23,42,0.96)] border-[rgba(148,163,255,0.12)] shadow-[0_0_0_1px_rgba(148,163,255,0.12),0_35px_80px_rgba(15,23,42,0.8)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-[#f5f7ff]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#22c55e] to-[#34d399] text-[#05060a]">
              <Upload className="h-5 w-5" />
            </div>
            Upload CSV Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {REQUIRED_FILES.map((file) => {
            const status = getFileStatus(file.key)
            const isUploaded = status === 'uploaded'
            const hasError = status === 'error'
            
            return (
              <div key={file.key} className={`flex items-center gap-4 p-6 rounded-xl border-2 transition-all duration-200 ${
                isUploaded 
                  ? "border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)]" 
                  : hasError 
                    ? "border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)]" 
                    : "border-[rgba(148,163,255,0.2)] bg-[rgba(15,23,42,0.3)] hover:border-[rgba(125,211,255,0.4)] hover:bg-[rgba(125,211,255,0.1)]"
              }`}>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#f5f7ff]">{file.name}</h3>
                  <p className="text-sm text-[#cbd5f5] mt-1">{file.description}</p>
                  <p className="text-xs text-[#9ca3ff] mt-1">Expected: {file.filename}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {isUploaded && <CheckCircle className="h-6 w-6 text-[#22c55e]" />}
                  {hasError && <AlertCircle className="h-6 w-6 text-[#ef4444]" />}
                  
                  <div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e, file.key)}
                      className="hidden"
                      id={`file-input-${file.key}`}
                    />
                    <Button
                      variant={isUploaded ? "outline" : "default"}
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => document.getElementById(`file-input-${file.key}`)?.click()}
                      className={isUploaded 
                        ? "border-[#22c55e] text-[#22c55e] hover:bg-[rgba(34,197,94,0.1)]" 
                        : "bg-gradient-to-r from-[#7dd3ff] to-[#a78bfa] hover:from-[#6bc5ff] hover:to-[#9678f9] text-[#05060a] shadow-lg"
                      }
                    >
                      {isUploaded ? "Replace" : "Upload"}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
          
          <div className="pt-6 border-t border-[rgba(148,163,255,0.12)]">
            <Button
              onClick={processFiles}
              disabled={!allFilesUploaded || isProcessing}
              className="w-full bg-gradient-to-r from-[#a78bfa] to-[#ec4899] hover:from-[#9678f9] hover:to-[#db2777] text-[#f5f7ff] py-3 text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#f5f7ff] border-t-transparent"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Dashboard
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
