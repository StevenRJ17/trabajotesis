

<template>
  <!-- Contenedor principal de la aplicación -->
  <div id="app">
    <!-- Router view donde se renderizan las diferentes vistas -->
    <router-view/>
  </div>
</template>

<script>
/**
 * Componente raíz de la aplicación
 * @component
 */
export default {
  name: 'App'
}
</script>

<style>
/* Importación de la fuente Poppins de Google Fonts */


/* Variables CSS globales para toda la aplicación */
:root {
  /* Sistema de colores principal
   * Incluye colores primarios, secundarios, fondos y texto
   */
  --primary-gradient: linear-gradient(180deg, #7f53ac 0%, #647dee 100%);
  --primary-color: #7f53ac;
  --secondary-color: #647dee;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #2c3e50;
  --text-secondary: #6c757d;
  --text-light: rgba(255, 255, 255, 0.8);
  --text-white: #ffffff;

  /* Sistema de espaciado consistente
   * Utiliza una escala progresiva para mantener consistencia
   */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Sistema de bordes redondeados
   * Tres tamaños para diferentes niveles de enfasis
   */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;

  /* Sistema de elevación con sombras
   * Tres niveles de elevación para diferentes contextos
   */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  --shadow-md: 0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12);
  --shadow-lg: 0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10);

  /* Sistema de transiciones
   * Diferentes duraciones para distintos tipos de animaciones
   */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}

/* Reset CSS básico para eliminar márgenes y rellenos predeterminados */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Estilos base para el cuerpo del documento */
body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
main {
  background-color: #eff6ff;
}

/* Contenedor principal de la aplicación
 * Asegura que ocupe al menos toda la altura de la ventana
 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.router-view {
  flex: 1;
  
}

/* Estilos base para enlaces
 * Elimina la decoración predeterminada y agrega transición suave
 */
a {
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

/* Estilos base para botones
 * Establece la fuente consistente y comportamiento interactivo
 */
button {
  font-family: 'Poppins', sans-serif;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Personaliza la barra de desplazamiento
 * Mejora la estética manteniendo la funcionalidad
 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(127, 83, 172, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(127, 83, 172, 0.7);
}
</style>