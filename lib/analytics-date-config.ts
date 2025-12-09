/**
 * Centralized Analytics Date Configuration
 * 
 * This file contains the default date ranges for analytics queries.
 * Change ANALYTICS_START_DATE to match your website's launch date or 
 * when you started tracking analytics with Google Analytics.
 */

/**
 * The start date for all-time analytics queries.
 * Format: YYYY-MM-DD
 * 
 * Change this to your website's launch date or GA4 tracking start date.
 */
export const ANALYTICS_START_DATE = '2020-01-01' as const

/**
 * The end date for analytics queries (typically "today")
 */
export const ANALYTICS_END_DATE = 'today' as const

/**
 * Default date range for analytics queries
 */
export const DEFAULT_ANALYTICS_DATE_RANGE = {
  startDate: ANALYTICS_START_DATE,
  endDate: ANALYTICS_END_DATE,
} as const

/**
 * Predefined date range options for dropdowns
 */
export const ANALYTICS_DATE_RANGES = {
  LAST_7_DAYS: '7daysAgo',
  LAST_30_DAYS: '30daysAgo',
  LAST_90_DAYS: '90daysAgo',
  LAST_YEAR: '365daysAgo',
  ALL_TIME: ANALYTICS_START_DATE,
} as const

/**
 * Labels for date range options
 */
export const ANALYTICS_DATE_RANGE_LABELS: Record<string, string> = {
  [ANALYTICS_DATE_RANGES.LAST_7_DAYS]: 'Last 7 days',
  [ANALYTICS_DATE_RANGES.LAST_30_DAYS]: 'Last 30 days',
  [ANALYTICS_DATE_RANGES.LAST_90_DAYS]: 'Last 90 days',
  [ANALYTICS_DATE_RANGES.LAST_YEAR]: 'Last year',
  [ANALYTICS_DATE_RANGES.ALL_TIME]: 'All time',
} as const

/**
 * Get label for a date range value
 */
export function getDateRangeLabel(range: string): string {
  return ANALYTICS_DATE_RANGE_LABELS[range] || 'Last 30 days'
}
