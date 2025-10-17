<!--
Componente HomeView

Este componente implementa la página de inicio principal de la aplicación.
Características:
- Hero section con mensaje de bienvenida
- Sección de características principales
- Call to Action (CTA) para acceder al dashboard
- Diseño responsivo y animaciones
-->

<template>
  <div class="bg-gray-50 min-h-screen text-gray-800">
    <header class="bg-gray-50 p-8 sm:p-12">
      <div class="container mx-auto">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Bienvenido a Mindex</h1>
        <p class="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">Aplicativo web para la gestión de evaluación Colombia mediante un dashboard intuitivo para el manejo de estudiantes, estadísticas y reportes.</p>
      </div>
    </header>

    <section class="py-12 px-4">
      <div class="container mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-center">Opciones dentro de la plataforma</h2>
        <p class="text-gray-500 mb-8 text-center">Explora las diversas funcionalidades que Mindex tiene para ofrecer.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-center">
          <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div class="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
              <img src="https://i.imgur.com/kM3P2fW.png" alt="Reportes Precisos" class="w-full md:w-1/2 h-auto mb-4 md:mb-0 rounded-lg">
              <div class="flex-1 text-center md:text-left">
                <h3 class="text-xl font-semibold mb-2">Reportes Precisos</h3>
                <p class="text-gray-600 text-sm mb-4">Acceso a los reportes generados por el psicólogo con sus respectivos campos y datos.</p>
                <div class="flex flex-wrap justify-center md:justify-start gap-2">
                  <span class="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">#reportes</span>
                  <span class="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">#datos</span>
                  <span class="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">#estadísticas</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div class="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
              <img src="https://i.imgur.com/N710Fj5.png" alt="Evaluacion Colombia" class="w-full md:w-1/2 h-auto mb-4 md:mb-0 rounded-lg">
              <div class="flex-1 text-center md:text-left">
                <h3 class="text-xl font-semibold mb-2">Evaluacion Colombia</h3>
                <p class="text-gray-600 text-sm mb-4">Realización completa de la evaluación Colombia con todos sus campos.</p>
                <div class="flex flex-wrap justify-center md:justify-start gap-2">
                  <span class="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">#evaluación</span>
                  <span class="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">#colombia</span>
                  <span class="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">#resultados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
/**
 * Componente de la página de inicio
 * @component
 */
export default {
  name: 'HomeView'
}
</script>

