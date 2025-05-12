<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTierStore } from '../../stores/tier';
import { useTierValidation } from '../../composables/useTierValidation';
import { TierLevel, type TierInfo, type TierSelection } from '../../types/tier';
import { formatCurrency } from '../../utils/formatters';
import ValidationMessage from './ValidationMessage.vue';
import AppCard from '../common/AppCard.vue';

// Props definition
interface Props {
  modelValue?: TierSelection;
  error?: string;
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    tierId: TierLevel.TIER_1,
    amount: 10000,
    isValid: true
  }),
  error: ''
});

// Define emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: TierSelection): void;
  (e: 'tier-selected', tierId: TierLevel, amount: number): void;
}>();

// Use tier store and validation composable
const tierStore = useTierStore();
const { 
  selectedTierId, 
  enteredAmount, 
  validationError,
  tiers,
  isAmountValid,
  selectTier,
  setAmount,
  validateSelection
} = useTierValidation();

// Local state
const selectedTier = ref<TierLevel | null>(props.modelValue.tierId);
const amountInput = ref<number>(props.modelValue.amount);

// Computed properties
const formattedAmounts = computed(() => {
  return tiers.value.map(tier => ({
    id: tier.id,
    formatted: formatCurrency(tier.amount)
  }));
});

// Initialize with props
selectedTierId.value = props.modelValue.tierId;
enteredAmount.value = props.modelValue.amount;

// Watch for changes in local state and emit events
watch([selectedTierId, enteredAmount, isAmountValid], () => {
  if (selectedTierId.value !== null) {
    const selection: TierSelection = {
      tierId: selectedTierId.value,
      amount: enteredAmount.value,
      isValid: isAmountValid.value
    };
    
    emit('update:modelValue', selection);
    
    if (isAmountValid.value) {
      emit('tier-selected', selectedTierId.value, enteredAmount.value);
    }
  }
});

// Handler for tier selection
const handleTierSelect = (tierId: TierLevel) => {
  selectTier(tierId);
  selectedTier.value = tierId;
  
  // Automatically set the correct amount for the tier
  const tier = tiers.value.find(t => t.id === tierId);
  if (tier) {
    amountInput.value = tier.amount;
    setAmount(tier.amount);
  }
};

// Handler for amount input
const handleAmountInput = (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement).value);
  if (!isNaN(value)) {
    amountInput.value = value;
    setAmount(value);
  }
};
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <AppCard
        v-for="tier in tiers"
        :key="tier.id"
        :variant="selectedTierId === tier.id ? 'primary' : 'default'"
        hover
        class="cursor-pointer transition-all"
        @click="handleTierSelect(tier.id)"
      >
        <div class="flex flex-col items-center text-center p-4">
          <h3 class="text-lg font-semibold">{{ tier.name }}</h3>
          <p class="text-2xl font-bold mt-2">{{ formatCurrency(tier.amount) }}</p>
          <p class="text-sm mt-1">{{ tier.interestRatePerWeek }}% weekly interest</p>
          <div class="mt-3 w-full">
            <div class="h-2 bg-gray-200 rounded-full">
              <div 
                class="h-2 rounded-full bg-blue-600" 
                :style="{ width: `${tier.interestRatePerWeek * 5}%` }"
              ></div>
            </div>
          </div>
          <p class="text-xs text-gray-600 mt-2">{{ tier.description }}</p>
        </div>
      </AppCard>
    </div>

    <div class="mt-4">
      <label for="amount" class="block text-sm font-medium text-gray-700">
        Savings Amount
      </label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-gray-500 sm:text-sm">₦</span>
        </div>
        <input
          type="number"
          id="amount"
          name="amount"
          :value="amountInput"
          @input="handleAmountInput"
          class="block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
          :class="{ 'border-red-300': validationError || props.error }"
          aria-describedby="amount-error"
        />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span class="text-gray-500 sm:text-sm">NGN</span>
        </div>
      </div>
      
      <ValidationMessage 
        :message="validationError || props.error" 
        type="error" 
        :visible="!!(validationError || props.error)"
      />
      
      <p v-if="selectedTierId !== null" class="mt-2 text-sm text-gray-600">
        The selected tier requires exactly {{ formattedAmounts.find(item => item.id === selectedTierId)?.formatted }}.
      </p>
    </div>
  </div>
</template>