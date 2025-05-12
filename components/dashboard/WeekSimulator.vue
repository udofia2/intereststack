<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useSimulation } from '../../composables/useSimulation';
import { useSavings } from '../../composables/useSavings';
import { formatWeek, formatDate } from '../../utils/formatters';
import AppCard from '../common/AppCard.vue';
import AppButton from '../common/AppButton.vue';

// Composable setup
const { 
  currentWeek,
  isSimulating,
  autoSimulationEnabled,
  simulationSpeed,
  formattedWeek,
  formattedStartDate,
  formattedLastUpdated,
  advanceWeek,
  resetSimulation,
  toggleAutoSimulation,
  setSimulationSpeed
} = useSimulation();

const { groupSavings, savingsSummary } = useSavings();

// State
const speedOptions = [
  { value: 500, label: 'Fast (0.5s)' },
  { value: 1000, label: 'Normal (1s)' },
  { value: 2000, label: 'Slow (2s)' }
];
const selectedSpeed = ref(1000);

// Update simulation speed when selectedSpeed changes
watch(selectedSpeed, (newValue) => {
  setSimulationSpeed(newValue);
});

// Confirm reset
const showResetConfirm = ref(false);

const confirmReset = () => {
  resetSimulation();
  showResetConfirm.value = false;
};

const handleResetClick = () => {
  if (currentWeek.value > 0) {
    showResetConfirm.value = true;
  } else {
    resetSimulation();
  }
};
</script>

<template>
  <AppCard title="Weekly Simulation" variant="primary" shadow>
    <div class="space-y-6">
      <!-- Week indicator -->
      <div class="text-center">
        <div class="text-sm text-gray-500">Current Week</div>
        <div class="text-4xl font-bold text-blue-700">{{ formattedWeek }}</div>
        <div class="mt-2 text-xs text-gray-500">
          Started: {{ formattedStartDate }} | Last Updated: {{ formattedLastUpdated }}
        </div>
      </div>
      
      <!-- Simulation controls -->
      <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
        <AppButton
          variant="success"
          :disabled="isSimulating"
          :loading="isSimulating"
          @click="advanceWeek"
        >
          <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Advance Week
        </AppButton>
        
        <AppButton
          :variant="autoSimulationEnabled ? 'danger' : 'primary'"
          @click="toggleAutoSimulation"
        >
          <template v-if="autoSimulationEnabled">
            <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Stop Auto Simulation
          </template>
          <template v-else>
            <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Auto Simulation
          </template>
        </AppButton>
        
        <AppButton
          variant="secondary"
          @click="handleResetClick"
        >
          <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Simulation
        </AppButton>
      </div>
      
      <!-- Speed selector (only shown when auto simulation is enabled) -->
      <div v-if="autoSimulationEnabled" class="text-center">
        <label for="simulationSpeed" class="block text-sm font-medium text-gray-700">
          Simulation Speed
        </label>
        <div class="mt-1">
          <select
            id="simulationSpeed"
            v-model="selectedSpeed"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option v-for="option in speedOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Weekly summary -->
      <div class="border-t border-gray-200 pt-4">
        <h3 class="text-sm font-medium text-gray-700">Weekly Summary</h3>
        <div class="mt-2 grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Interest Generated</p>
            <p class="text-lg font-medium text-green-600">
              {{ formatCurrency(groupSavings.totalInterest) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Return on Investment</p>
            <p class="text-lg font-medium text-blue-600">
              {{ formatPercentage(savingsSummary.returnOnInvestment) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Reset confirmation dialog -->
    <div v-if="showResetConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900">Reset Simulation?</h3>
        <p class="mt-2 text-sm text-gray-500">
          Are you sure you want to reset the simulation? This will set the current week back to 0 and reset all accumulated interest.
        </p>
        <div class="mt-4 flex justify-end space-x-2">
          <AppButton variant="light" @click="showResetConfirm = false">
            Cancel
          </AppButton>
          <AppButton variant="danger" @click="confirmReset">
            Reset
          </AppButton>
        </div>
      </div>
    </div>
  </AppCard>
</template>