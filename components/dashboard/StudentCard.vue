<script setup lang="ts">

import type { StudentWithFinancials } from '../../types/student';
import { formatCurrency, formatPercentage, getTierName } from '../../utils/formatters';
import AppButton from '../common/AppButton.vue';
import AppCard from '../common/AppCard.vue';

// Props definition
interface Props {
  student: StudentWithFinancials;
  currentWeek: number;
}

// Define props
const props = defineProps<Props>();

// Define emits
const emit = defineEmits<{
  (e: 'withdraw', studentId: string): void;
}>();

// Computed properties
const isActive = computed(() => props.student.status === 'active');
const interestRate = computed(() => {
  switch (props.student.tierId) {
    case 1: return 5;
    case 2: return 10;
    case 3: return 20;
    default: return 0;
  }
});

const interestRateFormatted = computed(() => formatPercentage(interestRate.value));
const principalFormatted = computed(() => formatCurrency(props.student.principal));
const interestEarnedFormatted = computed(() => formatCurrency(props.student.interestEarned));
const totalAmountFormatted = computed(() => formatCurrency(props.student.totalAmount));
const tierName = computed(() => getTierName(props.student.tierId));

// Return on investment percentage
const roi = computed(() => {
  if (props.student.principal === 0) return 0;
  return (props.student.interestEarned / props.student.principal) * 100;
});
const roiFormatted = computed(() => formatPercentage(roi.value));

// Methods
const handleWithdraw = () => {
  emit('withdraw', props.student.id);
};
</script>

<template>
  <AppCard 
    :variant="isActive ? 'default' : 'secondary'"
    shadow
    hover
    :class="{ 'opacity-75': !isActive }"
  >
    <div class="flex items-start justify-between">
      <div>
        <h3 class="text-lg font-medium text-gray-900">
          {{ student.name }}
          <span v-if="!isActive" class="text-sm font-normal text-gray-500">(Withdrawn)</span>
        </h3>
        <p class="text-sm text-gray-500">{{ tierName }} - {{ interestRateFormatted }} weekly</p>
      </div>
      <span 
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="{
          'bg-green-100 text-green-800': isActive,
          'bg-gray-100 text-gray-800': !isActive
        }"
      >
        {{ isActive ? 'Active' : 'Withdrawn' }}
      </span>
    </div>
    
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">Principal</p>
          <p class="text-lg font-medium">{{ principalFormatted }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Interest Earned</p>
          <p class="text-lg font-medium text-green-600">{{ interestEarnedFormatted }}</p>
        </div>
      </div>
      
      <div class="mt-4">
        <p class="text-sm text-gray-500">Total Value</p>
        <p class="text-xl font-semibold text-blue-600">{{ totalAmountFormatted }}</p>
        <p class="text-xs text-gray-500">Return on Investment: {{ roiFormatted }}</p>
      </div>
      
      <!-- Progress bar for ROI visualization -->
      <div class="mt-2">
        <div class="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            class="bg-green-600 h-1.5 rounded-full" 
            :style="{ width: `${Math.min(100, roi)}%` }"
          ></div>
        </div>
      </div>
      
      <div class="mt-4" v-if="isActive && currentWeek > 0">
        <AppButton
          variant="danger"
          size="sm"
          class="w-full"
          @click="handleWithdraw"
        >
          Withdraw Funds
        </AppButton>
      </div>
    </div>
  </AppCard>
</template>