<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Dashboard de Análisis Estadístico</h1>

    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Filtros</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        
        <div>
          <label class="block text-sm font-medium text-gray-600">Rango de Fechas</label>
          <div class="flex items-center space-x-2">
            <input type="date" v-model="filters.startDate" class="form-input" />
            <span>a</span>
            <input type="date" v-model="filters.endDate" class="form-input" />
          </div>
        </div>

        <div>
          <label for="career" class="block text-sm font-medium text-gray-600">Carrera</label>
          <select id="career" v-model="filters.career" class="form-select">
            <option value="">Todas</option>
            <option v-for="c in uniqueCareers" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <div>
          <label for="gender" class="block text-sm font-medium text-gray-600">Género</label>
          <select id="gender" v-model="filters.gender" class="form-select">
            <option value="">Todos</option>
            <option v-for="g in uniqueGenders" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>

        <div>
          <label for="analysis-type" class="block text-sm font-medium text-gray-600">Tipo de Análisis de Riesgo</label>
          <select id="analysis-type" v-model="filters.analysisType" class="form-select">
            <option value="ideationRiskLevel">Nivel de Riesgo de Ideación</option>
            <option value="behaviorRiskLevel">Nivel de Riesgo de Comportamiento</option>
          </select>
        </div>

        <div>
          <label for="psychologist" class="block text-sm font-medium text-gray-600">Psicólogo Evaluador</label>
          <select id="psychologist" v-model="filters.psychologistId" class="form-select">
            <option value="">Todos</option>
            <option v-for="p in psychologists" :key="p._id" :value="p._id">{{ p.firstName }} {{ p.lastName }}</option>
          </select>
        </div>
      </div>
      
      <div class="mt-4 flex justify-end">
        <button @click="fetchAssessments" class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Aplicar Filtros
        </button>
      </div>
    </div>

    <div v-if="!isLoading" class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-lg shadow-md col-span-full">
        <h3 class="text-xl font-semibold mb-4 text-center text-gray-700">{{ chartTitle }}</h3>
        <p class="text-sm text-gray-500 text-center mb-4">{{ displayedFilters }}</p>
        <div v-if="assessments.length > 0">
          <Bar :data="barChartData" :options="chartOptions" />
        </div>
        <div v-else class="text-center text-gray-500">
          <p>No hay datos de evaluaciones disponibles para este filtro.</p>
        </div>
      </div>
    </div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md min-h-[300px] text-center">
      <p class="text-lg text-gray-500">Cargando datos...</p>
    </div>
  </div>

  <StaticRiskLevel/>
  <StaticLineEvaluation/>
  <StaticCareerRiskLevel/>
  <StaticsGenderRiskLevel/>
  <StaticsAgaRiskLevel/>
  <FrecuencyQuestionsStatics/>
  <FrecuencyQuestionsBehaviorStatics/>
</template>

