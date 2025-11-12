import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { getMetricColor, getColorVariant, MetricType } from "@/lib/metric-utils"

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  changeLabel?: string
  metricType?: MetricType
  variant?: "default" | "success" | "warning" | "neutral" | "destructive"
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  metricType,
  variant 
}: MetricCardProps) {
  // Use threshold-based color if metricType is provided, otherwise use variant
  const getCardVariant = () => {
    if (metricType && variant === undefined) {
      const numericValue = typeof value === "number" ? value : parseFloat(value.toString()) || 0
      const color = getMetricColor(metricType, numericValue)
      return getColorVariant(color)
    }
    return variant || "default"
  }

  const getChangeVariant = () => {
    if (change > 0) return "success"
    if (change < 0) return "destructive"
    return "neutral"
  }

  const getIcon = () => {
    if (change > 0) return <ArrowUp className="h-3 w-3" />
    if (change < 0) return <ArrowDown className="h-3 w-3" />
    return <Minus className="h-3 w-3" />
  }

  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      if (val >= 1000) {
        return `$${val.toLocaleString()}`
      }
      return val.toString()
    }
    return val
  }

  const cardVariant = getCardVariant()

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      cardVariant === "warning" ? "border-l-4 border-l-yellow-500" :
      cardVariant === "success" ? "border-l-4 border-l-green-500" :
      cardVariant === "destructive" ? "border-l-4 border-l-red-500" :
      cardVariant === "neutral" ? "border-l-4 border-l-gray-500" :
      "border-l-4 border-l-blue-500"
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <div className="flex items-center gap-1">
            {getIcon()}
            <span className={`text-xs font-medium ${
              getChangeVariant() === "success" ? "text-green-600" :
              getChangeVariant() === "destructive" ? "text-red-600" :
              "text-gray-600"
            }`}>
              {change > 0 ? "+" : ""}{change}%
            </span>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {formatValue(value)}
          </div>
          <p className="text-xs text-muted-foreground">
            {change > 0 ? "Trending up" : change < 0 ? "Trending down" : "No change"} from last month
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
