<script setup lang="ts">

import { useRouter } from 'vue-router';
import { useUIStore } from '../stores/ui';
import { useStudentStore } from '../stores/student';
import { useSavings } from '../composables/useSavings';
import { useSimulation } from '../composables/useSimulation';
import AppCard from '../components/common/AppCard.vue';
import AppButton from '../components/common/AppButton.vue';
import TotalSavings from '../components/dashboard/TotalSavings.vue';
import StudentList from '../components/dashboard/StudentList.vue';
import WeekSimulator from '../components/dashboard/WeekSimulator.vue';
import InterestChart from '../components/dashboard/InterestChart.vue';

// Router and store setup
const router = useRouter();
const uiStore = useUIStore();
const studentStore = useStudentStore();
const { groupSavings, currentWeek } = useSavings();
const { formattedWeek } = useSimulation();

// Animation state
const isLoaded = ref(false);

// Navigate to registration
const navigateToRegister = () => {
  router.push('/register');
};

// Set loaded state after a small delay for animation
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
  
  // Initialize with test data in development mode
  if (process.env.NODE_ENV === 'development' && studentStore.getAllStudents.length === 0) {
    studentStore.initializeWithTestData();
  }
});
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <div>
        <h3 :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
          class="text-2xl leading-6 font-medium text-gray-900 transition-all duration-500 transform">
          Savings Dashboard
        </h3>
        <p :class="{ 'opacity-0': !isLoaded, 'opacity-100': isLoaded }" 
          class="mt-2 text-sm text-gray-600 transition-opacity duration-700 delay-200">
          Currently in {{ formattedWeek }} with {{ studentStore.getActiveStudentCount }} active members
        </p>
      </div>
      <div :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
        class="mt-3 sm:mt-0 transition-all duration-500 delay-300 transform">
        <AppButton 
          variant="primary" 
          @click="navigateToRegister" 
          :disabled="!studentStore.canRegisterMore"
        >
          <span v-if="studentStore.canRegisterMore">Register New Student</span>
          <span v-else>Group Full</span>
        </AppButton>
      </div>
    </div>

    <!-- Dashboard content -->
    <div class="mt-6 space-y-6">
      <!-- Main metrics -->
      <div :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
        class="transition-all duration-700 delay-500 transform">
        <TotalSavings />
      </div>

      <!-- Simulation and charts row -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Week simulator -->
        <div :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
          class="transition-all duration-700 delay-700 transform">
          <WeekSimulator />
        </div>

        <!-- Interest chart -->
        <div :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
          class="transition-all duration-700 delay-900 transform">
          <InterestChart />
        </div>
      </div>

      <!-- Student list -->
      <div :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
        class="transition-all duration-700 delay-1100 transform">
        <AppCard title="Students" shadow>
          <StudentList />
        </AppCard>
      </div>

      <!-- Empty state for no students -->
      <div v-if="studentStore.getAllStudents.length === 0" 
        :class="{ 'opacity-0': !isLoaded, 'opacity-100': isLoaded }" 
        class="text-center py-10 transition-opacity duration-1000 delay-1300">
        <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No students registered yet</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by registering students to the savings group.
        </p>
        <div class="mt-6">
          <AppButton 
            variant="primary"
            @click="navigateToRegister"
          >
            Register First Student
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>