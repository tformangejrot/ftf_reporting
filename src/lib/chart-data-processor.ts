import { parseCSV, parseCSVDate, isInMonth } from './csv-processor'

export interface ChartDataPoint {
  month: string
  introSales: number
  newLeads: number
  targetIntroSales: number
  targetNewLeads: number
}

export interface NewMembersChartDataPoint {
  month: string
  newMembers: number
  target: number
}

export interface CumulativeMembersChartDataPoint {
  month: string
  retainedMembers: number
  newMembers: number
  totalMembers: number
}

export interface TotalSalesChartDataPoint {
  month: string
  membership: number
  intro: number
  dropIn: number
  pack: number
  private: number
  party: number
  other: number
  totalSales: number
}

export function generateLeadsIntroSalesChartData(
  introSalesCSV: string,
  leadsCustomersCSV: string,
  targetMonth: number,
  targetYear: number
): ChartDataPoint[] {
  const introSalesData = parseCSV(introSalesCSV)
  const leadsData = parseCSV(leadsCustomersCSV)
  
  const chartData: ChartDataPoint[] = []
  
  // Generate 13 months of data starting from the same month the prior year
  for (let i = -12; i <= 0; i++) {
    const currentDate = new Date(targetYear, targetMonth, 1)
    currentDate.setMonth(currentDate.getMonth() + i)
    
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Count intro sales for this month
    const introSales = introSalesData.filter(row => {
      const date = parseCSVDate(row['Purchase date'])
      return isInMonth(date, month, year)
    }).length
    
    // Count new leads for this month
    const newLeads = leadsData.filter(row => {
      const date = parseCSVDate(row['Join date'])
      return isInMonth(date, month, year)
    }).length
    
    // Format month label
    const monthLabel = formatMonthLabel(currentDate, targetYear)
    
    chartData.push({
      month: monthLabel,
      introSales,
      newLeads,
      targetIntroSales: 90,
      targetNewLeads: 270
    })
  }
  
  return chartData
}

export function generateNewMembersChartData(
  membershipSalesCSV: string,
  targetMonth: number,
  targetYear: number
): NewMembersChartDataPoint[] {
  const membershipData = parseCSV(membershipSalesCSV)
  
  const chartData: NewMembersChartDataPoint[] = []
  
  // Generate 13 months of data starting from the same month the prior year
  for (let i = -12; i <= 0; i++) {
    const currentDate = new Date(targetYear, targetMonth, 1)
    currentDate.setMonth(currentDate.getMonth() + i)
    
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Count new members for this month
    const newMembers = membershipData.filter(row => {
      const date = parseCSVDate(row['Bought Date/Time (GMT)'])
      return isInMonth(date, month, year)
    }).length
    
    // Format month label
    const monthLabel = formatMonthLabel(currentDate, targetYear)
    
    chartData.push({
      month: monthLabel,
      newMembers,
      target: 30
    })
  }
  
  return chartData
}

export function generateCumulativeMembersChartData(
  membershipSalesWithRenewalsCSV: string,
  membershipSalesNoRenewalsCSV: string,
  targetMonth: number,
  targetYear: number
): CumulativeMembersChartDataPoint[] {
  const allMembershipData = parseCSV(membershipSalesWithRenewalsCSV)
  const newMembershipData = parseCSV(membershipSalesNoRenewalsCSV)
  
  const chartData: CumulativeMembersChartDataPoint[] = []
  
  // Generate 13 months of data starting from the same month the prior year
  for (let i = -12; i <= 0; i++) {
    const currentDate = new Date(targetYear, targetMonth, 1)
    currentDate.setMonth(currentDate.getMonth() + i)
    
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Count all memberships (with renewals) for this month
    const totalMembers = allMembershipData.filter(row => {
      const date = parseCSVDate(row['Bought Date/Time (GMT)'])
      return isInMonth(date, month, year)
    }).length
    
    // Count new memberships (no renewals) for this month
    const newMembers = newMembershipData.filter(row => {
      const date = parseCSVDate(row['Bought Date/Time (GMT)'])
      return isInMonth(date, month, year)
    }).length
    
    // Retained members = total members - new members
    const retainedMembers = totalMembers - newMembers
    
    // Format month label
    const monthLabel = formatMonthLabel(currentDate, targetYear)
    
    chartData.push({
      month: monthLabel,
      retainedMembers,
      newMembers,
      totalMembers
    })
  }
  
  return chartData
}

// Sales categorization function based on Excel formula
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

export function generateTotalSalesChartData(
  paymentsCSV: string,
  targetMonth: number,
  targetYear: number
): TotalSalesChartDataPoint[] {
  const paymentsData = parseCSV(paymentsCSV)
  
  console.log(`[Total Sales Chart] Processing ${paymentsData.length} payment records`)
  
  const chartData: TotalSalesChartDataPoint[] = []
  
  // Generate 13 months of data starting from the same month the prior year
  for (let i = -12; i <= 0; i++) {
    const currentDate = new Date(targetYear, targetMonth, 1)
    currentDate.setMonth(currentDate.getMonth() + i)
    
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Filter payments for this month and successful payments only
    const monthPayments = paymentsData.filter(row => {
      const date = parseCSVDate(row['Date'])
      return isInMonth(date, month, year) && row['Payment status'] === 'Succeeded'
    })
    
    // Categorize and sum sales by category
    const categories = {
      membership: 0,
      intro: 0,
      dropIn: 0,
      pack: 0,
      private: 0,
      party: 0,
      other: 0
    }
    
    monthPayments.forEach(row => {
      const saleValue = parseFloat(row['Sale value']) || 0
      const refunded = parseFloat(row['Refunded']) || 0
      const netValue = saleValue - refunded
      
      const category = categorizeSale(row['Category'], row['Item'])
      
      // Make sure the category exists in our categories object
      if (category in categories) {
        categories[category as keyof typeof categories] += netValue
      } else {
        console.warn(`[Total Sales] Unknown category: ${category} for ${row['Category']} | ${row['Item']}`)
        categories.other += netValue
      }
    })
    
    // Round to nearest dollar
    Object.keys(categories).forEach(key => {
      categories[key as keyof typeof categories] = Math.round(categories[key as keyof typeof categories])
    })
    
    const totalSales = Object.values(categories).reduce((sum, value) => sum + value, 0)
    
    // Format month label
    const monthLabel = formatMonthLabel(currentDate, targetYear)
    
    chartData.push({
      month: monthLabel,
      ...categories,
      totalSales
    })
    
    if (year === targetYear && month === targetMonth) {
      console.log(`[Total Sales Chart] Target month (${monthLabel}):`, {
        monthPayments: monthPayments.length,
        categories,
        totalSales
      })
    }
  }
  
  console.log(`[Total Sales Chart] Generated ${chartData.length} data points`)
  if (chartData.length > 0) {
    console.log(`[Total Sales Chart] Last data point:`, chartData[chartData.length - 1])
  }
  
  return chartData
}

function formatMonthLabel(date: Date, targetYear: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  const monthName = months[date.getMonth()]
  const year = date.getFullYear()
  
  // If it's the target year, don't show year
  if (year === targetYear) {
    return monthName
  }
  
  // If it's the previous year, show abbreviated year
  if (year === targetYear - 1) {
    return monthName + "..."
  }
  
  // For other years, show full year
  return monthName + " '" + year.toString().slice(-2)
}
