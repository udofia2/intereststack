<script setup lang="ts">

import { useUIStore } from '../../stores/ui';
import { useSavingsStore } from '../../stores/savings';
import { useStudentStore } from '../../stores/student';
import { formatCurrency, formatPercentage, formatWeek } from '../../utils/formatters';
import AppButton from '../common/AppButton.vue';

const router = useRouter();


const uiStore = useUIStore();
const savingsStore = useSavingsStore();
const studentStore = useStudentStore();

const isCollapsed = ref(false);

const currentWeek = computed(() => savingsStore.getCurrentWeek);
const groupSavings = computed(() => savingsStore.getGroupSavings);
const activeStudentCount = computed(() => studentStore.getActiveStudentCount);
const gameInvestment = computed(() => savingsStore.getGameInvestment);

const totalSavingsFormatted = computed(() => formatCurrency(groupSavings.value.totalAmount));
const totalPrincipalFormatted = computed(() => formatCurrency(groupSavings.value.totalPrincipal));
const totalInterestFormatted = computed(() => formatCurrency(groupSavings.value.totalInterest));
const formattedWeek = computed(() => formatWeek(currentWeek.value));
const gameReturnRateFormatted = computed(() => formatPercentage(gameInvestment.value.returnRate));
const gameExpectedReturnFormatted = computed(() => formatCurrency(gameInvestment.value.expectedReturn));

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const setActiveView = (view: 'registration' | 'dashboard') => {
  uiStore.setActiveView(view);
    if(view === 'registration') {
    router.push('/register');
  } else {
    router.push('/dashboard')
  }
};
</script>

<template>
  <aside
    class="bg-white border-r border-gray-200 transition-all duration-300"
    :class="{ 'w-64': !isCollapsed, 'w-20': isCollapsed }"
  >
    <div class="h-full flex flex-col">
      <!-- Sidebar header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div v-if="!isCollapsed" class="flex items-center">
          <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="ml-2 font-bold text-gray-900">InterestStack</span>
        </div>
        <button
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
          @click="toggleSidebar"
        >
          <svg v-if="isCollapsed" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto">
        <div class="px-2 py-4 space-y-1">
          <!-- Dashboard link -->
          <button
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
            :class="[
              uiStore.getCurrentView === 'dashboard'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
            @click="setActiveView('dashboard')"
          >
            <svg class="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span v-if="!isCollapsed">Dashboard</span>
          </button>
          
          <!-- Registration link -->
          <button
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
            :class="[
              uiStore.getCurrentView === 'registration'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
            @click="setActiveView('registration')"
          >
            <svg class="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span v-if="!isCollapsed">Registration</span>
          </button>
        </div>
      </nav>
      
      <!-- Sidebar footer with stats -->
      <div class="border-t border-gray-200 p-4">
        <div v-if="!isCollapsed" class="space-y-4">
          <!-- Current week -->
          <div>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Current Week
            </h3>
            <p class="mt-1 text-lg font-medium text-blue-600">{{ formattedWeek }}</p>
          </div>
          
          <!-- Members -->
          <div>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Members
            </h3>
            <p class="mt-1 flex items-baseline">
              <span class="text-lg font-medium text-gray-900">{{ activeStudentCount }}</span>
              <span class="ml-1 text-sm text-gray-500">/ 12</span>
            </p>
          </div>
          
          <!-- Total savings -->
          <div>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Savings
            </h3>
            <p class="mt-1 text-lg font-medium text-gray-900">{{ totalSavingsFormatted }}</p>
            <div class="mt-1 flex text-sm">
              <span class="text-green-500">{{ totalInterestFormatted }}</span>
              <span class="mx-1 text-gray-500">+</span>
              <span class="text-gray-500">{{ totalPrincipalFormatted }}</span>
            </div>
          </div>
          
          <!-- Game investment -->
          <div>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Game Return ({{ gameReturnRateFormatted }})
            </h3>
            <p class="mt-1 text-lg font-medium text-green-600">{{ gameExpectedReturnFormatted }}</p>
          </div>
        </div>
        
        <div v-else class="flex flex-col items-center space-y-4">
          <div class="text-center">
            <p class="text-lg font-medium text-blue-600">W{{ currentWeek }}</p>
          </div>
          <div class="text-center">
            <p class="text-lg font-medium text-gray-900">{{ activeStudentCount }}/12</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>