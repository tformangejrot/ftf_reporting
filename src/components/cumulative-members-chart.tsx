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
import { CumulativeMembersChartDataPoint } from "@/lib/chart-data-processor"

interface CumulativeMembersChartProps {
  data: CumulativeMembersChartDataPoint[]
}

export function CumulativeMembersChart({ data }: CumulativeMembersChartProps) {
  return (
    <Card className="bg-gradient-to-br from-[rgba(15,23,42,0.9)] to-[rgba(15,23,42,0.96)] border-[rgba(148,163,255,0.12)] shadow-[0_0_0_1px_rgba(148,163,255,0.12),0_35px_80px_rgba(15,23,42,0.8)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-[#f5f7ff]">
          Cumulative Memberships
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-[#9ca3ff] mb-4">
          All Members
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
                domain={[0, 150]}
                tick={{ fill: '#cbd5f5' }}
                label={{ value: 'New Members', angle: -90, position: 'insideLeft', fill: '#cbd5f5' }}
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
              
              {/* Target Line */}
              {data.length > 0 && data[0].targetTotalMembers !== undefined && (
                <ReferenceLine 
                  y={data[0].targetTotalMembers} 
                  stroke="#7dd3ff" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{ value: `Target Total Members (${data[0].targetTotalMembers})`, position: "top", fill: '#7dd3ff' }}
                />
              )}
              
              {/* Retained Members (bottom, light blue) */}
              <Bar 
                dataKey="retainedMembers" 
                name="Retained Members"
                stackId="members"
                fill="#7dd3fc"
                radius={[0, 0, 0, 0]}
              />
              
              {/* New Members (top, dark blue) */}
              <Bar 
                dataKey="newMembers" 
                name="New Members"
                stackId="members"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
