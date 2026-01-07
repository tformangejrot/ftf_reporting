import {
  getIntroSalesTarget,
  getClassPacksTarget,
  getTotalSalesTarget,
  getLeadsPerDayTarget,
  getHighIsGoodThresholds,
} from './targets'

export type MetricType = 
  | 'newMembers' 
  | 'introsSold' 
  | 'avgLeadsPerDay' 
  | 'leadToIntroConversion' 
  | 'introToMemberConversion' 
  | 'introToPackConversion' 
  | 'totalSales'
  | 'packSales'
  | 'membershipCancellations'

export type MetricColor = 'green' | 'yellow' | 'red' | 'gray'

export interface MetricThresholds {
  green: number
  yellow: number
  red: number
}

// Legacy static thresholds for metrics that don't use dynamic targets
// These are kept for backward compatibility but most metrics now use dynamic targets
export const METRIC_THRESHOLDS: Record<MetricType, MetricThresholds> = {
  newMembers: {
    green: 30,
    yellow: 15,
    red: 0
  },
  introsSold: {
    green: 90,
    yellow: 60,
    red: 0
  },
  avgLeadsPerDay: {
    green: 7,
    yellow: 4,
    red: 0
  },
  leadToIntroConversion: {
    green: 40,
    yellow: 30,
    red: 0
  },
  introToMemberConversion: {
    green: 33,
    yellow: 20,
    red: 0
  },
  introToPackConversion: {
    green: 0, // Not used - always gray
    yellow: 0, // Not used - always gray
    red: 0 // Not used - always gray
  },
  totalSales: {
    green: 45000,
    yellow: 40000,
    red: 0
  },
  packSales: {
    green: 33,
    yellow: 26,
    red: 0
  },
  membershipCancellations: {
    green: 12,
    yellow: 13,
    red: 16
  }
}

// Function to determine color based on metric value and type
// Now accepts optional month/year for dynamic targets
export function getMetricColor(
  metricType: MetricType, 
  value: number, 
  month?: number, 
  year?: number
): MetricColor {
  // Pack conversion is always gray
  if (metricType === 'introToPackConversion') {
    return 'gray'
  }

  // Metrics that use dynamic targets based on month/year
  if (month !== undefined && year !== undefined) {
    if (metricType === 'introsSold') {
      const target = getIntroSalesTarget(year, month)
      const thresholds = getHighIsGoodThresholds(target)
      if (value >= thresholds.greenThreshold) {
        return 'green'
      } else if (value >= thresholds.yellowThreshold) {
        return 'yellow'
      } else {
        return 'red'
      }
    }
    
    if (metricType === 'packSales') {
      const target = getClassPacksTarget(year, month)
      const thresholds = getHighIsGoodThresholds(target)
      if (value >= thresholds.greenThreshold) {
        return 'green'
      } else if (value >= thresholds.yellowThreshold) {
        return 'yellow'
      } else {
        return 'red'
      }
    }
    
    if (metricType === 'totalSales') {
      const target = getTotalSalesTarget(year, month)
      const thresholds = getHighIsGoodThresholds(target)
      if (value >= thresholds.greenThreshold) {
        return 'green'
      } else if (value >= thresholds.yellowThreshold) {
        return 'yellow'
      } else {
        return 'red'
      }
    }
    
    if (metricType === 'avgLeadsPerDay') {
      const target = getLeadsPerDayTarget()
      const thresholds = getHighIsGoodThresholds(target)
      if (value >= thresholds.greenThreshold) {
        return 'green'
      } else if (value >= thresholds.yellowThreshold) {
        return 'yellow'
      } else {
        return 'red'
      }
    }
  }

  // Membership cancellations: lower is better
  // Green: ≤ 12, Yellow: 13-15, Red: ≥ 16
  if (metricType === 'membershipCancellations') {
    if (value <= 12) {
      return 'green'
    } else if (value <= 15) {
      return 'yellow'
    } else {
      return 'red'
    }
  }

  // Fall back to static thresholds for other metrics
  const thresholds = METRIC_THRESHOLDS[metricType]
  if (!thresholds) {
    return 'gray'
  }
  
  if (value >= thresholds.green) {
    return 'green'
  } else if (value >= thresholds.yellow) {
    return 'yellow'
  } else {
    return 'red'
  }
}

// Function to get color variant for shadcn/ui components
export function getColorVariant(color: MetricColor): "default" | "success" | "warning" | "neutral" | "destructive" {
  switch (color) {
    case 'green':
      return 'success'
    case 'yellow':
      return 'warning'
    case 'red':
      return 'destructive'
    case 'gray':
      return 'neutral'
    default:
      return 'default'
  }
}


