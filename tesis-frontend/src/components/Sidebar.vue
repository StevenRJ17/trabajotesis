<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h3>{{ title }}</h3>
    </div>
    <nav class="sidebar-nav">
      <slot></slot>
    </nav>
    <div class="sidebar-footer">
      <slot name="footer"></slot>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h3 {
  margin: 0;
  color: #42b983;
}

.sidebar-nav {
  padding: 20px 0;
  flex-grow: 1;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
