import { defineStore } from 'pinia';
import { TierLevel, TierAmount, TierInterestRate, type TierInfo } from '../types/tier';
import { getTierAmount, getTierInterestRate } from '../utils/calculations';
import { getTierName, getTierDescription } from '../utils/formatters';

interface TierState {
  tiers: TierInfo[];
  selectedTier: TierLevel | null;
}

export const useTierStore = defineStore('tier', {
  state: (): TierState => ({
    tiers: [
      {
        id: TierLevel.TIER_1,
        name: getTierName(TierLevel.TIER_1),
        amount: TierAmount.TIER_1,
        interestRatePerWeek: TierInterestRate.TIER_1,
        description: getTierDescription(TierLevel.TIER_1)
      },
      {
        id: TierLevel.TIER_2,
        name: getTierName(TierLevel.TIER_2),
        amount: TierAmount.TIER_2,
        interestRatePerWeek: TierInterestRate.TIER_2,
        description: getTierDescription(TierLevel.TIER_2)
      },
      {
        id: TierLevel.TIER_3,
        name: getTierName(TierLevel.TIER_3),
        amount: TierAmount.TIER_3,
        interestRatePerWeek: TierInterestRate.TIER_3,
        description: getTierDescription(TierLevel.TIER_3)
      }
    ],
    selectedTier: null
  }),

  getters: {
    /**
     * Get all available tiers
     */
    getAllTiers: (state) => state.tiers,
    
    /**
     * Get a tier by ID
     */
    getTierById: (state) => (tierId: TierLevel): TierInfo | undefined => {
      return state.tiers.find(tier => tier.id === tierId);
    },
    
    /**
     * Get the currently selected tier
     */
    getSelectedTier: (state): TierInfo | undefined => {
      if (state.selectedTier === null) return undefined;
      return state.tiers.find(tier => tier.id === state.selectedTier);
    },
    
    /**
     * Check if a tier is valid based on ID
     */
    isTierValid: (state) => (tierId: TierLevel): boolean => {
      return state.tiers.some(tier => tier.id === tierId);
    }
  },

  actions: {
    /**
     * Select a tier
     */
    selectTier(tierId: TierLevel) {
      if (this.isTierValid(tierId)) {
        this.selectedTier = tierId;
      }
    },
    
    /**
     * Clear the selected tier
     */
    clearSelectedTier() {
      this.selectedTier = null;
    },
    
    /**
     * Get the expected amount for a tier
     */
    getExpectedAmount(tierId: TierLevel): number {
      return getTierAmount(tierId);
    },
    
    /**
     * Get the interest rate for a tier
     */
    getInterestRate(tierId: TierLevel): number {
      return getTierInterestRate(tierId);
    }
  }
});