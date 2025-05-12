import { TierLevel } from '../types/tier';

/**
 * Format a number as Nigerian Naira
 * @param amount The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a percentage value
 * @param value The percentage value
 * @param decimalPlaces Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimalPlaces: number = 2): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

/**
 * Format a date to localized string
 * @param date The date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string => {
  return new Intl.DateTimeFormat('en-NG', options).format(date);
};

/**
 * Get a human-readable tier name
 * @param tierId The tier level
 * @returns Formatted tier name
 */
export const getTierName = (tierId: TierLevel): string => {
  switch (tierId) {
    case TierLevel.TIER_1:
      return 'Tier 1';
    case TierLevel.TIER_2:
      return 'Tier 2';
    case TierLevel.TIER_3:
      return 'Tier 3';
    default:
      return 'Unknown Tier';
  }
};

/**
 * Format a week number with suffix
 * @param week The week number
 * @returns Formatted week string (e.g., "1st Week", "2nd Week")
 */
export const formatWeek = (week: number): string => {
  if (week <= 0) return 'Not started';
  
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const suffix = week % 100 > 10 && week % 100 < 20 
    ? suffixes[0] 
    : suffixes[Math.min(week % 10, 3)];
    
  return `${week}${suffix} Week`;
};

/**
 * Format a student name for display
 * @param name The student's name
 * @returns Formatted name string
 */
export const formatStudentName = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Generate a summary text for a tier
 * @param tierId The tier level
 * @returns Descriptive text for the tier
 */
export const getTierDescription = (tierId: TierLevel): string => {
  switch (tierId) {
    case TierLevel.TIER_1:
      return 'Basic savings tier with 5% weekly interest';
    case TierLevel.TIER_2:
      return 'Medium savings tier with 10% weekly interest';
    case TierLevel.TIER_3:
      return 'Premium savings tier with 20% weekly interest';
    default:
      return 'Unknown tier';
  }
};