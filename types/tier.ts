/**
 * Represents the available savings tiers in the application
 */
export enum TierLevel {
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3
}

/**
 * Tier amount in Naira for each tier level
 */
export enum TierAmount {
  TIER_1 = 10000,
  TIER_2 = 20000,
  TIER_3 = 30000
}

/**
 * Interest rate per week for each tier (as percentage)
 */
export enum TierInterestRate {
  TIER_1 = 5,
  TIER_2 = 10,
  TIER_3 = 20
}

/**
 * Tier information structure including amounts and interest rates
 */
export interface TierInfo {
  id: TierLevel;
  name: string;
  amount: number;
  interestRatePerWeek: number;
  description: string;
}

/**
 * Structure for tier selection in forms
 */
export interface TierSelection {
  tierId: TierLevel;
  amount: number;
  isValid: boolean;
}

/**
 * Structure for interest calculation results per tier
 */
export interface TierInterestCalculation {
  principal: number;
  interestAmount: number;
  totalAmount: number;
  interestRate: number;
}