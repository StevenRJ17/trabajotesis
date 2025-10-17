<template>
    <div>
        hola
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
let totalEvaluaciones = ref(0)

onMounted(() => {
  getEvaluaciones()
})
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
    console.log(data)
    if (Array.isArray(data.assessments)) {
      totalEvaluaciones.value = data.assessments.length
    } else {
      console.warn('La propiedad "assessments" no es un array')
    }
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error)
  }
}
</script>