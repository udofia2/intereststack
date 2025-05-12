import { TierLevel } from './tier';

/**
 * Unique identifier for a student
 */
export type StudentId = string;

/**
 * Status of a student in the savings group
 */
export enum StudentStatus {
  ACTIVE = 'active',
  WITHDRAWN = 'withdrawn'
}

/**
 * Core student information
 */
export interface StudentInfo {
  id: StudentId;
  name: string;
  tierId: TierLevel;
  joinedDate: Date;
  status: StudentStatus;
}

/**
 * Extended student information with financial calculations
 */
export interface StudentWithFinancials extends StudentInfo {
  principal: number;
  interestEarned: number;
  totalAmount: number;
  weeksActive: number;
}

/**
 * Student registration form data
 */
export interface StudentRegistrationData {
  name: string;
  tierId: TierLevel;
  amount: number;
}

/**
 * Structure for student withdrawal information
 */
export interface StudentWithdrawal {
  studentId: StudentId;
  withdrawalDate: Date;
  amountWithdrawn: number;
}