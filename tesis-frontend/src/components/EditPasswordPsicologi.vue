<template>
  <div class="text-h1">
    <h1 class="text-3xl sm:text-4xl mb-2 text-center text-black ">
      Cambiar Contraseña
    </h1>
  </div>
  <div class="bg-gray-100 min-h-screen p-4 flex justify-center items-start pt-16 font-sans text-gray-900">
    
    <div class="max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      
      <div class="grid grid-cols-1 md:grid-cols-2">
        
        <div class="p-6 sm:p-8 bg-gray-900 text-white flex flex-col justify-between custom-gradient-bg-container-1">
          <div>
            <p class="text-white text-sm sm:text-base max-w-lg">
              Establece una contraseña fuerte que no hayas usado antes. Por motivos de seguridad, debes ingresar tu contraseña actual.
            </p>
          </div>

          <div class="mt-8 flex items-start text-white text-sm p-3 bg-gray-500 rounded-lg shadow-inner border border-gray-700">
            <svg class="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0 4a1 1 0 100 2h2a1 1 0 100-2h-2z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <span class="font-semibold">Recomendación:</span> Usa al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8 flex flex-col justify-between custom-gradient-bg-container">
          <form @submit.prevent="handleChangePassword">
            <div class="space-y-6 mb-8">
              
              <div>
                <label for="currentPassword" class="block text-xs font-medium text-black mb-2">
                  CONTRASEÑA ACTUAL
                </label>
                <input 
                  type="password" 
                  id="currentPassword" 
                  v-model="currentPassword" 
                  :disabled="isSubmitting"
                  autocomplete="current-password"
                  required
                  class="w-full p-3 bg-white rounded-md text-gray-900 border border-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out shadow-sm"
                >
              </div>

              <div>
                <label for="newPassword" class="block text-xs font-medium text-black mb-2">
                  NUEVA CONTRASEÑA
                </label>
                <input 
                  type="password" 
                  id="newPassword" 
                  v-model="newPassword" 
                  :disabled="isSubmitting"
                  autocomplete="new-password"
                  required
                  class="w-full p-3 bg-white rounded-md text-gray-900 border border-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out shadow-sm"
                >
              </div>

              <div>
                <label for="confirmNewPassword" class="block text-xs font-medium text-black mb-2">
                  CONFIRMAR NUEVA CONTRASEÑA
                </label>
                <input 
                  type="password" 
                  id="confirmNewPassword" 
                  v-model="confirmNewPassword" 
                  :disabled="isSubmitting"
                  autocomplete="new-password"
                  required
                  class="w-full p-3 bg-white rounded-md text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out shadow-sm"
                >
              </div>
            </div>

            <div class="min-h-[50px] flex items-center justify-end">
              <div v-if="isSubmitting" class="flex items-center text-purple-200">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Cambiando...</span>
              </div>
              
              <p v-else-if="validationError || error" class="text-red-300 text-sm mr-4">
                ⚠️ Error: {{ validationError || error }}
              </p>
              
              <p v-else-if="successMsg" class="text-green-300 text-sm mr-4">
                ✅ {{ successMsg }}
              </p>
              
              <button
                type="submit"
                class="ml-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-md transition duration-300 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isSubmitting || !isFormValid"
              >
                Cambiar Contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

// --- Constantes y Variables de Entorno ---
// ⚠️ Asegúrate de que API_URL esté disponible en import.meta.env
const API_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_CHANGE_PASSWORD_ENDPOINT = `${API_URL}/api/psicologist`; 

// --- Estado Reactivo y Vuex ---
const store = useStore();
const router = useRouter();
const iconClass = ref('👁️');
const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');

const isSubmitting = ref(false);
const error = ref(null);      // Usado SOLO para errores de la llamada API o fallos de credenciales
const successMsg = ref(null);

// Obtener el UID del usuario logeado desde Vuex
const userUid = computed(() => {
    // 1. Intentar obtenerlo del Vuex Store (lo ideal)
    const uidFromStore = store.state.user?.uid;
    
    // 2. Si no está en el store, obtenerlo directamente del localStorage como respaldo
    if (uidFromStore) {
        return uidFromStore;
    }
    
    // 🔑 CLAVE: Usar la clave 'userId' de localStorage como fallback
    return localStorage.getItem('userId');
});
// --- Computed Properties (Puras: NO MUTAN estado) ---

