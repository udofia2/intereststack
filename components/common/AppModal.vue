<script setup lang="ts">

import AppButton from './AppButton.vue';

// Type definitions
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Props definition
interface Props {
  modelValue: boolean;
  title: string;
  size?: ModalSize;
  persistent?: boolean;
  hideClose?: boolean;
  hideFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: string;
  cancelVariant?: string;
  loading?: boolean;
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  size: 'md',
  persistent: false,
  hideClose: false,
  hideFooter: false,
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmVariant: 'primary',
  cancelVariant: 'secondary',
  loading: false
});

// Define emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

// State
const isOpen = ref(props.modelValue);
const modalRef = ref<HTMLDivElement | null>(null);

// Computed properties
const modalSizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };
  
  return sizes[props.size];
});

// Methods
const open = () => {
  isOpen.value = true;
  emit('update:modelValue', true);
  document.body.classList.add('overflow-hidden');
};

const close = () => {
  if (!props.persistent) {
    isOpen.value = false;
    emit('update:modelValue', false);
    document.body.classList.remove('overflow-hidden');
  }
};

const confirm = () => {
  emit('confirm');
  if (!props.persistent) {
    close();
  }
};

const cancel = () => {
  emit('cancel');
  close();
};

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
  if (modalRef.value && !modalRef.value.contains(event.target as Node) && !props.persistent) {
    close();
  }
};

// Handle escape key
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value && !props.persistent) {
    close();
  }
};

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue;
  if (newValue) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
});

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('keydown', handleEscKey);
  
  if (props.modelValue) {
    document.body.classList.add('overflow-hidden');
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  document.removeEventListener('keydown', handleEscKey);
  document.body.classList.remove('overflow-hidden');
});
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <!-- Modal content -->
        <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div 
              v-if="isOpen" 
              ref="modalRef"
              :class="['relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8', modalSizeClasses]"
            >
              <!-- Modal header -->
              <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900" id="modal-title">
                  {{ title }}
                </h3>
                <button 
                  v-if="!hideClose" 
                  type="button" 
                  class="rounded-md bg-gray-50 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @click="cancel"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <!-- Modal body -->
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <slot></slot>
              </div>
              
              <!-- Modal footer -->
              <div v-if="!hideFooter" class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <AppButton
                  :variant="confirmVariant"
                  :loading="loading"
                  class="w-full sm:ml-3 sm:w-auto"
                  @click="confirm"
                >
                  {{ confirmText }}
                </AppButton>
                <AppButton
                  :variant="cancelVariant"
                  class="mt-3 w-full sm:mt-0 sm:w-auto"
                  @click="cancel"
                >
                  {{ cancelText }}
                </AppButton>
                <slot name="footer"></slot>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </Teleport>
</template>