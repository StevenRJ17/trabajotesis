<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="brand">PsicoGest</router-link>
    </div>
    <div class="navbar-menu">
      <template v-if="!isAuthenticated">
        <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
      </template>
      <template v-else>
        <router-link to="/home" class="nav-link">Inicio</router-link>
        <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
        <button @click="logout" class="nav-link logout">
          <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </template>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NavBar',
  computed: {
    ...mapState(['isAuthenticated'])
  },
  methods: {
    logout() {
      localStorage.removeItem('x-token')
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.navbar {
  background: linear-gradient(135deg, #7f53ac 0%, #647dee 100%);
  padding: 1rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
}

.navbar-brand {
  font-size: 1.8rem;
  font-weight: 600;
}

.brand {
  color: white;
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.brand:hover {
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  transform: scale(1.02);
}

.navbar-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.nav-link:hover::before {
  transform: translateX(0);
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logout {
  background: none;
  border: 2px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
}

.logout:hover {
  background-color: rgba(255, 255, 255, 0.9);
  color: #7f53ac;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .navbar-menu {
    gap: 1rem;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
  }
  
  .navbar-brand {
    font-size: 1.5rem;
  }
}
</style>
