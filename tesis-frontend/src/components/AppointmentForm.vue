<template>
  <div class="appointment-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="date">Fecha y Hora</label>
        <input
          type="datetime-local"
          id="date"
          v-model="appointmentData.date"
          required
          class="form-control"
          :min="minDate"
        />
      </div>

      <div class="form-group">
        <label for="reason">Motivo de la Cita</label>
        <input
          type="text"
          id="reason"
          v-model="appointmentData.reason"
          required
          class="form-control"
          placeholder="Ej: Sesión de seguimiento"
        />
      </div>

      <div class="form-group">
        <label for="notes">Notas Adicionales</label>
        <textarea
          id="notes"
          v-model="appointmentData.notes"
          class="form-control"
          rows="3"
          placeholder="Notas o comentarios adicionales sobre la cita"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          <i class="ri-calendar-check-line"></i> Agendar Cita
        </button>
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          <i class="ri-close-line"></i> Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
const API_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'AppointmentForm',
  props: {
    studentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      appointmentData: {
        date: '',
        reason: '',
        notes: ''
      }
    };
  },
  computed: {
    minDate() {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const token = localStorage.getItem('x-token');
        const response = await axios.post(
          `${API_URL}/api/appointments`,
          {
            ...this.appointmentData,
            studentId: this.studentId
          },
          {
            headers: {
              'x-token': token
            }
          }
        );

        await Swal.fire({
          icon: 'success',
          title: '¡Cita Agendada!',
          text: response.data.msg || 'La cita ha sido agendada exitosamente'
        });

        this.$emit('created', response.data.appointment);
        this.$emit('cancel');
      } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.msg || 'Error al agendar la cita'
        });
      }
    }
  }
};
</script>

<style scoped>
.appointment-form {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease-in-out;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>
