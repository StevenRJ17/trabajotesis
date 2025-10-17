<template>
  <div class="bg-white p-4 sm:p-6 shadow-md rounded-lg mb-6">
    <h2 class="text-xl font-semibold text-gray-800">Riesgo de Ideación por Género</h2>
    <p class="text-sm text-gray-500 mb-4">Comparación del nivel de riesgo según la identidad de género.</p>

    <div v-if="dataLoaded" class="chart-container w-full mx-auto" style="height: 400px;">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="text-center py-10 text-gray-500">
      Cargando estadísticas por género...
    </div>
  </div>
</template>


<script>
import { defineComponent, ref, computed } from 'vue';
import { Bar } from 'vue-chartjs'; 
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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
  name: 'RiskByGenderGroupedBarChart',
  components: { Bar }, 
  
  setup() {
    const rawStats = ref([]);
    const dataLoaded = ref(false);

    const genders = computed(() => {
        const uniqueGenders = new Set(rawStats.value.map(stat => stat.gender));
        const sortedGenders = ['MASCULINO', 'FEMENINO', 'OTRO'].filter(g => uniqueGenders.has(g));
        return sortedGenders;
    });

    const chartData = computed(() => {
      const allGenders = genders.value;
      
      const datasets = RISK_LEVELS.map(risk => {
        const genderCounts = rawStats.value
          .filter(stat => stat.riskLevel === risk)
          .reduce((acc, stat) => {
            acc[stat.gender] = stat.count;
            return acc;
          }, {});

        const data = allGenders.map(gender => genderCounts[gender] || 0);

        return {
          label: risk,
          data: data,
          backgroundColor: RISK_COLORS[risk],
          // Opcional: Ajustar el ancho de barra individual aquí si no funciona globalmente
          // barPercentage: 1, // Usa todo el espacio de la barra asignada
          // categoryPercentage: 0.8, // Usa el 80% del espacio de la categoría
          // maxBarThickness: 50, // Limita el ancho máximo de la barra
        };
      });

      return {
        labels: allGenders,
        datasets: datasets,
      };
    });


    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false, 
      scales: {
        x: {
          stacked: false, 
          offset: true, // IMPORTANTE: Mueve las barras ligeramente para centrar en las etiquetas.
                       // A veces ayuda con el agrupamiento.
          
          // === AJUSTES DE ANCHO Y ESPACIADO ===
          // categoryPercentage: 0.9, // Usa un 90% del espacio de la categoría
          // barPercentage: 0.9,      // Usa un 90% del espacio de la barra individual
          // Opcional: Ajusta estos si los de abajo no funcionan
          barThickness: 20, // Permite que Chart.js calcule el mejor ancho flexible
          maxBarThickness: 60, // Limita el ancho máximo de cada barra (prueba valores como 40, 50, 60, 70)
          
          // Si el "flex" y "maxBarThickness" no funcionan bien, puedes probar:
          // barThickness: 40, // Un ancho fijo para cada barra (ej. 40px)
          // -------------------------------------

          title: {
            display: true,
            text: 'Identidad de Género'
          }
        },
        y: {
          stacked: false, 
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
          position: 'right', 
        },
        title: {
          display: true,
          text: 'Riesgo de Ideación Suicida por Género'
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
                console.error('ERROR: Token no encontrado. Acceso restringido.');
                dataLoaded.value = true;
                return;
            }

            const response = await fetch(`${API_URL}/api/statistics/genderRiskStatics`, {
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
            console.error('Error al obtener los datos de riesgo por género:', error);
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
.chart-container {
  height: 400px; 
}
</style>