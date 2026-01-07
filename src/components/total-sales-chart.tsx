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

interface ChartDataPoint {
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

interface TotalSalesChartProps {
  data: ChartDataPoint[]
}

export function TotalSalesChart({ data }: TotalSalesChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Total Sales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
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
                domain={[0, 50000]}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                }}
                formatter={(value, name) => [
                  `$${typeof value === 'number' ? value.toLocaleString() : value}`,
                  name
                ]}
                labelStyle={{ color: "#374151", fontWeight: "600" }}
              />
              <Legend />
              
              {/* Target Line */}
              {data.length > 0 && data[0].targetTotalSales !== undefined && (
                <ReferenceLine 
                  y={data[0].targetTotalSales} 
                  stroke="#3b82f6" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{ value: `Target Total Sales ($${data[0].targetTotalSales.toLocaleString()})`, position: "top" }}
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
