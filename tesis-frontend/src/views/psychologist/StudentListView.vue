<!--
Componente StudentListView

Este componente implementa la vista de lista de estudiantes para los psicólogos.
Características principales:
- Búsqueda dinámica de estudiantes
- Filtros por carrera, semestre y estado
- Vista en cuadrícula con tarjetas de estudiante
- Acciones rápidas para evaluaciones y agendamiento
- Navegación a detalles del estudiante
-->

<template>

  
  <div class="student-list">
    <PageHeader
      title="Lista de Estudiantes"
      subtitle="Gestiona tus estudiantes asignados"
    >
      <template #actions>
        <BaseButton
          icon="fas fa-filter"
          variant="outline"
          @click="toggleFilters"
        >
          Filtros
        </BaseButton>
        <BaseButton
          icon="fas fa-search"
          variant="outline"
          @click="toggleSearch"
        >
          Buscar
        </BaseButton>
      </template>
    </PageHeader>

    <div v-if="showSearch" class="search-bar card">
      <div class="search-input">
        <i class="fas fa-search search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre, carrera o semestre..."
          @input="handleSearch"
        >
      </div>
    </div>

    <div v-if="showFilters" class="filters-panel card">
      <div class="filters-grid">
        <div class="filter-group">
          <label>Carrera</label>
          <select v-model="filters.career">
            <option value="">Todas</option>
            <option value="ing">Ingeniería</option>
            <option value="med">Medicina</option>
            <option value="der">Derecho</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Semestre</label>
          <select v-model="filters.semester">
            <option value="">Todos</option>
            <option v-for="n in 10" :key="n" :value="n">
              {{ n }}º Semestre
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Estado</label>
          <select v-model="filters.status">
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      <div class="filters-actions">
        <BaseButton
          variant="outline"
          size="small"
          @click="resetFilters"
        >
          Limpiar Filtros
        </BaseButton>
        <BaseButton
          variant="primary"
          size="small"
          @click="applyFilters"
        >
          Aplicar Filtros
        </BaseButton>
      </div>
    </div>

    <div class="students-grid">
      <div v-for="student in filteredStudents" 
        :key="student.id" 
        class="student-card card"
        @click="viewStudentDetails(student.id)"
      >
        <div class="student-header">
          <div class="student-avatar" :style="{ backgroundColor: getAvatarColor(student.name) }">
            {{ getInitials(student.name) }}
          </div>
          <div class="student-info">
            <h3>{{ student.name }}</h3>
            <span class="badge" :class="student.status">
              {{ student.status === 'active' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>

        <div class="student-details">
          <div class="detail-item">
            <i class="fas fa-graduation-cap"></i>
            <span>{{ student.career }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-clock"></i>
            <span>{{ student.semester }}º Semestre</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-calendar-check"></i>
            <span>{{ student.lastSession }}</span>
          </div>
        </div>

        <div class="student-actions">
          <button class="action-btn" @click.stop="viewEvaluations(student.id)">
            <i class="fas fa-clipboard-list"></i>
            <span>Evaluaciones</span>
          </button>
          <button class="action-btn" @click.stop="scheduleSession(student.id)">
            <i class="fas fa-calendar-plus"></i>
            <span>Agendar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Importación de dependencias y componentes
 * @requires vue - Composables de Vue 3
 * @requires PageHeader - Componente de encabezado de página
 * @requires BaseButton - Componente base para botones
 */
import { ref, computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/BaseButton.vue'

/**
 * Componente para mostrar y gestionar la lista de estudiantes
 * @component
 */
export default {
  name: 'StudentListView',
  /**
   * Componentes utilizados en la vista
   */
  components: {
    PageHeader,
    BaseButton
  },
  /**
   * Configuración del componente usando la Composition API
   * @returns {Object} Estado y métodos del componente
   */
  setup() {
    /**
     * Estado para mostrar/ocultar la barra de búsqueda
     */
    const showSearch = ref(false)
    /**
     * Estado para mostrar/ocultar el panel de filtros
     */
    const showFilters = ref(false)
    /**
     * Término de búsqueda para filtrar estudiantes
     */
    const searchQuery = ref('')
    /**
     * Filtros aplicables a la lista de estudiantes
     */
    const filters = ref({
      career: '',
      semester: '',
      status: ''
    })

    // Datos de ejemplo
    /**
     * Lista de estudiantes (datos de ejemplo)
     */
    const students = ref([
      {
        id: 1,
        name: 'Juan Pérez',
        status: 'active',
        career: 'Ingeniería en Sistemas',
        semester: 6,
        lastSession: '15 Mar 2024'
      },
      {
        id: 2,
        name: 'María González',
        status: 'active',
        career: 'Medicina',
        semester: 4,
        lastSession: '20 Mar 2024'
      },
      {
        id: 3,
        name: 'Carlos Rodríguez',
        status: 'inactive',
        career: 'Derecho',
        semester: 8,
        lastSession: '10 Mar 2024'
      }
    ])

    /**
     * Lista filtrada de estudiantes basada en la búsqueda y filtros
     * @type {import('vue').ComputedRef<Array>}
     */
    const filteredStudents = computed(() => {
      return students.value.filter(student => {
        const matchesSearch = searchQuery.value === '' ||
          student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          student.career.toLowerCase().includes(searchQuery.value.toLowerCase())

        const matchesCareer = filters.value.career === '' ||
          student.career.toLowerCase().includes(filters.value.career)

        const matchesSemester = filters.value.semester === '' ||
          student.semester === parseInt(filters.value.semester)

        const matchesStatus = filters.value.status === '' ||
          student.status === filters.value.status

        return matchesSearch && matchesCareer && matchesSemester && matchesStatus
      })
    })

    const toggleSearch = () => {
      showSearch.value = !showSearch.value
      if (!showSearch.value) {
        searchQuery.value = ''
      }
    }

    const toggleFilters = () => {
      showFilters.value = !showFilters.value
    }

    const resetFilters = () => {
      filters.value = {
        career: '',
        semester: '',
        status: ''
      }
    }

    const applyFilters = () => {
      showFilters.value = false
    }

    const getInitials = (name) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const getAvatarColor = (name) => {
      const colors = [
        '#7E57C2', // primary-color
        '#26A69A', // secondary-color
        '#FF8A65'  // accent-color
      ]
      const hash = name.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
      }, 0)
      return colors[Math.abs(hash) % colors.length]
    }

    const viewStudentDetails = (id) => {
      // Navegar a la vista de detalles
    }

    const viewEvaluations = (id) => {
      // Ver evaluaciones del estudiante
    }

    const scheduleSession = (id) => {
      // Programar una sesión
    }

    return {
      showSearch,
      showFilters,
      searchQuery,
      filters,
      filteredStudents,
      toggleSearch,
      toggleFilters,
      resetFilters,
      applyFilters,
      getInitials,
      getAvatarColor,
      viewStudentDetails,
      viewEvaluations,
      scheduleSession
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para la vista de lista de estudiantes */
.student-list {
  animation: fadeIn var(--transition-normal);
}

.search-bar {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  color: var(--neutral-medium);
}

.search-input input {
  padding-left: calc(var(--spacing-md) * 2 + 16px);
}

.filters-panel {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.filter-group label {
  color: var(--neutral-medium);
  font-size: var(--font-size-sm);
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.student-card {
  cursor: pointer;
  transition: all var(--transition-fast);
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.student-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: var(--font-size-md);
}

.student-info {
  flex-grow: 1;
}

.student-info h3 {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size-md);
}

.badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.badge.active {
  background: var(--success-color);
  color: white;
}

.badge.inactive {
  background: var(--neutral-light);
  color: var(--neutral-dark);
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--neutral-medium);
  font-size: var(--font-size-sm);
}

.detail-item i {
  width: 16px;
  color: var(--primary-color);
}

.student-actions {
  display: flex;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius-md);
  background: var(--bg-secondary);
  color: var(--neutral-dark);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--primary-light);
  color: var(--primary-color);
}

.action-btn i {
  font-size: var(--font-size-md);
}

@media (max-width: 768px) {
  .students-grid {
    grid-template-columns: 1fr;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style>
