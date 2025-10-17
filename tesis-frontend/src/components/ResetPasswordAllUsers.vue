<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans relative overflow-hidden">
    <!-- Fondos animados (Blobs) del Login -->
    <div
      class="absolute w-40 h-40 bg-purple-200 rounded-full opacity-60 animate-blob top-10 left-10 md:w-60 md:h-60 md:-top-20 md:-left-20">
    </div>
    <div
      class="absolute w-52 h-52 bg-purple-100 rounded-full opacity-50 animate-blob animation-delay-2000 bottom-20 right-20 md:w-80 md:h-80 md:-bottom-40 md:-right-40">
    </div>
    <div
      class="absolute w-32 h-32 bg-blue-100 rounded-full opacity-40 animate-blob animation-delay-4000 top-20 right-10 md:w-48 md:h-48 md:top-auto md:bottom-10 md:left-1/4">
    </div>

    <!-- Contenedor principal del formulario (Card) -->
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full mx-auto relative z-10 login-card
                 transform transition-all duration-300 ease-in-out
                " :class="{ 'scale-95 opacity-75': loading }">
      <div class="text-center">
        <!-- Ícono central -->
        <div
          class="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl">
          <!-- Usamos un ícono relevante de seguridad/restablecimiento -->
          <i class="fas fa-key"></i> 
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-2">Restablecer Contraseña</h1>
        <p class="text-gray-500 mb-8">Ingresa tu nueva clave de acceso</p>

        <form @submit.prevent="handleResetPassword" class="space-y-6">
          
          <!-- Nueva Contraseña -->
          <div class="relative w-full max-w-sm mx-auto">
            <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1 text-left">
              <i class="fas fa-unlock-alt mr-2 text-purple-500"></i>
              Nueva Contraseña
            </label>
            <input
              id="new-password"
              v-model="newPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-4 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <!-- Confirmar Contraseña -->
          <div class="relative w-full max-w-sm mx-auto">
            <label for="confirm-password" class="block text-gray-700 text-sm font-medium mb-1 text-left">
              <i class="fas fa-lock mr-2 text-purple-500"></i>
              Confirmar Contraseña
            </label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-4 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>

          <!-- Mensajes de Estado -->
          <div class="mt-4">
            <p v-if="error" class="text-red-600 text-sm text-center font-medium">{{ error }}</p>
            <p v-if="success" class="text-green-600 text-sm text-center font-medium">{{ success }}</p>
          </div>
          
          <!-- Botón de Restablecer -->
          <button 
            type="submit"
            class="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-600 transition duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            :disabled="loading"
          >
            <span class="btn-text">{{ loading ? 'Cambiando...' : 'Restablecer Contraseña' }}</span>
            <i class="fas fa-check ml-2" :class="{ 'animate-pulse': loading }"></i>
          </button>
        </form>

        <router-link to="/login" class="back-to-login block mt-6 text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200">
            <i class="fas fa-arrow-left mr-2"></i> Volver al inicio de sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // ⚠️ Importar onMounted
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2'

const route = useRoute();
const router = useRouter();

// Usamos una variable reactiva para almacenar el token de forma interna
const internalResetToken = ref(null); 

const newPassword = ref('');
const confirmPassword = ref('');
const error = ref(null);
const success = ref(null);
const loading = ref(false);

// 1. LÓGICA DE CARGA: Lee el token y limpia la URL
onMounted(() => {
    // Leer el token de la URL (parámetros de ruta)
    const tokenFromUrl = route.params.token;

    if (tokenFromUrl) {
        // Almacenar el token internamente en el componente
        internalResetToken.value = tokenFromUrl; 
        
        // ⚠️ CAMBIO CRÍTICO: Limpiar la URL en el historial del navegador.
        // Reemplaza la entrada actual del historial con una URL sin el token.
        // Asegúrate de que '/reset-password-clean' es una ruta válida en tu router.
        router.replace({ path: '/reset-password-form' }).catch(() => {});
        
    } else if (!internalResetToken.value) {
        // Si no hay token ni en la URL ni en memoria, redirigir al login
        router.push('/login');
    }
});


const handleResetPassword = async () => {
    error.value = null;
    success.value = null;

    // Usar el token almacenado internamente
    const resetToken = internalResetToken.value;

    if (!resetToken) {
        error.value = 'Token de restablecimiento no encontrado.';
        router.push('/login');
        return;
    }

    if (newPassword.value.length < 6) {
        error.value = 'La contraseña debe tener al menos 6 caracteres.';
        return;
    }
    
    if (newPassword.value !== confirmPassword.value) {
        error.value = 'Las contraseñas no coinciden.';
        return;
    }
    
    loading.value = true;

    try {
        // Asegúrate de usar la URL limpia (sin token) y enviar el token en el body
        const response = await fetch(`http://localhost:3000/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                token: resetToken, // El token se envía en el BODY
                newPassword: newPassword.value 
            })
        });

        const data = await response.json();
        // ... (resto de la lógica) ...
               if (data.ok) {
            // 🔑 CAMBIO CLAVE: Notificación de Éxito y Redirección
            
            // 1. Notificar al usuario (usamos Swal para un mensaje profesional)
            await Swal.fire({
                icon: 'success',
                title: '¡Contraseña Cambiada!',
                text: 'Tu contraseña ha sido restablecida con éxito. Por favor, inicia sesión con tu nueva clave.',
                timer: 3000, // Se cierra automáticamente en 3 segundos
                showConfirmButton: false,
                customClass: {
                    popup: 'animated-alert'
                }
            });

            // 2. Limpiar el formulario (opcional, pero buena práctica)
            newPassword.value = '';
            confirmPassword.value = '';

            // 3. Redirigir al inicio de sesión
            router.push('/login'); 

        } else {
            // Manejo de error si la API responde pero indica un fallo (ej: token expirado/inválido)
            error.value = data.msg || 'Error al restablecer la contraseña. Inténtalo de nuevo.';
        }
    } catch (err) {
        // ... (Manejo de errores de red) ...
    } finally {
        loading.value = false;
    }
};
</script>