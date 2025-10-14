import fs from 'fs'
import path from 'path'
import { processCSVData } from './csv-processor'

export async function loadAndProcessCSVFiles(): Promise<any> {
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
    
    // Process the data
    const processedData = processCSVData(
      membershipSales,
      introSales,
      leadsCustomers,
      introConversions,
      payments
    )
    
    return processedData
  } catch (error) {
    console.error('Error loading CSV files:', error)
    throw error
  }
}
