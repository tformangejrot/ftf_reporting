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
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
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
              <label className="mb-2 block text-sm font-medium text-gray-700">Month</label>
              <select
                value={dateSelection.month}
                onChange={(e) => setDateSelection(prev => ({ ...prev, month: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Year</label>
              <select
                value={dateSelection.year}
                onChange={(e) => setDateSelection(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Report will be generated for <span className="font-semibold">{dateSelection.month} {dateSelection.year}</span>
          </p>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
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
                  ? "border-green-200 bg-green-50/50" 
                  : hasError 
                    ? "border-red-200 bg-red-50/50" 
                    : "border-gray-200 bg-white/50 hover:border-blue-300 hover:bg-blue-50/50"
              }`}>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{file.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Expected: {file.filename}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {isUploaded && <CheckCircle className="h-6 w-6 text-green-600" />}
                  {hasError && <AlertCircle className="h-6 w-6 text-red-600" />}
                  
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
                        ? "border-green-600 text-green-600 hover:bg-green-50" 
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                      }
                    >
                      {isUploaded ? "Replace" : "Upload"}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
          
          <div className="pt-6 border-t border-gray-200">
            <Button
              onClick={processFiles}
              disabled={!allFilesUploaded || isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
