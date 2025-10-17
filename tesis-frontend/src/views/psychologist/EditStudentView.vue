<!--
Componente EditStudentView

Este componente permite a los psicólogos editar la información de un estudiante.
Características:
- Formulario dividido en secciones (Información Personal y Académica)
- Validación de campos requeridos
- Manejo de estados de carga
- Notificaciones de éxito/error usando SweetAlert2
-->

<template>
  <div class="student-details-container">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <div class="header-section">
      <button class="back-btn" @click="goBack">
        <i class="ri-arrow-left-line"></i> Volver
      </button>
      <h1>Editar Estudiante</h1>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="ri-loader-4-line loading-spinner"></i>
      <p>Cargando...</p>
    </div>

    <div v-else class="edit-form">
      <form @submit.prevent="handleSubmit" class="student-form">
        <div class="form-section">
          <h3>Información Personal</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                v-model="student.firstName"
                required
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="lastName">Apellido</label>
              <input
                type="text"
                id="lastName"
                v-model="student.lastName"
                required
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="age">Edad</label>
              <input
                type="number"
                id="age"
                v-model="student.age"
                required
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                v-model="student.phone"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="city">Ciudad</label>
              <input
                type="text"
                id="city"
                v-model="student.city"
                class="form-control"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Información Académica</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="level">Nivel de Estudios</label>
              <input
                type="text"
                id="level"
                v-model="student.level"
                required
                class="form-control"
                placeholder="Ej: Bachillerato, Técnico, Universitario"
              />
            </div>

            <div class="form-group">
              <label for="career">Carrera</label>
              <input
                type="text"
                id="career"
                v-model="student.career"
                class="form-control"
              />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            <i class="ri-save-line"></i> Guardar Cambios
          </button>
          <button type="button" class="btn btn-secondary" @click="goBack">
            <i class="ri-close-line"></i> Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
const API_URL = import.meta.env.VITE_API_BASE_URL;
export default {
  /**
   * Nombre del componente para su identificación en Vue DevTools
   */
  name: 'EditStudentView',
  /**
   * Estado local del componente
   * @returns {Object} Estado inicial con datos del estudiante y estado de carga
   */
  data() {
    return {
      loading: true,
      student: {
        firstName: '',
        lastName: '',
        age: '',
        phone: '',
        city: '',
        level: '',
        career: ''
      }
    };
  },
  /**
   * Ciclo de vida: Se ejecuta cuando el componente es creado
   * Carga los detalles del estudiante desde el servidor
   */
  async created() {
    await this.fetchStudentDetails();
  },
  methods: {
    /**
     * Obtiene los detalles del estudiante desde el servidor
     * Utiliza el ID del estudiante desde los parámetros de la ruta
     * Actualiza el estado local con la información recibida
     */
    async fetchStudentDetails() {
      try {
        const token = localStorage.getItem('x-token');
        const response = await axios.get(
          `${API_URL}/api/students/${this.$route.params.id}`,
          {
            headers: {
              'x-token': token
            }
          }
        );
        this.student = response.data;
        this.loading = false;
      } catch (error) {
        console.error('Error al cargar los detalles del estudiante:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información del estudiante'
        });
        this.goBack();
      }
    },
    /**
     * Maneja el envío del formulario
     * Envía los datos actualizados al servidor
     * Muestra notificaciones de éxito/error
     * Redirige al detalle del estudiante si la actualización es exitosa
     */
    async handleSubmit() {
      try {
        const token = localStorage.getItem('x-token');
        const response = await axios.put(
          `${API_URL}/api/students/${this.$route.params.id}`,
          this.student,
          {
            headers: {
              'x-token': token
            }
          }
        );

        await Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: response.data.msg || 'Los cambios han sido guardados exitosamente'
        });

        this.$router.push(`/psychologist/dashboard/patients/${this.$route.params.id}`);
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron guardar los cambios'
        });
      }
    },
    /**
     * Navega de vuelta a la vista de detalles del estudiante
     * Utiliza el ID del estudiante de los parámetros de la ruta
     */
    goBack() {
      this.$router.push(`/psychologist/dashboard/patients/${this.$route.params.id}`);
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para el componente EditStudentView */
.student-details-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 1rem;
}

.back-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn:hover {
  color: #0056b3;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
}

.loading-spinner {
  font-size: 2rem;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.student-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-section {
  padding: 2rem;
  border-bottom: 1px solid #dee2e6;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  margin-bottom: 1.5rem;
  color: #343a40;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

.form-actions {
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease-in-out;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>
