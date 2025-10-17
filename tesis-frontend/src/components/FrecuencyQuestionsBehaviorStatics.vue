<template>
  <div class="bg-white p-4 sm:p-6 shadow-md rounded-lg mb-6">
    <h2 class="text-xl font-semibold text-gray-800">Frecuencia de Comportamiento Suicida</h2>
    <p class="text-sm text-gray-500 mb-4">Conteo de evaluaciones con respuesta positiva en actos de comportamiento.</p>

    <div v-if="dataLoaded" class="chart-container w-full mx-auto" style="height: 400px;">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="text-center py-10 text-gray-500">
      Cargando estadísticas de frecuencia...
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
  name: 'BehaviorFrequencyBarChart',
  components: { Bar }, 
  
  setup() {
    const rawStats = ref(null); 
    const dataLoaded = ref(false);

    // Mapeo fijo de etiquetas y claves del backend
    const labelsMap = {
      actualAttemptCount: 'Intento Actual',
      interruptedAttemptCount: 'Intento Interrumpido',
      abortedAttemptCount: 'Intento Abortado',
      preparatoryActsCount: 'Actos Preparatorios'
    };
    
    // 1. Computed para las etiquetas (Eje X)
    const labels = computed(() => {
        if (!rawStats.value) return [];
        return Object.values(labelsMap);
    });

    // 2. Computed para los valores (Eje Y)
    const dataValues = computed(() => {
        if (!rawStats.value || rawStats.value.length === 0) return [];
        
        const statsObject = rawStats.value[0]; 
        
        // Recorremos las claves en el orden definido por labelsMap para obtener los valores
        return Object.keys(labelsMap).map(key => statsObject[key]);
    });

    // 3. Objeto de datos completo para Chart.js
    const chartData = computed(() => ({
      labels: labels.value,
      datasets: [
        {
          label: 'Respuestas Positivas',
          data: dataValues.value,
          backgroundColor: '#dc3545', // Rojo para actos de comportamiento (más serio)
          borderColor: '#dc3545',
          borderWidth: 1,
        },
      ],
    }));


    // 4. Opciones del gráfico (Barra simple)
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false, 
      scales: {
        x: {
          title: {
            display: true,
            text: 'Comportamiento Suicida'
          }
        },
        y: {
          title: {
            display: true,
            text: 'N° de Respuestas Positivas'
          },
          beginAtZero: true,
          ticks: {
             callback: function(value) { if (value % 1 === 0) { return value; } }
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
            // 🔑 PASO 1: Obtener el token del localStorage
            const token = localStorage.getItem('x-token') || '';

            if (!token) {
                console.error('ERROR: Token no encontrado. Acceso restringido.');
                dataLoaded.value = true;
                return;
            }

            const response = await fetch(`${API_URL}/api/statistics/questionsBehaviorFrecuencyStatics`, {
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
            console.error('Error al obtener los datos de frecuencia de comportamiento:', error);
            rawStats.value = null;
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