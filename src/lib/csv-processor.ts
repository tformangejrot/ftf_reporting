import {
  generateLeadsIntroSalesChartData,
  generateNewMembersChartData,
  generateCumulativeMembersChartData,
  generateTotalSalesChartData,
  type ChartDataPoint,
  type NewMembersChartDataPoint,
  type CumulativeMembersChartDataPoint,
  type TotalSalesChartDataPoint
} from './chart-data-processor'
import { getMetricTarget, getMetricColor, type MetricType } from './metric-utils'

export interface DashboardMetrics {
  newMembers: { value: number; change: number }
  leadToIntroConversion: { value: number; change: number }
  introsSold: { value: number; change: number }
  introToMemberConversion: { value: number; change: number }
  totalSales: { value: number; change: number }
  avgLeadsPerDay: { value: number; change: number }
  introToPackConversion: { value: number; change: number }
  packSales: { value: number; change: number }
  membershipCancellations: { value: number; change: number }
}

export interface ProcessedCSVData {
  metrics: DashboardMetrics
  summary: string
  chartData?: ChartDataPoint[]
  newMembersChartData?: NewMembersChartDataPoint[]
  cumulativeMembersChartData?: CumulativeMembersChartDataPoint[]
  totalSalesChartData?: TotalSalesChartDataPoint[]
}

export type CSVRow = Record<string, string>

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
  /monthly\s+membership/i,
  /membership.*\$269/i,
  /membership.*\$189/i,
  /membership.*student\s+discount/i
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
export function parseCSV(csvContent: string): CSVRow[] {
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
    const row: CSVRow = {}
    
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    
    return row
  }).filter((row): row is CSVRow => row !== null)
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

export function calculateTotalIntroSalesForPeriod(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for 3-month period starting 2 months before target month
  const startMonth = month - 2 >= 0 ? month - 2 : month + 10
  const startYear = month - 2 >= 0 ? year : year - 1
  
  return data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
  }).length
}

export function calculateTotalIntroSalesForPeriodPrev(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for previous 3-month period
  const startMonth = month - 3 >= 0 ? month - 3 : month + 9
  const startYear = month - 3 >= 0 ? year : year - 1
  
  return data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
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

export function calculateIntroToMemberConversion(csvContent: string, month: number, year: number, totalIntroSales: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for 3-month period starting 2 months before target month
  const startMonth = month - 2 >= 0 ? month - 2 : month + 10
  const startYear = month - 2 >= 0 ? year : year - 1
  const threeMonthData = data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
  })
  
  // Count conversions to memberships
  const memberConversions = threeMonthData.filter(row => {
    const convertedTo = row['Converted to']
    return matchesPattern(convertedTo, MEMBERSHIP_PATTERNS)
  }).length
  
  // Calculate rate based on total intro sales, not total conversions
  return totalIntroSales > 0 ? Math.round((memberConversions / totalIntroSales) * 1000) / 10 : 0
}

export function calculateIntroToMemberConversionPrev(csvContent: string, month: number, year: number, totalIntroSales: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for previous 3-month period
  const startMonth = month - 3 >= 0 ? month - 3 : month + 9
  const startYear = month - 3 >= 0 ? year : year - 1
  const threeMonthData = data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
  })
  
  // Count conversions to memberships
  const memberConversions = threeMonthData.filter(row => {
    const convertedTo = row['Converted to']
    return matchesPattern(convertedTo, MEMBERSHIP_PATTERNS)
  }).length
  
  // Calculate rate based on total intro sales, not total conversions
  return totalIntroSales > 0 ? Math.round((memberConversions / totalIntroSales) * 1000) / 10 : 0
}

export function calculateIntroToPackConversion(csvContent: string, month: number, year: number, totalIntroSales: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for 3-month period starting 2 months before target month
  const startMonth = month - 2 >= 0 ? month - 2 : month + 10
  const startYear = month - 2 >= 0 ? year : year - 1
  const threeMonthData = data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
  })
  
  // Count conversions to packages
  const packConversions = threeMonthData.filter(row => {
    const convertedTo = row['Converted to']
    return matchesPattern(convertedTo, PACKAGE_PATTERNS)
  }).length
  
  // Calculate rate based on total intro sales, not total conversions
  return totalIntroSales > 0 ? Math.round((packConversions / totalIntroSales) * 1000) / 10 : 0
}

