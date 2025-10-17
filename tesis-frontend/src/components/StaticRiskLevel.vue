<template>
  <div class="bg-white p-4 sm:p-6 shadow-md rounded-lg mb-6">
    <h2 class="text-xl font-semibold text-gray-800">Distribución de Nivel de Riesgo de Ideación</h2>
    <p class="text-sm text-gray-500 mb-4">Conteo de evaluaciones por nivel de riesgo.</p>

    <div v-if="dataLoaded" class="chart-container max-w-xs sm:max-w-sm mx-auto">
      <PieChart :chartData="chartData" :options="chartOptions" />
    </div>
    <div v-else class="text-center py-10 text-gray-500">
      Cargando estadísticas...
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from 'vue';
import { PieChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

// Registrar los componentes esenciales para un gráfico de pastel
Chart.register(...registerables);

// Colores de riesgo (sin cambios)
const RISK_COLORS = {
  'EXTREMO': '#dc3545',   
  'MUY_ALTO': '#ffc107',  
  'ALTO': '#fd7e14',      
  'MEDIO': '#0dcaf0',     
  'MODERADO-BAJO': '#20c997', 
  'BAJO': '#0d6efd',      
};

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default defineComponent({
  name: 'IdeationRiskPieChart',
  components: { PieChart },
  
  setup() {
    const rawStats = ref([]);
    const dataLoaded = ref(false);

    const labels = computed(() => rawStats.value.map(stat => stat.name));
    const dataValues = computed(() => rawStats.value.map(stat => stat.y));
    const backgroundColors = computed(() => rawStats.value.map(stat => RISK_COLORS[stat.name] || '#6c757d'));

    const chartData = computed(() => ({
      labels: labels.value,
      datasets: [{
        data: dataValues.value,
        backgroundColor: backgroundColors.value,
        label: 'Nivel de Riesgo',
      }],
    }));

    // Opciones del gráfico (Responsividad y Estilo)
    const chartOptions = ref({
      // PROPIEDADES CLAVE PARA LA RESPONSIVIDAD:
      responsive: true,
      maintainAspectRatio: true, // Permite que la gráfica cambie de tamaño
      
      // En gráficos de pastel, el aspecto visual es importante en móvil
      aspectRatio: 1, // Mantiene la gráfica cuadrada (1:1) en móvil.

      plugins: {
        legend: {
          position: 'bottom', // Mueve la leyenda abajo para dejar más espacio al gráfico en vertical
          labels: {
            boxWidth: 20,
            padding: 15,
            font: {
              size: window.innerWidth > 768 ? 14 : 10 // Reduce la fuente en móvil
            }
          }
        },
        title: {
          display: true,
          text: 'Distribución de Riesgo de Ideación Suicida',
          font: {
            size: window.innerWidth > 768 ? 18 : 14 // Ajusta el tamaño del título
          }
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const total = dataValues.value.reduce((sum, val) => sum + val, 0);
              const currentValue = tooltipItem.raw;
              const percentage = ((currentValue / total) * 100).toFixed(1);
              return `${tooltipItem.label}: ${percentage}% (${currentValue} casos)`;
            },
          },
        },
      },
    });

    // Lógica de obtención de datos (sin cambios)
const fetchData = async () => {
        dataLoaded.value = false;
        try {
            const token = localStorage.getItem('x-token') || ''; 

            if (!token) {
                console.error('ERROR: No se encontró el token. Acceso restringido.');
                dataLoaded.value = true;
                return;
            }

            const response = await fetch(`${API_URL}/api/statistics/riskLevelStatic`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token, // <<-- El token es necesario para el backend
                }
            }); 

            // ... (manejo de errores y asignación de rawStats.value)
            if (!response.ok) {
                if (response.status === 401) {
                    console.error('Token inválido/expirado. Redirigiendo a login.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            rawStats.value = await response.json();
            dataLoaded.value = true;
        } catch (error) {
            console.error('Error al obtener los datos de la gráfica:', error);
            rawStats.value = [];
            dataLoaded.value = true; 
        }
    };


    fetchData();

    return {
      chartData,
      chartOptions,
      dataLoaded
    };
  },
});
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  /* El padding ayuda a que el gráfico no toque los bordes en móvil */
  padding: 1rem; 
}

/* Estilo clave: Asegura que el contenedor del canvas tenga un ancho máximo 
  y que el canvas se adapte dentro de él.
*/
.chart-container {
  width: 100%;
  max-width: 500px; /* Limita el tamaño en pantallas grandes para gráficos de pastel */
  margin: 0 auto; /* Centra el gráfico */
}
</style>

---
