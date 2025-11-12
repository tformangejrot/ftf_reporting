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
  newMembers: number
  target: number
}

interface NewMembersChartProps {
  data: ChartDataPoint[]
}

export function NewMembersChart({ data }: NewMembersChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          New Members and Target
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 mb-4">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> New memberships (*FYI in this report and the next I discovered a small issue because the report download translates to local time zone so a few purchases may be attributed to the incorrect month)
          </p>
        </div>
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
                domain={[0, 40]}
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
              
              {/* Target Line */}
              <ReferenceLine 
                y={30} 
                stroke="#60a5fa" 
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{ value: "Target (30)", position: "topLeft" }}
              />
              
              {/* New Members Bar */}
              <Bar 
                dataKey="newMembers" 
                name="New Members"
                fill="#60a5fa"
                radius={[2, 2, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