export function calculateIntroToPackConversionPrev(csvContent: string, month: number, year: number, totalIntroSales: number): number {
  const data = parseCSV(csvContent)
  
  // Filter for previous 3-month period
  const startMonth = month - 3 >= 0 ? month - 3 : month + 9
  const startYear = month - 3 >= 0 ? year : year - 1
  const threeMonthData = data.filter(row => {
    const date = parseCSVDate(row['Purchase date'])
    return isInThreeMonthPeriod(date, startMonth, startYear)
  })
  
  // Count conversions to packages
  const packConversions = threeMonthData.filter(row => {
    const convertedTo = row['Converted to']
    return matchesPattern(convertedTo, PACKAGE_PATTERNS)
  }).length
  
  // Calculate rate based on total intro sales, not total conversions
  return totalIntroSales > 0 ? Math.round((packConversions / totalIntroSales) * 1000) / 10 : 0
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

// Helper function to categorize sale (reused from chart-data-processor logic)
function categorizeSale(category: string, item: string): string {
  if (category === "Class") {
    return "dropIn"
  }
  
  if (category === "Subscription") {
    if (item === "Unlimited 14 Day Intro Package") {
      return "intro"
    }
    if (item.includes("Monthly")) {
      return "membership"
    }
    if (item.includes("Lupit")) {
      return "other"
    }
    return "other"
  }
  
  if (category === "Appointment") {
    if (item.includes("Private Lesson")) {
      return "private"
    }
    if (item.includes("PARTY")) {
      return "party"
    }
    return "other"
  }
  
  if (category === "Pack") {
    if (item === "New Flyer 3 Class Pack") {
      return "intro"
    }
    return "pack"
  }
  
  if (category === "Product" || category === "Payment plan installment" || category === "Gift card" || 
      category === "Automatic penalty charge" || category === "On-demand") {
    return "other"
  }
  
  // Default to "other" for anything not covered
  return "other"
}

export function calculatePackSales(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  
  return data.filter(row => {
    const date = parseCSVDate(row['Date'])
    return isInMonth(date, month, year) && row['Payment status'] === 'Succeeded'
  }).filter(row => {
    const category = categorizeSale(row['Category'], row['Item'])
    return category === 'pack'
  }).length
}

export function calculatePackSalesPrev(csvContent: string, month: number, year: number): number {
  const data = parseCSV(csvContent)
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  
  return data.filter(row => {
    const date = parseCSVDate(row['Date'])
    return isInMonth(date, prevMonth, prevYear) && row['Payment status'] === 'Succeeded'
  }).filter(row => {
    const category = categorizeSale(row['Category'], row['Item'])
    return category === 'pack'
  }).length
}

// Get set of active membership customer emails for a given month
function getActiveMembershipEmails(csvContent: string, month: number, year: number): Set<string> {
  const data = parseCSV(csvContent)
  const emails = new Set<string>()
  
  data.forEach(row => {
    const date = parseCSVDate(row['Bought Date/Time (GMT)'])
    if (isInMonth(date, month, year)) {
      const email = row['Customer Email']?.trim().toLowerCase()
      if (email) {
        emails.add(email)
      }
    }
  })
  
  return emails
}

export function calculateMembershipCancellations(
  membershipSalesWithRenewals: string,
  month: number,
  year: number
): number {
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  
  // Get emails from previous month
  const prevMonthEmails = getActiveMembershipEmails(membershipSalesWithRenewals, prevMonth, prevYear)
  
  // Get emails from current month
  const currentMonthEmails = getActiveMembershipEmails(membershipSalesWithRenewals, month, year)
  
  // Count emails that were in previous month but not in current month
  let cancellations = 0
  prevMonthEmails.forEach(email => {
    if (!currentMonthEmails.has(email)) {
      cancellations++
    }
  })
  
  return cancellations
}

export function calculateMembershipCancellationsPrev(
  membershipSalesWithRenewals: string,
  month: number,
  year: number
): number {
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const prevPrevMonth = prevMonth === 0 ? 11 : prevMonth - 1
  const prevPrevYear = prevMonth === 0 ? prevYear - 1 : prevYear
  
  // Get emails from month before previous
  const prevPrevMonthEmails = getActiveMembershipEmails(membershipSalesWithRenewals, prevPrevMonth, prevPrevYear)
  
  // Get emails from previous month
  const prevMonthEmails = getActiveMembershipEmails(membershipSalesWithRenewals, prevMonth, prevYear)
  
  // Count emails that were in prev-prev month but not in previous month
  let cancellations = 0
  prevPrevMonthEmails.forEach(email => {
    if (!prevMonthEmails.has(email)) {
      cancellations++
    }
  })
  
  return cancellations
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
      introToPackConversion: { value: 14.9, change: -6 },
      packSales: { value: 33, change: 0 },
      membershipCancellations: { value: 12, change: -10 }
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

// Generate dynamic executive summary based on metrics analysis
function generateExecutiveSummary(metrics: DashboardMetrics, month: number, year: number): string {
  const insights: string[] = []
  
  // Helper to get metric status
  const getMetricStatus = (metricType: MetricType, value: number) => {
    const target = getMetricTarget(metricType, month, year)
    if (target === null) return null
    const color = getMetricColor(metricType, value, month, year)
    const percentage = (value / target) * 100
    return { target, color, percentage }
  }
  
  // Analyze sharp changes (>20% increase or decrease)
  const sharpIncreases: string[] = []
  const sharpDecreases: string[] = []
  
  if (Math.abs(metrics.introToMemberConversion.change) >= 20) {
    if (metrics.introToMemberConversion.change > 0) {
      sharpIncreases.push(`Intro-to-Member conversion surged ${metrics.introToMemberConversion.change}%`)
    } else {
      sharpDecreases.push(`Intro-to-Member conversion dropped ${Math.abs(metrics.introToMemberConversion.change)}%`)
    }
  }
  
  if (Math.abs(metrics.avgLeadsPerDay.change) >= 20) {
    if (metrics.avgLeadsPerDay.change > 0) {
      sharpIncreases.push(`Average leads per day increased ${metrics.avgLeadsPerDay.change}%`)
    } else {
      sharpDecreases.push(`Average leads per day decreased ${Math.abs(metrics.avgLeadsPerDay.change)}%`)
    }
  }
  
  if (Math.abs(metrics.totalSales.change) >= 15) {
    if (metrics.totalSales.change > 0) {
      sharpIncreases.push(`Total sales grew ${metrics.totalSales.change}%`)
    } else {
      sharpDecreases.push(`Total sales declined ${Math.abs(metrics.totalSales.change)}%`)
    }
  }
  
  if (Math.abs(metrics.newMembers.change) >= 20) {
    if (metrics.newMembers.change > 0) {
      sharpIncreases.push(`New members increased ${metrics.newMembers.change}%`)
    } else {
      sharpDecreases.push(`New members decreased ${Math.abs(metrics.newMembers.change)}%`)
    }
  }
  
  // Analyze target performance
  const targetAnalysis: string[] = []
  
  const introsStatus = getMetricStatus('introsSold', metrics.introsSold.value)
  if (introsStatus) {
    if (introsStatus.color === 'red' && introsStatus.percentage < 70) {
      targetAnalysis.push(`Intro sales are significantly below target at ${Math.round(introsStatus.percentage)}%`)
    } else if (introsStatus.color === 'green' && introsStatus.percentage >= 100) {
      targetAnalysis.push(`Intro sales exceeded target by ${Math.round(introsStatus.percentage - 100)}%`)
    }
  }
  
  const totalSalesStatus = getMetricStatus('totalSales', metrics.totalSales.value)
  if (totalSalesStatus) {
    if (totalSalesStatus.color === 'red' && totalSalesStatus.percentage < 70) {
      targetAnalysis.push(`Total sales are well below target at ${Math.round(totalSalesStatus.percentage)}%`)
    } else if (totalSalesStatus.color === 'green' && totalSalesStatus.percentage >= 100) {
      targetAnalysis.push(`Total sales exceeded target`)
    }
  }
  
  const newMembersStatus = getMetricStatus('newMembers', metrics.newMembers.value)
  if (newMembersStatus) {
    if (newMembersStatus.color === 'green' && newMembersStatus.percentage >= 100) {
      targetAnalysis.push(`New members exceeded target`)
    } else if (newMembersStatus.color === 'red' && newMembersStatus.percentage < 70) {
      targetAnalysis.push(`New members are below target at ${Math.round(newMembersStatus.percentage)}%`)
    }
  }
  
  const avgLeadsStatus = getMetricStatus('avgLeadsPerDay', metrics.avgLeadsPerDay.value)
  if (avgLeadsStatus) {
    if (avgLeadsStatus.color === 'green' && avgLeadsStatus.percentage >= 100) {
      targetAnalysis.push(`Average leads per day met or exceeded target`)
    } else if (avgLeadsStatus.color === 'red') {
      targetAnalysis.push(`Average leads per day is below target at ${Math.round(avgLeadsStatus.percentage)}%`)
    }
  }
  
  // Cancellations analysis (lower is better)
  if (metrics.membershipCancellations.value <= 12) {
    targetAnalysis.push(`Membership cancellations are at a healthy level (${metrics.membershipCancellations.value})`)
  } else if (metrics.membershipCancellations.value >= 16) {
    targetAnalysis.push(`Membership cancellations are elevated at ${metrics.membershipCancellations.value}`)
  }
  
  // Build summary
  if (sharpIncreases.length > 0) {
    insights.push(sharpIncreases.join(', ') + '.')
  }
  
  if (sharpDecreases.length > 0) {
    insights.push(sharpDecreases.join(', ') + '.')
  }
  
  if (targetAnalysis.length > 0) {
    insights.push(targetAnalysis.join('. ') + '.')
  }
  
  // Add conversion rate insights
  if (metrics.introToMemberConversion.value >= 30) {
    insights.push(`Strong intro-to-member conversion rate at ${metrics.introToMemberConversion.value.toFixed(1)}%`)
  } else if (metrics.introToMemberConversion.value < 20) {
    insights.push(`Intro-to-member conversion needs attention at ${metrics.introToMemberConversion.value.toFixed(1)}%`)
  }
  
  if (metrics.leadToIntroConversion.value >= 35) {
    insights.push(`Lead-to-intro conversion is performing well at ${metrics.leadToIntroConversion.value.toFixed(1)}%`)
  } else if (metrics.leadToIntroConversion.value < 25) {
    insights.push(`Lead-to-intro conversion could be improved (currently ${metrics.leadToIntroConversion.value.toFixed(1)}%)`)
  }
  
  // If no specific insights, provide general overview
  if (insights.length === 0) {
    return `Performance this month shows steady metrics across key indicators. All metrics are within expected ranges with moderate month-over-month changes.`
  }
  
  return insights.join(' ') + (insights.length > 0 ? ' Overall, the month shows ' : '') + 
    (metrics.totalSales.change > 0 ? 'positive momentum' : metrics.totalSales.change < 0 ? 'areas needing attention' : 'stable performance') + '.'
}

// Function to process actual CSV data (to be used when files are uploaded)
export function processCSVData(
  membershipSales: string,
  introSales: string,
  leadsCustomers: string,
  introConversions: string,
  payments: string,
  membershipSalesWithRenewals: string,
  month: number,
  year: number
): ProcessedCSVData {
  // Calculate current month metrics
  const newMembers = calculateNewMembers(membershipSales, month, year)
  const introsSold = calculateIntrosSold(introSales, month, year)
  const avgLeadsPerDay = calculateAvgLeadsPerDay(leadsCustomers, month, year)
  const leadToIntroConversion = calculateLeadToIntroConversion(leadsCustomers, month, year)
  
  // Get total intro sales for the 3-month period for conversion rate calculations
  const totalIntroSalesForPeriod = calculateTotalIntroSalesForPeriod(introSales, month, year)
  const introToMemberConversion = calculateIntroToMemberConversion(introConversions, month, year, totalIntroSalesForPeriod)
  const introToPackConversion = calculateIntroToPackConversion(introConversions, month, year, totalIntroSalesForPeriod)
  const totalSales = calculateTotalSales(payments, month, year)
  const packSales = calculatePackSales(payments, month, year)
  const membershipCancellations = calculateMembershipCancellations(membershipSalesWithRenewals, month, year)
  
  // Calculate previous month metrics
  const newMembersPrev = calculateNewMembersPrev(membershipSales, month, year)
  const introsSoldPrev = calculateIntrosSoldPrev(introSales, month, year)
  const avgLeadsPerDayPrev = calculateAvgLeadsPerDayPrev(leadsCustomers, month, year)
  const leadToIntroConversionPrev = calculateLeadToIntroConversionPrev(leadsCustomers, month, year)
  
  // Get total intro sales for the previous 3-month period
  const totalIntroSalesForPeriodPrev = calculateTotalIntroSalesForPeriodPrev(introSales, month, year)
  const introToMemberConversionPrev = calculateIntroToMemberConversionPrev(introConversions, month, year, totalIntroSalesForPeriodPrev)
  const introToPackConversionPrev = calculateIntroToPackConversionPrev(introConversions, month, year, totalIntroSalesForPeriodPrev)
  const totalSalesPrev = calculateTotalSalesPrev(payments, month, year)
  const packSalesPrev = calculatePackSalesPrev(payments, month, year)
  const membershipCancellationsPrev = calculateMembershipCancellationsPrev(membershipSalesWithRenewals, month, year)
  
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
    },
    packSales: {
      value: packSales,
      change: calculatePercentageChange(packSales, packSalesPrev)
    },
    membershipCancellations: {
      value: membershipCancellations,
      change: calculatePercentageChange(membershipCancellations, membershipCancellationsPrev)
    }
  }
  
  const summary = generateExecutiveSummary(metrics, month, year)

  // Generate chart data for the leads vs intro sales chart
  const chartData = generateLeadsIntroSalesChartData(introSales, leadsCustomers, month, year)
  
  // Generate chart data for the new members chart
  const newMembersChartData = generateNewMembersChartData(membershipSales, month, year)
  
  // Generate chart data for the cumulative members chart
  const cumulativeMembersChartData = generateCumulativeMembersChartData(
    membershipSalesWithRenewals, 
    membershipSales, 
    month, 
    year
  )
  
  // Generate chart data for the total sales chart
  const totalSalesChartData = generateTotalSalesChartData(payments, month, year)

  return {
    metrics,
    summary,
    chartData,
    newMembersChartData,
    cumulativeMembersChartData,
    totalSalesChartData
  }
}