<script>
const API_URL = import.meta.env.VITE_API_BASE_URL;
import FrecuencyQuestionsBehaviorStatics from '@/components/FrecuencyQuestionsBehaviorStatics.vue';
import FrecuencyQuestionsStatics from '@/components/FrecuencyQuestionsStatics.vue';
import StaticCareerRiskLevel from '@/components/StaticCareerRiskLevel.vue';
import StaticLineEvaluation from '@/components/StaticLineEvaluation.vue';
import StaticRiskLevel from '@/components/StaticRiskLevel.vue';
import StaticsAgaRiskLevel from '@/components/StaticsAgaRiskLevel.vue';
import StaticsGenderRiskLevel from '@/components/StaticsGenderRiskLevel.vue';
import axios from 'axios';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  components: { Bar, StaticRiskLevel, FrecuencyQuestionsBehaviorStatics, FrecuencyQuestionsStatics , StaticLineEvaluation, StaticCareerRiskLevel,StaticsGenderRiskLevel, StaticsAgaRiskLevel },
  data() {
    return {
      // 🔑 CORRECCIÓN 1: Objeto filters simplificado (se eliminó el handler incorrecto)
      filters: {
        startDate: '',
        endDate: '',
        career: '',
        gender: '',
        psychologistId: '',
        analysisType: 'ideationRiskLevel'
      },
      isLoading: false,
      psychologists: [],
      studenslist: [],
      assessments: [],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Evaluaciones'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Nivel de Riesgo'
            }
          }
        }
      }
    };
  },
  async mounted() {
    await this.fetchPsychologists();
    await this.fetchStudentDetails();
    this.fetchAssessments();
  },
  computed: {
    uniqueCareers() {
      // Las carreras se obtienen de los datos de las evaluaciones, que ya están filtradas.
      const careers = this.assessments.map(assessment => assessment.studentInfo?.career).filter(Boolean);
      return [...new Set(careers)];
    },
    uniqueGenders() {
      const genders = this.studenslist.map(student => student.gender).filter(Boolean);
      return [...new Set(genders)];
    },
    displayedFilters() {
      const parts = [];
      if (this.filters.startDate && this.filters.endDate) {
        parts.push(`Fechas: ${this.filters.startDate} a ${this.filters.endDate}`);
      }
      if (this.filters.career) {
        parts.push(`Carrera: ${this.filters.career}`);
      }
      if (this.filters.gender) {
        parts.push(`Género: ${this.filters.gender}`);
      }
      if (this.filters.psychologistId) {
        const psychologist = this.psychologists.find(p => p._id === this.filters.psychologistId);
        if (psychologist) {
          parts.push(`Psicólogo: ${psychologist.firstName} ${psychologist.lastName}`);
        }
      }
      return parts.length ? `Filtros aplicados: ${parts.join(', ')}` : 'No hay filtros aplicados.';
    },
    // 🔑 CORRECCIÓN 2: Eliminamos 'filteredAssessments'. Usaremos 'assessments' directamente.
    
    chartTitle() {
      const titleMap = {
        'ideationRiskLevel': 'Distribución de Nivel de Riesgo de Ideación',
        'behaviorRiskLevel': 'Distribución de Nivel de Riesgo de Comportamiento'
      };
      return titleMap[this.filters.analysisType] || 'Distribución de Nivel de Riesgo';
    },
    barChartData() {
      // Usamos this.assessments (ya filtrados por el backend)
      if (this.assessments.length === 0) {
        return { labels: [], datasets: [] };
      }
      
      const riskCounts = this.assessments.reduce((acc, assessment) => {
        // Aseguramos que studentInfo existe antes de acceder a la carrera
        const riskLevel = assessment[this.filters.analysisType] || 'Desconocido';
        acc[riskLevel] = (acc[riskLevel] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(riskCounts);
      const data = Object.values(riskCounts);
      
      const backgroundColors = labels.map(label => {
        switch (label) {
          case 'BAJO':
            return '#4299e1'; // Blue
          case 'MODERADO-BAJO':
            return '#63b3ed'; // Tailwind blue-400
          case 'MODERADO':
            return '#f6ad55'; // Tailwind orange-500
          case 'ALTO':
            return '#ed8936'; // Tailwind orange-600
          case 'MUY_ALTO':
            return '#f56565'; // Tailwind red-500
          case 'EXTREMO':
            return '#c53030'; // Tailwind red-700
          default:
            return '#a0aec0'; // Tailwind gray-500
        }
      });

      return {
        labels: labels,
        datasets: [{
          label: 'Número de Evaluaciones',
          backgroundColor: backgroundColors,
          data: data
        }]
      };
    }
  },
  methods: {
    async fetchPsychologists() {
      try {
        const token = localStorage.getItem('x-token');
        if (!token) {
          console.error('No se encontró el token de autenticación.');
          return;
        }
        const response = await axios.get(`${API_URL}/api/users/psychologistslist`, {
          headers: {
            'x-token': token
          }
        });
        this.psychologists = response.data.psychologists;
      } catch (error) {
        console.error('Error al obtener la lista de psicólogos:', error);
      }
    },
    async fetchStudentDetails() {
      try {
        const token = localStorage.getItem('x-token');
        const response = await axios.get(`${API_URL}/api/students`, {
          headers: {
            'x-token': token
          }
        });
        this.studenslist = response.data.students;
      } catch (error) {
        console.error('Error al obtener detalles del estudiante:', error);
      }
    },
    
    async fetchAssessments() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem('x-token');
        if (!token) {
          console.error('No se encontró el token de autenticación.');
          this.isLoading = false;
          return;
        }
        
        // Enviamos todos los filtros a la API, que los aplicará junto con el filtro de rol.
        const response = await axios.get(`${API_URL}/api/statistics/all-assessments`, { 
          params: this.filters,
          headers: {
            'x-token': token
          }
        });
        
        // Almacenamos el resultado, que ya debe venir filtrado por el backend
        this.assessments = response.data;
        
      } catch (error) {
        console.error('Error al obtener datos de la API:', error.message);
        console.error('Detalles del error:', error.response || error);
        this.assessments = []; // Asegurar que assessments se vacía en caso de error
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.form-input, .form-select {
  @apply w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500;
}
</style>