
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Portada -->
    <div class="relative">
      <div class="h-60 sm:h-80 md:h-96 bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden rounded-xl">
        <img 
          v-if="coverImageUrl" 
          :src="coverImageUrl" 
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
          alt="Imagen de portada"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <div class="text-white text-center">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
            <p class="text-lg opacity-75">Agregar imagen de portada</p>
          </div>
        </div>
        
        <!-- Overlay gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" ></div>
        
        <!-- Botón cambiar portada -->
        <input type="file" accept="image/*" @change="onCoverSelected" ref="coverInput" style="display: none;" />
        <button 
          @click="$refs.coverInput.click()" 
          class="absolute top-2 right-2 sm:bottom-4 sm:right-4 sm:top-auto bg-white/90 backdrop-blur-sm hover:bg-white active:scale-95 text-gray-700 px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center gap-1 sm:gap-2"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="pointer-events-none">Cambiar portada</span>
        </button>
      </div>

      <!-- Información del perfil -->
      <div class="bg-white shadow-sm rounded-xl">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative -mt-8 sm:mt-12 pb-6">
            <!-- Foto de perfil -->
            <div class="flex flex-col items-center sm:flex-row sm:items-end sm:space-x-6">
              <div class="relative group">
                <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 mx-auto sm:mx-0">
                  <img 
                    v-if="profileImageUrl" 
                    :src="profileImageUrl" 
                    class="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110" 
                    alt="Foto de perfil"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <!-- Botón editar foto de perfil -->
                <input type="file" accept="image/*" @change="onProfileSelected" ref="profileInput" style="display: none;" />
                <button 
                  @click="$refs.profileInput.click()" 
                  class="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 active:scale-90 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 border-2 border-white group-hover:scale-110 hover:shadow-xl"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              <!-- Información del usuario -->
              <div class="mt-4 sm:mt-0 flex-1 min-w-0 text-center sm:text-left">
                <div class="flex justify-center sm:justify-start items-center">
                  <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                    {{ user?.firstName || 'Nombre' }} {{ user?.lastName || 'Apellido' }}
                  </h1>
                </div>
                
                <!-- Estadísticas -->
                <div class="flex justify-center sm:justify-start items-center space-x-4 sm:space-x-6 mt-3 sm:mt-4">
                  <div class="text-center">
                    <div class="text-lg sm:text-xl font-bold text-gray-900">{{totalActivos}}</div>
                    <div class="text-xs sm:text-sm text-gray-500">Psicologos Activos</div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navegación del perfil -->
    <div class="bg- border-t border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-8" >   
          <a href="#" class="text-black hover:text-gray-700 pb-2 text-3xl whitespace-nowrap transition-colors">
            Información General
          </a>
        </div>
    </div>
     <div class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 text-sm text-gray-800 text-center" >
      
      <!-- Columna izquierda -->
      <div>
        <p class="text-dark font-semibold  ">Primer Nombre</p>
        <p class="text-pink-500" >{{ user?.firstName }}</p>
      </div>

      <div>
        <p class="text-dark font-semibold text- ">Segundo Nombre</p>
        <p class="text-pink-500" >{{ user?.lastName }}</p>
      </div>

      <div>
        <p class="text-dark font-semibold text- ">Email</p>
        <p class="text-pink-500" >{{ user?.email }}</p>
      </div>

      <div>
        <p class="text-dark font-semibold text- ">Ciudad</p>
        <p class="text-pink-500" >Manta</p>
      </div>

      <div>
        <p class="text-dark font-semibold text- ">Telefono</p>
        <p class="text-pink-500" >+01 999 999 999</p>
      </div>

      <div>
        <p class="text-dark font-semibold text- ">Web</p>
        <p class="text-pink-500" >www.kickresume.com</p>
      </div>
      
    </div>
  </div>
  </div>
</template>
<script>
const API_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

export default {
  
  name: 'ProfileView',
  data() {
    return {
        psycologiths:null,
      user: null,
      profileImageUrl: '',
      coverImageUrl: '',
       totalActivos: 0
    };
  },
  methods: {
    async fetchUser() {
      try {
        const token = localStorage.getItem('x-token');
        // Usar localhost para la llamada API
        const res = await axios.get(`${API_URL}/api/auth/me`, { 
          headers: { 'x-token': token }
        });

        const user = res.data.user || res.data;
        this.user = user;

        // CAMBIO CLAVE 1: Asignar la URL de Cloudinary directamente. 
        // El backend debe devolver la URL completa en user.img y user.coverImage.
        this.profileImageUrl = user.img || '';
        this.coverImageUrl = user.coverImage || '';
        
      } catch (err) {
        console.error('Error al obtener usuario:', err);
      }
    },
    
    // ... (onProfileSelected y onCoverSelected se mantienen igual)
    async onProfileSelected(event) {
      const file = event.target.files[0];
      if (!file) return;
      await this.uploadImage('profileImage', file);
    },
    async onCoverSelected(event) {
      const file = event.target.files[0];
      if (!file) return;
      await this.uploadImage('coverImage', file);
    },

    // 2. FUNCIÓN PARA SUBIR LA IMAGEN
    async uploadImage(type, file) {
      try {
        const token = localStorage.getItem('x-token');
        const formData = new FormData();
        formData.append(type, file);

        // Usar localhost para la llamada API
        const { data } = await axios.put(
          `${API_URL}/api/users/upload/${this.user._id || this.user.uid}`,
          formData,
          {
            headers: {
              'x-token': token,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        // CAMBIO CLAVE 2: Asignar la URL de Cloudinary directamente.
        // El backend ya devuelve la URL completa y única, no necesitamos concatenar
        // el dominio ni agregar un timestamp para evitar la caché.
        if (data.user.img) {
          this.profileImageUrl = data.user.img;
        }
        if (data.user.coverImage) {
          this.coverImageUrl = data.user.coverImage;
        }
        
        this.user = data.user;
      } catch (err) {
        console.error('Error subiendo imagen:', err);
      }
    },
// async obtenerEstudiantesActivos() {
//       try {
//         const token = localStorage.getItem('x-token');
//         const respuesta = await axios.get('https://tesis-dn07.onrender.com/api/students/?limit=1000&skip=0', {
//           headers: {
//             'x-token': token,
//           },
//         });

//         const data = respuesta.data;
//         this.totalActivos = data.total;
//         console.log(data);
//       } catch (error) {
//         console.error('Error al obtener estudiantes:', error);
//       }
//     },
  
  },
  mounted() {
    this.fetchUser();
  }
};
</script>
