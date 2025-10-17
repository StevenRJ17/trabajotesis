<!--
Componente HomeView (Vista Principal del Psicólogo)

Este componente implementa la vista principal para los psicólogos.
Características:
- Tarjeta de bienvenida personalizada
- Información del perfil del psicólogo
- Resumen de pacientes asignados y sesiones
- Avatar dinámico con iniciales
- Diseño responsivo
-->

<template>
  <div class="psychologist-home">
    <div class="welcome-card">
      <div class="header">
        <div class="avatar" :style="{ backgroundColor: avatarColor }">
          <span>{{ userInitials }}</span>
        </div>
        <h1>Bienvenssssssssssido, {{ userName }}</h1>
      </div>
      
      <div class="info-section">
        <div class="info-item">
          <label>Nombre:</label>
          <p>{{ userData?.user?.firstName }} {{ userData?.user?.lastName }}</p>
        </div>
        <div class="info-item">
          <label>Email:</label>
          <p>{{ userData?.user?.email }}</p>
        </div>
        <div class="info-item">
          <label>Rol:</label>
          <p>{{ userRole }}</p>
        </div>
        <div class="info-item">
          <label>Pacientes asignados:</label>
          <p>{{ studentCount }} estudiantes</p>
        </div>
        <div class="info-item">
          <label>Sesiones realizadas:</label>
          <p>{{ userData?.user?.sessionCount || 0 }} sesiones</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Importación de dependencias
 * @requires vuex - Estado global de la aplicación
 */
import { mapState } from 'vuex'

/**
 * Componente de vista principal para psicólogos
 * @component
 */
export default {
  /**
   * Nombre del componente para su identificación
   */
  name: 'PsychologistHomeView',
  /**
   * Estado local del componente
   * @returns {Object} Estado inicial
   */
  data() {
    return {
      studentCount: 0
    }
  },
  /**
   * Propiedades computadas del componente
   */
  computed: {
    ...mapState(['userData']),
    /**
     * Obtiene el nombre completo del psicólogo
     * @returns {string} Nombre completo formateado
     */
    userName() {
      if (this.userData?.user?.firstName && this.userData?.user?.lastName) {
        return `${this.userData.user.firstName} ${this.userData.user.lastName}`
      }
      return this.userData?.user?.name || ''
    },
    /**
     * Obtiene el rol del usuario
     * @returns {string} Rol del usuario (siempre 'Psicólogo')
     */
    userRole() {
      return 'Psicólogo'
    },
    /**
     * Genera las iniciales del nombre del psicólogo
     * @returns {string} Iniciales en mayúsculas (máximo 2 caracteres)
     */
    userInitials() {
      if (!this.userName) return ''
      return this.userName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },
    /**
     * Genera un color consistente para el avatar basado en el nombre
     * @returns {string} Color en formato hexadecimal
     */
    avatarColor() {
      const colors = [
        '#1976D2', // primary-color
        '#26A69A', // secondary-color
        '#FF8A65'  // accent-color
      ]
      const hash = this.userName.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
      }, 0)
      return colors[Math.abs(hash) % colors.length]
    }
  },
  /**
   * Ciclo de vida: Se ejecuta cuando el componente es creado
   * Obtiene la cantidad de estudiantes asignados al psicólogo
   */
  async created() {
    try {
      const token = localStorage.getItem('x-token')
      const response = await fetch(`${API_URL}/api/students/`, {
        headers: {
          'x-token': token
        }
      })
      if (response.ok) {
        const data = await response.json()
        this.studentCount = data.students.length
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para la vista principal del psicólogo */
.psychologist-home {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.welcome-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 2rem;
}

h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 500;
}

.info-section {
  display: grid;
  gap: 1.5rem;
}

.info-item {
  display: grid;
  gap: 0.5rem;
}

.info-item label {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.info-item p {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .psychologist-home {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    text-align: center;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
