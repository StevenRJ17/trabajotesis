<template>
  <div class="p-4 overflow-x-auto">
    <table class="w-full min-w-max">
      <thead class="bg-gray-50">
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
            Evaluaciones
          </th>
          <th class="px-6 py-4 mr-3text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="(student, index) in students"
          :key="student._id"
          :class="[
            index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
            'hover:bg-gray-100 transition-colors duration-200',
          ]"
        >
          <!-- Estudiante con avatar -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div
                class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center"
              >
                <span class="text-white font-medium text-sm">
                  {{ getInitials(student.fullName) }}
                </span>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">{{ student.fullName }}</div>
                <div class="text-sm text-gray-500">Email: {{ student.email }}</div>
              </div>
            </div>
          </td>

          <!-- Email -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ student.career }}</div>
          </td>

          <!-- Fecha Registro -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ formatDate(student.createdAt) }}</div>
          </td>

          <!-- Evaluaciones -->
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="student.hasAssessment ? 'text-green-600' : 'text-red-500'">
                {{ student.hasAssessment ? 'Realizada' : 'No realizada' }}
            </span>
          </td>

          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="student.evaluationCount > 0 ? 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium' : 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium'"
            >
              {{ student.evaluationCount }} evaluaciones
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
const API_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

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
    getInitials(name) {
      if (!name) return '';
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },
  },
};
</script>
