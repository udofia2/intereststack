<script setup lang="ts">

import { useUIStore } from '../../stores/ui';
import { useSavingsStore } from '../../stores/savings';
import { useStudentStore } from '../../stores/student';
import { formatCurrency } from '../../utils/formatters';
import AppButton from '../common/AppButton.vue';

// Store setup
const uiStore = useUIStore();
const savingsStore = useSavingsStore();
const studentStore = useStudentStore();

// State
const isMobileMenuOpen = ref(false);

// Computed properties
const currentView = computed(() => uiStore.getCurrentView);
const groupSavings = computed(() => savingsStore.getGroupSavings);
const activeStudentCount = computed(() => studentStore.getActiveStudentCount);
const availableSpots = computed(() => studentStore.getAvailableSpots);

// Formatted values
const totalSavingsFormatted = computed(() => formatCurrency(groupSavings.value.totalAmount));

// Methods
const setActiveView = (view: 'registration' | 'dashboard') => {
  uiStore.setActiveView(view);
  isMobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and desktop navigation -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <div class="flex items-center">
              <!-- Logo -->
              <svg class="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="ml-2 text-xl font-bold text-gray-900">InterestStack</span>
            </div>
          </div>
          <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <!-- Desktop navigation links -->
            <button
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-blue-500 text-blue-600': currentView === 'registration' }"
              @click="setActiveView('registration')"
            >
              Registration
            </button>
            <button
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-blue-500 text-blue-600': currentView === 'dashboard' }"
              @click="setActiveView('dashboard')"
            >
              Dashboard
            </button>
          </nav>
        </div>
        
        <!-- Savings summary and mobile menu button -->
        <div class="flex items-center">
          <div class="hidden md:flex items-center space-x-4">
            <!-- Member count -->
            <div class="flex items-center">
              <svg class="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-700">
                {{ activeStudentCount }}/12 Members
              </span>
            </div>
            
            <!-- Total savings -->
            <div class="flex items-center">
              <svg class="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-700">
                {{ totalSavingsFormatted }}
              </span>
            </div>
          </div>
          
          <!-- Mobile menu button -->
          <div class="flex items-center sm:hidden ml-4">
            <button
              type="button"
              class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              :aria-expanded="isMobileMenuOpen"
              @click="toggleMobileMenu"
            >
              <span class="sr-only">Open main menu</span>
              <!-- Icon when menu is closed -->
              <svg
                v-if="!isMobileMenuOpen"
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <!-- Icon when menu is open -->
              <svg
                v-else
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      id="mobile-menu"
      class="sm:hidden"
      :class="{ 'block': isMobileMenuOpen, 'hidden': !isMobileMenuOpen }"
    >
      <div class="pt-2 pb-3 space-y-1">
        <button
          class="text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="{ 'bg-blue-50 border-blue-500 text-blue-700': currentView === 'registration', 'border-transparent': currentView !== 'registration' }"
          @click="setActiveView('registration')"
        >
          Registration
        </button>
        <button
          class="text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="{ 'bg-blue-50 border-blue-500 text-blue-700': currentView === 'dashboard', 'border-transparent': currentView !== 'dashboard' }"
          @click="setActiveView('dashboard')"
        >
          Dashboard
        </button>
      </div>
      
      <!-- Mobile savings summary -->
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4 space-x-4">
          <!-- Member count -->
          <div class="flex items-center">
            <svg class="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-700">
              {{ activeStudentCount }}/12 Members
            </span>
          </div>
          
          <!-- Total savings -->
          <div class="flex items-center">
            <svg class="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-700">
              {{ totalSavingsFormatted }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>