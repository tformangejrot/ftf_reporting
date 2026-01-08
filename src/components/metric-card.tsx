import { Card, CardContent } from "@/components/ui/card"
import { Tooltip } from "@/components/ui/tooltip"
import { ArrowUp, ArrowDown, Minus, Info } from "lucide-react"
import { getMetricColor, getColorVariant, getMetricTarget, MetricType } from "@/lib/metric-utils"

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  metricType?: MetricType
  variant?: "default" | "success" | "warning" | "neutral" | "destructive"
  month?: number
  year?: number
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  metricType,
  variant,
  month,
  year
}: MetricCardProps) {
  // Use threshold-based color if metricType is provided, otherwise use variant
  const getCardVariant = () => {
    if (metricType && variant === undefined) {
      const numericValue = typeof value === "number" ? value : parseFloat(value.toString().replace(/[^0-9.-]/g, '')) || 0
      const color = getMetricColor(metricType, numericValue, month, year)
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
  const numericValue = typeof value === "number" ? value : parseFloat(value.toString().replace(/[^0-9.-]/g, '')) || 0
  const metricColor = metricType ? getMetricColor(metricType, numericValue, month, year) : 'gray'
  const target = metricType ? getMetricTarget(metricType, month, year) : null

  // Get color styles for dark theme with full card tint
  const getColorStyles = () => {
    switch (metricColor) {
      case 'green':
        return {
          border: 'border-l-4 border-l-[#22c55e]',
          bg: 'bg-[rgba(34,197,94,0.15)]',
          bgGradient: 'from-[rgba(34,197,94,0.2)] to-[rgba(34,197,94,0.05)]'
        }
      case 'yellow':
        return {
          border: 'border-l-4 border-l-[#f59e0b]',
          bg: 'bg-[rgba(245,158,11,0.15)]',
          bgGradient: 'from-[rgba(245,158,11,0.2)] to-[rgba(245,158,11,0.05)]'
        }
      case 'red':
        return {
          border: 'border-l-4 border-l-[#ef4444]',
          bg: 'bg-[rgba(239,68,68,0.15)]',
          bgGradient: 'from-[rgba(239,68,68,0.2)] to-[rgba(239,68,68,0.05)]'
        }
      default:
        return {
          border: 'border-l-4 border-l-[rgba(148,163,255,0.3)]',
          bg: '',
          bgGradient: 'from-[rgba(15,23,42,0.9)] to-[rgba(15,23,42,0.96)]'
        }
    }
  }

  const colorStyles = getColorStyles()
  const statusText = metricColor === 'green' ? 'On Target' : metricColor === 'yellow' ? 'At 80%' : metricColor === 'red' ? 'Below Target' : 'No Target'
  
  // Calculate percentage of target
  // For percentage-based metrics (like conversion rates), we compare the numeric value directly
  // For count/amount metrics, we divide by target
  const getTargetPercentage = () => {
    if (target === null || target === 0) return null
    
    // Check if this is a percentage metric (like conversion rates)
    const isPercentageMetric = metricType === 'leadToIntroConversion' || 
                               metricType === 'introToMemberConversion' || 
                               metricType === 'introToPackConversion'
    
    if (isPercentageMetric) {
      // For percentage metrics, compare directly (e.g., 40% vs 40% target)
      const percentage = (numericValue / target) * 100
      return Math.round(percentage * 10) / 10
    } else {
      // For count/amount metrics, divide current by target
      const percentage = (numericValue / target) * 100
      return Math.round(percentage * 10) / 10
    }
  }
  
  const targetPercentage = getTargetPercentage()

  const tooltipContent = target !== null ? (
    <div className="space-y-2">
      <div className="font-semibold text-[#7dd3ff]">{title}</div>
      <div className="space-y-1 text-xs">
        <div>Target: <span className="font-semibold">{typeof target === 'number' && target >= 1000 ? `$${target.toLocaleString()}` : target}</span></div>
        <div>Current: <span className="font-semibold">{formatValue(value)}</span></div>
        {targetPercentage !== null && (
          <div>Progress: <span className="font-semibold">{targetPercentage}%</span> of target</div>
        )}
        {metricColor === 'yellow' && (
          <div className="mt-2 pt-2 border-t border-[rgba(148,163,255,0.2)] text-[#9ca3ff]">
            Yellow indicates 80% of target
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="space-y-1">
      <div className="font-semibold text-[#7dd3ff]">{title}</div>
      <div className="text-xs text-[#cbd5f5]">No target defined for this metric</div>
    </div>
  )

  // Use colored gradient background if metric has a color, otherwise use default dark gradient
  const cardBgClass = metricColor !== 'gray' 
    ? `bg-gradient-to-br ${colorStyles.bgGradient}`
    : 'bg-gradient-to-br from-[rgba(15,23,42,0.9)] to-[rgba(15,23,42,0.96)]'

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${colorStyles.border} ${cardBgClass} border-[rgba(148,163,255,0.12)]`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-[#cbd5f5]">
            {title}
          </p>
          <div className="flex items-center gap-2">
            {target !== null && (
              <Tooltip content={tooltipContent}>
                <Info className="h-4 w-4 text-[#7dd3ff] cursor-help hover:text-[#a78bfa] transition-colors" />
              </Tooltip>
            )}
            <div className="flex items-center gap-1">
              {getIcon()}
              <span className={`text-xs font-medium ${
                getChangeVariant() === "success" ? "text-[#22c55e]" :
                getChangeVariant() === "destructive" ? "text-[#ef4444]" :
                "text-[#9ca3ff]"
              }`}>
                {change > 0 ? "+" : ""}{change}%
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#f5f7ff]">
            {formatValue(value)}
          </div>
          <p className="text-xs text-[#9ca3ff]">
            {change > 0 ? "Trending up" : change < 0 ? "Trending down" : "No change"} from last month
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
