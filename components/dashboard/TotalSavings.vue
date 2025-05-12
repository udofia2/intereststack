<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useSavingsStore } from '../../stores/savings';
import { useStudentStore } from '../../stores/student';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import AppCard from '../common/AppCard.vue';

// Store setup
const savingsStore = useSavingsStore();
const studentStore = useStudentStore();

// Computed properties
const groupSavings = computed(() => savingsStore.getGroupSavings);
const savingsSummary = computed(() => savingsStore.getSavingsSummary);
const gameInvestment = computed(() => savingsStore.getGameInvestment);
const activeStudentCount = computed(() => studentStore.getActiveStudentCount);

// Formatted values
const totalSavingsFormatted = computed(() => formatCurrency(groupSavings.value.totalAmount));
const totalPrincipalFormatted = computed(() => formatCurrency(groupSavings.value.totalPrincipal));
const totalInterestFormatted = computed(() => formatCurrency(groupSavings.value.totalInterest));
const returnOnInvestmentFormatted = computed(() => formatPercentage(savingsSummary.value.returnOnInvestment));
const gameReturnRateFormatted = computed(() => formatPercentage(gameInvestment.value.returnRate));
const gameExpectedReturnFormatted = computed(() => formatCurrency(gameInvestment.value.expectedReturn));

// Animation refs and logic for counters
const animatedTotalSavings = ref('₦0.00');
const animatedTotalInterest = ref('₦0.00');
const animatedGameReturn = ref('₦0.00');

// Function to animate a counter from 0 to target value
const animateCounter = (
  startValue: number, 
  endValue: number, 
  duration: number, 
  updateFn: (value: string) => void
) => {
  const startTime = performance.now();
  
  const updateCounter = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    
    // Easing function for smoother animation
    const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    
    const currentValue = startValue + (endValue - startValue) * easedProgress;
    updateFn(formatCurrency(currentValue));
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };
  
  requestAnimationFrame(updateCounter);
};

// Run animations when component is mounted
onMounted(() => {
  // Start animations from 0 to actual values over 1.5 seconds
  animateCounter(0, groupSavings.value.totalAmount, 1500, value => animatedTotalSavings.value = value);
  animateCounter(0, groupSavings.value.totalInterest, 1800, value => animatedTotalInterest.value = value);
  animateCounter(0, gameInvestment.value.expectedReturn, 2000, value => animatedGameReturn.value = value);
});
</script>

<template>
  <div class="space-y-6">
    <!-- Main metrics cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Total Savings -->
      <AppCard
        title="Total Savings"
        variant="primary"
        shadow
        hover
      >
        <div class="flex flex-col">
          <div class="text-3xl font-bold text-blue-700">{{ animatedTotalSavings }}</div>
          <div class="mt-2 flex items-baseline text-sm">
            <div class="text-green-600 font-medium">
              {{ totalInterestFormatted }} interest
            </div>
            <div class="ml-1 text-gray-500">
              on {{ totalPrincipalFormatted }} principal
            </div>
          </div>
          
          <!-- Progress bar representing the interest to principal ratio -->
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-green-600 h-2.5 rounded-full"
                :style="{
                  width: `${Math.min(100, (groupSavings.totalInterest / groupSavings.totalPrincipal) * 100)}%`
                }"
              ></div>
            </div>
            <div class="mt-1 flex justify-between text-xs text-gray-500">
              <div>Principal</div>
              <div>Interest: {{ returnOnInvestmentFormatted }}</div>
            </div>
          </div>
        </div>
      </AppCard>
      
      <!-- Game Investment -->
      <AppCard
        title="Game Investment Return"
        subtitle="Play-to-Earn Blockchain Game"
        variant="success"
        shadow
        hover
      >
        <div class="flex flex-col">
          <div class="text-3xl font-bold text-green-700">{{ animatedGameReturn }}</div>
          <div class="mt-2 flex items-baseline text-sm">
            <div class="text-green-600 font-medium">
              {{ gameReturnRateFormatted }} return rate
            </div>
            <div class="ml-1 text-gray-500">
              on {{ totalSavingsFormatted }} investment
            </div>
          </div>
          
          <!-- Visual representation of the game return -->
          <div class="mt-4 relative pt-1">
            <div class="flex mb-2 items-center justify-between">
              <div>
                <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  Yield
                </span>
              </div>
            </div>
            <div class="flex h-4 mb-4 overflow-hidden bg-gray-200 rounded-lg">
              <div
                class="flex flex-col justify-center bg-green-500 text-xs text-white text-center whitespace-nowrap px-2"
                :style="{ width: `${gameInvestment.returnRate}%` }"
              >
                {{ gameReturnRateFormatted }}
              </div>
            </div>
          </div>
        </div>
      </AppCard>
      
      <!-- Member Stats -->
      <AppCard
        title="Member Statistics"
        variant="info"
        shadow
        hover
      >
        <div class="flex flex-col">
          <div class="text-3xl font-bold text-gray-800">{{ activeStudentCount }}/12</div>
          <div class="mt-2 text-sm text-gray-600">
            Active members in the savings group
          </div>
          
          <!-- Member capacity visualized -->
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-blue-600 h-2.5 rounded-full"
                :style="{ width: `${(activeStudentCount / 12) * 100}%` }"
              ></div>
            </div>
            <div class="mt-1 flex justify-between text-xs text-gray-500">
              <div>Current Members</div>
              <div>Capacity: 12</div>
            </div>
          </div>
          
          <!-- Tier breakdown -->
          <div class="mt-4 space-y-2">
            <div class="text-sm font-medium text-gray-700">Members by Tier</div>
            <div class="grid grid-cols-3 gap-2">
              <div 
                v-for="(tierData, tierId) in savingsSummary.tierBreakdown"
                :key="tierId"
                class="bg-gray-100 rounded p-2 text-center"
              >
                <div class="text-xs text-gray-500">Tier {{ tierId }}</div>
                <div class="text-base font-semibold text-gray-800">{{ tierData.count }}</div>
              </div>
            </div>
          </div>
        </div>
      </AppCard>
    </div>
    
    <!-- Additional details card -->
    <AppCard title="Financial Overview" shadow>
      <div class="divide-y divide-gray-200">
        <div class="py-3 flex justify-between">
          <span class="text-gray-600">Total Principal</span>
          <span class="font-medium">{{ totalPrincipalFormatted }}</span>
        </div>
        <div class="py-3 flex justify-between">
          <span class="text-gray-600">Total Interest</span>
          <span class="font-medium text-green-600">{{ totalInterestFormatted }}</span>
        </div>
        <div class="py-3 flex justify-between">
          <span class="text-gray-600">Return on Investment</span>
          <span class="font-medium text-blue-600">{{ returnOnInvestmentFormatted }}</span>
        </div>
        <div class="py-3 flex justify-between">
          <span class="text-gray-600">Game Investment Return</span>
          <span class="font-medium text-green-600">{{ gameExpectedReturnFormatted }}</span>
        </div>
        <div class="py-3 flex justify-between">
          <span class="text-gray-600">Game Return Rate</span>
          <span class="font-medium">{{ gameReturnRateFormatted }}</span>
        </div>
        <div class="py-3 flex justify-between">
          <span class="text-gray-600">Total Potential Returns</span>
          <span class="font-medium text-blue-700">
            {{ formatCurrency(groupSavings.totalAmount + gameInvestment.expectedReturn) }}
          </span>
        </div>
      </div>
    </AppCard>
  </div>
</template>