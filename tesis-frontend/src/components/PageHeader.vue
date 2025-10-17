<template>
  <header class="page-header">
    <div class="header-content">
      <div class="title-section">
        <h1>{{ title }}</h1>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      
      <div v-if="$slots.actions" class="header-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <div v-if="$slots.tabs" class="header-tabs">
      <slot name="tabs"></slot>
    </div>
  </header>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: var(--spacing-xl);
  animation: slideDown var(--transition-normal);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.title-section {
  flex-grow: 1;
}

.title-section h1 {
  color: var(--neutral-dark);
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs);
  line-height: 1.2;
}

.subtitle {
  color: var(--neutral-medium);
  font-size: var(--font-size-md);
  margin: 0;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.header-tabs {
  margin-top: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .header-actions {
    justify-content: flex-start;
  }

  .title-section h1 {
    font-size: var(--font-size-xl);
  }
}
</style>
