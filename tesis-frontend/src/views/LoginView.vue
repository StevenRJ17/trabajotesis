<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans relative overflow-hidden">
    <div
      class="absolute w-40 h-40 bg-purple-200 rounded-full opacity-60 animate-blob top-10 left-10 md:w-60 md:h-60 md:-top-20 md:-left-20">
    </div>
    <div
      class="absolute w-52 h-52 bg-purple-100 rounded-full opacity-50 animate-blob animation-delay-2000 bottom-20 right-20 md:w-80 md:h-80 md:-bottom-40 md:-right-40">
    </div>
    <div
      class="absolute w-32 h-32 bg-blue-100 rounded-full opacity-40 animate-blob animation-delay-4000 top-20 right-10 md:w-48 md:h-48 md:top-auto md:bottom-10 md:left-1/4">
    </div>

    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full mx-auto relative z-10 login-card
    transform transition-all duration-300 ease-in-out
    " :class="{ 'scale-95 opacity-75': loading, 'shake': error }">
      <div class="text-center">
        <div
          class="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl">
          <i class="fas fa-brain"></i>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h1>
        <p class="text-gray-500 mb-8">Ingresa a tu cuenta</p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <div class="relative w-full max-w-sm mx-auto mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1 text-left">
                <i class="fas fa-envelope mr-2 text-purple-500"></i>
                Correo Electrónico
              </label>
              <div class="relative">
                <input
                  v-model="formData.email"
                  type="email"
                  id="email"
                  @focus="handleFocus('email')"
                  @blur="handleBlur"
                  @keydown="checkCapsLock"
                  class="
                    w-full px-4 pr-10 py-2
                    border rounded-md shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-purple-500
                    transition-colors duration-200
                  "
                  :class="{ 'border-purple-500': isCapsLockOn && focusedField === 'email' }"
                  placeholder="Escribe tu correo electrónico"
                  required
                />
                <svg
                  v-if="isCapsLockOn && focusedField === 'email'"
                  class="
                    absolute top-1/2 right-3 transform -translate-y-1/2
                    w-5 h-5 text-purple-600
                  "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="17 11 12 6 7 11"></polyline>
                  <line x1="12" y1="18" x2="12" y2="6"></line>
                </svg>
              </div>
              <p v-if="isCapsLockOn && focusedField === 'email'" class="text-sm text-red-500 mt-2 text-left">
                <span role="img" aria-label="Advertencia">⚠️</span> ¡Bloq Mayús está activada!
              </p>
            </div>

            <div class="relative w-full max-w-sm mx-auto">
              <label for="password" class="block text-gray-700 text-sm font-medium mb-1 text-left">
                <i class="fas fa-lock mr-2 text-purple-500"></i>
                Contraseña
              </label>
              <div class="relative">
                <input
                  v-model="formData.password"
                  type="password"
                  id="password"
                  @focus="handleFocus('password')"
                  @blur="handleBlur"
                  @keydown="checkCapsLock"
                  class="
                    w-full px-4 pr-10 py-2
                    border rounded-md shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-purple-500
                    transition-colors duration-200
                  "
                  :class="{ 'border-purple-500': isCapsLockOn && focusedField === 'password' }"
                  placeholder="Tu contraseña"
                  required
                />
                <svg
                  v-if="isCapsLockOn && focusedField === 'password'"
                  class="
                    absolute top-1/2 right-3 transform -translate-y-1/2
                    w-5 h-5 text-purple-600
                  "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="17 11 12 6 7 11"></polyline>
                  <line x1="12" y1="18" x2="12" y2="6"></line>
                </svg>
              </div>
              <p v-if="isCapsLockOn && focusedField === 'password'" class="text-sm text-red-500 mt-2 text-left">
                <span role="img" aria-label="Advertencia">⚠️</span> ¡Bloq Mayús está activada!
              </p>
            </div>
          </div>
          
          <div class="text-right w-full max-w-sm mx-auto">
            <a 
              href="#" 
              @click.prevent="showForgotPassword = true" 
              class="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <div class="flex items-center mt-4 w-full max-w-sm mx-auto">
            <input
              type="checkbox"
              id="terms"
              v-model="formData.termsAccepted"
              class="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700 text-left cursor-pointer select-none">
              Acepto los
              <a href="#" @click.prevent="showTermsModal = true" class="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                Términos y Condiciones
              </a>
            </label>
          </div>
          <div v-if="error" class="text-red-600 text-sm mt-2 text-center">{{ error }}</div>

          <button type="submit"
            class="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-600 transition duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 submit-btn"
            :disabled="loading">
            <span class="btn-text">{{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
            <i class="fas fa-arrow-right ml-2" :class="{ 'animate-pulse': loading }"></i>
          </button>
        </form>
      </div>
    </div>
    
    <div v-if="showTermsModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center transition-opacity duration-300" @click.self="showTermsModal = false">
      <div class="bg-white rounded-lg shadow-xl m-4 p-6 max-w-lg w-full transform transition-all duration-300 scale-100 ease-out">
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h3 class="text-2xl font-bold text-gray-800">Términos y Condiciones</h3>
          <button @click="showTermsModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="h-64 overflow-y-scroll text-sm text-gray-600 pr-2 space-y-3">
          <p class="font-semibold">1. Aceptación de los Términos</p>
          <p>Al acceder o utilizar el servicio, usted acepta estar sujeto a estos Términos. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al servicio.</p>
          
          <p class="font-semibold">2. Uso del Servicio</p>
          <p>El servicio y su contenido están destinados únicamente para fines informativos y de desarrollo personal. Cualquier uso indebido está estrictamente prohibido.</p>
          
          <p class="font-semibold">3. Privacidad</p>
          <p>Su uso del servicio también se rige por nuestra Política de Privacidad, que describe cómo recopilamos, utilizamos y divulgamos su información. Le invitamos a revisarla.</p>
          
          <p class="font-semibold">4. Modificaciones</p>
          <p>Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. El uso continuado del servicio después de dichas modificaciones constituye su aceptación.</p>
          
          <p class="font-semibold">5. Limitación de Responsabilidad</p>
          <p>En ningún caso la compañía será responsable por daños indirectos, incidentales, especiales, consecuenciales o punitivos, incluyendo, sin limitación, pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles.</p>
        </div>
        <div class="mt-4 pt-4 border-t text-right">
          <button @click="showTermsModal = false" class="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <div v-if="showForgotPassword" 
        class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center transition-opacity duration-300"
        @click.self="showForgotPassword = false">
      
      <div class="bg-white rounded-lg shadow-xl m-4 p-6 max-w-md w-full transform transition-all duration-300 scale-100 ease-out">
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h3 class="text-2xl font-bold text-gray-800">Recuperar Contraseña</h3>
          <button @click="showForgotPassword = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="handleForgotPassword" class="space-y-4">
            
          <p class="text-gray-500 text-sm">Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.</p>

          <div class="relative w-full mx-auto">
            <label for="recovery-email" class="block text-sm font-medium text-gray-700 mb-1 text-left">
              <i class="fas fa-envelope mr-2 text-purple-500"></i>
              Correo Electrónico
            </label>
            <input
              v-model="forgotPasswordEmail"
              type="email"
              id="recovery-email"
              required
              class="w-full px-4 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
              placeholder="Tu correo electrónico"
            />
          </div>

          <div class="mt-4">
            <p v-if="forgotPasswordError" class="text-red-600 text-sm text-center font-medium">{{ forgotPasswordError }}</p>
            <p v-if="forgotPasswordMessage" class="text-green-600 text-sm text-center font-medium">{{ forgotPasswordMessage }}</p>
          </div>

          <button type="submit"
            class="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-600 transition duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            :disabled="forgotPasswordLoading">
            <span class="btn-text">{{ forgotPasswordLoading ? 'Enviando...' : 'Enviar Enlace' }}</span>
            <i class="fas fa-paper-plane ml-2" :class="{ 'animate-pulse': forgotPasswordLoading }"></i>
          </button>
          
        </form>
      </div>
    </div>
    </div>
</template>

<script>
const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Importación de dependencias
 * @requires axios - Cliente HTTP para realizar peticiones
 * @requires sweetalert2 - Biblioteca para mostrar alertas personalizadas
 */
import axiosInstance from '@/config/axios';
import axios from 'axios'
import Swal from 'sweetalert2'

/**
 * Componente de vista de inicio de sesión
 * @component
 */
export default {
  /**
    * Nombre del componente para su identificación
    */
  name: 'LoginView',
  /**
    * Estado local del componente
    * @returns {Object} Estado inicial del formulario y del modal
    */
  data() {
    return {
      focusedField: null,
      isCapsLockOn: false,
      formData: {
        email: '',
        password: '',
        // NUEVO: Estado para el checkbox de términos
        termsAccepted: false 
      },
      loading: false,
      // Mantenemos 'error' para mostrar errores de la API, pero lo ocultamos
      // para errores de validación local que irán a Swal.
      error: null, 
      // NUEVO: Estado para controlar la visibilidad del modal de Términos
      showTermsModal: false,
      
      // 🔑 ESTADOS NUEVOS PARA "OLVIDÉ CONTRASEÑA"
      showForgotPassword: false,
      forgotPasswordEmail: '',
      forgotPasswordLoading: false,
      forgotPasswordMessage: '',
      forgotPasswordError: ''
    }
  },
  /**
    * Métodos del componente
    */
  methods: {
    handleFocus(fieldName) {
      this.focusedField = fieldName;
      if (event && event.getModifierState) {
        this.isCapsLockOn = event.getModifierState('CapsLock');
      }
    },
    handleBlur() {
      this.focusedField = null;
      this.isCapsLockOn = false;
    },
    checkCapsLock(event) {
      this.isCapsLockOn = event.getModifierState('CapsLock');
    },
    /**
      * Valida los campos del formulario, incluyendo el checkbox de términos.
      * @returns {string | null} Mensaje de error o null si la validación es exitosa.
      */
    validateForm() {
      if (!this.formData.email || !this.formData.password) {
        return 'Por favor, complete todos los campos';
      }
      
      // VALIDACIÓN: Checkbox de términos
      if (!this.formData.termsAccepted) {
        return 'Debe aceptar los Términos y Condiciones para continuar';
      }
      
      return null;
    },
    /**
      * Maneja el envío del formulario de inicio de sesión
      * @async
      * @returns {Promise<void>}
      */
    async handleSubmit() {
      if (this.loading) return

      this.error = null; // Limpiar error de intentos anteriores
      
      // 1. Validar localmente (campos vacíos y términos)
      const validationError = this.validateForm();
      if (validationError) {
        // Mostrar error de validación local en SweetAlert2
        await Swal.fire({
          icon: 'warning', // Cambiado a warning para errores de forma/validación
          title: 'Faltan datos',
          text: validationError,
          customClass: {
            popup: 'animated-alert'
          }
        });
        this.triggerShakeAnimation();
        return; // Detener el proceso
      }

      this.loading = true

      try {
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn?.classList.add('loading')

        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email: this.formData.email,
            password: this.formData.password
        })
        const { token, ...userData } = response.data
        localStorage.setItem('x-token', token)
        localStorage.setItem('userId', userData.user.id);
        localStorage.setItem('user-data', JSON.stringify(userData)); 
        this.$store.dispatch('login', userData)


        
        // Mensaje de éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'animated-alert'
          }
        })

        // Redirigir según el rol
        if (userData.user.role === 'ADMIN') {
          this.$router.push('/home')
        } else {
          this.$router.push('/psychologist')
        }

      } catch (error) {
        console.error('Error de inicio de sesión:', error)

        // Error de la API: sigue mostrándose en SweetAlert2
        const errorMessage = error.response?.data?.msg || 'Error al iniciar sesión'

        // Opcional: Asignar el error para que se muestre brevemente en el div si lo deseas, 
        // aunque el Swal es la fuente principal.
        this.error = errorMessage 

        await Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: errorMessage,
          customClass: {
            popup: 'animated-alert'
          }
        })
        
        this.triggerShakeAnimation();
      } finally {
        this.loading = false
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn?.classList.remove('loading')
      }
    },
    
    /**
     * 🔑 Maneja el envío del formulario de "Olvidé Contraseña"
     * Llama al endpoint /auth/forgot-password para enviar el email de restablecimiento.
     * @async
     * @returns {Promise<void>}
     */
    async handleForgotPassword() {
        this.forgotPasswordMessage = '';
        this.forgotPasswordError = '';
        
        if (!this.forgotPasswordEmail) {
            this.forgotPasswordError = 'Por favor, ingresa tu correo electrónico.';
            return;
        }

        this.forgotPasswordLoading = true;

        try {
            // Usamos axios sin la instancia si la instancia tiene interceptores de token que no queremos aquí
            const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
                email: this.forgotPasswordEmail,
            });

            const data = response.data; // Ya que axios envuelve la respuesta en .data

            if (data.ok) {
                this.forgotPasswordMessage = data.msg; 
                // Limpiar campo después del éxito
                this.forgotPasswordEmail = ''; 
                // Opcional: Cerrar el modal después de mostrar el éxito
                setTimeout(() => { this.showForgotPassword = false; }, 5000);

            } else {
                this.forgotPasswordError = data.msg || 'Error al procesar la solicitud.';
            }
            
        } catch (error) {
            console.error('Error de red al solicitar restablecimiento:', error);
            const errorMessage = error.response?.data?.msg || 'Error de conexión con el servidor.';
            this.forgotPasswordError = errorMessage;
        } finally {
            this.forgotPasswordLoading = false;
        }
    },

    /**
      * Función auxiliar para la animación de error
      */
    triggerShakeAnimation() {
      const loginCard = document.querySelector('.login-card')
      loginCard?.classList.add('shake') 
      setTimeout(() => {
        loginCard?.classList.remove('shake')
      }, 820) 
    }
  },
  /**
    * Ciclo de vida: Se ejecuta al crear el componente
    * Verifica si existe un token y redirecciona si es necesario
    */
  created() {
    if (localStorage.getItem('x-token')) {
      this.$router.push('/home')
    }
  }
}
</script>