<!--
Componente AdminHomeView

Este componente representa el panel de control principal para los administradores del sistema.
Muestra un resumen de las estadísticas importantes y proporciona acceso rápido a las
funcionalidades principales del sistema.
-->

<template>
  <div class=" ">
    <div class="py-16 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-semibold text-dark tracking-tight sm:text-4xl">
            Bienvenido a Mindex
          </h2>
          <p class="mt-4 text-lg text-gray-800">
            Aplicativo web para la gestión de evaluación Columbia mediante un dashboard intuitivo
            para el manejo de estudiantes, estadísticas y reportes.
          </p>
        </div>
        <div class="mt-16 text-center">
          <h2 class="text-2xl font-semibold text-dark tracking-tight">
            Opciones dentro de la plataforma
          </h2>
          <p class="mt-2 text-lg text-gray-800">
            Explora las diversas funcionalidades que Mindex tiene para ofrecer.
          </p>
        </div>
        <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">

          <div class="bg-white rounded-xl shadow-md overflow-hidden max-w-xs sm:max-w-sm w-full
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-xl cursor-pointer">
            <img class="w-full h-40 object-cover" src="../assets/img/report.jpg" alt="Reportes Precisos">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Reportes Precisos</h3>
              <p class="text-gray-700 text-base mb-4">
                Acceso a los reportes generados por el psicólogo con sus respectivos campos y
                datos.
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#reportes</span>
                <span
                  class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#datos</span>
                <span
                  class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#estadísticas</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md overflow-hidden max-w-xs sm:max-w-sm w-full
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-xl cursor-pointer">
            <img class="w-full h-40 object-cover" src="../assets/img/eval.webp" alt="Evaluacion Columbia">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Evaluacion Columbia</h3>
              <p class="text-gray-700 text-base mb-4">
                Realización completa de la evaluación Columbia con todos sus campos.
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#evaluación</span>
                <span
                  class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#columbia</span>
                <span
                  class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#resultados</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">

          <div class="bg-white rounded-xl shadow-md overflow-hidden max-w-xs sm:max-w-sm w-full
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-xl cursor-pointer">
            <img class="w-full h-40 object-cover" src="../assets/img/Register.png" alt="Registrar Estudiantes">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Registrar Estudiantes</h3>
              <p class="text-gray-700 text-base mb-4">
                Capacidad de ingresar estudiantes individualmente y por lote.
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#Registro</span>
                <span
                  class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#datos</span>
                <span
                  class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#Lote</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md overflow-hidden max-w-xs sm:max-w-sm w-full
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-xl cursor-pointer">
            <img class="w-full h-40 object-cover" src="../assets/img/informa.webp" alt="Informacion Intuitiva">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Informacion Intuitiva</h3>
              <p class="text-gray-700 text-base mb-4">
                Informacion detallada y exacta de cada estudiante.
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#Estudiantes</span>
                <span
                  class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#Datos</span>
                <span
                  class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#resultados</span>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <h2 class="text-3xl font-semibold text-dark tracking-tight sm:text-4xl mt-10">
            Bienvenido a Mindex
          </h2>
        </div>

        <div class="min-h-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
          <div class="max-w-7xl mx-auto">


            <div classname="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div
                class="bg-white rounded-2xl mb-4 shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 mb-1">Total de Psicólogos registrados</p>
                    <p class="text-3xl font-bold text-blue-600">{{ totalPsycologistLoad}}</p>
                  </div>
                  <div class="bg-green-100 p-3 rounded-full">
                    <p class="h-8 w-8 text-green-600 text-center"> {{ totalPsycologistLoad }} </p>
                  </div>
                </div>
              </div>
              <div
                class="bg-white rounded-2xl mb-4 shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 mb-1">Total de Estudiantes registrados</p>
                    <p class="text-3xl font-bold text-blue-600">{{ totalStudentsLoad}}</p>
                  </div>
                  <div class="bg-green-100 p-3 rounded-full">
                    <p class="h-8 w-8 text-green-600 text-center"> {{ totalStudentsLoad }} </p>
                  </div>
                </div>
              </div>
                            <div
                class="bg-white rounded-2xl mb-4 shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 mb-1">Total de Usuarios registrados</p>
                    <p class="text-3xl font-bold text-blue-600">{{ totalPsycologistLoad + totalStudentsLoad}}</p>
                  </div>
                  <div class="bg-green-100 p-3 rounded-full">
                    <p class="h-8 w-8 text-green-600 text-center"> {{ totalPsycologistLoad + totalStudentsLoad }} </p>
                  </div>
                </div>
              </div>
              <div
                class="bg-white rounded-2xl mb-4 shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex items-center justify-between">
                  <div v-if="latestpsicologo">
                    <p class="text-sm font-medium text-gray-600 mb-1">Último Registro</p>
                    <p class="text-lg font-bold text-green-600">{{ latestpsicologo.firstName }} {{
                      latestpsicologo.lastName}}</p>
                    <p class="text-xs text-gray-500">{{ formattedDate }}</p>

                  </div>
                  <div class="bg-green-100 p-3 rounded-full">
                    <p class="h-8 w-8 text-green-600 text-center">1</p>
                  </div>
                </div>
              </div>
              <div
                class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 mb-1">Total Evaluaciones</p>
                    <p class="text-3xl font-bold text-purple-600">{{ totalEvaluaciones }}</p>
                  </div>
                  <div class="bg-green-100 p-3 rounded-full">
                    <p class="h-8 w-8 text-green-600 text-center">2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CountAssessment />
