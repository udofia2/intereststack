<script setup lang="ts">

import { useUIStore } from '../stores/ui';
import TheHeader from '../components/layout/TheHeader.vue';
import TheSidebar from '../components/layout/TheSidebar.vue';
import TheFooter from '../components/layout/TheFooter.vue';
import AppAlert from '../components/common/AppAlert.vue';

// Store setup
const uiStore = useUIStore();

// State
const isSidebarOpen = ref(true);
const isMobile = ref(false);

// Computed properties
const notifications = computed(() => uiStore.getNotifications);

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    isSidebarOpen.value = false;
  } else {
    isSidebarOpen.value = true;
  }
};

// Toggle sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Remove a notification
const removeNotification = (id: string) => {
  uiStore.removeNotification(id);
};

// Set up responsive behavior
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  // Clean up event listener
  return () => {
    window.removeEventListener('resize', checkMobile);
  };
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <TheHeader />
    
    <!-- Main content area with sidebar -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar (hidden on mobile if closed) -->
      <Transition
        enter-active-class="transition-all duration-300 ease-in-out"
        leave-active-class="transition-all duration-300 ease-in-out"
        enter-from-class="-translate-x-full"
        leave-to-class="-translate-x-full"
      >
        <div 
          v-if="isSidebarOpen" 
          class="w-64 fixed inset-y-0 left-0 z-20 top-16 md:relative md:top-0"
        >
          <TheSidebar />
          
          <!-- Mobile sidebar backdrop -->
          <div 
            v-if="isMobile" 
            class="fixed inset-0 bg-gray-600 bg-opacity-50 z-10"
            @click="toggleSidebar"
          ></div>
        </div>
      </Transition>
      
      <!-- Main content -->
      <main 
        class="flex-1 overflow-y-auto pb-10"
        :class="{ 'md:pl-64': isSidebarOpen && !isMobile }"
      >
        <!-- Toggle sidebar button for mobile -->
        <button
          v-if="isMobile && !isSidebarOpen"
          class="fixed top-20 left-4 z-10 rounded-full bg-white p-2 shadow-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="toggleSidebar"
        >
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Page content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <slot></slot>
        </div>
      </main>
    </div>
    
    <!-- Footer -->
    <TheFooter />
    
    <!-- Notifications -->
    <div class="fixed bottom-0 right-0 p-4 space-y-4 max-w-md z-50">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <AppAlert
          v-for="notification in notifications"
          :key="notification.id"
          :type="notification.type"
          :message="notification.message"
          dismissible
          :auto-close="true"
          :duration="notification.timeout || 5000"
          @close="removeNotification(notification.id)"
        />
      </TransitionGroup>
    </div>
    
    <!-- Modal container -->
    <div v-if="uiStore.isModalOpen">
      <slot name="modal"></slot>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for WebKit browsers */
main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
}

main::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>