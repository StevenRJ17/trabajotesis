<template>
  <div class="bg-white p-4 sm:p-6 shadow-md rounded-lg mb-6">
    <h2 class="text-xl font-semibold text-gray-800">Riesgo de Ideación por Carrera</h2>
    <p class="text-sm text-gray-500 mb-4">Distribución del nivel de riesgo según la carrera del estudiante.</p>

    <div v-if="dataLoaded" class="chart-container w-full mx-auto" style="height: 400px;">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="text-center py-10 text-gray-500">
      Cargando estadísticas por carrera...
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { Bar } from 'vue-chartjs'; 
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Registra los elementos necesarios para barras apiladas
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Define el ORDEN y COLOR de los riesgos (MUY IMPORTANTE para el gráfico apilado)
const RISK_LEVELS = ['EXTREMO', 'MUY_ALTO', 'ALTO', 'MEDIO', 'MODERADO-BAJO', 'BAJO'];
const RISK_COLORS = {
  'EXTREMO': '#dc3545',       // Rojo
  'MUY_ALTO': '#ff6384',      // Rosado
  'ALTO': '#fd7e14',          // Naranja
  'MEDIO': '#ffc107',         // Amarillo
  'MODERADO-BAJO': '#0dcaf0', // Azul claro
  'BAJO': '#28a745',          // Verde
};

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default defineComponent({
  name: 'RiskByCareerStackedBarChart',
  components: { Bar }, // Usamos el componente Bar
  
  setup() {
    const rawStats = ref([]);
    const dataLoaded = ref(false);

    // 1. Computed para obtener las Carreras Únicas (Eje X)
    const careers = computed(() => {
        const uniqueCareers = new Set(rawStats.value.map(stat => stat.career));
        return Array.from(uniqueCareers).sort();
    });

    // 2. Computed para generar los DATSETS (Segmentos de Riesgo)
    const chartData = computed(() => {
      const allCareers = careers.value;
      
      // Creamos un dataset por cada Nivel de Riesgo (6 datasets)
      const datasets = RISK_LEVELS.map(risk => {
        
        // Creamos un mapa de conteo para la carrera actual { 'Ing. Sistemas': 10, 'Medicina': 5, ... }
        const careerCounts = rawStats.value
          .filter(stat => stat.riskLevel === risk)
          .reduce((acc, stat) => {
            acc[stat.career] = stat.count;
            return acc;
          }, {});

        // Mapeamos el array de carreras para obtener el conteo, usando 0 si la carrera no tiene ese riesgo
        const data = allCareers.map(career => careerCounts[career] || 0);

        return {
          label: risk,
          data: data,
          backgroundColor: RISK_COLORS[risk],
        };
      });

      return {
        labels: allCareers,
        datasets: datasets,
      };
    });


    // 3. Opciones del gráfico: Configuración clave para "apilado"
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false, // Permitir altura fija del contenedor
      scales: {
        x: {
          stacked: true, // CLAVE: Apila las barras en el eje X
          title: {
            display: true,
            text: 'Carrera'
          }
        },
        y: {
          stacked: true, // CLAVE: Apila los valores en el eje Y
          title: {
            display: true,
            text: 'Total de Evaluaciones'
          },
          beginAtZero: true,
          ticks: {
             callback: function(value) { if (value % 1 === 0) { return value; } }
          }
        }
      },
      plugins: {
        legend: {
          position: 'right', // Coloca la leyenda a la derecha para ver los colores del riesgo
        },
        title: {
          display: true,
          text: 'Riesgo de Ideación Suicida por Carrera'
        },
      },
    });

    // 4. Método para obtener los datos de la API
   const fetchData = async () => {
        dataLoaded.value = false;
        try {
            // 🔑 PASO 1: Obtener el token del localStorage
            const token = localStorage.getItem('x-token') || '';

            if (!token) {
                console.error('ERROR: Token no encontrado. Acceso restringido para el psicólogo.');
                dataLoaded.value = true;
                return;
            }

            const response = await fetch(`${API_URL}/api/statistics/carrerRiskStatics`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token, // 🔑 PASO 2: Enviar el token
                }
            }); 
            
            if (!response.ok) {
                 if (response.status === 401) {
                    console.error('Autenticación fallida. El token no es válido o la sesión expiró.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const statsData = await response.json();
            rawStats.value = statsData;
            dataLoaded.value = true;

        } catch (error) {
            console.error('Error al obtener los datos de riesgo por carrera:', error);
            rawStats.value = [];
            dataLoaded.value = true;
        }
    };
    fetchData();

    return {
      chartData,
      chartOptions,
      dataLoaded,
    };
  },
});
</script>

<style scoped>
/* Asegura que el contenedor tenga una altura mínima para que el gráfico sea visible */
.chart-container {
  height: 400px; 
}
</style>