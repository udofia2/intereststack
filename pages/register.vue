<script setup lang="ts">

import { useRouter } from 'vue-router';
import { useUIStore } from '../stores/ui';
import { useStudentStore } from '../stores/student';
import { useSavings } from '../composables/useSavings';
import AppCard from '../components/common/AppCard.vue';
import AppButton from '../components/common/AppButton.vue';
import StudentForm from '../components/Forms/StudentForm.vue';

// Router and store setup
const router = useRouter();
const uiStore = useUIStore();
const studentStore = useStudentStore();
const { groupSavings } = useSavings();

// Animation state
const isLoaded = ref(false);

// Navigate to dashboard
const navigateToDashboard = () => {
  router.push('/dashboard');
};

// Set loaded state after a small delay for animation
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h3 :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
        class="text-2xl leading-6 font-medium text-gray-900 transition-all duration-500 transform">
        Student Registration
      </h3>
      <div :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
        class="mt-3 sm:mt-0 transition-all duration-500 delay-300 transform">
        
        <AppButton variant="primary" @click="navigateToDashboard">
          View Dashboard
        </AppButton>
      </div>
    </div>

    <!-- Registration content -->
    <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Registration form -->
      <div :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
        class="lg:col-span-7 transition-all duration-700 delay-500 transform">
        <AppCard title="Join the Savings Group" shadow>
          <StudentForm />
        </AppCard>
      </div>

      <!-- Information cards -->
      <div class="lg:col-span-5 space-y-6">
        <!-- Group status card -->
        <div :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
          class="transition-all duration-700 delay-700 transform">
          <AppCard title="Group Status" variant="info" shadow>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                  Active Members
                </div>
                <div class="text-lg font-semibold">
                  {{ studentStore.getActiveStudentCount }}/12
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  class="bg-blue-600 h-2.5 rounded-full"
                  :style="{ width: `${(studentStore.getActiveStudentCount / 12) * 100}%` }"
                ></div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                  Available Spots
                </div>
                <div class="text-lg font-semibold">
                  {{ studentStore.getAvailableSpots }}
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- How it works card -->
        <div :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
          class="transition-all duration-700 delay-900 transform">
          <AppCard title="How It Works" shadow>
            <div class="space-y-4">
              <div class="border-l-4 border-blue-500 pl-4">
                <h4 class="text-lg font-medium text-gray-900">Step 1: Choose a Tier</h4>
                <p class="mt-1 text-sm text-gray-500">
                  Select from three savings tiers with different investment amounts and interest rates.
                </p>
              </div>
              <div class="border-l-4 border-green-500 pl-4">
                <h4 class="text-lg font-medium text-gray-900">Step 2: Register</h4>
                <p class="mt-1 text-sm text-gray-500">
                  Enter your name and confirm your tier selection to join the savings group.
                </p>
              </div>
              <div class="border-l-4 border-purple-500 pl-4">
                <h4 class="text-lg font-medium text-gray-900">Step 3: Track Your Growth</h4>
                <p class="mt-1 text-sm text-gray-500">
                  Use the dashboard to monitor your weekly interest and group performance.
                </p>
              </div>
              <div class="border-l-4 border-yellow-500 pl-4">
                <h4 class="text-lg font-medium text-gray-900">Step 4: Withdraw Anytime</h4>
                <p class="mt-1 text-sm text-gray-500">
                  When you're ready, withdraw your principal plus accumulated interest.
                </p>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </div>
</template>