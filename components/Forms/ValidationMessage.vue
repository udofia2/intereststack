<script setup lang="ts">


// Props definition
interface Props {
  message?: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  visible?: boolean;
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  message: '',
  type: 'error',
  visible: true
});

// Computed classes based on message type
const messageClasses = computed(() => {
  const typeClasses = {
    error: 'text-red-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };
  
  return [
    'text-sm font-medium mt-1',
    typeClasses[props.type]
  ].join(' ');
});

// Computed icon based on message type
const iconPath = computed(() => {
  switch (props.type) {
    case 'error':
      return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    case 'success':
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
    case 'warning':
      return 'M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z';
    case 'info':
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    default:
      return '';
  }
});
</script>

<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <div v-if="visible && message" :class="messageClasses" role="alert">
      <div class="flex items-center">
        <svg 
          class="w-4 h-4 mr-1.5 flex-shrink-0" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            :d="iconPath" 
          />
        </svg>
        <span>{{ message }}</span>
      </div>
    </div>
  </transition>
</template>