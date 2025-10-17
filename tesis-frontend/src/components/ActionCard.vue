<template>
  <div class="action-card" @click="$emit('click')">
    <div class="card-icon">
      <i :class="icon"></i>
    </div>
    <div class="card-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <i class="fas fa-chevron-right arrow-icon"></i>
  </div>
</template>

<script>
export default {
  name: 'ActionCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.action-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.action-card:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

.card-icon {
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  background: var(--primary-light);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-content {
  flex-grow: 1;
}

.card-content h3 {
  color: var(--neutral-dark);
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-xs);
  font-weight: 600;
}

.card-content p {
  color: var(--neutral-medium);
  font-size: var(--font-size-sm);
  margin: 0;
  line-height: 1.4;
}

.arrow-icon {
  color: var(--primary-color);
  font-size: var(--font-size-lg);
  opacity: 0;
  transform: translateX(-10px);
  transition: all var(--transition-fast);
}

@media (max-width: 768px) {
  .action-card {
    padding: var(--spacing-md);
  }
  
  .arrow-icon {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
