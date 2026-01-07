"use client"

import { MetricCard } from "@/components/metric-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeadsIntroSalesChart } from "./leads-intro-sales-chart"
import { NewMembersChart } from "./new-members-chart"
import { CumulativeMembersChart } from "./cumulative-members-chart"
import { TotalSalesChart } from "./total-sales-chart"
import { ChartDataPoint, NewMembersChartDataPoint, CumulativeMembersChartDataPoint, TotalSalesChartDataPoint } from "@/lib/chart-data-processor"
import { getMonthNumber } from "@/lib/csv-processor"

interface DashboardProps {
  month: string
  year: number
  summary: string
  metrics: {
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
  chartData?: ChartDataPoint[]
  newMembersChartData?: NewMembersChartDataPoint[]
  cumulativeMembersChartData?: CumulativeMembersChartDataPoint[]
  totalSalesChartData?: TotalSalesChartDataPoint[]
}

export function Dashboard({ month, year, summary, metrics, chartData, newMembersChartData, cumulativeMembersChartData, totalSalesChartData }: DashboardProps) {
  const monthNumber = getMonthNumber(month)
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Performance Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  {month} {year} Report
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Summary Section */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold">
                Executive Summary
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="dashboard" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="leads-intro">Leads vs Intro Sales</TabsTrigger>
                <TabsTrigger value="new-members">New Members</TabsTrigger>
                <TabsTrigger value="cumulative-members">All Members</TabsTrigger>
                <TabsTrigger value="total-sales">Total Sales</TabsTrigger>
              </TabsList>
            </div>
          
            <TabsContent value="dashboard" className="space-y-4">
              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="New Members"
                  value={metrics.newMembers.value}
                  change={metrics.newMembers.change}
                  metricType="newMembers"
                  month={monthNumber}
                  year={year}
                />
                <MetricCard
                  title="Lead to Intro Conversion"
                  value={`${metrics.leadToIntroConversion.value}%`}
                  change={metrics.leadToIntroConversion.change}
                  metricType="leadToIntroConversion"
                  month={monthNumber}
                  year={year}
                />
                <MetricCard
                  title="Intros Sold"
                  value={metrics.introsSold.value}
                  change={metrics.introsSold.change}
                  metricType="introsSold"
                  month={monthNumber}
                  year={year}
                />
                <MetricCard
                  title="Intro to Member Conversion"
                  value={`${metrics.introToMemberConversion.value}%`}
                  change={metrics.introToMemberConversion.change}
                  metricType="introToMemberConversion"
                  month={monthNumber}
                  year={year}
                />
                <MetricCard
                  title="Total Sales"
                  value={metrics.totalSales.value}
                  change={metrics.totalSales.change}
                  metricType="totalSales"
                  month={monthNumber}
                  year={year}
                />
                <MetricCard
                  title="Avg. Leads per Day"
                  value={metrics.avgLeadsPerDay.value}
                  change={metrics.avgLeadsPerDay.change}
                  metricType="avgLeadsPerDay"
                  month={monthNumber}
                  year={year}
                />
                <MetricCard
                  title="Intro to Pack Conversion"
                  value={`${metrics.introToPackConversion.value}%`}
                  change={metrics.introToPackConversion.change}
                  metricType="introToPackConversion"
                  month={monthNumber}
                  year={year}
                />
                <MetricCard
                  title="Pack Sales"
                  value={metrics.packSales.value}
                  change={metrics.packSales.change}
                  metricType="packSales"
                  month={monthNumber}
                  year={year}
                />
                <MetricCard
                  title="Membership Cancellations"
                  value={metrics.membershipCancellations.value}
                  change={metrics.membershipCancellations.change}
                  metricType="membershipCancellations"
                  month={monthNumber}
                  year={year}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="leads-intro" className="space-y-4">
              {chartData && (
                <LeadsIntroSalesChart data={chartData} />
              )}
            </TabsContent>
            
            <TabsContent value="new-members" className="space-y-4">
              {newMembersChartData && (
                <NewMembersChart data={newMembersChartData} />
              )}
            </TabsContent>
            
            <TabsContent value="cumulative-members" className="space-y-4">
              {cumulativeMembersChartData && (
                <CumulativeMembersChart data={cumulativeMembersChartData} />
              )}
            </TabsContent>
            
            <TabsContent value="total-sales" className="space-y-4">
              {totalSalesChartData && (
                <TotalSalesChart data={totalSalesChartData} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