// Determina el mensaje de error de validación interna. Retorna el mensaje o null.
const validationError = computed(() => {
    // 1. Verificación de campos llenos (este error lo manejamos en isFormValid, pero lo incluimos si el botón no está deshabilitado por el 'required')
    if (!currentPassword.value || !newPassword.value || !confirmNewPassword.value) {
        return 'Debe completar todos los campos.';
    }

    // 2. Verificación de coincidencia
    if (newPassword.value !== confirmNewPassword.value) {
        return 'Las nuevas contraseñas no coinciden.';
    }
    
    // 3. Verificación de diferencia con la actual
    if (newPassword.value === currentPassword.value) {
        return 'La nueva contraseña debe ser diferente a la actual.';
    }
    
    // 4. Verificación de la sesión (Para informar al usuario ANTES de hacer click)
    if (!userUid.value) {
        return 'Error de sesión: No se encontró su ID de usuario.';
    }

    return null; // Todo bien
});
onMounted(() => {
    // Si no tenemos el UID en el store, pero sí tenemos el token,
    // intentamos recargar la información del usuario logeado.
    if (!userUid.value && localStorage.getItem('x-token')) {
        // Debes tener esta acción definida en tu store para validar el token 
        // y rellenar store.state.user = { uid: '...' }
        // Si no tienes esta acción, tendrás que crearla.
        // Ejemplo: store.dispatch('checkAuth'); 
        
        // Si no tienes una acción de checkAuth, forzamos el error para que el usuario reinicie:
        error.value = 'Sesión incompleta. Por favor, recargue la página o inicie sesión de nuevo.';
        console.warn('Vuex Store no contiene el UID. Error de sesión forzado.');
    }
});

// Determina si el formulario es VÁLIDO para su envío.
const isFormValid = computed(() => {
    // Es válido SÓLO si no hay errores de validación internos.
    // Esto incluye la verificación de userUid y campos llenos.
    return validationError.value === null;
});

// --- Funciones de Lógica y API ---

const handleChangePassword = async () => {
    // 1. Limpiar mensajes de estado al inicio
    error.value = null; 
    successMsg.value = null;

    // 2. Bloquear si no es válido
    if (!isFormValid.value || isSubmitting.value) {
        error.value = validationError.value;
        return;
    }

    isSubmitting.value = true;
    
    try {
        const token = localStorage.getItem('x-token');
        const uid = userUid.value;
        
        if (!token || !uid) {
             error.value = 'Fallo de autenticación: Token o ID faltante.';
             throw new Error('Faltan credenciales o ID para actualizar.');
        }

        const updateUrl = `${BASE_CHANGE_PASSWORD_ENDPOINT}/${uid}/changePasswordPsicologi`;

        const response = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token, 
            },
            body: JSON.stringify({
                currentPassword: currentPassword.value,
                newPassword: newPassword.value,
            }),
        });

        // 3. MANEJO DE LA RESPUESTA
        if (!response.ok) {
            // Manejo de Error del Backend (Contraseña incorrecta, etc.)
            let errorMessage = `Error HTTP ${response.status}`;
            try {
                const errorBody = await response.json();
                errorMessage = errorBody.msg || errorBody.error || errorMessage;
            } catch (e) {}
            
            error.value = errorMessage; // Asigna el error del backend
            throw new Error(errorMessage);

        } else {
            // 4. MANEJO DE ÉXITO ÚNICO
            
            // a) Asignar el mensaje de éxito y limpiar el error.
            error.value = null; 
            successMsg.value = 'Contraseña actualizada exitosamente.';
            
            // b) Limpiar campos *con retraso* para evitar que validationError se active de inmediato.
            setTimeout(() => {
                successMsg.value = null; // Limpiar mensaje después de 5s

                // 🔑 CLAVE: La limpieza de campos VA AQUÍ, después de que el usuario vio el éxito.
                currentPassword.value = '';
                newPassword.value = '';
                confirmNewPassword.value = '';
            }, 5000); 
        }

    } catch (err) {
        // Captura errores de red o errores lanzados por 'throw new Error'
        console.error('Fallo al cambiar la contraseña:', err.message);
        // Si el error de API no se asignó en el if (!response.ok), ponemos un genérico.
        if (!error.value) error.value = 'Error al procesar la solicitud.';
    } finally {
        isSubmitting.value = false;
    }
};
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
.text-h1, label {
  font-family: 'Poppins', sans-serif !important
}
</style>