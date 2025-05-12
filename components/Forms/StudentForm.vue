<script setup lang="ts">

import { useStudentStore } from '../../stores/student';
import { useUIStore } from '../../stores/ui';
import { useStudents } from '../../composables/useStudents';
import { TierLevel, type TierSelection } from '~/types/tier';
import type { StudentRegistrationData, StudentInfo } from '~/types/student';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateWeeklyInterest } from '../../utils/calculations';
import AppButton from '../common/AppButton.vue'; 
import AppCard from '../common/AppCard.vue';
import ValidationMessage from './ValidationMessage.vue';
import TierSelector from './TierSelector.vue';

// Store and composable setup
const studentStore = useStudentStore();
const uiStore = useUIStore();
const { amountInput, newStudentName, selectedTierId, registerStudent, isGroupFull, canRegisterMore, availableSpots } = useStudents();

// Form state
const form = reactive<{
  name: string;
  tierSelection: TierSelection;
  errors: Record<string, string>;
  isSubmitting: boolean;
}>({
  name: '',
  tierSelection: {
    tierId: TierLevel.TIER_1,
    amount: 10000,
    isValid: true
  },
  errors: {},
  isSubmitting: false
});

// Computed values for the form
const weeklyInterest = computed(() => {
  if (!form.tierSelection.isValid) return 0;
  
  const { interestAmount } = calculateWeeklyInterest(
    form.tierSelection.tierId,
    form.tierSelection.amount
  );
  
  return interestAmount;
});

const totalWithdrawal = computed(() => {
  if (!form.tierSelection.isValid) return 0;
  
  const { totalAmount } = calculateWeeklyInterest(
    form.tierSelection.tierId,
    form.tierSelection.amount
  );
  
  return totalAmount;
});

const interestRate = computed(() => {
  switch (form.tierSelection.tierId) {
    case TierLevel.TIER_1:
      return 5;
    case TierLevel.TIER_2:
      return 10;
    case TierLevel.TIER_3:
      return 20;
    default:
      return 0;
  }
});

const isFormValid = computed(() => {
  return (
    form.name.trim().length >= 2 &&
    form.tierSelection.isValid &&
    canRegisterMore.value
  );
});

// Form validation
const validateForm = (): boolean => {
  form.errors = {};
  
  if (!form.name.trim()) {
    form.errors.name = 'Name is required';
  } else if (form.name.trim().length < 2) {
    form.errors.name = 'Name must be at least 2 characters long';
  }
  
  if (!form.tierSelection.isValid) {
    form.errors.tier = 'Please select a valid tier and amount';
  }
  
  if (isGroupFull.value) {
    form.errors.general = 'The savings group is full';
  }
  
  return Object.keys(form.errors).length === 0;
};

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) return;
  
  form.isSubmitting = true;
  
  try {
    const registrationData: StudentRegistrationData = {
      name: form.name.trim(),
      tierId: form.tierSelection.tierId,
      amount: form.tierSelection.amount
    };

    newStudentName.value = form.name;
    selectedTierId.value = form.tierSelection.tierId;
    amountInput.value = form.tierSelection.amount;
    const student = await registerStudent();
    console.log(student)
    if (student) {
      // Reset form
      form.name = '';
      form.tierSelection = {
        tierId: TierLevel.TIER_1,
        amount: 10000,
        isValid: true
      };
      
      // Show success notification
      uiStore.showSuccess(`${student.name} has been successfully registered!`);
      
      // Switch to dashboard view if enabled
      uiStore.setActiveView('dashboard');
    }
  } catch (error) {
    form.errors.general = 'An error occurred during registration';
    console.log(error)
    uiStore.showError('Failed to register student');
  } finally {
    form.isSubmitting = false;
  }
};

const resetForm = () => {
  form.name = '';
  form.tierSelection = {
    tierId: TierLevel.TIER_1,
    amount: 10000,
    isValid: true
  };
  form.errors = {};
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="isGroupFull" class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            The savings group is currently full. Please wait until a spot becomes available.
          </p>
        </div>
      </div>
    </div>
    
    <div v-else-if="availableSpots < 5" class="bg-blue-50 border-l-4 border-blue-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700">
            Only {{ availableSpots }} {{ availableSpots === 1 ? 'spot' : 'spots' }} left in the savings group. 
            Register now to secure your place!
          </p>
        </div>
      </div>
    </div>
    
    <!-- Name Input -->
    <div class="mb-4">
      <label for="name" class="block text-sm font-medium text-gray-700">
        Full Name
      </label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        :class="{ 'border-red-300': form.errors.name }"
        placeholder="Enter your full name"
        required
      />
      
      <ValidationMessage 
        :message="form.errors.name" 
        type="error" 
        :visible="!!form.errors.name"
      />
    </div>
    
    <!-- Tier Selector -->
    <div class="mb-4">
      <h3 class="text-lg font-medium text-gray-900 mb-2">Select Savings Tier</h3>
      <TierSelector 
        v-model="form.tierSelection"
        :error="form.errors.tier"
      />
    </div>
    
    <!-- Interest Calculation Preview -->
    <AppCard v-if="form.tierSelection.isValid" title="Weekly Earnings Preview" class="mb-4">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Principal Amount</p>
            <p class="text-lg font-semibold">{{ formatCurrency(form.tierSelection.amount) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Interest Rate</p>
            <p class="text-lg font-semibold">{{ formatPercentage(interestRate) }} per week</p>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Weekly Interest</p>
            <p class="text-lg font-semibold text-green-600">{{ formatCurrency(weeklyInterest) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Amount after 1 week</p>
            <p class="text-lg font-semibold text-blue-600">{{ formatCurrency(totalWithdrawal) }}</p>
          </div>
        </div>
      </div>
    </AppCard>
    
    <!-- General Error Message -->
    <ValidationMessage 
      :message="form.errors.general" 
      type="error" 
      :visible="!!form.errors.general"
    />
    
    <!-- Submit Button -->
    <div class="flex justify-end">
      <AppButton
        type="button"
        variant="light"
        class="mr-2"
        @click="resetForm"
      >
        Reset
      </AppButton>
      
      <AppButton
        type="submit"
        variant="primary"
        :disabled="!isFormValid || form.isSubmitting"
        :loading="form.isSubmitting"
      >
        Register
      </AppButton>
    </div>
  </form>
</template>