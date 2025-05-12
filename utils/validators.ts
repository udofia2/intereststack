import { TierLevel, TierAmount } from '../types/tier';
import type { StudentRegistrationData } from '../types/student';

/**
 * Validate if the provided amount matches the expected tier amount
 * @param tierId The tier level
 * @param amount The amount to validate
 * @returns Boolean indicating if the amount is valid for the tier
 */
export const validateTierAmount = (tierId: TierLevel, amount: number): boolean => {
  let expectedAmount: number;
  
  switch (tierId) {
    case TierLevel.TIER_1:
      expectedAmount = TierAmount.TIER_1;
      break;
    case TierLevel.TIER_2:
      expectedAmount = TierAmount.TIER_2;
      break;
    case TierLevel.TIER_3:
      expectedAmount = TierAmount.TIER_3;
      break;
    default:
      return false;
  }
  
  return amount === expectedAmount;
};

/**
 * Validate student registration data
 * @param data Student registration form data
 * @returns Validation result with errors if any
 */
export const validateStudentRegistration = (data: StudentRegistrationData): { 
  isValid: boolean; 
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  
  // Validate name
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  // Validate tier selection
  if (!data.tierId) {
    errors.tierId = 'Please select a savings tier';
  }
  
  // Validate amount based on selected tier
  if (!data.amount) {
    errors.amount = 'Amount is required';
  } else if (!validateTierAmount(data.tierId, data.amount)) {
    let expectedAmount: number;
    
    switch (data.tierId) {
      case TierLevel.TIER_1:
        expectedAmount = TierAmount.TIER_1;
        break;
      case TierLevel.TIER_2:
        expectedAmount = TierAmount.TIER_2;
        break;
      case TierLevel.TIER_3:
        expectedAmount = TierAmount.TIER_3;
        break;
      default:
        expectedAmount = 0;
    }
    
    errors.amount = `Amount must be exactly ₦${expectedAmount.toLocaleString()} for the selected tier`;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Check if the group has reached maximum capacity
 * @param currentCount Current number of members
 * @param maxCapacity Maximum allowed members (default: 12)
 * @returns Boolean indicating if group is full
 */
export const isGroupFull = (currentCount: number, maxCapacity: number = 12): boolean => {
  return currentCount >= maxCapacity;
};

/**
 * Check if a student withdrawal is valid
 * @param weeksActive Number of weeks the student has been active
 * @param currentWeek Current simulation week
 * @returns Boolean indicating if withdrawal is valid
 */
export const canWithdraw = (weeksActive: number, currentWeek: number): boolean => {
  // Students can withdraw after they've been active for at least a week
  return weeksActive > 0 && currentWeek > 0;
};