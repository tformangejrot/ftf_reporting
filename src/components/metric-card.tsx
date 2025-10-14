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
    <Card className={`border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 ${
      cardVariant === "warning" ? "border-l-4 border-l-yellow-500" :
      cardVariant === "success" ? "border-l-4 border-l-green-500" :
      cardVariant === "destructive" ? "border-l-4 border-l-red-500" :
      cardVariant === "neutral" ? "border-l-4 border-l-gray-500" :
      "border-l-4 border-l-blue-500"
    }`}>
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatValue(value)}
            </p>
            <Badge 
              variant={getChangeVariant()} 
              className="flex w-fit items-center gap-1 mb-4 text-sm font-semibold"
            >
              {getIcon()}
              {Math.abs(change)}%
            </Badge>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              {title}
            </p>
          </div>
          <div className={`ml-4 flex h-12 w-12 items-center justify-center rounded-xl ${
            cardVariant === "warning" ? "bg-yellow-100" :
            cardVariant === "success" ? "bg-green-100" :
            cardVariant === "destructive" ? "bg-red-100" :
            cardVariant === "neutral" ? "bg-gray-100" :
            "bg-blue-100"
          }`}>
            {cardVariant === "warning" && (
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
            {cardVariant === "success" && (
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {cardVariant === "destructive" && (
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {cardVariant === "neutral" && (
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )}
            {cardVariant === "default" && (
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
