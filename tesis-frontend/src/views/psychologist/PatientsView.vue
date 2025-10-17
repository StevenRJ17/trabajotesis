<template>
  <div class="px-4 py-6 sm:px-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Mis Pacientes</h2>
        <span class="text-sm text-gray-500">{{ users.length }} pacientes en total</span>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <div class="relative">
          <input
            type="text"
            v-model="searchTerm"
            @input="filterPatients"
            placeholder="Buscar paciente..."
            class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-64"
          />
          <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
        </div>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
          @click="showModal = true"
        >
          <i class="fas fa-plus"></i> Agregar Estudiante
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">{{ selectedStudent ? 'Editar' : 'Agregar' }} Estudiante</h3>
          <button @click="closeModal" class="text-gray-600 hover:text-red-500 text-xl font-bold">×</button>
        </div>
        <form @submit.prevent="saveStudent" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre *</label>
              <input v-model="formData.firstName" @input="validateField('firstName')" required placeholder="Ingrese el nombre" :class="{ 'border-red-500': formErrors.firstName }" class="input" />
              <p v-if="formErrors.firstName" class="text-red-500 text-xs mt-1">{{ formErrors.firstName }}</p>
            </div>
            <!-- Apellido -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Apellido *</label>
              <input v-model="formData.lastName" @input="validateField('lastName')" required placeholder="Ingrese el apellido" :class="{ 'border-red-500': formErrors.lastName }" class="input" />
              <p v-if="formErrors.lastName" class="text-red-500 text-xs mt-1">{{ formErrors.lastName }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Edad *</label>
              <input type="number" v-model="formData.age" @input="validateField('age')" min="0" max="100" required :class="{ 'border-red-500': formErrors.age }" class="input" />
              <p v-if="formErrors.age" class="text-red-500 text-xs mt-1">{{ formErrors.age }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ciudad *</label>
              <input v-model="formData.city" @input="validateField('city')" required placeholder="Ingrese la ciudad" :class="{ 'border-red-500': formErrors.city }" class="input" />
              <p v-if="formErrors.city" class="text-red-500 text-xs mt-1">{{ formErrors.city }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono *</label>
              <input v-model="formData.phone" @input="validateField('phone')" required placeholder="Ingrese el teléfono" :class="{ 'border-red-500': formErrors.phone }" class="input" />
              <p v-if="formErrors.phone" class="text-red-500 text-xs mt-1">{{ formErrors.phone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Género *</label>
              <select v-model="formData.gender" @change="validateField('gender')" required :class="{ 'border-red-500': formErrors.gender }" class="input">
                <option value="">Seleccione género</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
              <p v-if="formErrors.gender" class="text-red-500 text-xs mt-1">{{ formErrors.gender }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nivel de Estudios *</label>
              <input v-model="formData.level" @input="validateField('level')" required placeholder="Ingrese nivel de estudios" :class="{ 'border-red-500': formErrors.level }" class="input" />
              <p v-if="formErrors.level" class="text-red-500 text-xs mt-1">{{ formErrors.level }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado Laboral *</label>
              <select v-model="formData.employmentStatus" @change="validateField('employmentStatus')" required :class="{ 'border-red-500': formErrors.employmentStatus }" class="input">
                <option value="">Seleccione estado</option>
                <option value="EMPLEADO">Empleado</option>
                <option value="DESEMPLEADO">Desempleado</option>
                <option value="ESTUDIANTE">Estudiante</option>
              </select>
              <p v-if="formErrors.employmentStatus" class="text-red-500 text-xs mt-1">{{ formErrors.employmentStatus }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Ingresos</label>
              <input type="number" v-model="formData.income" @input="validateField('income')" placeholder="Ingrese ingresos" :class="{ 'border-red-500': formErrors.income }" class="input" />
              <p v-if="formErrors.income" class="text-red-500 text-xs mt-1">{{ formErrors.income }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Carrera *</label>
              <input v-model="formData.career" @input="validateField('career')" required placeholder="Ingrese carrera" :class="{ 'border-red-500': formErrors.career }" class="input" />
              <p v-if="formErrors.career" class="text-red-500 text-xs mt-1">{{ formErrors.career }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email *</label>
              <input type="email" v-model="formData.email" @input="validateField('email')" required placeholder="ejemplo@dominio.com" :class="{ 'border-red-500': formErrors.email }" class="input" />
              <p v-if="formErrors.email" class="text-red-500 text-xs mt-1">{{ formErrors.email }}</p>
            </div>
            <div v-if="!selectedStudent">
              <label class="block text-sm font-medium text-gray-700">Contraseña *</label>
              <input type="password" v-model="formData.password" @input="validateField('password')" required placeholder="Mínimo 6 caracteres" :class="{ 'border-red-500': formErrors.password }" class="input" />
              <p v-if="formErrors.password" class="text-red-500 text-xs mt-1">{{ formErrors.password }}</p>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100">Cancelar</button>
            <button type="submit" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" :disabled="!isFormValid">
              {{ selectedStudent ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabla -->
<div v-else class="overflow-x-auto h-[calc(100vh-300px)]">
  <table class="w-full border-collapse">
    <thead>
      <tr class="bg-gray-100 text-gray-700 text-left sticky top-0 z-10">
        <th class="p-3">Estudiante</th>
        <th class="p-3">Email</th>
        <th class="p-3">Carrera</th>
        <th class="p-3 text-center">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="user in filteredUsers"
        :key="user._id"
        class="bg-white cursor-pointer border-b"
        @click="viewStudentDetails(user)"
      >
        <td class="p-3 ">
          <div class="flex items-center">
            <div class="min-w-[40px] min-h-[40px] w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm leading-none">
              {{ getInitials(`${user?.firstName || ''} ${user?.lastName || ''}`) }}
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
            </div>
          </div>
        </td>

        <td class="p-3">{{ user.email }}</td>
        <td class="p-3">{{ user.career }}</td>

        <td class="p-3 text-center">
          <div class="flex justify-center gap-2">
            <button class="text-blue-500 hover:text-blue-700" title="Editar" @click.stop="editStudent(user)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="text-yellow-500 hover:text-yellow-600" title="Notas" @click.stop>
              <i class="fas fa-notes-medical"></i>
            </button>
            <button class="text-green-500 hover:text-green-600" title="Agendar" @click.stop>
              <i class="fas fa-calendar-plus"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

    <!-- Importación -->
    <div class="mt-8">
      <h2 class="text-lg font-semibold mb-2">Importar Estudiantes</h2>
      <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" class="mb-2 block" />
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        @click="uploadExcel"
        :disabled="!selectedFile || isLoading"
      >
        {{ isLoading ? 'Subiendo...' : 'Importar' }}
      </button>
      <p v-if="uploadMessage" class="mt-2 text-green-600">{{ uploadMessage }}</p>
      <p v-if="uploadError" class="mt-2 text-red-600">{{ uploadError }}</p>
    </div>
    <div class="mt-8">
      <h2 class="text-lg font-semibold mb-2">Descargar Plantilla para ingresar usuarios en masa (Lea los comentarios de cada columna en el exel.)</h2>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        @click="downloadTemplate"
      >
      Descargar Plantilla
      <a 
     ref="downloadLink" 
     href="/plantilla_usuarios.xlsx" 
     download="plantilla_usuarios.xlsx" 
     style="display: none;"
   ></a>
      </button>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
<script>
const API_URL = import.meta.env.VITE_API_BASE_URL;
/**
 * Importación de dependencias
 * @requires axios - Cliente HTTP para realizar peticiones al servidor
 * @requires sweetalert2 - Biblioteca para mostrar notificaciones elegantes
 */
import axios from 'axios'
import Swal from 'sweetalert2'

/**
 * Componente para gestionar la lista de pacientes del psicólogo
 * @component
 */
export default {
  name: 'PatientsView',
  /**
   * Estado local del componente
   * @returns {Object} Estado inicial con datos de pacientes, formulario y validación
   */
  data() {
    return {
      selectedFile: null,
      uploadMessage: '',
      uploadError: '',
      isLoading: false,
      users: [],
      filteredUsers: [],
      loading: true,
      error: null,
      searchTerm: '',
      showModal: false,
      selectedStudent: null,
      formData: {
        firstName: '',
        lastName: '',
        age: '',
        city: '',
        phone: '',
        gender: '',
        level: '',
        employmentStatus: '',
        income: '',
        career: '',
        email: '',
        password: '',
        finalRemarks: ''
      },
      formErrors: {}
    }
  },
  /**
   * Ciclo de vida: Se ejecuta cuando el componente es creado
   * Carga la lista inicial de pacientes
   */
  
  async created() {
    await this.fetchUsers()
  },
  /**
   * Métodos del componente para manejar la lógica de negocio
   */
  methods: {
    downloadTemplate() {
      // Simplemente simulamos un clic en el enlace oculto
      this.$refs.downloadLink.click();
    },
    getInitials(name) {
  try {
    if (!name || typeof name !== 'string') return '';

    const parts = name.trim().split(/\s+/).filter(Boolean);

    const first = parts?.[0]?.[0]?.toUpperCase() || '';
    const second = parts?.[1]?.[0]?.toUpperCase() || '';

    return first + second;
  } catch (error) {
    console.error('Error en getInitials:', error);
    return '';
  }
},
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      this.uploadMessage = '';
      this.uploadError = '';
    },
    async uploadExcel() {
      if (!this.selectedFile) return;

      this.isLoading = true;
      this.uploadMessage = '';
      this.uploadError = '';

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        const token = localStorage.getItem('x-token');

        const response = await axios.post(`${API_URL}/api/students/import`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-token': token
          }
        });

        this.uploadMessage = response.data.msg || 'Estudiantes importados con éxito';
        this.selectedFile = null;
      } catch (error) {
        console.error(error);
        this.uploadError = error.response?.data?.msg || 'Error al importar estudiantes';
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Obtiene la lista de pacientes desde el servidor
     * @async
     */
    async fetchUsers() {
      try {
        this.loading = true
        this.error = null
        const token = localStorage.getItem('x-token')
        const response = await axios.get(`${API_URL}/api/students`, {
          headers: {
            'x-token': token
          }
        })

        this.users = response.data.students
        this.filteredUsers = this.users
      } catch (err) {
        this.error = 'Error al cargar los pacientes: ' + (err.response?.data?.message || err.message)
        console.error('Error:', err)
      } finally {
        this.loading = false
      }
    },
    /**
     * Genera las iniciales del nombre completo del paciente
     * @param {string} firstName - Nombre del paciente
     * @param {string} lastName - Apellido del paciente
     * @returns {string} Iniciales en mayúsculas
     */

    /**
     * Filtra la lista de pacientes según el término de búsqueda
     * Actualiza la lista filtrada en tiempo real
     */
    filterPatients() {
      const searchLower = this.searchTerm.toLowerCase()
      this.filteredUsers = this.users.filter(user => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower)
      )
    },
    /**
     * Cierra el modal y reinicia el formulario
     * Limpia los errores de validación
     */
    closeModal() {
      this.showModal = false
      this.selectedStudent = null
      this.formData = {
        firstName: '',
        lastName: '',
        age: '',
        city: '',
        phone: '',
        gender: '',
        level: '',
        employmentStatus: '',
        income: '',
        career: '',
        email: '',
        password: ''
      }
      this.formErrors = {}
    },
    /**
     * Valida un campo específico del formulario
     * @param {string} field - Nombre del campo a validar
     */
    validateField(field) {
      this.formErrors[field] = ''

      const value = this.formData[field]?.toString().trim() || ''
      const age = field === 'age' ? parseInt(value) : null
      const income = field === 'income' && value !== '' ? parseFloat(value) : null

      switch (field) {
        case 'firstName':
        case 'lastName':
          if (!value) {
            this.formErrors[field] = `El ${field === 'firstName' ? 'nombre' : 'apellido'} es requerido`
          } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/.test(value)) {
            this.formErrors[field] = `El ${field === 'firstName' ? 'nombre' : 'apellido'} solo debe contener letras y espacios (2-30 caracteres)`
          }
          break

        case 'age':
          if (!value) {
            this.formErrors.age = 'La edad es requerida'
          } else if (isNaN(age) || age < 0 || age > 100) {
            this.formErrors.age = 'La edad debe estar entre 0 y 100 años'
          }
          break

        case 'city':
          if (!value) {
            this.formErrors.city = 'La ciudad es requerida'
          } else if (value.length < 2 || value.length > 50) {
            this.formErrors.city = 'La ciudad debe tener entre 2 y 50 caracteres'
          }
          break

        case 'phone':
          if (!value) {
            this.formErrors.phone = 'El teléfono es requerido'
          } else if (!/^\+?[\d\s-]{6,15}$/.test(value)) {
            this.formErrors.phone = 'Formato de teléfono inválido'
          }
          break

        case 'gender':
          if (!value) {
            this.formErrors.gender = 'El género es requerido'
          }
          break

        case 'level':
          if (!value) {
            this.formErrors.level = 'El nivel de estudios es requerido'
          } else if (value.length < 2 || value.length > 50) {
            this.formErrors.level = 'El nivel de estudios debe tener entre 2 y 50 caracteres'
          }
          break

        case 'employmentStatus':
          if (!value) {
            this.formErrors.employmentStatus = 'El estado laboral es requerido'
          }
          break

        case 'income':
          if (value !== '') {
            if (isNaN(income) || income < 0) {
              this.formErrors.income = 'Los ingresos no pueden ser negativos'
            }
          }
          break

        case 'career':
          if (!value) {
            this.formErrors.career = 'La carrera es requerida'
          } else if (value.length < 2 || value.length > 50) {
            this.formErrors.career = 'La carrera debe tener entre 2 y 50 caracteres'
          }
          break

        case 'email':
          if (!value) {
            this.formErrors.email = 'El email es requerido'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            this.formErrors.email = 'Email inválido'
          }
          break

        case 'password':
          if (!this.selectedStudent) { // Solo validar contraseña para nuevos estudiantes
            if (!value) {
              this.formErrors.password = 'La contraseña es requerida'
            } else if (value.length < 6) {
              this.formErrors.password = 'La contraseña debe tener al menos 6 caracteres'
            }
          }
          break
      }
    },
    /**
     * Guarda o actualiza la información de un paciente
     * @async
     * Realiza validación completa antes de enviar al servidor
     */
    async saveStudent() {
      const fieldsToValidate = Object.keys(this.formData).filter(field => 
        field !== 'password' || !this.selectedStudent
      )

      fieldsToValidate.forEach(field => {
        if (field !== 'income' || this.formData[field]) { // income es opcional
          this.validateField(field)
        }
      })

      const hasErrors = Object.values(this.formErrors).some(error => error !== '')

      if (hasErrors) {
        const errorMessages = Object.values(this.formErrors)
          .filter(error => error !== '')
          .join('\n')

        Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          text: errorMessages
        })
        return
      }

      try {
        const token = localStorage.getItem('x-token')
        const url = `${API_URL}/api/students`
        const method = this.selectedStudent ? 'PUT' : 'POST'
        const endpoint = this.selectedStudent ? `${url}/${this.selectedStudent._id}` : url

        const dataToSend = { ...this.formData }
        if (this.selectedStudent) {
          delete dataToSend.password
        }

        const response = await axios({
          method,
          url: endpoint,
          headers: {
            'Content-Type': 'application/json',
            'x-token': token
          },
          data: dataToSend
        })

        const data = response.data

        if (response.status === 201 || response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: data.msg || (this.selectedStudent ? 'Estudiante actualizado correctamente' : 'Estudiante creado correctamente')
          })
          this.closeModal()
          await this.fetchUsers()
        } else {
          throw new Error(data.msg || 'Error al procesar la solicitud')
        }
      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.msg || error.message || 'Error al procesar la solicitud'
        })
      }
    },
    /**
     * Prepara el formulario para editar un paciente existente
     * @param {Object} student - Datos del paciente a editar
     */
    editStudent(student) {
      this.selectedStudent = student
      this.formData = {
        firstName: student.firstName,
        lastName: student.lastName,
        age: student.age,
        city: student.city,
        phone: student.phone,
        gender: student.gender,
        level: student.level,
        employmentStatus: student.employmentStatus,
        income: student.income,
        career: student.career,
        email: student.email,
        password: '' // No incluimos la contraseña en la edición
      }
      this.showModal = true
    },
    /**
     * Navega a la vista de detalles del paciente
     * @param {Object} student - Datos del paciente a visualizar
     */
    viewStudentDetails(student) {
      this.$router.push(`/psychologist/dashboard/patients/${student._id}`)
    }
  },
  /**
   * Propiedades computadas del componente
   */
  computed: {
    /**
     * Verifica si el formulario es válido para enviar
     * @returns {boolean} true si no hay errores de validación
     */
    isFormValid() {
      return Object.values(this.formErrors).every(error => error === '')
    }
  }
}
</script>

