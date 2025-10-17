<!-- <template>
  <div class="login-form">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Email:</label>
        <input 
          type="email" 
          v-model="formData.email" 
          required
          placeholder="Ingrese su email"
        >
      </div>

      <div class="form-group">
        <label>Contraseña:</label>
        <input 
          type="password" 
          v-model="formData.password" 
          required
          placeholder="Ingrese su contraseña"
        >
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" :disabled="loading">{{ loading ? 'Cargando...' : 'Iniciar Sesión' }}</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'LoginForm',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      loading: false,
      error: null
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', this.formData)
        
        // Guardar el token
        localStorage.setItem('x-token', response.data.token)
        
        // Mostrar alerta de éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente',
          timer: 1500,
          showConfirmButton: false
        })
        
        // Redirigir al dashboard
        this.$router.push('/dashboard')
      } catch (err) {
        /* this.error = err.response.data.message */
        console.error('Error de login:', err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3aa876;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-bottom: 10px;
  text-align: center;
  font-size: 14px;
}
</style>
 -->