</template>
<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';

// Variables reactivas usando `ref`
const userData = ref(null);
const totalEvaluaciones = ref(0);
const latestpsicologo = ref(null);
const totalActivos = ref(0);
const totalPsycologistLoad = ref(0)
const totalStudentsLoad = ref(0);

// Propiedades computadas
const userName = computed(() => {
  if (userData.value?.firstName && userData.value?.lastName) {
    return `${userData.value.firstName} ${userData.value.lastName}`;
  }
  return userData.value?.name || '';
});

const userRole = computed(() => {
  return userData.value?.user?.role === 'ADMIN' ? 'Administrador' : '';
});

const userInitials = computed(() => {
  if (userData.value?.firstName && userData.value?.lastName) {
    return (userData.value.firstName[0] + userData.value.lastName[0]).toUpperCase();
  }
  return '';
});

const avatarColor = computed(() => {
  const colors = [
    '#1976D2', // primary-color
    '#26A69A', // secondary-color
    '#FF8A65'  // accent-color
  ];
  const hash = userName.value.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return colors[Math.abs(hash) % colors.length];
});
const getLatestPsychologist = async () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    const token = localStorage.getItem('x-token');
    const res = await fetch(`${API_URL}/api/users/getPsicologo`, {
      headers: {
        'x-token': token,
      },
    });
    const responseData = await res.json();

    // Verificamos si la respuesta contiene una propiedad 'psychologists'
    const psychologistList = responseData.psychologists || responseData;

    // Si `psychologistList` es un array, procedemos a ordenarlo.
    if (Array.isArray(psychologistList)) {
      // Ordenamos los psicólogos por la fecha de creación de forma descendente y tomamos el primero.
       latestpsicologo.value = psychologistList
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]

      // Asignamos el resultado a la variable reactiva
    }  else {
      console.warn('No se encontraron psicólogos en la respuesta:', responseData);
    }
  } catch (error) {
    console.error('Error al obtener psicólogos:', error);
  }
};
const formattedDate = computed(() => {
  // Asegúrate de que la fecha existe antes de intentar formatearla
  if (latestpsicologo.value?.createdAt) {
    const date = new Date(latestpsicologo.value.createdAt);
    // Usamos toLocaleDateString para formatear la fecha a un formato legible
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }
  return 'Fecha no disponible';
});
// Funciones
const loadUserData = async () => {
      const API_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    const token = localStorage.getItem('x-token');
    const response = await fetch(`${API_URL}/api/auth/`, {
      headers: {
        'x-token': token
      }
    });
    const data = await response.json();
    if (data.ok) {
      userData.value = data.user;
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
};

const loadStats = async () => {
        const API_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    const token = localStorage.getItem('x-token');
    const response = await axios.get(`${API_URL}/api/suicide-assessments/statistics`, {
      headers: {
        'x-token': token
      }
    });
    const data =  response.data.statistics;
    
    totalEvaluaciones.value = data.total
    totalPsycologistLoad.value = data.totalPsychologists
    totalStudentsLoad.value = data.totalStudentOn


  } catch (error) {
    console.error('Error loading stats:', error);
  }
};

// Hook de ciclo de vida
onMounted(() => {
  getLatestPsychologist();
  loadUserData();
  loadStats();
});
</script>


<style scoped>
.admin-home {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.welcome-card {
  margin-bottom: 2rem;
}

.welcome-card .header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  font-weight: bold;
}

.welcome-text h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
}

.welcome-text .subtitle {
  color: #666;
  margin-top: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card i {
  font-size: 2.5rem;
  color: #6c5ce7;
}

.stat-content h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #6c5ce7;
  margin: 0.3rem 0;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.quick-actions {
  background: white;
}

.quick-actions h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #f8f9fa;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: #6c5ce7;
  color: white;
}

.action-btn i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .admin-home {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}

.admin-home {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.welcome-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 2rem;
}

h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 500;
}

.info-section {
  display: grid;
  gap: 1.5rem;
}

.info-item {
  display: grid;
  gap: 0.5rem;
}

.info-item label {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.info-item p {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .admin-home {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    text-align: center;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
