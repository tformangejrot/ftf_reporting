import {
  ComposedChart,
  Bar,
  Line,
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          New Leads & Customers vs Intro Sales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 400]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                }}
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toLocaleString() : value,
                  name
                ]}
                labelStyle={{ color: "#374151", fontWeight: "600" }}
              />
              <Legend />
              
              {/* Target Lines */}
              <ReferenceLine 
                y={90} 
                stroke="#3b82f6" 
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{ value: "Target Intro Sales (90)", position: "topLeft" }}
              />
              <ReferenceLine 
                y={270} 
                stroke="#f59e0b" 
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{ value: "Target New Leads (270)", position: "topLeft" }}
              />
              
              {/* Bars */}
              <Bar 
                dataKey="introSales" 
                name="Intro Sales"
                fill="#60a5fa"
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
