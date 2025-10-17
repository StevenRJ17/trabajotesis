<template>
  <router-link 
    :to="to" 
    class="sidebar-link"
    :class="{ active: isActive }"
  >
    <div class="link-icon">
      <i :class="icon"></i>
    </div>
    <span class="link-text">{{ text }}</span>
    <div ></div>
  </router-link>
</template>

<script>
export default {
  name: 'SidebarLink',
  props: {
    to: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    isActive() {
      // Para rutas exactas como /dashboard
      if (this.to === '/dashboard' || this.to === '/psychologist/dashboard') {
        return this.$route.path === this.to
      }
      // Para subrutas como /dashboard/profile
      return this.$route.path.startsWith(this.to)
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.6rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  margin: 0.2rem 0.8rem;
  border-radius: 8px;
  gap: 1rem;
}

.sidebar-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.sidebar-link.active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 20px;
  font-size: 1.1rem;
  color: inherit;
  transition: transform 0.3s ease;
}

.sidebar-link:hover .link-icon,
.sidebar-link.active .link-icon {
  transform: scale(1.1);
}

.link-text {
  font-size: 0.95rem;
  transition: transform 0.3s ease;
  color: inherit;
}

.hover-indicator {
  position: absolute;
  left: -0.8rem;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 70%;
  background: white;
  border-radius: 0 4px 4px 0;
  transition: transform 0.3s ease;
  opacity: 0.8;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}


@media (max-width: 768px) {
  .sidebar-link {
    padding: 0.6rem 1rem;
    margin: 0.9rem 0.5rem;
    justify-content: center;
    color: white;
  }

  .link-text {
    color: white;
    font-size: 1.2rem;
  }



  .link-icon {
    font-size: 1.2rem;
  }
}
</style>
