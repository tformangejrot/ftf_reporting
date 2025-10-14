import { NextResponse } from 'next/server'
import { loadAndProcessCSVFiles } from '@/lib/load-csv-files'

export async function GET() {
  try {
    const data = await loadAndProcessCSVFiles()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error processing CSV files:', error)
    return NextResponse.json(
      { error: 'Failed to process CSV files' },
      { status: 500 }
    )
  }
}
