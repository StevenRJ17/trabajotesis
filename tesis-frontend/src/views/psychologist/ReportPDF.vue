<template>
  <div class="p-4">
    <h1 class="mb-4 text-4xl leading-none text-gray-500">Selecionar el estudiante a evaluar: </h1>
    
    <div class="mt-8 h-[calc(100vh-17 0px)] overflow-y-auto relative">
      <table class="w-full min-w-max">
        <thead class="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estudiante
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Carrera
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Registro
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Evaluado
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="(student, index) in students" 
            :key="student._id" 
            @click="viewStudentDetails(student)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center"></div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ student.fullName }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ student.career }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatDate(student.createdAt) }}</div>
            </td>
            <td class="px-10 py-4 whitespace-nowrap">
              <span :class="student.hasAssessment ? 'text-green-600' : 'text-red-500'">
                {{ student.hasAssessment ? 'Si' : 'No' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script >
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default {
  data() {
    return {
      students: [],
    };
  },
  async created() {
    try {
      const token = localStorage.getItem('x-token');
      const psychologistId = localStorage.getItem('userId');

      if (!psychologistId) {
        console.error('ID de psicólogo no encontrado en localStorage');
        return;
      }
      if (!token) {
        console.error('Token no encontrado en localStorage');
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/students/by-psychologist/${psychologistId}`,
        {
          headers: { 'x-token': token },
        }
      );

      this.students = res.data.students;
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  },
  methods: {

    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },
    viewStudentDetails(student) {
      
      this.$router.push(`/psychologist/dashboard/studenteva/${student._id}`)
    }
  },
}
</script>

<style scoped>

</style>