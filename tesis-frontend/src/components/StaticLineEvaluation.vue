<template>
  <div class="bg-white p-4 sm:p-6 shadow-md rounded-lg mb-6">
    <h2 class="text-xl font-semibold text-gray-800">Tendencia de Evaluaciones Realizadas</h2>
    <p class="text-sm text-gray-500 mb-4">Muestra el número de evaluaciones a lo largo del tiempo.</p>

    <div class="mb-4 flex items-center">
      <label for="timeframe" class="text-sm font-medium text-gray-700 mr-3">Agrupar por:</label>
      <select 
        id="timeframe" 
        v-model="timeframe" 
        @change="fetchData" 
        class="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="day">Día</option>
        <option value="week">Semana</option>
        <option value="month">Mes</option>
        <option value="year">Año</option>
      </select>
    </div>

    <div v-if="dataLoaded" class="chart-container w-full mx-auto" style="height: 350px;">
      <LineChart :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="text-center py-10 text-gray-500">
      Cargando datos de tendencia...
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { Line } from 'vue-chartjs'; 
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

// === IMPORTACIONES DE DATE-FNS ===
import { parseISO, format, getDay, startOfWeek, isValid } from 'date-fns';
import { es } from 'date-fns/locale'; // Para tener los nombres en español
// ==================================

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

const API_URL = import.meta.env.VITE_API_BASE_URL;

// FUNCIÓN DE AYUDA PARA FORMATO DE ETIQUETAS
const formatLabel = (dateLabel, timeframe) => {
    switch (timeframe) {
        case 'week':
            const [yearStr, weekStr] = dateLabel.split('-W');
            const weekNumber = parseInt(weekStr, 10);
            const year = parseInt(yearStr, 10);
            
            // --- Cálculo del inicio de la semana ISO (para formateo) ---
            const firstDayOfYear = new Date(year, 0, 4); // 4 de enero
            const startOfFirstISOWeek = startOfWeek(firstDayOfYear, { weekStartsOn: 1 });
            
            // Calcular la fecha para la semana deseada
            const targetDate = new Date(startOfFirstISOWeek.getTime());
            targetDate.setDate(targetDate.getDate() + (weekNumber - 1) * 7);

            if (isValid(targetDate)) {
                 // Formato legible: "Semana 40 (Oct 01)"
                return `Semana ${weekNumber} (${format(targetDate, 'MMM dd', { locale: es })})`;
            }
            return dateLabel; 
            
        case 'month':
            // 'YYYY-MM' -> 'Octubre 2025'
            if (dateLabel.length === 7) { // Asegura que es 'YYYY-MM'
                return format(parseISO(dateLabel), 'MMMM yyyy', { locale: es });
            }
            return dateLabel;
            
        case 'year':
            // 'YYYY' -> '2025'
            return dateLabel;
            
        case 'day':
            // 'YYYY-MM-DD' -> '01 Oct'
            if (dateLabel.length === 10) { // Asegura que es 'YYYY-MM-DD'
                return format(parseISO(dateLabel), 'dd MMM', { locale: es });
            }
            return dateLabel;
            
        default:
            return dateLabel;
    }
};
// FIN FUNCIÓN DE AYUDA

export default defineComponent({
  name: 'AssessmentTimelineLineChart',
  components: { LineChart: Line }, 
  
  setup() {
    const rawStats = ref([]);
    const dataLoaded = ref(false);
    const timeframe = ref('month'); 

    // 2. Computed para las etiquetas (Eje X) - APLICACIÓN DEL FORMATO
    // AHORA LLAMA A LA FUNCIÓN DE FORMATO ANTES DE ASIGNAR LA ETIQUETA
    const labels = computed(() => 
        rawStats.value.map(stat => formatLabel(stat.dateLabel, timeframe.value))
    );

    // 3. Computed para los valores (Eje Y)
    const dataValues = computed(() => rawStats.value.map(stat => stat.count));

    // 4. Objeto de datos completo para Chart.js
    const chartData = computed(() => ({
      labels: labels.value,
      datasets: [
        {
          label: 'N° de Evaluaciones',
          data: dataValues.value,
          borderColor: '#1e40af', 
          backgroundColor: 'rgba(30, 64, 175, 0.1)', 
          tension: 0.3, 
          fill: true, 
        },
      ],
    }));

    // 5. Opciones del gráfico (sin cambios esenciales)
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false, 
      scales: {
        y: {
          title: {
            display: true,
            text: 'N° de Evaluaciones'
          },
          beginAtZero: true,
          ticks: {
             callback: function(value) { if (value % 1 === 0) { return value; } }
          }
        },
        x: {
          // El texto del título del eje X se actualiza en fetchData
          title: {
            display: true,
            text: `Período (${timeframe.value.toUpperCase()})`
          }
        }
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
    });

    // 6. Método para obtener los datos de la API
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

            const queryParams = `?timeframe=${timeframe.value}`;
            
            const response = await fetch(`${API_URL}/api/statistics/timeEvaluatiomStatic${queryParams}`, {
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

            // Actualiza el título del eje X
            chartOptions.value.scales.x.title.text = `Período (${timeframe.value.toUpperCase()})`;

        } catch (error) {
            console.error('Error al obtener los datos de la línea de tiempo:', error);
            rawStats.value = [];
            dataLoaded.value = true;
        }
    };

    fetchData();

    return {
      timeframe,
      chartData,
      chartOptions,
      dataLoaded,
      fetchData
    };
  },
});
</script>

<style scoped>
.chart-container {
  height: 350px; 
}
</style>