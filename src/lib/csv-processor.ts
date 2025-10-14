export interface DashboardMetrics {
  newMembers: { value: number; change: number }
  leadToIntroConversion: { value: number; change: number }
  introsSold: { value: number; change: number }
  introToMemberConversion: { value: number; change: number }
  totalSales: { value: number; change: number }
  avgLeadsPerDay: { value: number; change: number }
  introToPackConversion: { value: number; change: number }
}

export interface ProcessedCSVData {
  metrics: DashboardMetrics
  summary: string
}

// Utility functions for date parsing and filtering
export function parseCSVDate(dateStr: string): Date | null {
  if (!dateStr) return null
  
  // Handle different date formats
  // Format 1: "2025-09-30T23:18:14.368Z" (ISO)
  // Format 2: "2025-09-30, 6:49 PM" (MM/DD/YYYY, H:MM AM/PM)
  // Format 3: "2024-09-01, 6:38 AM" (MM/DD/YYYY, H:MM AM/PM)
  
  try {
    // Try ISO format first
    if (dateStr.includes('T')) {
      return new Date(dateStr)
    }
    
    // Handle format like "2025-09-30, 6:49 PM"
    const cleanDateStr = dateStr.replace(/, /g, ' ')
    return new Date(cleanDateStr)
  } catch (error) {
    console.warn('Failed to parse date:', dateStr, error)
    return null
  }
}

export function isInMonth(date: Date | null, targetMonth: number, targetYear: number): boolean {
  if (!date) return false
  return date.getFullYear() === targetYear && date.getMonth() === targetMonth // Month is 0-indexed
}

export function isInThreeMonthPeriod(date: Date | null, startMonth: number, targetYear: number): boolean {
  if (!date) return false
  const year = date.getFullYear()
  const month = date.getMonth()
  return year === targetYear && (month >= startMonth && month <= startMonth + 2)
}

export function isInThreeMonthPeriodPrev(date: Date | null, startMonth: number, targetYear: number): boolean {
  if (!date) return false
  const year = date.getFullYear()
  const month = date.getMonth()
  return year === targetYear && (month >= startMonth - 1 && month <= startMonth + 1)
}

// Helper function to get month number from month name
export function getMonthNumber(monthName: string): number {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  return months.indexOf(monthName)
}

// Regex patterns for flexible text matching
export const INTRO_PATTERNS = [
  /new\s+flyer\s+3[\s-]?(class|pack)/i,
  /unlimited\s+14\s+day\s+intro/i,
  /new\s+flyer\s+6[\s-]?(class|pack)/i,
  /3[\s-]?class\s+intro/i,
  /6[\s-]?class\s+intro/i,
  /intro\s+pack/i
]

export const MEMBERSHIP_PATTERNS = [
  /4[\s-]?class\s+membership/i,
  /8[\s-]?class\s+membership/i,
  /12[\s-]?class\s+membership/i,
  /unlimited\s+membership/i,
  /monthly\s+membership/i
]

export const PACKAGE_PATTERNS = [
  /10[\s-]?class\s+package/i,
  /5[\s-]?class\s+package/i,
  /15[\s-]?class\s+package/i,
  /class\s+package/i
]

export function matchesPattern(text: string, patterns: RegExp[]): boolean {
  if (!text) return false
  return patterns.some(pattern => pattern.test(text))
}

// CSV parsing functions
export function parseCSV(csvContent: string): any[] {
  const lines = csvContent.split('\n')
  
  // Parse CSV line properly handling quotes
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }
  
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, ''))
  
  return lines.slice(1).map(line => {
    if (!line.trim()) return null
    
    const values = parseCSVLine(line).map(v => v.replace(/"/g, ''))
    const row: any = {}
    
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    
    return row
  }).filter(row => row !== null)
}

// Metric calculation functions
export function calculateNewMembers(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  return data.filter(row => {
    const date = parseCSVDate(row['Bought Date/Time (GMT)'])
    return isInMonth(date, month, year)
  }).length
}

export function calculateNewMembersPrev(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  return data.filter(row => {
    const date = parseCSVDate(row['Bought Date/Time (GMT)'])
    return isInMonth(date, prevMonth, prevYear)
  }).length
}

export function calculateIntrosSold(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  return data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInMonth(date, month, year)
  }).length
}

export function calculateIntrosSoldPrev(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  return data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInMonth(date, prevMonth, prevYear)
  }).length
}

export function calculateAvgLeadsPerDay(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  const monthLeads = data.filter(row => {
    const date = parseCSVDate(row['Join date'])
    return isInMonth(date, month, year)
  }).length
  
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return Math.round((monthLeads / daysInMonth) * 10) / 10
}

