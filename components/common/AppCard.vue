<script setup lang="ts">


// Type definitions
type CardVariant = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

// Props definition
interface Props {
  title?: string;
  subtitle?: string;
  variant?: CardVariant;
  shadow?: boolean;
  hover?: boolean;
  bordered?: boolean;
  noPadding?: boolean;
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  variant: 'default',
  shadow: true,
  hover: false,
  bordered: true,
  noPadding: false
});

// Computed classes based on props
const cardClasses = computed(() => {
  const variantClasses = {
    default: 'bg-white',
    primary: 'bg-blue-50 border-blue-200',
    secondary: 'bg-gray-50 border-gray-200',
    success: 'bg-green-50 border-green-200',
    danger: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-cyan-50 border-cyan-200'
  };

  return [
    'rounded-lg overflow-hidden',
    variantClasses[props.variant],
    props.shadow ? 'shadow-md' : '',
    props.hover ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg' : '',
    props.bordered ? 'border' : ''
  ].filter(Boolean).join(' ');
});

const headerClasses = computed(() => {
  const variantClasses = {
    default: 'border-b border-gray-200',
    primary: 'border-b border-blue-200 bg-blue-100',
    secondary: 'border-b border-gray-200 bg-gray-100',
    success: 'border-b border-green-200 bg-green-100',
    danger: 'border-b border-red-200 bg-red-100',
    warning: 'border-b border-yellow-200 bg-yellow-100',
    info: 'border-b border-cyan-200 bg-cyan-100'
  };

  return [
    'px-6 py-4',
    variantClasses[props.variant]
  ].filter(Boolean).join(' ');
});

const bodyClasses = computed(() => {
  return props.noPadding ? '' : 'p-6';
});

const footerClasses = computed(() => {
  const variantClasses = {
    default: 'border-t border-gray-200 bg-gray-50',
    primary: 'border-t border-blue-200 bg-blue-100',
    secondary: 'border-t border-gray-200 bg-gray-100',
    success: 'border-t border-green-200 bg-green-100',
    danger: 'border-t border-red-200 bg-red-100',
    warning: 'border-t border-yellow-200 bg-yellow-100',
    info: 'border-t border-cyan-200 bg-cyan-100'
  };

  return [
    'px-6 py-4',
    variantClasses[props.variant]
  ].filter(Boolean).join(' ');
});
</script>

<template>
  <div :class="cardClasses">
    <!-- Card Header (if title or subtitle is provided) -->
    <div v-if="title || subtitle" :class="headerClasses">
      <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-600">{{ subtitle }}</p>
      <slot name="header"></slot>
    </div>
    
    <!-- Card Body -->
    <div :class="bodyClasses">
      <slot></slot>
    </div>
    
    <!-- Card Footer (if footer slot is provided) -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer"></slot>
    </div>
  </div>
</template>