<template>
  <button 
    :type="type"
    :class="['base-btn', variant, size]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <i v-if="icon" :class="icon" class="btn-icon"></i>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'button'
    },
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'accent', 'danger', 'outline'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  font-weight: 500;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  gap: var(--spacing-sm);
  white-space: nowrap;
}

/* Tamaños */
.base-btn.small {
  padding: 0.5rem 1rem;
  font-size: var(--font-size-sm);
}

.base-btn.medium {
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-md);
}

.base-btn.large {
  padding: 1rem 2rem;
  font-size: var(--font-size-lg);
}

/* Variantes */
.base-btn.primary {
  background-color: var(--primary-color);
  color: white;
}

.base-btn.primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-btn.secondary {
  background-color: var(--secondary-color);
  color: white;
}

.base-btn.secondary:hover:not(:disabled) {
  background-color: var(--secondary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-btn.accent {
  background-color: var(--accent-color);
  color: white;
}

.base-btn.accent:hover:not(:disabled) {
  background-color: var(--accent-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-btn.danger {
  background-color: var(--error-color);
  color: white;
}

.base-btn.danger:hover:not(:disabled) {
  background-color: #D32F2F;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-btn.outline {
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.base-btn.outline:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Estado deshabilitado */
.base-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Efecto de click */
.base-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Icono */
.btn-icon {
  font-size: 1.1em;
}
</style>
