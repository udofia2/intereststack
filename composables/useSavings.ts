import { computed } from 'vue';
import { useSavingsStore } from '../stores/savings';
import { useStudentStore } from '../stores/student';
import type { GroupSavings, SavingsSummary, GameInvestment } from '../types/savings';
import { formatCurrency, formatPercentage } from '../utils/formatters';

/**
 * Composable for savings calculations and information
 */
export function useSavings() {
  // Stores
  const savingsStore = useSavingsStore();
  const studentStore = useStudentStore();
  
  // Computed properties
  const currentWeek = computed<number>(() => savingsStore.getCurrentWeek);
  
  const groupSavings = computed<GroupSavings>(() => savingsStore.getGroupSavings);
  
  const savingsSummary = computed<SavingsSummary>(() => savingsStore.getSavingsSummary);
  
  const gameInvestment = computed<GameInvestment>(() => savingsStore.getGameInvestment);
  
  const studentsWithFinancials = computed(() => 
    studentStore.getStudentsWithFinancials(currentWeek.value)
  );
  
  const totalSavedFormatted = computed<string>(() => 
    formatCurrency(groupSavings.value.totalPrincipal)
  );
  
  const totalInterestFormatted = computed<string>(() => 
    formatCurrency(groupSavings.value.totalInterest)
  );
  
  const totalAmountFormatted = computed<string>(() => 
    formatCurrency(groupSavings.value.totalAmount)
  );
  
  const returnOnInvestmentFormatted = computed<string>(() => 
    formatPercentage(savingsSummary.value.returnOnInvestment)
  );
  
  const expectedGameReturnFormatted = computed<string>(() => 
    formatCurrency(gameInvestment.value.expectedReturn)
  );
  
  const tierBreakdown = computed(() => {
    const { tierBreakdown } = savingsSummary.value;
    return Object.entries(tierBreakdown).map(([tierId, data]) => ({
      tierId: parseInt(tierId),
      count: data.count,
      principal: data.principal,
      principalFormatted: formatCurrency(data.principal),
      interest: data.interest,
      interestFormatted: formatCurrency(data.interest),
      total: data.total,
      totalFormatted: formatCurrency(data.total)
    }));
  });
  
  // Methods
  const advanceWeek = (): void => {
    savingsStore.advanceWeek();
  };
  
  const resetSimulation = (): void => {
    savingsStore.resetSimulation();
  };
  
  const calculateProjectedEarnings = (weeks: number): {
    principal: string;
    interest: string;
    total: string;
    gameReturn: string;
    grandTotal: string;
  } => {
    // Current values
    const principal = groupSavings.value.totalPrincipal;
    
    // Simple interest calculation for future weeks
    const weeklyInterestRate = 0.1; // Average of all tiers for simplicity
    const projectedInterest = principal * weeklyInterestRate * weeks;
    const projectedTotal = principal + projectedInterest;
    
    // Game return calculation
    const gameReturnRate = gameInvestment.value.returnRate / 100;
    const projectedGameReturn = projectedTotal * gameReturnRate;
    
    // Grand total
    const grandTotal = projectedTotal + projectedGameReturn;
    
    return {
      principal: formatCurrency(principal),
      interest: formatCurrency(projectedInterest),
      total: formatCurrency(projectedTotal),
      gameReturn: formatCurrency(projectedGameReturn),
      grandTotal: formatCurrency(grandTotal)
    };
  };
  
  return {
    // Computed
    currentWeek,
    groupSavings,
    savingsSummary,
    gameInvestment,
    studentsWithFinancials,
    totalSavedFormatted,
    totalInterestFormatted,
    totalAmountFormatted,
    returnOnInvestmentFormatted,
    expectedGameReturnFormatted,
    tierBreakdown,
    
    // Methods
    advanceWeek,
    resetSimulation,
    calculateProjectedEarnings
  };
}