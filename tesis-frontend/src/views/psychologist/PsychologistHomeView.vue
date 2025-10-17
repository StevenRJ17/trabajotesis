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
            <img class="w-full h-40 object-cover" src="../../assets/img/report.jpg" alt="Reportes Precisos">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Reportes Precisos</h3>
              <p class="text-gray-700 text-base mb-4">
                Acceso a los reportes generados por el psicólogo con sus respectivos campos y
                datos.
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#reportes</span>
                <span class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#datos</span>
                <span class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#estadísticas</span>
              </div>
            </div>
          </div>
    
          <div class="bg-white rounded-xl shadow-md overflow-hidden max-w-xs sm:max-w-sm w-full
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-xl cursor-pointer">
            <img class="w-full h-40 object-cover" src="../../assets/img/eval.webp" alt="Evaluacion Columbia">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Evaluacion Columbia</h3>
              <p class="text-gray-700 text-base mb-4">
                Realización completa de la evaluación Columbia con todos sus campos.
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#evaluación</span>
                <span class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#columbia</span>
                <span class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#resultados</span>
              </div>
            </div>
          </div>
        </div>
    
        <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">
          
          <div class="bg-white rounded-xl shadow-md overflow-hidden max-w-xs sm:max-w-sm w-full
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-xl cursor-pointer">
            <img class="w-full h-40 object-cover" src="../../assets/img/Register.png" alt="Registrar Estudiantes">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Registrar Estudiantes</h3>
              <p class="text-gray-700 text-base mb-4">
                Capacidad de ingresar estudiantes individualmente y por lote.
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#Registro</span>
                <span class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#datos</span>
                <span class="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">#Lote</span>
              </div>
            </div>
          </div>
    
          <div class="bg-white rounded-xl shadow-md overflow-hidden max-w-xs sm:max-w-sm w-full
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-xl cursor-pointer">
            <img class="w-full h-40 object-cover" src="../../assets/img/informa.webp" alt="Informacion Intuitiva">
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Informacion Intuitiva</h3>
              <p class="text-gray-700 text-base mb-4">
                Informacion detallada y exacta de cada estudiante.
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#Estudiantes</span>
                <span class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#Datos</span>
                <span class="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">#resultados</span>
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
              <div class="bg-white rounded-2xl mb-4 shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 mb-1">Total Estudiantes</p>
                    <p class="text-3xl font-bold text-blue-600">{{ totalActivos }}</p>
                  </div>
                  <div class="bg-green-100 p-3 rounded-full">
                    <p class="h-8 w-8 text-green-600 text-center" > {{ totalActivos }} </p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-2xl mb-4 shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex items-center justify-between">
                  <div v-if="latestStudent">
                    <p class="text-sm font-medium text-gray-600 mb-1">Último Registro</p>
                    <p class="text-lg font-bold text-green-600">{{ latestStudent.firstName }} {{ latestStudent.lastName}}</p>
                    <p class="text-xs text-gray-500">{{ latestStudent.createdAt }}</p>
                  </div>
                  <div class="bg-green-100 p-3 rounded-full">
                    <p class="h-8 w-8 text-green-600 text-center" >1</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 mb-1">Total Evaluaciones</p>
                    <p class="text-3xl font-bold text-purple-600">{{totalEvaluaciones}}</p>
                  </div>
                  <div class="bg-green-100 p-3 rounded-full">
                    <p class="h-8 w-8 text-green-600 text-center" >2</p>
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
import CountAssessment from '@/components/CountAssessment.vue'
import { ref, onMounted } from 'vue';
import axios from 'axios';
let totalEvaluaciones = ref(0)
let latestStudent = ref(null)
let totalActivos = ref(0); // Aquí guardamos la cantidad de estudiantes activos

const getEvaluaciones = async () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    const token = localStorage.getItem('x-token');
    const res = await fetch(`${API_URL}/api/suicide-assessments`,{
      headers: {
        'x-token': token, // Reemplaza con tu token real
      }
    })
    const data = await res.json()

    if (Array.isArray(data.assessments)) {
      totalEvaluaciones.value = data.assessments.length
    } else {
      console.warn('La propiedad "assessments" no es un array')
    }
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error)
  }
}

onMounted(() => {
  getEvaluaciones()
})
const getLatestStudent = async () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    const token = localStorage.getItem('x-token');
    const res = await fetch(`${API_URL}/api/students/`,{
      headers: {
        'x-token': token, // Reemplaza con tu token real
      }
    })
    const responseData = await res.json()

    // Accede correctamente al array de estudiantes
    const studentList = responseData.students

    if (Array.isArray(studentList)) {
      latestStudent.value = studentList
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    } else {
      console.warn('students no es un array:', responseData)
    }
  } catch (error) {
    console.error('Error al obtener estudiantes:', error)
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  getLatestStudent()
  setInterval(getLatestStudent, 100000) // actualiza cada 10 segundos
})
const obtenerEstudiantesActivos = async () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    const token = localStorage.getItem('x-token');
    const respuesta = await axios.get(`${API_URL}/api/students/?limit=1000&skip=0`, {
      headers: {
        'x-token': token, // Reemplaza con tu token real
      }
    });
    
    const data = respuesta.data // ajusta esto si el array viene en otra propiedad
    totalActivos.value = data.total

  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
  }
};

onMounted(() => {
  obtenerEstudiantesActivos();
});
</script>


<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>
