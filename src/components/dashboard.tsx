"use client"

import { MetricCard } from "@/components/metric-card"

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
  }
}

export function Dashboard({ month, year, summary, metrics }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Performance Dashboard
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {month} {year} Report
              </p>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mb-12 rounded-2xl bg-white/70 backdrop-blur-sm p-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Executive Summary
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            {summary}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Column 1 */}
          <div className="space-y-6">
            <MetricCard
              title="New members last month"
              value={metrics.newMembers.value}
              change={metrics.newMembers.change}
              metricType="newMembers"
            />
            <MetricCard
              title="Lead to intro conversion last 3 months"
              value={`${metrics.leadToIntroConversion.value}%`}
              change={metrics.leadToIntroConversion.change}
              metricType="leadToIntroConversion"
            />
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <MetricCard
              title="Intros sold last month"
              value={metrics.introsSold.value}
              change={metrics.introsSold.change}
              metricType="introsSold"
            />
            <MetricCard
              title="Intro to member conversion last 3 months"
              value={`${metrics.introToMemberConversion.value}%`}
              change={metrics.introToMemberConversion.change}
              metricType="introToMemberConversion"
            />
            <MetricCard
              title="Total sales last month"
              value={metrics.totalSales.value}
              change={metrics.totalSales.change}
              metricType="totalSales"
            />
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            <MetricCard
              title="Avg. # of leads per day last month"
              value={metrics.avgLeadsPerDay.value}
              change={metrics.avgLeadsPerDay.change}
              metricType="avgLeadsPerDay"
            />
            <MetricCard
              title="Intro to pack conversion last 3 months"
              value={`${metrics.introToPackConversion.value}%`}
              change={metrics.introToPackConversion.change}
              metricType="introToPackConversion"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