export function calculateAvgLeadsPerDayPrev(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const prevMonthLeads = data.filter(row => {
    const date = parseCSVDate(row['Join date'])
    return isInMonth(date, prevMonth, prevYear)
  }).length
  
  // Get days in previous month
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
  return Math.round((prevMonthLeads / daysInPrevMonth) * 10) / 10
}

export function calculateLeadToIntroConversion(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for 3-month period starting 2 months before target month
  const startMonth = month - 2 >= 0 ? month - 2 : month + 10
  const startYear = month - 2 >= 0 ? year : year - 1
  const threeMonthData = data.filter(row => {
    const date = parseCSVDate(row['Join date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
  })
  
  // Count total leads in 3-month period
  const totalLeads = threeMonthData.length
  
  // Count leads who made intro purchases
  const introLeads = threeMonthData.filter(row => {
    const firstPurchase = row['First purchase']
    return matchesPattern(firstPurchase, INTRO_PATTERNS)
  }).length
  
  return totalLeads > 0 ? Math.round((introLeads / totalLeads) * 1000) / 10 : 0
}

export function calculateLeadToIntroConversionPrev(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for previous 3-month period
  const startMonth = month - 3 >= 0 ? month - 3 : month + 9
  const startYear = month - 3 >= 0 ? year : year - 1
  const threeMonthData = data.filter(row => {
    const date = parseCSVDate(row['Join date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
  })
  
  // Count total leads in 3-month period
  const totalLeads = threeMonthData.length
  
  // Count leads who made intro purchases
  const introLeads = threeMonthData.filter(row => {
    const firstPurchase = row['First purchase']
    return matchesPattern(firstPurchase, INTRO_PATTERNS)
  }).length
  
  return totalLeads > 0 ? Math.round((introLeads / totalLeads) * 1000) / 10 : 0
}

export function calculateIntroToMemberConversion(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for 3-month period starting 2 months before target month
  const startMonth = month - 2 >= 0 ? month - 2 : month + 10
  const startYear = month - 2 >= 0 ? year : year - 1
  const threeMonthData = data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
  })
  
  // Count total intro conversions in 3-month period
  const totalConversions = threeMonthData.length
  
  // Count conversions to memberships
  const memberConversions = threeMonthData.filter(row => {
    const convertedTo = row['Converted to']
    return matchesPattern(convertedTo, MEMBERSHIP_PATTERNS)
  }).length
  
  return totalConversions > 0 ? Math.round((memberConversions / totalConversions) * 1000) / 10 : 0
}

export function calculateIntroToMemberConversionPrev(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for previous 3-month period
  const startMonth = month - 3 >= 0 ? month - 3 : month + 9
  const startYear = month - 3 >= 0 ? year : year - 1
  const threeMonthData = data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
  })
  
  // Count total intro conversions in 3-month period
  const totalConversions = threeMonthData.length
  
  // Count conversions to memberships
  const memberConversions = threeMonthData.filter(row => {
    const convertedTo = row['Converted to']
    return matchesPattern(convertedTo, MEMBERSHIP_PATTERNS)
  }).length
  
  return totalConversions > 0 ? Math.round((memberConversions / totalConversions) * 1000) / 10 : 0
}

export function calculateIntroToPackConversion(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for 3-month period starting 2 months before target month
  const startMonth = month - 2 >= 0 ? month - 2 : month + 10
  const startYear = month - 2 >= 0 ? year : year - 1
  const threeMonthData = data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
  })
  
  // Count total intro conversions in 3-month period
  const totalConversions = threeMonthData.length
  
  // Count conversions to packages
  const packConversions = threeMonthData.filter(row => {
    const convertedTo = row['Converted to']
    return matchesPattern(convertedTo, PACKAGE_PATTERNS)
  }).length
  
  return totalConversions > 0 ? Math.round((packConversions / totalConversions) * 1000) / 10 : 0
}

export function calculateIntroToPackConversionPrev(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for previous 3-month period
  const startMonth = month - 3 >= 0 ? month - 3 : month + 9
  const startYear = month - 3 >= 0 ? year : year - 1
  const threeMonthData = data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
  })
  
  // Count total intro conversions in 3-month period
  const totalConversions = threeMonthData.length
  
  // Count conversions to packages
  const packConversions = threeMonthData.filter(row => {
    const convertedTo = row['Converted to']
    return matchesPattern(convertedTo, PACKAGE_PATTERNS)
  }).length
  
  return totalConversions > 0 ? Math.round((packConversions / totalConversions) * 1000) / 10 : 0
}

export function calculateTotalSales(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  
  const monthSales = data.filter(row => {
    const date = parseCSVDate(row['Date'])
    return isInMonth(date, month, year) && row['Payment status'] === 'Succeeded'
  }).reduce((total, row) => {
    const saleValue = parseFloat(row['Sale value']) || 0
    const refunded = parseFloat(row['Refunded']) || 0
    return total + saleValue - refunded
  }, 0)
  
  return Math.round(monthSales)
}

