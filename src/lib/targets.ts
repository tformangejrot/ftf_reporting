// Monthly target values for Dec 2025 - Dec 2026
// Outside this window, defaults are used

// Intro Sales targets (Dec 2025 - Dec 2026)
const INTRO_SALES_TARGETS: Record<string, number> = {
  '2025-11': 53, // Dec 2025
  '2026-0': 55,  // Jan 2026
  '2026-1': 49,  // Feb 2026
  '2026-2': 42,  // March 2026
  '2026-3': 42,  // April 2026
  '2026-4': 37,  // May 2026
  '2026-5': 31,  // June 2026
  '2026-6': 33,  // July 2026
  '2026-7': 32,  // Aug 2026
  '2026-8': 47,  // Sept 2026
  '2026-9': 47,  // Oct 2026
  '2026-10': 42, // Nov 2026
  '2026-11': 37, // Dec 2026
}

// Total Memberships targets (Dec 2025 - Dec 2026)
const TOTAL_MEMBERSHIPS_TARGETS: Record<string, number> = {
  '2025-11': 143, // Dec 2025
  '2026-0': 132,  // Jan 2026
  '2026-1': 135,  // Feb 2026
  '2026-2': 140,  // March 2026
  '2026-3': 142,  // April 2026
  '2026-4': 138,  // May 2026
  '2026-5': 133,  // June 2026
  '2026-6': 128,  // July 2026
  '2026-7': 123,  // Aug 2026
  '2026-8': 128,  // Sept 2026
  '2026-9': 132,  // Oct 2026
  '2026-10': 134, // Nov 2026
  '2026-11': 136, // Dec 2026
}

// Class Packs targets (Dec 2025 - Dec 2026)
const CLASS_PACKS_TARGETS: Record<string, number> = {
  '2025-11': 34, // Dec 2025
  '2026-0': 33,  // Jan 2026
  '2026-1': 33,  // Feb 2026
  '2026-2': 33,  // March 2026
  '2026-3': 33,  // April 2026
  '2026-4': 33,  // May 2026
  '2026-5': 33,  // June 2026
  '2026-6': 33,  // July 2026
  '2026-7': 33,  // Aug 2026
  '2026-8': 33,  // Sept 2026
  '2026-9': 33,  // Oct 2026
  '2026-10': 33, // Nov 2026
  '2026-11': 33, // Dec 2026
}

// Total Sales targets (Dec 2025 - Dec 2026)
// Note: Dec 2025 shows 40,614 without dollar sign, others have dollar signs
const TOTAL_SALES_TARGETS: Record<string, number> = {
  '2025-11': 40614, // Dec 2025
  '2026-0': 43548,  // Jan 2026
  '2026-1': 39892,  // Feb 2026
  '2026-2': 40016,  // March 2026
  '2026-3': 40254,  // April 2026
  '2026-4': 39173,  // May 2026
  '2026-5': 38131,  // June 2026
  '2026-6': 37405,  // July 2026
  '2026-7': 35961,  // Aug 2026
  '2026-8': 37691,  // Sept 2026
  '2026-9': 38221,  // Oct 2026
  '2026-10': 38106, // Nov 2026
  '2026-11': 38207, // Dec 2026
}

// Default values for months outside Dec 2025 - Dec 2026
const DEFAULT_INTRO_SALES = 90
const DEFAULT_TOTAL_MEMBERSHIPS = 30 // This is for new members, not total
const DEFAULT_CLASS_PACKS = 33
const DEFAULT_TOTAL_SALES = 45000
const LEADS_PER_DAY = 8 // Fixed across all months
const NEW_LEADS_PER_MONTH = 238 // Fixed monthly target for new leads

export interface TargetThresholds {
  target: number
  yellowThreshold: number
  greenThreshold: number
}

/**
 * Get the target for intro sales for a given month/year
 */
export function getIntroSalesTarget(year: number, month: number): number {
  const key = `${year}-${month}`
  return INTRO_SALES_TARGETS[key] ?? DEFAULT_INTRO_SALES
}

/**
 * Get the target for total memberships for a given month/year
 */
export function getTotalMembershipsTarget(year: number, month: number): number {
  const key = `${year}-${month}`
  return TOTAL_MEMBERSHIPS_TARGETS[key] ?? DEFAULT_TOTAL_MEMBERSHIPS
}

/**
 * Get the target for class packs for a given month/year
 */
export function getClassPacksTarget(year: number, month: number): number {
  const key = `${year}-${month}`
  return CLASS_PACKS_TARGETS[key] ?? DEFAULT_CLASS_PACKS
}

/**
 * Get the target for total sales for a given month/year
 */
export function getTotalSalesTarget(year: number, month: number): number {
  const key = `${year}-${month}`
  return TOTAL_SALES_TARGETS[key] ?? DEFAULT_TOTAL_SALES
}

/**
 * Get the target for leads per day (fixed at 8)
 */
export function getLeadsPerDayTarget(): number {
  return LEADS_PER_DAY
}

/**
 * Get the target for new leads per month (fixed at 238)
 */
export function getNewLeadsTarget(): number {
  return NEW_LEADS_PER_MONTH
}

/**
 * Get target thresholds for a high-is-good metric using the 80% rule
 * - Green: at or above target
 * - Yellow: 80% of target up to (but not including) target
 * - Red: below 80% of target
 */
export function getHighIsGoodThresholds(
  target: number
): TargetThresholds {
  const yellowThreshold = target * 0.8
  return {
    target,
    yellowThreshold,
    greenThreshold: target,
  }
}

/**
 * Get target thresholds for a low-is-good metric (for cancellations)
 * - Green: ≤ 12
 * - Yellow: 13-15
 * - Red: ≥ 16
 */
export function getCancellationsThresholds(): TargetThresholds {
  return {
    target: 12,
    yellowThreshold: 13,
    greenThreshold: 12,
  }
}

