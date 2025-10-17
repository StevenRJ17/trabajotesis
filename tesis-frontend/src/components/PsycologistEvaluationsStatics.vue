<template>
  <div class="bg-white p-4 sm:p-6 shadow-md rounded-lg mb-6">
    <h2 class="text-xl font-semibold text-gray-800">Evaluaciones Realizadas por Psicólogo</h2>
    <p class="text-sm text-gray-500 mb-4">Conteo total de evaluaciones por psicólogo en el período seleccionado.</p>

    <div class="mb-4 flex items-center">
      <label for="periodFilter" class="text-sm font-medium text-gray-700 mr-3">Filtrar por Tiempo:</label>
      <select 
        id="periodFilter" 
        v-model="periodFilter" 
        @change="fetchData" 
        class="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Todo el Historial</option>
        <option value="day">Hoy</option>
        <option value="week">Esta Semana</option>
        <option value="month">Este Mes</option>
        <option value="year">Este Año</option>
      </select>
    </div>

    <div v-if="dataLoaded" class="chart-container w-full mx-auto" :style="{ height: chartHeight }">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="text-center py-10 text-gray-500">
      Cargando estadísticas de psicólogos...
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { Bar } from 'vue-chartjs'; 
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default defineComponent({
  name: 'EvaluationsByPsychologistHorizontalBarChart',
  components: { Bar }, 
  
  setup() {
    const rawStats = ref([]);
    const dataLoaded = ref(false);
    const periodFilter = ref(''); // 'day', 'week', 'month', 'year', o ''

    // Ajusta la altura dinámicamente según la cantidad de psicólogos
    const chartHeight = computed(() => {
        // Altura mínima + 50px por cada psicólogo
        const baseHeight = 300; 
        const itemsHeight = rawStats.value.length * 50; 
        return `${Math.max(baseHeight, itemsHeight)}px`;
    });

    // 1. Computed para las etiquetas (Nombres de psicólogos - Eje Y)
    const labels = computed(() => {
        return rawStats.value.map(stat => stat.psychologistName);
    });

    // 2. Computed para los valores (Conteo - Eje X)
    const dataValues = computed(() => {
        return rawStats.value.map(stat => stat.count);
    });

    // 3. Objeto de datos completo para Chart.js
    const chartData = computed(() => ({
      labels: labels.value,
      datasets: [
        {
          label: 'Total de Evaluaciones',
          data: dataValues.value,
          backgroundColor: '#4e73df', // Azul de rendimiento
          borderColor: '#4e73df',
          borderWidth: 1,
        },
      ],
    }));


    // 4. Opciones del gráfico: CLAVE para "Horizontal"
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false, 
      indexAxis: 'y', // CLAVE: Muestra las barras de forma horizontal
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'N° de Evaluaciones Realizadas'
          },
          ticks: {
             callback: function(value) { if (value % 1 === 0) { return value; } }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Psicólogo'
          }
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
    });

    // 5. Método para obtener los datos de la API
    const fetchData = async () => {
      dataLoaded.value = false;
      try {
        // 1. Obtener el token del localStorage
        const token = localStorage.getItem('x-token') || ''; 

        if (!token) {
            console.error('ERROR: No se encontró el token de autenticación (x-token).');
            // Puedes mostrar un mensaje al usuario o redirigir a login
            dataLoaded.value = true;
            return;
        }

        const query = periodFilter.value ? `?period=${periodFilter.value}` : '';
        
        const response = await fetch(`${API_URL}/api/statistics/psycologistEvaluations${query}`, {
            method: 'GET',
            headers: {
                // 2. Incluir el token en el header 'x-token'
                'Content-Type': 'application/json',
                'x-token': token, // <<-- ¡El cambio clave!
            }
        }); 
        
        if (!response.ok) {
            // Si la respuesta no es OK (ej. 401 Unauthorized), mostramos un error
            if (response.status === 401) {
                console.error('Token inválido o expirado. Por favor, inicie sesión nuevamente.');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const statsData = await response.json();
        rawStats.value = statsData;
        dataLoaded.value = true;

      } catch (error) {
        console.error('Error al obtener las estadísticas por psicólogo:', error);
        rawStats.value = [];
        dataLoaded.value = true;
      }
    };

    fetchData();

    return {
      periodFilter,
      chartData,
      chartOptions,
      dataLoaded,
      chartHeight,
      fetchData,
    };
  },
});
</script>

<style scoped>
/* No necesita estilos adicionales si ya usas style="height:..." en el template */
</style>