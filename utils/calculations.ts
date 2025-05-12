import { TierLevel, TierAmount, TierInterestRate, type TierInterestCalculation } from '../types/tier';
import type { GroupSavings, SavingsSummary } from '../types/savings';
import type { StudentWithFinancials } from '../types/student';

/**
 * Calculate weekly interest for a given tier and amount
 * @param tierId The tier level
 * @param amount The principal amount
 * @returns Calculation result with principal, interest, total and rate
 */
export const calculateWeeklyInterest = (tierId: TierLevel, amount: number): TierInterestCalculation => {
  let interestRate: number;
  
  switch (tierId) {
    case TierLevel.TIER_1:
      interestRate = TierInterestRate.TIER_1;
      break;
    case TierLevel.TIER_2:
      interestRate = TierInterestRate.TIER_2;
      break;
    case TierLevel.TIER_3:
      interestRate = TierInterestRate.TIER_3;
      break;
    default:
      throw new Error('Invalid tier level');
  }
  
  const interestAmount = (amount * interestRate) / 100;
  const totalAmount = amount + interestAmount;
  
  return {
    principal: amount,
    interestAmount,
    totalAmount,
    interestRate
  };
};

/**
 * Calculate the accumulated interest over multiple weeks
 * @param tierId The tier level
 * @param amount The principal amount
 * @param weeks Number of weeks
 * @param compound Whether to compound the interest (default: false)
 * @returns Calculation result with principal, interest, total and rate
 */
export const calculateAccumulatedInterest = (
  tierId: TierLevel, 
  amount: number, 
  weeks: number, 
  compound: boolean = false
): TierInterestCalculation => {
  let interestRate: number;
  
  switch (tierId) {
    case TierLevel.TIER_1:
      interestRate = TierInterestRate.TIER_1;
      break;
    case TierLevel.TIER_2:
      interestRate = TierInterestRate.TIER_2;
      break;
    case TierLevel.TIER_3:
      interestRate = TierInterestRate.TIER_3;
      break;
    default:
      throw new Error('Invalid tier level');
  }
  
  let totalAmount = amount;
  let totalInterest = 0;
  
  if (compound) {
    // Compound interest calculation
    totalAmount = amount * Math.pow(1 + (interestRate / 100), weeks);
    totalInterest = totalAmount - amount;
  } else {
    // Simple interest calculation
    totalInterest = amount * (interestRate / 100) * weeks;
    totalAmount = amount + totalInterest;
  }
  
  return {
    principal: amount,
    interestAmount: totalInterest,
    totalAmount,
    interestRate
  };
};

/**
 * Calculate the game investment return
 * @param investmentAmount Total amount invested in the game
 * @param returnRate Return rate percentage (default: 20%)
 * @returns The expected return amount
 */
export const calculateGameReturn = (investmentAmount: number, returnRate: number = 20): number => {
  return investmentAmount * (returnRate / 100);
};

/**
 * Calculate group savings summary
 * @param students Array of students with their financial data
 * @param currentWeek Current week number
 * @returns Savings summary with totals and breakdown
 */
export const calculateGroupSavingsSummary = (
  students: StudentWithFinancials[],
  currentWeek: number
): SavingsSummary => {
  const activeStudents = students.filter(student => student.status === 'active');
  
  // Initialize summary object with tier breakdown
  const summary: SavingsSummary = {
    totalSaved: 0,
    totalInterest: 0,
    totalAmount: 0,
    tierBreakdown: {
      [TierLevel.TIER_1]: { count: 0, principal: 0, interest: 0, total: 0 },
      [TierLevel.TIER_2]: { count: 0, principal: 0, interest: 0, total: 0 },
      [TierLevel.TIER_3]: { count: 0, principal: 0, interest: 0, total: 0 }
    },
    returnOnInvestment: 0
  };
  
  // Calculate totals and tier breakdown
  activeStudents.forEach(student => {
    summary.totalSaved += student.principal;
    summary.totalInterest += student.interestEarned;
    summary.totalAmount += student.totalAmount;
    
    // Update tier breakdown
    summary.tierBreakdown[student.tierId].count += 1;
    summary.tierBreakdown[student.tierId].principal += student.principal;
    summary.tierBreakdown[student.tierId].interest += student.interestEarned;
    summary.tierBreakdown[student.tierId].total += student.totalAmount;
  });
  
  // Calculate ROI
  if (summary.totalSaved > 0) {
    summary.returnOnInvestment = (summary.totalInterest / summary.totalSaved) * 100;
  }
  
  return summary;
};

/**
 * Get the correct tier amount for a given tier
 * @param tierId The tier level
 * @returns The amount for the tier
 */
export const getTierAmount = (tierId: TierLevel): number => {
  switch (tierId) {
    case TierLevel.TIER_1:
      return TierAmount.TIER_1;
    case TierLevel.TIER_2:
      return TierAmount.TIER_2;
    case TierLevel.TIER_3:
      return TierAmount.TIER_3;
    default:
      throw new Error('Invalid tier level');
  }
};

/**
 * Get the interest rate for a given tier
 * @param tierId The tier level
 * @returns The weekly interest rate percentage
 */
export const getTierInterestRate = (tierId: TierLevel): number => {
  switch (tierId) {
    case TierLevel.TIER_1:
      return TierInterestRate.TIER_1;
    case TierLevel.TIER_2:
      return TierInterestRate.TIER_2;
    case TierLevel.TIER_3:
      return TierInterestRate.TIER_3;
    default:
      throw new Error('Invalid tier level');
  }
};