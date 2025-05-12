import type { StudentId } from './student';
import { TierLevel } from './tier';

/**
 * Structure for group savings information
 */
export interface GroupSavings {
  totalPrincipal: number;
  totalInterest: number;
  totalAmount: number;
  memberCount: number;
  currentWeek: number;
  gameplayReturnRate: number;
}

/**
 * Structure for individual contribution tracking
 */
export interface Contribution {
  studentId: StudentId;
  tierId: TierLevel;
  amount: number;
  date: Date;
}

/**
 * Structure for weekly interest accrual tracking
 */
export interface WeeklyInterest {
  week: number;
  date: Date;
  totalInterestGenerated: number;
  perStudentInterest: Record<StudentId, number>;
}

/**
 * Structure for the savings simulation
 */
export interface SavingsSimulation {
  currentWeek: number;
  startDate: Date;
  lastUpdated: Date;
  weeklyHistory: WeeklyInterest[];
}

/**
 * Structure for a savings summary report
 */
export interface SavingsSummary {
  totalSaved: number;
  totalInterest: number;
  totalAmount: number;
  tierBreakdown: Record<TierLevel, {
    count: number;
    principal: number;
    interest: number;
    total: number;
  }>;
  returnOnInvestment: number;
}

/**
 * Structure for the blockchain game investment
 */
export interface GameInvestment {
  investedAmount: number;
  returnRate: number;
  expectedReturn: number;
}