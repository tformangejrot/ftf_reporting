export type MetricType = 
  | 'newMembers' 
  | 'introsSold' 
  | 'avgLeadsPerDay' 
  | 'leadToIntroConversion' 
  | 'introToMemberConversion' 
  | 'introToPackConversion' 
  | 'totalSales'

export type MetricColor = 'green' | 'yellow' | 'red' | 'gray'

export interface MetricThresholds {
  green: number
  yellow: number
  red: number
}

// Define thresholds for each metric type
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
  }
}

// Function to determine color based on metric value and type
export function getMetricColor(metricType: MetricType, value: number): MetricColor {
  // Pack conversion is always gray
  if (metricType === 'introToPackConversion') {
    return 'gray'
  }

  const thresholds = METRIC_THRESHOLDS[metricType]
  
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
