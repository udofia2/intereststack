import { ref, computed } from 'vue';
import { useTierStore } from '../stores/tier';
import { validateTierAmount } from '../utils/validators';
import { getTierAmount } from '../utils/calculations';
import { TierLevel, type TierSelection, type TierInfo } from '../types/tier';


/**
 * Composable for tier validation and selection
 */
export function useTierValidation() {
  const tierStore = useTierStore();
  
  // State
  const selectedTierId = ref<TierLevel | null>(null);
  const enteredAmount = ref<number>(0);
  const validationError = ref<string | null>(null);
  
  // Computed properties
  const tiers = computed<TierInfo[]>(() => tierStore.getAllTiers);
  
  const selectedTier = computed<TierInfo | undefined>(() => {
    if (selectedTierId.value === null) return undefined;
    return tierStore.getTierById(selectedTierId.value);
  });
  
  const expectedAmount = computed<number>(() => {
    if (selectedTierId.value === null) return 0;
    return getTierAmount(selectedTierId.value);
  });
  
  const isAmountValid = computed<boolean>(() => {
    if (selectedTierId.value === null) return false;
    return validateTierAmount(selectedTierId.value, enteredAmount.value);
  });
  
  const tierSelection = computed<TierSelection>(() => {
    return {
      tierId: selectedTierId.value || TierLevel.TIER_1,
      amount: enteredAmount.value,
      isValid: isAmountValid.value
    };
  });
  
  // Methods
  const selectTier = (tierId: TierLevel): void => {
    selectedTierId.value = tierId;
    
    // Auto-fill the expected amount
    enteredAmount.value = getTierAmount(tierId);
    
    // Set in store as well
    tierStore.selectTier(tierId);
    
    // Clear any validation errors
    validationError.value = null;
  };
  
  const setAmount = (amount: number): void => {
    enteredAmount.value = amount;
    
    // Validate the amount
    if (selectedTierId.value !== null) {
      if (!validateTierAmount(selectedTierId.value, amount)) {
        const expected = getTierAmount(selectedTierId.value);
        validationError.value = `Amount must be exactly ₦${expected.toLocaleString()} for the selected tier`;
      } else {
        validationError.value = null;
      }
    }
  };
  
  const resetTierSelection = (): void => {
    selectedTierId.value = null;
    enteredAmount.value = 0;
    validationError.value = null;
    tierStore.clearSelectedTier();
  };
  
  const validateSelection = (): boolean => {
    if (selectedTierId.value === null) {
      validationError.value = 'Please select a tier';
      return false;
    }
    
    if (!validateTierAmount(selectedTierId.value, enteredAmount.value)) {
      const expected = getTierAmount(selectedTierId.value);
      validationError.value = `Amount must be exactly ₦${expected.toLocaleString()} for the selected tier`;
      return false;
    }
    
    validationError.value = null;
    return true;
  };
  
  return {
    // State
    selectedTierId,
    enteredAmount,
    validationError,
    
    // Computed
    tiers,
    selectedTier,
    expectedAmount,
    isAmountValid,
    tierSelection,
    
    // Methods
    selectTier,
    setAmount,
    resetTierSelection,
    validateSelection
  };
}