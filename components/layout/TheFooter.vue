<script setup lang="ts">

// Current year for copyright
const currentYear = ref(new Date().getFullYear());
</script>

<template>
  <footer class="bg-gray-50 border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- Logo and copyright -->
        <div class="flex flex-col items-center md:items-start">
          <div class="flex items-center">
            <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="ml-2 text-lg font-bold text-gray-900">InterestStack</span>
          </div>
          <p class="mt-2 text-sm text-gray-500">
            © {{ currentYear }} InterestStack. All rights reserved.
          </p>
        </div>
        
        <!-- App description -->
        <div class="mt-4 md:mt-0 text-center md:text-right max-w-md">
          <p class="text-sm text-gray-500">
            Student Savings Group Application - Helping students collectively invest in blockchain games with tiered savings and interest returns.
          </p>
          <p class="mt-2 text-xs text-gray-400">
            Web3Bridge Cohort XIII Pre-Qualification Exercise
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>