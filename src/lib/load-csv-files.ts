import fs from 'fs'
import path from 'path'
import { processCSVData, type ProcessedCSVData } from './csv-processor'

export async function loadAndProcessCSVFiles(): Promise<ProcessedCSVData> {
  try {
    const csvDir = path.join(process.cwd(), 'september-2025')
    
    // Read all CSV files
    const membershipSales = fs.readFileSync(
      path.join(csvDir, 'momence--membership-sales-export-norenewals.csv'), 
      'utf-8'
    )
    
    const introSales = fs.readFileSync(
      path.join(csvDir, 'momence-intro-offers-sales-report.csv'), 
      'utf-8'
    )
    
    const leadsCustomers = fs.readFileSync(
      path.join(csvDir, 'momence-new-leads-and-customers.csv'), 
      'utf-8'
    )
    
    const introConversions = fs.readFileSync(
      path.join(csvDir, 'momence-intro-offers-conversions-report.csv'), 
      'utf-8'
    )
    
    const payments = fs.readFileSync(
      path.join(csvDir, 'momence-latest-payments-report.csv'), 
      'utf-8'
    )
    
    const membershipSalesWithRenewals = fs.readFileSync(
      path.join(csvDir, 'momence--membership-sales-export-withrenewals.csv'), 
      'utf-8'
    )
    
    // Process the data (September 2025 = month 8, year 2025)
    const processedData = processCSVData(
      membershipSales,
      introSales,
      leadsCustomers,
      introConversions,
      payments,
      membershipSalesWithRenewals,
      8, // September (0-indexed)
      2025
    )
    
    return processedData
  } catch (error) {
    console.error('Error loading CSV files:', error)
    throw error
  }
}
