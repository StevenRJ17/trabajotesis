<!--
Componente DashboardView

Este componente implementa el layout principal del dashboard del psicólogo.
Características:
- Barra lateral de navegación (AppSidebar)
- Área principal de contenido con router-view
- Diseño responsivo que se adapta a diferentes tamaños de pantalla
- Manejo de sesión y cierre de sesión
-->

<template>
  <div class="dashboard-layout" :class="{ 'sidebar-open': isSidebarOpen }">
    <button class="mobile-menu-btn" @click="toggleSidebar" aria-label="Toggle menu">
      <i class="fas" :class="isSidebarOpen ? 'fa-times' : 'fa-bars'"></i>
    </button>
    
    <AppSidebar :class="{ 'mobile-open': isSidebarOpen }" />
    
    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- Overlay para cerrar el menú en móvil -->
    <div 
      v-if="isSidebarOpen" 
      class="mobile-overlay"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script>
import AppSidebar from '@/components/AppSidebar.vue'

export default {
  name: 'PsychologistDashboard',
  components: {
    AppSidebar
  },
  data() {
    return {
      isSidebarOpen: false
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
      document.body.style.overflow = this.isSidebarOpen ? 'hidden' : ''
    },
    closeSidebar() {
      this.isSidebarOpen = false
      document.body.style.overflow = ''
    },
    /**
     * Cierra la sesión del usuario
     * - Elimina el token y datos del usuario del localStorage
     * - Actualiza el estado global de autenticación
     * - Redirige al usuario a la página de login
     */
    logout() {
      localStorage.removeItem('x-token')
      localStorage.removeItem('user-data')
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-secondary);
  position: relative;
}

.main-content {
  flex-grow: 1;
  margin-left: 280px;
  padding: var(--spacing-xl);
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  align-items: center;
  justify-content: center;
  opacity: 1 !important;
  visibility: visible !important;
}

.mobile-menu-btn:hover {
  transform: scale(1.05);
}

.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 90;
  backdrop-filter: blur(2px);
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  .main-content {
    margin-left: 0;
    padding: var(--spacing-md);
    padding-top: calc(var(--spacing-md) + 48px);
  }

  .mobile-overlay {
    display: none;
  }

  .sidebar-open .mobile-overlay {
    display: block;
  }

  :deep(.app-sidebar) {
    transform: translateX(-280px);
  }

  :deep(.app-sidebar.mobile-open) {
    transform: translateX(0);
  }
}
</style>
