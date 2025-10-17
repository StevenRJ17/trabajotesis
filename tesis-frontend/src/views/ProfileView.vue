<!--
Componente ProfileView

Este componente implementa la vista de perfil del administrador.
Características:
- Información personal del administrador
- Estadísticas del sistema
- Actividad reciente
- Avatar dinámico con iniciales
- Diseño responsivo y moderno
-->

<template>
  <div class="profile-view">
    <div class="profile-header">
      <div class="cover-photo"></div>
      <div class="profile-info-container">
        <div class="profile-avatar">
          <div class="avatar-circle">
            <span class="initials">{{ getInitials }}</span>
          </div>
        </div>
        <div class="profile-details">
          <h1>{{ adminData.firstName }} {{ adminData.lastName }}</h1>
          <span class="role-badge">Administrador</span>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="info-card personal-info">
        <div class="card-header">
          <i class="fas fa-user-shield"></i>
          <h2>Información Personal</h2>
        </div>
        <div class="card-content">
          <div class="info-group">
            <label>Nombre Completo</label>
            <p>{{ adminData.firstName }} {{ adminData.lastName }}</p>
          </div>
          <div class="info-group">
            <label>Correo Electrónico</label>
            <p>{{ adminData.email }}</p>
          </div>
          <div class="info-group">
            <label>Rol del Sistema</label>
            <p>{{ adminData.role }}</p>
          </div>
        </div>
      </div>

      <div class="info-card stats">
        <div class="card-header">
          <i class="fas fa-chart-pie"></i>
          <h2>Estadísticas del Sistema</h2>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">{{ psychologistsCount }}</span>
            <span class="stat-label">Psicólogos Activos</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ studentsCount }}</span>
            <span class="stat-label">Estudiantes Registrados</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">98%</span>
            <span class="stat-label">Uptime del Sistema</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">24/7</span>
            <span class="stat-label">Soporte Disponible</span>
          </div>
        </div>
      </div>

      <div class="info-card activity">
        <div class="card-header">
          <i class="fas fa-clock"></i>
          <h2>Actividad Reciente</h2>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity._id" class="activity-item">
            <i :class="getActivityIcon(activity.type)"></i>
            <div class="activity-details">
              <p class="activity-text">{{ activity.description }}</p>
              <span class="activity-time">{{ formatTimestamp(activity.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = import.meta.env.VITE_API_BASE_URL;
/**
 * Componente de vista de perfil del administrador
 * @component
 */
export default {
  name: 'ProfileView',
  /**
   * Estado local del componente
   * @returns {Object} Estado inicial del perfil
   */
  data() {
    return {
      adminData: {
        firstName: '',
        lastName: '',
        email: '',
        role: ''
      },
      psychologistsCount: 0,
      studentsCount: 0,
      loading: true,
      error: null,
      recentActivities: []
    }
  },
  /**
   * Propiedades computadas del componente
   */
  computed: {
    /**
     * Calcula las iniciales del nombre del administrador
     * @returns {string} Iniciales en mayúsculas
     */
    getInitials() {
      return `${this.adminData.firstName.charAt(0)}${this.adminData.lastName.charAt(0)}`.toUpperCase()
    }
  },
  /**
   * Ciclo de vida: Se ejecuta al crear el componente
   * Carga los datos iniciales del perfil
   */
  async created() {
    await this.fetchAdminData()
    await this.fetchStats()
    await this.fetchRecentActivities()
  },
  /**
   * Métodos del componente
   */
  methods: {
    /**
     * Obtiene los datos del administrador desde el servidor
     * @async
     */
    async fetchAdminData() {
      try {
        const token = localStorage.getItem('x-token')
        const response = await fetch(`${API_URL}/api/users/admin`, {
          headers: {
            'x-token': token
          }
        })
        const data = await response.json()
        this.adminData = data
      } catch (err) {
        this.error = 'Error al cargar datos del administrador'
        console.error('Error:', err)
      }
    },
    /**
     * Obtiene las estadísticas del sistema
     * @async
     */
    async fetchStats() {
      try {
        const token = localStorage.getItem('x-token')
        const response = await fetch(`${API_URL}/api/users`, {
          headers: {
            'x-token': token
          }
        })
        const data = await response.json()
        this.psychologistsCount = data.psychologists.length
        this.studentsCount = data.students?.length || 0
      } catch (err) {
        console.error('Error fetching stats:', err)
      }
    },
    /**
     * Obtiene el historial de actividades recientes
     * @async
     */
    async fetchRecentActivities() {
      try {
        const token = localStorage.getItem('x-token')
        const response = await fetch(`${API_URL}/api/activities`, {
          headers: {
            'x-token': token
          }
        })
        const data = await response.json()
        this.recentActivities = data
      } catch (err) {
        console.error('Error fetching recent activities:', err)
      }
    },
    /**
     * Determina el icono a mostrar según el tipo de actividad
     * @param {string} type - Tipo de actividad
     * @returns {string} Clase CSS del icono
     */
    getActivityIcon(type) {
      switch (type) {
        case 'new-psychologist':
          return 'fas fa-user-plus'
        case 'system-update':
          return 'fas fa-sync'
        case 'security-review':
          return 'fas fa-shield-alt'
        default:
          return 'fas fa-question-circle'
      }
    },
    /**
     * Formatea una marca de tiempo a formato legible
     * @param {string} timestamp - Marca de tiempo ISO
     * @returns {string} Hora formateada
     */
    formatTimestamp(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para la vista de perfil */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* Contenedor principal del perfil */
.profile-view {
  padding: 2rem;
  font-family: var(--font-family);
  background-color: var(--bg-secondary);
  min-height: calc(100vh - var(--header-height));
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

/* Encabezado del perfil con foto de portada */
.profile-header {
  position: relative;
  margin-bottom: 2rem;
  background: var(--primary-gradient);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  color: white;
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
  }
}

.profile-avatar {
  margin-bottom: 1.5rem;

  .avatar-circle {
    width: 120px;
    height: 120px;
    margin: 0 auto;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-md);

    .initials {
      color: var(--primary-color);
      font-size: 2.5rem;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 1rem;

    .avatar-circle {
      width: 100px;
      height: 100px;

      .initials {
        font-size: 2rem;
      }
    }
  }
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: var(--border-radius-md);
  }
}

.info-card {
  background: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  height: fit-content;

  .card-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 0.75rem;

    i {
      color: var(--primary-color);
      font-size: 1.25rem;
    }

    h2 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--text-primary);
      font-weight: 600;
    }
  }

  .card-content {
    padding: 1.25rem;
  }

  @media (max-width: 768px) {
    .card-header {
      padding: 1rem 1.25rem;

      h2 {
        font-size: 1.1rem;
      }
    }

    .card-content {
      padding: 1.25rem;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: var(--border-radius-md);
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.profile-info-container {
  padding: 0 1rem;
}

.profile-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.profile-details {
  text-align: center;

  h1 {
    margin: 0;
    font-size: 1.75rem;
    color: white;
    font-weight: 600;
  }

  .role-badge {
    display: inline-block;
    padding: 0.35rem 1rem;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 2rem;
    font-size: 0.9rem;
    margin-top: 0.75rem;
    backdrop-filter: blur(10px);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.5rem;
    }

    .role-badge {
      font-size: 0.8rem;
      padding: 0.25rem 0.75rem;
    }
  }
}

.activity-list {
  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-color);

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    i {
      background: var(--bg-secondary);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-color);
      font-size: 1rem;
    }
  }

  .activity-details {
    flex: 1;
  }

  .activity-text {
    margin: 0;
    color: var(--text-primary);
    font-weight: 500;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .activity-time {
    display: block;
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 0.35rem;
  }

  @media (max-width: 768px) {
    .activity-item {
      padding: 0.75rem 0;
      gap: 0.75rem;

      i {
        width: 32px;
        height: 32px;
        font-size: 0.9rem;
      }
    }

    .activity-text {
      font-size: 0.9rem;
    }

    .activity-time {
      font-size: 0.75rem;
    }
  }
}

@media (max-width: 768px) {
  .profile-info-container {
    padding: 0 1rem;
  }

  .profile-content {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-item {
    padding: 1rem;
  }
}
</style>
