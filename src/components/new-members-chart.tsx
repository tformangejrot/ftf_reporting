import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
    <Card className="bg-gradient-to-br from-[rgba(15,23,42,0.9)] to-[rgba(15,23,42,0.96)] border-[rgba(148,163,255,0.12)] shadow-[0_0_0_1px_rgba(148,163,255,0.12),0_35px_80px_rgba(15,23,42,0.8)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-[#f5f7ff]">
          New Members and Target
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] p-3 mb-4">
          <p className="text-xs text-[#fbbf24]">
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
                domain={[0, 40]}
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
              
              {/* New Members Bar */}
              <Bar 
                dataKey="newMembers" 
                name="New Members"
                fill="#7dd3ff"
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