export function calculateTotalSalesPrev(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  
  const prevMonthSales = data.filter(row => {
    const date = parseCSVDate(row['Date'])
    return isInMonth(date, prevMonth, prevYear) && row['Payment status'] === 'Succeeded'
  }).reduce((total, row) => {
    const saleValue = parseFloat(row['Sale value']) || 0
    const refunded = parseFloat(row['Refunded']) || 0
    return total + saleValue - refunded
  }, 0)
  
  return Math.round(prevMonthSales)
}

// Main processing function
export async function processDashboardData(): Promise<ProcessedCSVData> {
  try {
    // For now, we'll use mock data since we need to handle file uploads
    // In a real implementation, you'd read the CSV files from the filesystem or upload them
    
    const mockMetrics: DashboardMetrics = {
      newMembers: { value: 29, change: 26 },
      leadToIntroConversion: { value: 24.8, change: -3 },
      introsSold: { value: 66, change: 0 },
      introToMemberConversion: { value: 22.1, change: 39 },
      totalSales: { value: 38874, change: 14 },
      avgLeadsPerDay: { value: 8.6, change: 28 },
      introToPackConversion: { value: 14.9, change: -6 }
    }
    
    const summary = "The work put in to convert intros to memberships is paying off (up nearly 40%!). While there's an increase in leads (solid numbers here!), intro sales aren't following (but maybe they trail by a few week?). This seems like a really solid swing and good momentum for October."
    
    return {
      metrics: mockMetrics,
      summary
    }
  } catch (error) {
    console.error('Error processing dashboard data:', error)
    throw error
  }
}

// Helper function to calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

// Function to process actual CSV data (to be used when files are uploaded)
export function processCSVData(
  membershipSales: string,
  introSales: string,
  leadsCustomers: string,
  introConversions: string,
  payments: string,
  month: number,
  year: number
): ProcessedCSVData {
  // Calculate current month metrics
  const newMembers = calculateNewMembers(membershipSales, month, year)
  const introsSold = calculateIntrosSold(introSales, month, year)
  const avgLeadsPerDay = calculateAvgLeadsPerDay(leadsCustomers, month, year)
  const leadToIntroConversion = calculateLeadToIntroConversion(leadsCustomers, month, year)
  const introToMemberConversion = calculateIntroToMemberConversion(introConversions, month, year)
  const introToPackConversion = calculateIntroToPackConversion(introConversions, month, year)
  const totalSales = calculateTotalSales(payments, month, year)
  
  // Calculate previous month metrics
  const newMembersPrev = calculateNewMembersPrev(membershipSales, month, year)
  const introsSoldPrev = calculateIntrosSoldPrev(introSales, month, year)
  const avgLeadsPerDayPrev = calculateAvgLeadsPerDayPrev(leadsCustomers, month, year)
  const leadToIntroConversionPrev = calculateLeadToIntroConversionPrev(leadsCustomers, month, year)
  const introToMemberConversionPrev = calculateIntroToMemberConversionPrev(introConversions, month, year)
  const introToPackConversionPrev = calculateIntroToPackConversionPrev(introConversions, month, year)
  const totalSalesPrev = calculateTotalSalesPrev(payments, month, year)
  
  // Calculate percentage changes
  const metrics: DashboardMetrics = {
    newMembers: { 
      value: newMembers, 
      change: calculatePercentageChange(newMembers, newMembersPrev)
    },
    leadToIntroConversion: { 
      value: leadToIntroConversion, 
      change: calculatePercentageChange(leadToIntroConversion, leadToIntroConversionPrev)
    },
    introsSold: { 
      value: introsSold, 
      change: calculatePercentageChange(introsSold, introsSoldPrev)
    },
    introToMemberConversion: { 
      value: introToMemberConversion, 
      change: calculatePercentageChange(introToMemberConversion, introToMemberConversionPrev)
    },
    totalSales: { 
      value: totalSales, 
      change: calculatePercentageChange(totalSales, totalSalesPrev)
    },
    avgLeadsPerDay: { 
      value: avgLeadsPerDay, 
      change: calculatePercentageChange(avgLeadsPerDay, avgLeadsPerDayPrev)
    },
    introToPackConversion: { 
      value: introToPackConversion, 
      change: calculatePercentageChange(introToPackConversion, introToPackConversionPrev)
    }
  }
  
  const summary = "Data processed from CSV files for September 2025. Metrics calculated based on the specified criteria for each KPI, with month-over-month changes calculated from August 2025 data."
  
  return {
    metrics,
    summary
  }
}
