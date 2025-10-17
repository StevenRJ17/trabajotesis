<template >
  <div class="text-h1">
    <h1 class="text-3xl sm:text-4xl mb-2 text-center text-black ">
      Perfil del Psicólogo
    </h1>
  </div>
  <div class="bg-gray-100 min-h-4 p-4 flex justify-center items-start pt-16 font-sans text-gray-900">
    
    <div class="max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      
      <div class="grid grid-cols-1 md:grid-cols-2">
        
        <div class="p-6 sm:p-8 bg-gray-900 text-white flex flex-col justify-between custom-gradient-bg-container-1">
          <div>
            <p class="text-white text-sm sm:text-base max-w-lg">
              Aquí puedes ver y editar tus datos de perfil, como tu nombre y apellido.
            </p>
          </div>

          <div class="mt-8 flex items-start text-white text-sm p-3 bg-gray-500 rounded-lg shadow-inner border border-gray-700">
            <svg class="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0 4a1 1 0 100 2h2a1 1 0 100-2h-2z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <span class="font-semibold">Advertencia:</span> Estás a punto de modificar tus credenciales. Asegúrate de que la información sea correcta antes de guardar los cambios.
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8 flex flex-col justify-between custom-gradient-bg-container">
          <form @submit.prevent="handleSave">
            <div class="space-y-6 mb-8">
              
              <div>
                <label for="firstName" class="block text-xs font-medium text-black mb-2">
                  Nombre (First Name)
                </label>
                <input 
                  type="text" 
                  id="firstName" 
                  v-model="editableFirstName" 
                  :disabled="isLoading"
                  class="w-full p-3 bg-white rounded-md text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out shadow-sm"
                >
              </div>

              <div>
                <label for="lastName" class="block text-xs font-medium text-black mb-2">
                  Apellido (Last Name)
                </label>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="editableLastName" 
                  :disabled="isLoading"
                  class="w-full p-3 bg-white rounded-md text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out shadow-sm"
                >
              </div>
            </div>

            <div class="min-h-[50px] flex items-center justify-end">
              <div v-if="isLoading" class="flex items-center text-purple-200">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Cargando...</span>
              </div>
              <p v-else-if="error" class="text-red-300 text-sm mr-4">
                ⚠️ Error: {{ error }}
              </p>
              <p v-else-if="saveSuccess" class="text-green-300 text-sm mr-4">
                ✅ ¡Cambios guardados!
              </p>
              
              <button
                type="submit"
                class="ml-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-md transition duration-300 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isLoading || !isDirty"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex'; // Importar useStore

// --- Constantes y Variables de Entorno ---
const API_URL = import.meta.env.VITE_API_BASE_URL;

// 🔑 CAMBIO CLAVE: Usamos el endpoint que trae al usuario logeado por su token
const AUTH_USER_ENDPOINT = `${API_URL}/api/auth/me`; 
// Endpoint para ACTUALIZAR datos
const UPDATE_PSICOLOGO_ENDPOINT = `${API_URL}/api/psicologist/updatePsicologi`; 

// --- Estado Reactivo y Vuex ---
const store = useStore(); 

const originalFirstName = ref('');
const originalLastName = ref('');
const editableFirstName = ref('');
const editableLastName = ref('');
const isLoading = ref(true);
const error = ref(null);
const saveSuccess = ref(false); 
const currentPsicologoUid = ref(null); 

// --- Computed Properties ---
const isDirty = computed(() => {
  return editableFirstName.value !== originalFirstName.value || 
         editableLastName.value !== originalLastName.value;
});

// --- Funciones de Lógica y API ---

/**
 * Obtiene los datos del psicólogo logeado (usando /api/auth/me).
 * Esta función es la que asegura que SIEMPRE se obtienen los datos del usuario correcto.
 */
const fetchPsicologoData = async () => {
  isLoading.value = true;
  error.value = null;
  saveSuccess.value = false;

  try {
    const token = localStorage.getItem('x-token');
    
    if (!token) {
      error.value = 'Token de autenticación no encontrado.';
      throw new Error('Token no disponible en localStorage.');
    }

    // 🔑 Llamamos a la ruta de autenticación que devuelve el usuario basado en el token
    const response = await fetch(AUTH_USER_ENDPOINT, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    });

    if (!response.ok) {
      let errorMessage = `Error HTTP ${response.status}`;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorBody.error || errorMessage;
      } catch (e) {}
      error.value = errorMessage;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Asumimos que devuelve { user: { ... } } o { ... }
    const fetchedPsicologo = data.user || data; 
    
    if (!fetchedPsicologo || !fetchedPsicologo.uid) {
        throw new Error('No se encontraron datos completos del psicólogo logeado.');
    }
    
    // Asignar datos
    originalFirstName.value = fetchedPsicologo.firstName || '';
    originalLastName.value = fetchedPsicologo.lastName || '';
    editableFirstName.value = fetchedPsicologo.firstName || '';
    editableLastName.value = fetchedPsicologo.lastName || '';
    currentPsicologoUid.value = fetchedPsicologo.uid;

    // 🔑 ACTUALIZAR VUE STORE: Crucial para sincronizar el Sidebar
    store.dispatch('setUser', fetchedPsicologo); 

  } catch (err) {
    console.error('Fallo al obtener datos:', err.message);
    if (!error.value) error.value = 'Error al conectar con el servidor.';
    editableFirstName.value = '---';
    editableLastName.value = '---';
  } finally {
    isLoading.value = false;
  }
};

/**
 * Maneja el envío del formulario para guardar los cambios.
 */
const handleSave = async () => {
  if (!isDirty.value || isLoading.value) return;

  isLoading.value = true;
  error.value = null;
  saveSuccess.value = false;

  try {
    const token = localStorage.getItem('x-token');
    if (!token || !currentPsicologoUid.value) {
        throw new Error('Faltan credenciales o ID para actualizar.');
    }

    // Construcción de la ruta de actualización: /updatePsicologi/:id
    const updateUrl = `${UPDATE_PSICOLOGO_ENDPOINT}/${currentPsicologoUid.value}`;

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-token': token,
      },
      body: JSON.stringify({
        firstName: editableFirstName.value,
        lastName: editableLastName.value,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Error HTTP ${response.status}`;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorBody.error || errorMessage;
      } catch (e) {}
      error.value = errorMessage;
      throw new Error(errorMessage);
    }

    // Si tiene éxito, actualizar los valores originales
    originalFirstName.value = editableFirstName.value;
    originalLastName.value = editableLastName.value;
    saveSuccess.value = true;
    
    // 🔑 CRUCIAL: Vuelve a cargar la data para que el Sidebar se sincronice con los nuevos valores.
    await fetchPsicologoData(); 

    setTimeout(() => { saveSuccess.value = false; }, 3000);

  } catch (err) {
    console.error('Fallo al guardar cambios:', err.message);
    if (!error.value) error.value = 'Error al guardar los datos.';
  } finally {
    isLoading.value = false;
  }
};


// --- Ciclo de Vida ---
onMounted(() => {
  fetchPsicologoData();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.custom-gradient-bg-container {
  background: linear-gradient(180deg, rgba(127, 83, 172, 0.1) 0%, rgba(100, 125, 238, 0.1) 100%); 
  border-left: 1px solid rgba(0,0,0,0.1); 
  font-family: 'Poppins', sans-serif !important
}
.custom-gradient-bg-container-1{
  background: linear-gradient(180deg, #7f53ac 0%, #647dee 100%);
  font-family: 'Poppins', sans-serif !important
}
.text-h1{
  font-family: 'Poppins', sans-serif !important
}
</style>