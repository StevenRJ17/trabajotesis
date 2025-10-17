<template>
  <div class="bg-white p-4 sm:p-6 shadow-md rounded-lg mb-6">
    <h2 class="text-xl font-semibold text-gray-800">Riesgo de Ideación por Rango de Edad (Proporcional)</h2>
    <p class="text-sm text-gray-500 mb-4">Proporción de riesgo dentro de cada rango de edad (100% Apilado).</p>

    <div class="mb-4 flex items-center">
      <label for="ageFilter" class="text-sm font-medium text-gray-700 mr-3">Filtrar Rango:</label>
      <select 
        id="ageFilter" 
        v-model="ageFilter" 
        @change="fetchData" 
        class="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Todos los Rangos</option>
        <option value="17-19">17-19 Años</option>
        <option value="20-22">20-22 Años</option>
        <option value="23+">+23 Años</option>
      </select>
    </div>

    <div v-if="dataLoaded" class="chart-container w-full mx-auto" style="height: 400px;">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="text-center py-10 text-gray-500">
      Cargando estadísticas por edad...
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { Bar } from 'vue-chartjs'; 
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Define el ORDEN y COLOR de los riesgos
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


// 5. Función para transformar los datos de conteo a porcentaje
const calculatePercentages = (data) => {
    // 1. Agrupar por el Eje X (ageGroup) para obtener los totales
    const totals = data.reduce((acc, item) => {
        acc[item.ageGroup] = (acc[item.ageGroup] || 0) + item.count;
        return acc;
    }, {});

    // 2. Crear el nuevo array de objetos con el porcentaje, manteniendo el conteo.
    return data.map(item => {
        const total = totals[item.ageGroup];
        const percentage = total > 0 ? (item.count / total) * 100 : 0;
        
        return {
            ...item,
            // Renombramos el conteo original
            absoluteCount: item.count, 
            // Añadimos el porcentaje, que será el valor Y del gráfico (0-100)
            count: percentage 
        };
    });
};


export default defineComponent({
  name: 'RiskByAgeStacked100BarChart',
  components: { Bar }, 
  
  setup() {
    const rawStats = ref([]);
    const dataLoaded = ref(false);
    const ageFilter = ref(''); 

    // 1. Computed para obtener los Grupos de Edad Únicos (Eje X)
    const ageGroups = computed(() => {
        const uniqueGroups = new Set(rawStats.value.map(stat => stat.ageGroup));
        // Ordenamos los grupos para que sigan la secuencia lógica
        const sortedGroups = ['17-19 Años', '20-22 Años', '+23 Años', 'Sin Clasificar'].filter(g => uniqueGroups.has(g));
        return sortedGroups;
    });

    // 2. Computed para generar los DATSETS (Segmentos de Riesgo)
    const chartData = computed(() => {
      const allAgeGroups = ageGroups.value;
      
      // Creamos un dataset por cada Nivel de Riesgo
      const datasets = RISK_LEVELS.map(risk => {
        
        let absoluteCounts = []; // Array para guardar los conteos absolutos
        let percentages = [];    // Array para guardar los porcentajes (datos del gráfico)

        allAgeGroups.forEach(group => {
             // Buscamos el objeto stat que coincide con el grupo y el riesgo actual
             const stat = rawStats.value.find(s => s.riskLevel === risk && s.ageGroup === group);
             
             // Si existe, usamos los valores precalculados, si no, es 0
             percentages.push(stat ? stat.count : 0); 
             absoluteCounts.push(stat ? stat.absoluteCount : 0);
        });
        
        return {
          label: risk,
          data: percentages,
          backgroundColor: RISK_COLORS[risk],
          stack: 'stack1', 
          // === CLAVE PARA EL TOOLTIP ===
          absoluteCounts: absoluteCounts,
          // =============================
        };
      });

      return {
        labels: allAgeGroups,
        datasets: datasets,
      };
    });


    // 3. Opciones del gráfico: Configuración clave para "100% Apilado"
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false, 
      scales: {
        x: {
          stacked: true, 
          title: {
            display: true,
            text: 'Rango de Edad'
          }
        },
        y: {
          stacked: true, 
          title: {
            display: true,
            text: 'Porcentaje de Evaluaciones'
          },
          beginAtZero: true,
          
          // === CLAVE: Formateador para mostrar 100% ===
          ticks: {
             callback: function(value) {
                // Muestra el valor como porcentaje
                if (value % 10 === 0) {
                    return value + '%';
                }
             }
          },
          // Asegura que el eje vaya de 0 a 100
          min: 0, 
          max: 100
          // ============================================
        }
      },
      plugins: {
        legend: {
          position: 'right', 
        },
        tooltip: {
            callbacks: {
                // Muestra la cantidad absoluta y el porcentaje en el tooltip
                label: function(context) {
                    let label = context.dataset.label || '';
                    
                    // Obtenemos el conteo absoluto de nuestro array personalizado
                    const count = context.dataset.absoluteCounts[context.dataIndex]; 
                    
                    // Obtenemos el porcentaje (el valor real de la barra)
                    const percentage = context.parsed.y.toFixed(1);
                    
                    if (label) {
                        label += ': ';
                    }
                    if (count !== null) {
                        // Formato: NivelRiesgo: 10 evaluaciones (25.5%)
                        label += `${count} evaluaciones (${percentage}%)`;
                    }
                    return label;
                }
            }
        },
        title: {
          display: true,
          text: 'Riesgo de Ideación Suicida Proporcional por Edad'
        },
      },
    });

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

            const query = ageFilter.value ? `?ageRange=${ageFilter.value}` : '';
            
            const response = await fetch(`${API_URL}/api/statistics/ageRiskLevelStatics${query}`, {
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
                        console.log(statsData, "asi viene la informacion");

            const processedStats = calculatePercentages(statsData);

            rawStats.value = processedStats;
            dataLoaded.value = true;

        } catch (error) {
            console.error('Error al obtener los datos de riesgo por edad:', error);
            rawStats.value = [];
            dataLoaded.value = true;
        }
    };

    fetchData();

    return {
      ageFilter,
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
  height: 400px; 
}
</style>