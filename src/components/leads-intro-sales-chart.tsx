import {
  ComposedChart,
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

interface ChartDataPoint {
  month: string
  introSales: number
  newLeads: number
  targetIntroSales: number
  targetNewLeads: number
}

interface LeadsIntroSalesChartProps {
  data: ChartDataPoint[]
}

export function LeadsIntroSalesChart({ data }: LeadsIntroSalesChartProps) {
  return (
    <Card className="bg-gradient-to-br from-[rgba(15,23,42,0.9)] to-[rgba(15,23,42,0.96)] border-[rgba(148,163,255,0.12)] shadow-[0_0_0_1px_rgba(148,163,255,0.12),0_35px_80px_rgba(15,23,42,0.8)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-[#f5f7ff]">
          New Leads & Customers vs Intro Sales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-[#9ca3ff] mb-4">
          Intro Sales, New Leads & Customers, Target Intro Sales and Target New Leads
        </p>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
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
                domain={[0, 400]}
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
                  typeof value === 'number' ? value.toLocaleString() : value,
                  name
                ]}
                labelStyle={{ color: "#7dd3ff", fontWeight: "600" }}
              />
              <Legend wrapperStyle={{ color: '#cbd5f5' }} />
              
              {/* Target Lines - use the last data point's targets (which is the selected month) */}
              {data.length > 0 && (
                <>
                  <ReferenceLine 
                    y={data[data.length - 1].targetIntroSales} 
                    stroke="#7dd3ff" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{ value: `Target Intro Sales (${data[data.length - 1].targetIntroSales})`, position: "top", fill: '#7dd3ff' }}
                  />
                  <ReferenceLine 
                    y={data[data.length - 1].targetNewLeads} 
                    stroke="#f59e0b" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{ value: `Target New Leads (${data[data.length - 1].targetNewLeads})`, position: "top", fill: '#f59e0b' }}
                  />
                </>
              )}
              
              {/* Bars */}
              <Bar 
                dataKey="introSales" 
                name="Intro Sales"
                fill="#7dd3ff"
                radius={[2, 2, 0, 0]}
                maxBarSize={40}
              />
              <Bar 
                dataKey="newLeads" 
                name="New Leads & Customers"
                fill="#ef4444"
                radius={[2, 2, 0, 0]}
                maxBarSize={40}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
