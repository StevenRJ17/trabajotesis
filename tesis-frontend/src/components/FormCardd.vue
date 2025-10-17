<template>
  <div class="card p-6 mb-6">
    <div class="flex items-start space-x-3 mb-4">
      <div :class="['p-2 rounded-lg', getIconBgColor()]">
        <component :is="icon" :class="['h-5 w-5', getIconColor()]" />
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h3>
        <p v-if="description" class="text-sm text-gray-600">{{ description }}</p>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FormCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: Object,
      required: true
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'warning', 'danger', 'success', 'info'].includes(value)
    }
  },
  setup(props) {
    const getIconBgColor = () => {
      const colors = {
        default: 'bg-gray-100',
        warning: 'bg-yellow-100',
        danger: 'bg-red-100',
        success: 'bg-green-100',
        info: 'bg-blue-100'
      }
      return colors[props.variant]
    }

    const getIconColor = () => {
      const colors = {
        default: 'text-gray-600',
        warning: 'text-yellow-600',
        danger: 'text-red-600',
        success: 'text-green-600',
        info: 'text-blue-600'
      }
      return colors[props.variant]
    }

    return {
      getIconBgColor,
      getIconColor
    }
  }
}
</script>
