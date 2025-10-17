<template>
  <div class="form-group">
    <label :for="id" class="form-label">{{ label }}</label>
    <div class="input-wrapper" :class="{ 'with-icon': icon }">
      <i v-if="icon" :class="icon" class="input-icon"></i>
      <input 
        :type="type"
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        :placeholder="placeholder"
        :class="['form-input', { 'has-error': error }]"
        :disabled="disabled"
      >
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-if="helpText" class="help-text">{{ helpText }}</span>
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    id: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    helpText: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.form-label {
  color: var(--neutral-dark);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper.with-icon .form-input {
  padding-left: 2.5rem;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--neutral-medium);
  font-size: var(--font-size-md);
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: var(--font-size-md);
  font-family: var(--font-family);
  color: var(--neutral-dark);
  background-color: var(--bg-primary);
  border: 2px solid var(--neutral-light);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.form-input::placeholder {
  color: var(--neutral-medium);
}

.form-input:disabled {
  background-color: var(--neutral-light);
  cursor: not-allowed;
  opacity: 0.7;
}

.form-input.has-error {
  border-color: var(--error-color);
}

.form-input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 83, 80, 0.2);
}

.error-message {
  color: var(--error-color);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.help-text {
  color: var(--neutral-medium);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}
</style>
