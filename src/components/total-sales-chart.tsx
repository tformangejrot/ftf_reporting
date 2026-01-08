import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TotalSalesChartDataPoint } from "@/lib/chart-data-processor"

interface TotalSalesChartProps {
  data: TotalSalesChartDataPoint[]
}

export function TotalSalesChart({ data }: TotalSalesChartProps) {
  return (
    <Card className="bg-gradient-to-br from-[rgba(15,23,42,0.9)] to-[rgba(15,23,42,0.96)] border-[rgba(148,163,255,0.12)] shadow-[0_0_0_1px_rgba(148,163,255,0.12),0_35px_80px_rgba(15,23,42,0.8)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-[#f5f7ff]">
          Total Sales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-[#9ca3ff] mb-4">
          Excluding ClassPass & rental income and ignoring CC fees
        </p>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,255,0.15)" />
              <XAxis 
                dataKey="month" 
                stroke="#cbd5f5"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#cbd5f5' }}
              />
              <YAxis 
                stroke="#cbd5f5"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 50000]}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                tick={{ fill: '#cbd5f5' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "rgba(15,23,42,0.98)",
                  border: "1px solid rgba(148,163,255,0.3)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
                  color: "#f5f7ff"
                }}
                formatter={(value, name) => [
                  `$${typeof value === 'number' ? value.toLocaleString() : value}`,
                  name
                ]}
                labelStyle={{ color: "#7dd3ff", fontWeight: "600" }}
              />
              <Legend wrapperStyle={{ color: '#cbd5f5' }} />
              
              {/* Target Line */}
              {data.length > 0 && data[0].targetTotalSales !== undefined && (
                <ReferenceLine 
                  y={data[0].targetTotalSales} 
                  stroke="#7dd3ff" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{ value: `Target Total Sales ($${data[0].targetTotalSales.toLocaleString()})`, position: "top", fill: '#7dd3ff' }}
                />
              )}
              
              {/* Sales Categories - stacked in order from bottom to top */}
              <Bar 
                dataKey="membership" 
                name="Membership"
                stackId="sales"
                fill="#7dd3fc"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="intro" 
                name="Intro"
                stackId="sales"
                fill="#fb923c"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="dropIn" 
                name="Drop-in"
                stackId="sales"
                fill="#86efac"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="pack" 
                name="Pack"
                stackId="sales"
                fill="#3b82f6"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="private" 
                name="Private"
                stackId="sales"
                fill="#ec4899"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="party" 
                name="Party"
                stackId="sales"
                fill="#a855f7"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="other" 
                name="Other"
                stackId="sales"
                fill="#6b7280"
                radius={[4, 4, 4, 4]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
