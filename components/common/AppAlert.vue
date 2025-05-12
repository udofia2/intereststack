<script setup lang="ts">

type AlertType = 'success' | 'error' | 'warning' | 'info';
type AlertPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';


interface Props {
  type?: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  autoClose?: boolean;
  duration?: number;
  position?: AlertPosition;
  icon?: boolean;
}


const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: '',
  message: '',
  dismissible: true,
  autoClose: false,
  duration: 5000,
  position: 'top-right',
  icon: true
});


const emit = defineEmits<{
  (e: 'close'): void;
}>();


const isVisible = ref(true);
const timeoutId = ref<number | null>(null);


const alertClasses = computed(() => {
  const typeClasses = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800'
  };

  return [
    'border-l-4 p-4 rounded shadow-sm',
    typeClasses[props.type],
    props.dismissible ? 'pr-10' : ''
  ].filter(Boolean).join(' ');
});

const iconClasses = computed(() => {
  const icons = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };
  
  return `h-5 w-5 ${icons[props.type]}`;
});

const iconPath = computed(() => {
  switch (props.type) {
    case 'success':
      return 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z';
    case 'error':
      return 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z';
    case 'warning':
      return 'M12 9v2m0 4h.01M10.939 2.939a1.5 1.5 0 012.122 0l6.939 6.939a1.5 1.5 0 010 2.122l-6.939 6.939a1.5 1.5 0 01-2.122 0L3.939 11.939a1.5 1.5 0 010-2.122L10.939 2.939z';
    case 'info':
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  }
});


const close = () => {
  isVisible.value = false;
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }
  emit('close');
};


onMounted(() => {
  if (props.autoClose && props.duration > 0) {
    timeoutId.value = window.setTimeout(() => {
      close();
    }, props.duration);
  }
  
  return () => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
    }
  };
});
</script>

<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isVisible" :class="alertClasses" role="alert">
      <div class="flex">
        <!-- Icon -->
        <div v-if="icon" class="flex-shrink-0">
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" :class="iconClasses">
            <path fill-rule="evenodd" :d="iconPath" clip-rule="evenodd" />
          </svg>
        </div>
        
        <!-- Content -->
        <div class="ml-3">
          <div v-if="title" class="text-sm font-medium">
            {{ title }}
          </div>
          <div class="text-sm">
            {{ message }}
          </div>
        </div>
        
        <!-- Close button -->
        <div v-if="dismissible" class="absolute top-0 right-0 p-2">
          <button @click="close" class="text-gray-400 hover:text-gray-600 focus:outline-none">
            <span class="sr-only">Close</span>
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>