<script setup lang="ts">

import { useRouter } from 'vue-router';
import { useUIStore } from '../stores/ui';
import AppButton from '../components/common/AppButton.vue';

// Router and store setup
const router = useRouter();
const uiStore = useUIStore();

// Animation state
const isLoaded = ref(false);

// Navigate to registration or dashboard
const navigateToRegister = () => {
  router.push('/register');
};

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
  <div class="min-h-[calc(100vh-14rem)]">
    <!-- Hero section -->
    <div class="relative bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div class="relative pt-6 px-4 sm:px-6 lg:px-8">
            <!-- Empty container for spacing -->
          </div>

          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
                  class="block transition-all duration-700 ease-out transform">
                  Student Savings Group
                </span>
                <span :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
                  class="block text-blue-600 transition-all duration-700 ease-out transform delay-300">
                  with Interest<span class="text-green-500">Stack</span>
                </span>
              </h1>
              <p :class="{ 'opacity-0': !isLoaded, 'opacity-100': isLoaded }" 
                class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 transition-opacity duration-1000 delay-700">
                A collaborative platform for students to pool their savings, invest in blockchain gaming, and earn interest together. Choose your tier, track your earnings, and grow your money with the power of collective investing.
              </p>
              <div :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
                class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start transition-all duration-700 ease-out transform delay-1000">
                <div class="rounded-md shadow">
                  <AppButton 
                    variant="primary" 
                    size="lg" 
                    class="w-full"
                    @click="navigateToRegister"
                  >
                    Get Started
                  </AppButton>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <AppButton 
                    variant="light" 
                    size="lg" 
                    class="w-full"
                    @click="navigateToDashboard"
                  >
                    View Dashboard
                  </AppButton>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center p-8">
          <div :class="{ 'opacity-0 scale-95': !isLoaded, 'opacity-100 scale-100': isLoaded }" 
            class="w-full max-w-md bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-8 text-white shadow-xl transition-all duration-1000 delay-500">
            <div class="text-center">
              <h2 class="text-3xl font-bold mb-4">Savings Tiers</h2>
              <div class="grid grid-cols-3 gap-4">
                <div class="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 class="font-bold">Tier 1</h3>
                  <p class="text-xl font-bold">₦10,000</p>
                  <p class="text-sm">5% weekly</p>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 class="font-bold">Tier 2</h3>
                  <p class="text-xl font-bold">₦20,000</p>
                  <p class="text-sm">10% weekly</p>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-4">
                  <h3 class="font-bold">Tier 3</h3>
                  <p class="text-xl font-bold">₦30,000</p>
                  <p class="text-sm">20% weekly</p>
                </div>
              </div>
              <p class="mt-4 text-sm">20% return on blockchain game investment</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature section -->
    <div :class="{ 'opacity-0 translate-y-4': !isLoaded, 'opacity-100 translate-y-0': isLoaded }" 
      class="py-12 bg-gray-50 transition-all duration-1000 ease-out transform delay-1200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to save together
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            InterestStack makes it easy for students to pool resources, invest together, and watch their savings grow.
          </p>
        </div>

        <div class="mt-10">
          <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Tiered Savings Options</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Choose from three tiers with different investment amounts and corresponding interest rates to match your savings capacity.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Weekly Interest Growth</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Track your weekly interest earnings and watch your savings grow with our detailed analytics and visual charts.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Blockchain Gaming Returns</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Collectively invest in a Play-to-Earn blockchain game that yields a 20% return on the total invested amount.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Flexible Withdrawals</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                Withdraw your funds when needed, with accumulated interest, and make room for new members to join the group.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- CTA section -->
    <div :class="{ 'opacity-0': !isLoaded, 'opacity-100': isLoaded }" 
      class="bg-blue-600 transition-opacity duration-1000 delay-1500">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span class="block">Ready to start saving?</span>
          <span class="block text-blue-200">Join our savings group today.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <AppButton 
              variant="light" 
              size="lg"
              @click="navigateToRegister"
            >
              Get Started
            </AppButton>
          </div>
          <div class="ml-3 inline-flex rounded-md shadow">
            <AppButton 
              variant="dark" 
              size="lg"
              @click="navigateToDashboard"
            >
              View Dashboard
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>