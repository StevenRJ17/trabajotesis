<template>
  <div class="min-h-screen">
    <div class="text-center mb-8">
      <div class="flex items-center justify-center gap-3 mb-4">
        <FileTextIcon class="h-8 w-8 !text-primary-600" />
        <h1 class="text-3xl font-bold text-gray-900">
          Escala Columbia de Evaluación del Riesgo de Suicidio
        </h1>

      </div>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Herramienta de evaluación sistemática para detectar y evaluar el riesgo suicida en pacientes
      </p>
    </div>

    <div class="bg-white border-b border-gray-200 print-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">
              Paso {{ currentStep }} de {{ totalSteps }}: {{ currentStepTitle }}
            </span>
            <span class="text-sm text-gray-500">{{ progress }}% completado</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
              :style="{ width: progress + '%' }"></div>
          </div>
          <div v-if="displayedRiskLevel && displayedRiskLevel !== 'BAJO'" class="flex items-center space-x-2 mt-2">
            <AlertTriangleIcon class="h-5 w-5" :class="getRiskIconColor(displayedRiskLevel)" />
            <span class="text-sm font-medium" :class="getRiskTextColor(displayedRiskLevel)">
              Riesgo: {{ displayedRiskLevel }}
            </span>
          </div>
          <div v-else-if="displayedRiskLevel === 'BAJO'" class="flex items-center space-x-2 mt-2">
            <CheckCircleIcon class="h-5 w-5 text-green-500" />
            <span class="text-sm font-medium text-green-700">
              Riesgo: Bajo
            </span>
          </div>
        </div>
      </div>
    </div>
    <form @submit.prevent="saveEvaluation">
      <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <FormCardd v-if="currentStep === 1" title="Información del Paciente"
          description="Datos básicos requeridos para la evaluación" :icon="UserIcon">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="patient-name" class="block text-sm font-medium text-gray-700">
                Nombre del Paciente *
              </label>
              <input v-if="student" id="patient-name" type="text" placeholder="Nombre completo del paciente"
                class="form-input" required :value="fullName" disabled />
            </div>

            <div class="space-y-2">
              <label for="patient-age" class="block text-sm font-medium text-gray-700">
                Edad *
              </label>
              <input v-if="student" id="patient-age" type="number" min="1" max="120" placeholder="Edad en años"
                class="form-input" :value="student.age" disabled required />
            </div>

            <div class="space-y-2">
              <label for="patient-id" class="block text-sm font-medium text-gray-700">
                ID del Paciente
              </label>
              <input v-if="student" id="patient-id" type="text" placeholder="Número de identificación o expediente"
                class="form-input" :value="student._id" disabled />
            </div>

            <div class="space-y-2">
              <label for="evaluation-date" class="block text-sm font-medium text-gray-700">
                Fecha de Evaluación *
              </label>
              <input v-if="student" id="evaluation-date" type="text" class="form-input"
                :value="formatDateToReadable(student.createdAt)" disabled required />
            </div>

            <div class="space-y-2 md:col-span-2">
              <label for="clinician-name" class="block text-sm font-medium text-gray-700">
                Profesional Evaluador *
              </label>
              <input v-if="student" id="clinician-name" type="text"
                placeholder="Nombre del profesional que realiza la evaluación" class="form-input"
                :value="assignedPsychologistFullName" disabled required />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label for="clinician-name" class="block text-sm font-medium text-gray-700">
                ID de Evaluador *
              </label>
              <input v-if="student" id="clinician-name" type="text"
                placeholder="Nombre del profesional que realiza la evaluación" class="form-input"
                :value="student.assignedPsychologist._id" disabled required />
            </div>
          </div>
        </FormCardd>

        <FormCardd v-if="currentStep === 2" title="Sección 2: Evaluación de Síntomas"
          description="Preguntas relacionadas con el estado emocional del paciente." :icon="BrainIcon">
          <div class="space-y-6">
            <div class="alert-info">
              <div class="flex items-center space-x-2 mb-2">
                <InfoIcon class="h-5 w-5" />
                <h4 class="font-semibold">Instrucciones para la Evaluación</h4>
              </div>
              <div class="text-sm space-y-1">
                <p><strong>1.</strong> Haga las preguntas 1 y 2. Si ambas son negativas, pase a "Comportamiento
                  suicida".</p>
                <p><strong>2.</strong> Si la pregunta 2 es "sí", continúe con las preguntas 3, 4 y 5.</p>
                <p><strong>3.</strong> Si cualquier respuesta es "sí", complete la sección "Intensidad".</p>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-gray-700 mb-2">
                1. Pensamientos sobre el deseo de morir o dejar de vivir
              </p>
              <div class="text-xs text-gray-600 space-y-1">
                <p>• ¿Has pensado en estar muerto/a o lo que sería estar muerto/a?</p>
                <p>• ¿Has deseado estar muerto/a o quedarte dormido/a y nunca despertar?</p>
                <p>• ¿Desearías dejar de vivir?</p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center space-x-4">
                <label class="flex items-center cursor-pointer">
                  <input class="form-radio" type="radio" v-model="assessment.deathWish.present" :value="true" required>
                  <span class="ml-2 text-sm">Si</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input class="form-radio" type="radio" v-model="assessment.deathWish.present" :value="false" required>
                  <span class="ml-2 text-sm">No</span>
                </label>
              </div>
              <div class="space-y-2" v-if="assessment.deathWish.present">
                <label class="block text-sm font-medium text-gray-700">
                  Descripción detallada:
                </label>
                <textarea v-model="assessment.deathWish.description" placeholder="Describe la respuesta..." rows="2"
                  class="form-textarea mt-2"></textarea>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="bg-yellow-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-gray-700 mb-2">
                2. Pensamientos generales de querer terminar con su vida sin métodos específicos
              </p>
              <div class="text-xs text-gray-600 space-y-1">
                <p>• ¿Has pensado en hacer algo para dejar de vivir?</p>
                <p>• ¿Has pensado en matarte?</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center space-x-4">
                <label class="flex items-center cursor-pointer">
                  <input class="form-radio" type="radio" v-model="assessment.nonSpecificActiveSuicidalThoughts.present"
                    :value="true" required>
                  <span class="ml-2 text-sm">Si</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input class="form-radio" type="radio" v-model="assessment.nonSpecificActiveSuicidalThoughts.present"
                    :value="false" required>
                  <span class="ml-2 text-sm">No</span>
                </label>
              </div>
            </div>
            <div class="space-y-2" v-if="assessment.nonSpecificActiveSuicidalThoughts.present">
              <label class="block text-sm font-medium text-gray-700">
                Descripción detallada:
              </label>
              <textarea v-model="assessment.nonSpecificActiveSuicidalThoughts.description"
                placeholder="Describe la respuesta..." rows="2" class="form-textarea mt-2"></textarea>
            </div>
          </div>
          <div class="space-y-4" v-if="showAdditionalIdeation">
            <div class="bg-orange-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-gray-700 mb-2">
                3. Pensamientos suicidas con al menos un método considerado, pero sin plan detallado
              </p>
              <div class="text-xs text-gray-600 space-y-1">
                <p>• ¿Has pensado en cómo lo harías para dejar de vivir?</p>
                <p>• ¿En qué método has pensado?</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center space-x-4">
                <label>
                  <input type="radio" v-model="assessment.activeSuicidalIdeationWithMethods.present" :value="true"
                    required>
                  <span class="ml-2 text-sm">Sí</span>
                </label>
                <label>
                  <input type="radio" v-model="assessment.activeSuicidalIdeationWithMethods.present" :value="false"
                    required>
                  <span class="ml-2 text-sm">No</span>
                </label>
              </div>
              <div class="space-y-2" v-if="assessment.activeSuicidalIdeationWithMethods.present">
                <label class="block text-sm font-medium text-gray-700">
                  Descripción del método considerado:
                </label>
                <textarea v-model="assessment.activeSuicidalIdeationWithMethods.description"
                  placeholder="Describe la respuesta..." rows="2" class="form-textarea mt-2"></textarea>
              </div>
            </div>
          </div>
          <div class="space-y-4" v-if="showAdditionalIdeation">
            <div class="bg-orange-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-gray-700 mb-2">
                4. Pensamientos suicidas con cierta intención de llevarlos a cabo
              </p>
              <div class="text-xs text-gray-600 space-y-1">
                <p>• ¿Pensaste que esto era algo que realmente podrías hacer?</p>
                <p>• ¿Es diferente a solo tener pensamientos sin intención de actuar?</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center space-x-4">
                <label>
                  <input type="radio" v-model="assessment.activeSuicidalIdeationWithIntent.present" :value="true"
                    required>
                  <span class="ml-2 text-sm">Sí</span>
                </label>
                <label>
                  <input type="radio" v-model="assessment.activeSuicidalIdeationWithIntent.present" :value="false"
                    required>
                  <span class="ml-2 text-sm">No</span>
                </label>
              </div>
              <div class="space-y-2" v-if="assessment.activeSuicidalIdeationWithIntent.present">
                <label class="block text-sm font-medium text-gray-700">
                  Descripción de la intención:
                </label>
                <textarea v-model="assessment.activeSuicidalIdeationWithIntent.description"
                  placeholder="Describe la respuesta..." rows="2" class="form-textarea mt-2"></textarea>
              </div>
            </div>
          </div>
          <div class="space-y-4" v-if="showAdditionalIdeation">
            <div class="bg-red-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-gray-700 mb-2">
                5. Pensamientos suicidas con detalles elaborados y intención de llevarlos a cabo
              </p>
              <div class="text-xs text-gray-600 space-y-1">
                <p>• ¿Has decidido cómo o cuándo harías algo para dejar de vivir?</p>
                <p>• ¿Has planificado los detalles de cómo lo harías?</p>
                <p>• ¿Hay alguna parte tuya pensando en hacerlo realmente?</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center space-x-4">
                <label>
                  <input type="radio" v-model="assessment.activeSuicidalIdeationWithPlan.present" :value="true"
                    required>
                  <span class="ml-2 text-sm">Sí</span>
                </label>
                <label>
                  <input type="radio" v-model="assessment.activeSuicidalIdeationWithPlan.present" :value="false"
                    required>
                  <span class="ml-2 text-sm">No</span>
                </label>
              </div>
              <div class="space-y-2" v-if="assessment.activeSuicidalIdeationWithPlan.present">
                <label class="block text-sm font-medium text-gray-700">
                  Descripción del plan específico:
                </label>
                <textarea v-model="assessment.activeSuicidalIdeationWithPlan.description"
                  placeholder="Describe la respuesta..." rows="2" class="form-textarea mt-2"></textarea>
              </div>
            </div>
          </div>
        </FormCardd>

        <FormCardd v-if="currentStep === 3" title="Sección 3: Intesidad de la ideacion"
          description="Preguntas relevantes a la intensidad y frecuencia de la ideaccion" :icon="AlertTriangleIcon">
          <div class="space-y-6">
            <div class="alert-info">
              <div class="flex items-center space-x-2 mb-2">
                <InfoIcon class="h-5 w-5" />
                <h4 class="font-semibold">Evaluación de Intensidad</h4>
              </div>
              <p class="text-sm">
                Las siguientes características deben evaluarse con respecto al tipo más serio de ideación
                identificado en la sección anterior (preguntas 1-5).
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="serious-type" class="block text-sm font-medium text-gray-700">
                Tipo más serio (1-5) *
              </label>
              <select class="form-input" v-model.number="assessment.ideationIntensity.mostSeriousIdeationType" required>
                <option :value="null">Seleccione el tipo</option>
                <option value="1">1. Deseo de estar muerto/a</option>
                <option value="2">2. Pensamientos suicidas activos no específicos</option>
                <option value="3">3. Ideación suicida activa con métodos</option>
                <option value="4">4. Ideación suicida activa con intención</option>
                <option value="5">5. Ideación suicida activa con plan</option>
              </select>

            </div>
            <div class="space-y-4">
              <label for="serious-description" class="block text-sm font-medium text-gray-700">
                Descripción detallada
              </label>
              <textarea v-model="assessment.ideationIntensity.mostSeriousIdeationDescription"
                placeholder="Describa la ideación más seria..." required class="form-textarea"></textarea>
            </div>
            <div class="space-y-2">
              <label for="frequency-description" class="text-1xl font-medium text-black-700">
                Frecuencia
                ¿Cuántas veces has tenido estos pensamientos?
              </label>
              <select class="form-input" v-model="assessment.ideationIntensity.frequencyLabel">
    <option :value="null">Seleccione el tipo</option>
    <option value="Sólo una vez">Sólo una vez</option>
    <option value="Unas pocas veces">Unas pocas veces</option>
    <option value="Muchas">Muchas</option>
    <option value="Todo el tiempo">Todo el tiempo</option>
    <option value="No sabe/No corresponde">No sabe/No corresponde</option>
  </select>
<!--               <select class="form-input" v-model="assessment.ideationIntensity.frequency">
                <option :value="null">Seleccione el tipo</option>
                <option :value="0">Sólo una vez</option>
                <option :value="0">Unas pocas veces</option>
                <option :value="1">Muchas</option>
                <option :value="1">Todo el tiempo</option>
                <option :value="0">No sabe/No corresponde</option>
              </select> -->
<!--               <div class="form-group">
                <div class="radio-group">
                  <label>
                    <input type="radio" v-model.number="assessment.ideationIntensity.frequency" :value="0">
                    Sólo una vez
                  </label>
                  <label>
                    <input type="radio" v-model.number="assessment.ideationIntensity.frequency" :value="0">
                    Unas pocas veces
                  </label>
                  <label>
                    <input type="radio" v-model.number="assessment.ideationIntensity.frequency" :value="1">
                    Muchas
                  </label>
                  <label>
                    <input type="radio" v-model.number="assessment.ideationIntensity.frequency" :value="1">
                    Todo el tiempo
                  </label>
                  <label>
                    <input type="radio" v-model.number="assessment.ideationIntensity.frequency" :value="0">
                    No sabe/No corresponde
                  </label>
                </div>
              </div> -->
            </div>

          </div>
        </FormCardd>

        <FormCardd v-if="currentStep === 4" title="Sección 4: Comportamiento Suicida"
          description="Evaluación de planes o comportamientos suicidas recientes." :icon="ActivityIcon">
          <div class="space-y-6">
            <div class="alert-danger">
              <div class="flex items-center space-x-2 mb-2">
                <AlertTriangleIcon class="h-5 w-5" />
                <h4 class="font-semibold">Evaluación de Comportamiento Suicida</h4>
              </div>
              <div class="text-sm space-y-1">
                <p><strong>Importante:</strong> Marque todos los que correspondan, siempre que sean eventos diferentes.
                </p>
                <p>Debe preguntar sobre todos los tipos de comportamiento.</p>
                <p class="text-xs italic">Período de evaluación: Desde la última visita o período específico</p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="bg-red-50 p-4 rounded-lg">
                <p class="text-sm font-medium text-gray-700 mb-2">
                  1. Comportamiento concebido como método para matarse (la intención no necesita ser 100%)
                </p>
                <div class="text-xs text-gray-600 space-y-1">
                  <p>• ¿Hiciste algo para tratar de matarte o dejar de vivir?</p>
                  <p>• ¿Te hiciste daño a propósito? ¿Por qué?</p>
                  <p>• ¿Querías morirte cuando hiciste _____?</p>
                  <p>• ¿Pensaste que era posible que podrías haber muerto?</p>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-center space-x-4">
                  <label class="flex items-center cursor-pointer">
                    <input type="radio" v-model="assessment.actualAttempt.present" :value="true" required
                      class="form-radio">
                    <span class="ml-2 text-sm">Si</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input type="radio" v-model="assessment.actualAttempt.present" :value="false" required
                      class="form-radio">
                    <span class="ml-2 text-sm">No</span>
                  </label>
                </div>
                <div class="space-y-4" v-if="assessment.actualAttempt.present">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Descripción detallada del intento:
                    </label>
                    <textarea v-model="assessment.actualAttempt.description" placeholder="Describe lo que sucedió..."
                      rows="2" required></textarea>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label for="total-attempts" class="block text-sm font-medium text-gray-700">
                        Número total de intentos
                      </label>
                      <input type="number" v-model.number="assessment.actualAttempt.totalAttempts" min="0"
                        class="form-input">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <div class="bg-orange-50 p-4 rounded-lg">
                <p class="text-sm font-medium text-gray-700 mb-2">
                  2. Persona interrumpida al empezar un acto autolesivo (de no ser así, habría ocurrido)
                </p>
                <div class="text-xs text-gray-600 space-y-1">
                  <p><strong>Ejemplos:</strong></p>
                  <p>• Sobredosis: tenía pastillas pero le impidieron ingerirlas</p>
                  <p>• Dispararse: tenía pistola apuntando, otra persona se la quitó</p>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-center space-x-4">
                  <label class="flex items-center cursor-pointer">
                    <input class="form-radio" type="radio" v-model="assessment.interruptedAttempt.present" :value="true"
                      required>
                    <span class="ml-2 text-sm">Si</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input class="form-radio" type="radio" v-model="assessment.interruptedAttempt.present"
                      :value="false" required>
                    <span class="ml-2 text-sm">No</span>
                  </label>
                </div>
                <div class="space-y-4" v-if="assessment.interruptedAttempt.present">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label for="total-attempts" class="block text-sm font-medium text-gray-700">
                        Número total de intentos
                      </label>
                      <input type="number" v-model.number="assessment.interruptedAttempt.totalAttempts" min="0"
                        class="form-input">
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Descripción detallada del intento:
                    </label>
                    <textarea v-model="assessment.interruptedAttempt.description"
                      placeholder="Describe el comportamiento..." rows="2" required></textarea>
                  </div>

                </div>
              </div>
            </div>
            <div class="space-y-4">
              <div class="bg-yellow-50 p-4 rounded-lg">
                <p class="text-sm font-medium text-gray-700 mb-2">
                  3. Empezó a prepararse pero se detuvo antes de tener comportamiento autodestructivo
                </p>
                <div class="text-xs text-gray-600">
                  <p>• ¿Empezaste a hacer algo para dejar de vivir pero cambiaste de idea antes de hacerlo realmente?
                  </p>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-center space-x-4">
                  <label class="flex items-center cursor-pointer">
                    <input class="form-radio" type="radio" v-model="assessment.abortedAttempt.present" :value="true"
                      required>
                    <span class="ml-2 text-sm">Si</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input class="form-radio" type="radio" v-model="assessment.abortedAttempt.present" :value="false"
                      required>
                    <span class="ml-2 text-sm">No</span>
                  </label>
                </div>
                <div class="space-y-4" v-if="assessment.abortedAttempt.present">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Descripción detallada del intento:
                    </label>
                    <textarea v-model="assessment.abortedAttempt.description" placeholder="Describe lo que sucedió..."
                      rows="2" required></textarea>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label for="total-attempts" class="block text-sm font-medium text-gray-700">
                        Número total de intentos
                      </label>
                      <input type="number" v-model.number="assessment.abortedAttempt.totalAttempts" min="0"
                        class="form-radio">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <div class="bg-yellow-50 p-4 rounded-lg">
                <p class="text-sm font-medium text-gray-700 mb-2">
                  4. Preparativos más allá de pensamientos o palabras
                </p>
                <div class="text-xs text-gray-600 space-y-1">
                  <p><strong>Ejemplos:</strong></p>
                  <p>• Obtener método específico (pastillas, arma)</p>
                  <p>• Regalar pertenencias</p>
                  <p>• Escribir nota de despedida</p>
                  <p>• Hacer arreglos finales</p>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-center space-x-4">
                  <label class="flex items-center cursor-pointer">
                    <input class="form-radio" type="radio" v-model="assessment.preparatoryActs.present" :value="true"
                      required>
                    <span class="ml-2 text-sm">Si</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input class="form-radio" type="radio" v-model="assessment.preparatoryActs.present" :value="false"
                      required>
                    <span class="ml-2 text-sm">No</span>
                  </label>
                </div>
                <div class="space-y-4" v-if="assessment.preparatoryActs.present">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Descripción detallada del intento:
                    </label>
                    <textarea v-model="assessment.preparatoryActs.description" placeholder="Describe lo que sucedió..."
                      rows="2" required></textarea>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label for="total-attempts" class="block text-sm font-medium text-gray-700">
                        Número total de intentos
                      </label>
                      <input type="number" v-model.number="assessment.preparatoryActs.totalAttempts" min="0"
                        class="form-radio">
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="space-y-6">
            <div class="space-y-4">
              <h4 class="text-base font-semibold text-gray-900">Grado de letalidad y lesiones</h4>
              <div class="space-y-3" v-if="assessment.actualAttempt.present">
                <label class="flex items-start cursor-pointer">Grado de letalidad:</label>
                <select v-model.number="assessment.lethalityDegree" required
                  class="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-drak dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="0">0 - No hay daño físico o muy poco daño físico</option>
                  <option value="1">1 - Daño físico menor</option>
                  <option value="2">2 - Daño físico moderado</option>
                  <option value="3">3 - Daño físico moderadamente grave</option>
                  <option value="4">4 - Daño físico grave</option>
                  <option value="5">5 - Muerte</option>
                </select>
              </div>
            </div>
            <div class="space-y-4" v-if="assessment.lethalityDegree === 0">
              <div class="space-y-3">
                <label class="flex items-start cursor-pointer">Letalidad potencial:</label>
                <select v-model.number="assessment.potentialLethality" required
                  class="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-drak dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="0">0 - Comportamiento con poca probabilidad de lesiones</option>
                  <option value="1">1 - Comportamiento con probabilidad de lesiones pero no de muerte</option>
                  <option value="2">2 - Comportamiento con probabilidad de muerte</option>
                </select>
              </div>
            </div>
            <div class="space-y-4">
              <div class="space-y-3">
                <div class="relative max-w-sm">
                  <label class="flex items-start cursor-pointer">
                    Fecha:
                  </label>
                  <input type="date" v-model="assessment.mostLethalAttemptDate" :max="today"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
              </div>
            </div>
          </div>

        </FormCardd>

        <FormCardd v-if="currentStep === totalSteps + 1" title="Resultados y Conclusión"
          description="Resumen de la evaluación y observaciones finales." :icon="CheckCircleIcon">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Nivel de Riesgo de Ideación</h3>
              <div class="flex items-center space-x-2 mt-2">
                <AlertTriangleIcon class="h-5 w-5" :class="getRiskIconColor(ideationRiskLevel)" />
                <span 
                :class="{
        // Mapeo basado en el resultado de tu método ideationRiskLevel()
        'risk-mod-low': ideationRiskLevel === 'MODERADO-BAJO',
        'risk-high': ideationRiskLevel === 'ALTO',
        'risk-very-high': ideationRiskLevel === 'MUY-ALTO',
        'risk-extreme': ideationRiskLevel === 'EXTREMO',
        'risk-danger': ideationRiskLevel === 'PELIGRO'
    }"
                class="text-sm font-medium" v-if="assessment.ideationIntensity.frequency === 1">
{{ ideationRiskLevel  }}                </span>
<span   
                
                :class="{
        // Mapeo basado en el resultado de tu método ideationRiskLevel
        'risk-low': ideationRiskLevel === 'BAJO', // Verde
        'risk-mod-low': ideationRiskLevel === 'MODERADO-BAJO', // Naranja
        'risk-high': ideationRiskLevel === 'ALTO', // Naranja fuerte
        'risk-very-high': ideationRiskLevel === 'MUY-ALTO', // Rojo bajo
        'risk-extreme': ideationRiskLevel === 'EXTREMO' // Rojo
        // No incluyes 'PELIGRO' aquí porque solo ocurre cuando frequency es 1.
    }"
                class="text-sm font-medium" v-if="assessment.ideationIntensity.frequency === 0">
{{ ideationRiskLevel  }}                </span>
                
              </div>
              <ul class="mt-4 list-none list-inside text-sm text-gray-600">
                <li v-if="assessment.deathWish"> <br> <span class="text-black">Deseo de morir:</span>  {{ assessment.deathWish.present ? 'Si' : 'No' }}.
                 <br> <span class="text-black">Observación:</span>  {{
                    assessment.deathWish.description ? assessment.deathWish.description : 'No detalles' }}</li>
                <li v-if="assessment.nonSpecificActiveSuicidalThoughts">
                  <br> <span class="text-black">Pensamientos suicidas no específicos:</span>
                  {{ assessment.nonSpecificActiveSuicidalThoughts.present ? "Si" : "No" }}
                  <br> <span class="text-black">Observación:</span> {{ assessment.nonSpecificActiveSuicidalThoughts.description ? assessment.nonSpecificActiveSuicidalThoughts.description : "No detalles"  }}
                </li>
                <li v-if="assessment.activeSuicidalIdeationWithMethods">
                  <br> <span class="text-black">Ideación con métodos:</span> 
                  {{ assessment.activeSuicidalIdeationWithMethods.present ? 'Sí' : 'No' }}.
                  <br> <span class="text-black">Observación:</span>
                  {{ assessment.activeSuicidalIdeationWithMethods.description ?
                    assessment.activeSuicidalIdeationWithMethods.description : 'No detalles' }}
                </li>
                <li v-if="assessment.activeSuicidalIdeationWithIntent">
                  <br><span class="text-black">Ideación con intención:</span>  {{ assessment.activeSuicidalIdeationWithIntent.present ? 'Si' : 'No' }}.
                 <br> <span class="text-black">Observación:</span>
                  {{ assessment.activeSuicidalIdeationWithIntent.description ?
                    assessment.activeSuicidalIdeationWithIntent.description : 'No detalles' }}
                </li>
                <li v-if="assessment.activeSuicidalIdeationWithPlan">
                 <br>  <span class="text-black">Ideación con plan:</span>
                  {{ assessment.activeSuicidalIdeationWithPlan.present ? 'Si' : 'No' }}. ´
                  <br><span class="text-black">Observación:</span> {{
                    assessment.activeSuicidalIdeationWithPlan.description ?
                      assessment.activeSuicidalIdeationWithPlan.description : 'No Detalles' }}
                </li>
              </ul>
            </div>
<div class="mt-5">
    <h3 class="text-lg font-semibold text-gray-900 mt-2">Nivel de Frecuencia </h3>
    
    <span>{{ 
      assessment.ideationIntensity.frequencyLabel 
      ? assessment.ideationIntensity.frequencyLabel 
      : 'No hay datos'
    }}</span>
    
  </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Nivel de Riesgo de Comportamiento</h3>
              <div class="flex items-center space-x-2 mt-2">
                <AlertTriangleIcon class="h-5 w-5" :class="getRiskIconColor(behaviorRiskLevel)" />
                <span class="text-sm font-medium" :class="getRiskTextColor(behaviorRiskLevel)">
                  Riesgo: {{ behaviorRiskLevel }}
                </span>
              </div>
              <ul class="mt-4 list-inside text-sm text-gray-600 list-none">
                <li v-if="assessment.actualAttempt.present"> <br><span class="text-black">Intento Real:</span> {{ assessment.actualAttempt.present ? 'Si' :
                  'No' }} <br> <span class="text-black">Observación:</span>  {{
                    assessment.actualAttempt.description }} <br><span class="text-black">Intentos: </span>  {{ assessment.actualAttempt.totalAttempts }}</li>
                <li v-if="assessment.interruptedAttempt.present"> <br>Intento Interrumpido: Sí. <br> Observación: {{
                  assessment.interruptedAttempt.description }} <br>Intentos: {{ assessment.interruptedAttempt.totalAttempts
                  }}</li>
                <li v-if="assessment.abortedAttempt.present"> <br>Intento Abortado: Sí. <br>Observación: {{
                  assessment.abortedAttempt.description }} <br> Intentos: {{ assessment.abortedAttempt.totalAttempts }}</li>
                <li v-if="assessment.preparatoryActs.present"> <br>Actos Preparatorios: Sí. <br> Observación: {{
                  assessment.preparatoryActs.description }}</li>
              </ul>
            </div>

            <div class="mt-6 space-y-2">
              <label for="final-remarks" class="block text-sm font-medium text-gray-700">
                Observaciones Finales
              </label>
              <textarea id="final-remarks" v-model="assessment.finalRemarks"
                placeholder="Añade observaciones finales sobre la evaluación." rows="4"
                class="form-textarea"></textarea>
            </div>
          </div>
        </FormCardd>

      </div>
      <button v-if="currentStep === totalSteps && !isAssessmentSaved" @click.prevent="saveEvaluation"
        class="btn-primary flex items-center gap-2 ml-auto">
        <CheckCircleIcon class="h-5 w-5" /> Guardar Evaluación
      </button>
    </form>

    <div class="mt-8 flex justify-between print-hidden">
      <button v-if="currentStep > 1 && currentStep <= totalSteps" @click="prevStep"
        class="btn-secondary flex items-center gap-2">
        <ChevronLeftIcon class="h-5 w-5" /> Anterior
      </button>
      <button v-if="currentStep === 1 || currentStep === 2 || currentStep === 3" @click="nextStep"
        class="btn-primary flex items-center gap-2 ml-auto">
        Siguiente
        <ChevronRightIcon class="h-5 w-5" />
      </button>


    </div>
  </div>

</template>

<script>
const API_URL = import.meta.env.VITE_API_BASE_URL;
import FormCardd from '@/components/FormCardd.vue';
import { ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2'; // Se mantiene Swal, ya estaba en tu código
import {

  FileText as FileTextIcon,
  User as UserIcon,
  Brain as BrainIcon,
  Activity as ActivityIcon,
  AlertTriangle as AlertTriangleIcon,
  BarChart3 as BarChart3Icon,
  CheckCircle as CheckCircleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-vue-next';

export default {
  components: {
    FileTextIcon,
    FormCardd,
    BrainIcon,
    ActivityIcon,
    AlertTriangleIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  data() {
    return {
      totalSteps: 4,
      student: null,
      currentStep: 1,
      stepTitles: {
        1: 'Datos Personales',
        2: 'Sección 2: Evaluación de Síntomas',
        3: 'Sección 3: Historial de Riesgo',
        4: 'Sección 4: Planes y Comportamientos',
        5: 'Resultados',
      },
      isAssessmentSaved: false,
      showFinalRemarks: false,
      savedAssessmentId: null,
      remarksLoading: false,
      today: new Date().toISOString().split('T')[0],
      ideationRiskLevel: 'BAJO',
      behaviorRiskLevel: 'BAJO',
      assessment: {
        studentId: null,
        psicologiId: null,
        // Ideación Suicida
        deathWish: { present: false, description: '' },
        nonSpecificActiveSuicidalThoughts: { present: false, description: '' },
        activeSuicidalIdeationWithMethods: { present: false, description: '' },
        activeSuicidalIdeationWithIntent: { present: false, description: '' },
        activeSuicidalIdeationWithPlan: { present: false, description: '' },
        ideationIntensity: {
          mostSeriousIdeationType: null, // Cambiado a null para que sea más fácil validar si ha sido seleccionado
          mostSeriousIdeationDescription: '',
          frequency: null,
          frequencyLabel: 'Unas pocas veces' // Mantener como null para indicar que no se ha seleccionado
        },
        // Se eliminan ideationIntensity.mostSeriousIdeationType y frequency
        // Comportamiento Suicida (se mantienen por ser otra sección)
        actualAttempt: {
          present: false,
          description: '',
          totalAttempts: 0
        },
        interruptedAttempt: {
          present: false,
          description: '',
          totalAttempts: 0
        },
        abortedAttempt: {
          present: false,
          description: '',
          totalAttempts: 0
        },
        preparatoryActs: {
          present: false,
          description: ''
        },
        completedSuicide: false,
        mostLethalAttemptDate: '',
        lethalityDegree: null,
        potentialLethality: null,
        observations: '',
        finalRemarks: '',
        riskLevel: 'BAJO' // Se mantendrá sincronizado con riskLevel.level
      },
      labelToValueMap: {
        'Sólo una vez': 0,
        'Unas pocas veces': 0,
        'Muchas': 1,
        'Todo el tiempo': 1,
        'No sabe/No corresponde': 0
      }
    };
  },
  async created() {
    await this.fetchStudentDetails();
    if (this.student) {
      this.assessment.studentId = this.student._id;
      this.updateRiskLevel(); // Asegurarse de que el riesgo inicial se calcule
    }
  },
  methods: {
    caulculateideationtypeResult(){
      switch (this.ideationType) {
        case this.ideationType === 1:
          return 'Bajo'
          
          break;
      
        default:
          break;
      }

    },
    updateRiskLevel() {
      if (this.assessment.activeSuicidalIdeationWithPlan.present === true) {
        this.ideationRiskLevel = 'EXTREMO';
      } else if (this.assessment.activeSuicidalIdeationWithIntent.present === true) {
        this.ideationRiskLevel = 'MUY_ALTO'
      } else if (this.assessment.activeSuicidalIdeationWithMethods.present === true) {
        this.ideationRiskLevel = 'ALTO'
      }
      else if (this.assessment.nonSpecificActiveSuicidalThoughts.present === true) {
        this.ideationRiskLevel = 'MODERADO-BAJO'

      } else if (this.assessment.deathWish.present === true) {
        this.ideationRiskLevel = 'BAJO'
      } else if (this.assessment.deathWish.present === false && this.assessment.nonSpecificActiveSuicidalThoughts.present === false) {
        this.ideationRiskLevel = 'BAJO'
      }

      // Lógica para la Sección 4 - Comportamiento Suicida (prioridad alta)
      if (this.assessment.actualAttempt.present === true) {
        this.behaviorRiskLevel = 'MUY_ALTO';
      }

      if (this.assessment.interruptedAttempt.present === true) {
        this.behaviorRiskLevel = 'ALTO';
      }
      if (this.assessment.abortedAttempt.present === true) {
        this.behaviorRiskLevel = 'MODERADO-BAJO';
      }
      if (this.assessment.preparatoryActs.present === true) {
        this.behaviorRiskLevel = 'BAJO';
      }



      // this.riskLevel.level = this.calculatedRiskLevel;
      // this.assessment.riskLevel = this.calculatedRiskLevel;
    },

    getRiskIconColor(riskLevel) {
      switch (riskLevel) {
        case 'MUY_ALTO':
          return 'text-red-600';
        case 'ALTO':
          return 'text-red-500';
        case 'MODERADO':
          return 'text-yellow-500';
        case 'MODERADO-BAJO':
          return 'text-blue-500';
        case 'BAJO':
          return 'text-green-500';
        default:
          return 'text-red-400';
      }
    },

    getRiskTextColor(riskLevel) {
      switch (riskLevel) {
        case 'MUY ALTOooooo/EXTREMOoooooo':
          return'text-red-800';
        case 'MUY_ALTO':
          return 'text-red-600';
        case 'ALTO':
          return 'text-red-700';
        case 'MODERADO':
          return 'text-yellow-700';
        case 'MODERADO-BAJO': // Corregido de 'MEDIO-MODERADO'
          return 'text-orange-700';
        case 'BAJO':
          return 'text-green-700';
        default:
          return 'text-red-400';
      }
    },

    checkIdeation() {
      // Si la pregunta 2 es 'No', se resetean las preguntas 3, 4 y 5
      if (this.assessment.nonSpecificActiveSuicidalThoughts.present === false) {
        // Establece explícitamente a 'false' las preguntas adicionales
        this.assessment.activeSuicidalIdeationWithMethods.present = false;
        this.assessment.activeSuicidalIdeationWithMethods.description = '';
        this.assessment.activeSuicidalIdeationWithIntent.present = false;
        this.assessment.activeSuicidalIdeationWithIntent.description = '';
        this.assessment.activeSuicidalIdeationWithPlan.present = false;
        this.assessment.activeSuicidalIdeationWithPlan.description = '';
      }
      this.updateRiskLevel(); // Siempre actualizar el riesgo después de cambiar las ideaciones
    },

    conditionalResetBehavior() {
      if (
        this.assessment.deathWish.present === false &&
        this.assessment.nonSpecificActiveSuicidalThoughts.present === false
      ) {
        this.resetBehaviorFields();
      }
    },

    resetBehaviorFields() {
      this.assessment.actualAttempt = { present: null, description: '', totalAttempts: 0 };
      this.assessment.interruptedAttempt = { present: null, description: '', totalAttempts: 0 };
      this.assessment.abortedAttempt = { present: null, description: '', totalAttempts: 0 };
      this.assessment.preparatoryActs = { present: null, description: '' };
      this.assessment.mostLethalAttemptDate = '';
      this.assessment.lethalityDegree = null;
      this.assessment.potentialLethality = null;
    },

    async submitAssessment() {
      let mensaje = '';

      if (this.currentStep === 2) {
        if (
          this.assessment.deathWish.present === null ||
          this.assessment.nonSpecificActiveSuicidalThoughts.present === null
        ) {
          mensaje = 'Por favor, responda las preguntas 1 y 2 de Ideación Suicida.';
        } else if (
          this.showAdditionalIdeation &&
          (
            this.assessment.activeSuicidalIdeationWithMethods.present === null ||
            this.assessment.activeSuicidalIdeationWithIntent.present === null ||
            this.assessment.activeSuicidalIdeationWithPlan.present === null
          )
        ) {
          mensaje = 'Por favor, complete todas las preguntas de Ideación Suicida (3, 4 y 5).';
        }
      }

      if (mensaje) {
        await Swal.fire({ icon: 'warning', title: 'Validación', text: mensaje });
        return;
      }
      this.nextStep();
    },
    async submitFinalRemarks() {
      if (!this.savedAssessmentId) {
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Primero debe guardar la evaluación principal.' });
        return;
      }

      this.remarksLoading = true;
      try {
        const token = localStorage.getItem('x-token');
        const response = await axios.put(
          `${API_URL}/api/suicide-assessments/${this.savedAssessmentId}/final-remarks`,
          { finalRemarks: this.assessment.finalRemarks },
          { headers: { 'x-token': token } }
        );

        if (response.data.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Observaciones Guardadas',
            text: 'Las observaciones finales han sido actualizadas.'
          });
          this.$emit('assessment-updated', response.data.assessment);
        }
      } catch (error) {
        console.error(error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.msg || 'Error al guardar las observaciones finales.'
        });
      } finally {
        this.remarksLoading = false;
      }
    },
    formatDateToReadable(isoDateString) {
      if (!isoDateString || typeof isoDateString !== 'string') {
        return 'Fecha no disponible';
      }
      const date = new Date(isoDateString);
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const formattedDate = date.toLocaleDateString('es-EC', dateOptions);
      return formattedDate;
    },
    async fetchStudentDetails() {
      try {
        const token = localStorage.getItem('x-token');
        const studentId = this.$route.params.id;
        const response = await axios.get(`${API_URL}/api/students/${studentId}`, {
          headers: {
            'x-token': token,
          },
        });
        this.student = response.data;
        this.assessment.studentId = this.student._id;
        this.loading = false;
      } catch (error) {
        console.error('Error al obtener detalles del estudiante:', error);
        this.loading = false;
      }

    }, nextStep() {
      if (this.currentStep === 2) {
        if (!this.assessment.deathWish.present && !this.assessment.nonSpecificActiveSuicidalThoughts.present) {
          // Establecer a false los campos de ideación avanzada para evitar el error de validación
          this.assessment.activeSuicidalIdeationWithMethods.present = false;
          this.assessment.activeSuicidalIdeationWithIntent.present = false;
          this.assessment.activeSuicidalIdeationWithPlan.present = false;
          this.currentStep = 4;
        } else {
          this.currentStep++;
        }
      } else {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1 && this.currentStep !== 4) {
        this.currentStep--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    async saveEvaluation() {
      let mensaje = '';

      if (mensaje) {
        await Swal.fire({ icon: 'warning', title: 'Validación', text: mensaje });
        return;
      }

      try {
        const token = localStorage.getItem('x-token');
        const payload = {
          student: this.assessment.studentId,
          psicologiId: this.student.assignedPsychologist._id,
          ...this.assessment,
          ideationRiskLevel: this.ideationRiskLevel,
          behaviorRiskLevel: this.behaviorRiskLevel
        };

        const response = await axios.post(
          `${API_URL}/api/suicide-assessments`,
          payload,
          { headers: { 'x-token': token } }
        );

        if (response.data.ok) {
          this.savedAssessmentId = response.data.assessment._id;
          this.isAssessmentSaved = true;
          this.showFinalRemarks = true;
          this.currentStep = this.totalSteps + 1;
          this.$nextTick(() => {
            const section = this.$refs.finalRemarksSection;
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
            }
          });
          await Swal.fire({
            icon: 'success',
            title: 'Evaluación Guardada',
            text: 'La evaluación ha sido registrada exitosamente'
          });

          this.$emit('assessment-created', response.data.assessment);
        }
      } catch (error) {
        console.error(error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.msg || 'Error al guardar la evaluación'
        });
      }
    },
    updateData(event) {
      console.log('Intento de actualización en campo deshabilitado:', event.target.value);
    }
  },
  computed: {
    displayedRiskLevel() {
      if (this.currentStep === 2 || this.currentStep === 3) {
        return this.ideationRiskLevel;
      } else if (this.currentStep === 4) {
        return this.behaviorRiskLevel;
      }
      return 'BAJO';
    },
    showAdditionalIdeation() {
      return this.assessment.nonSpecificActiveSuicidalThoughts.present === true;
    },
    // showIntensitySection se ha eliminado ya que no se usará
    canShowBehaviorSection() {
      return (
        this.assessment.deathWish.present === false &&
        this.assessment.nonSpecificActiveSuicidalThoughts.present === false
      );
    },
    calculatedRiskLevel() {

      switch (this.currentStep) {
        case 2:
          if (this.assessment.deathWish.activeSuicidalIdeationWithPlan === true) { // Si la Q1 es Sí
            return 'MUY_ALTO';
          } else if (this.assessment.nonSpecificActiveSuicidalThoughts.present === true) { // Si la Q5 es Sí
            return 'ALTO';
          } else if (this.assessment.deathWish.present === false && this.assessment.nonSpecificActiveSuicidalThoughts.present === false) { // Si la Q4 es Sí
            return 'MEDIO-MODERADO';
          }
          // } else if (this.assessment.activeSuicidalIdeationWithMethods.present === true) { // Si la Q3 es Sí
          //     return 'MODERADO';
          // } else if (this.assessment.nonSpecificActiveSuicidalThoughts.present === true) { 
          //     return 'B';
          // } else if (this.assessment.deathWish.present === false && this.assessment.nonSpecificActiveSuicidalThoughts.present === false) { // Si Q1 y Q2 son No
          //     return 'MEDIO-MODERADO';
          // }

          // return 'BAJO'; 
          break;
        case 3:
          // Esta es una sección nueva. Deberías agregar aquí la lógica de validación
          // que aún no has definido. Por ahora, regresaremos 'BAJO' por defecto.
          return 'BAJO';
        case 4:
          // Lógica para la Sección 4 - Comportamiento Suicida (prioridad alta)
          if (this.assessment.actualAttempt.present === true) {
            return 'MUY_ALTO';
          }
          if (this.assessment.interruptedAttempt.present === true) {
            return 'ALTA';
          }
          if (this.assessment.abortedAttempt.present === true) {
            return 'MODERADO-BAJO';
          }
          if (this.assessment.preparatoryActs.present === true) {
            return 'BAJO';
          }
          break;
      }
      return 'BAJO';


    },
    fullName() {
      const tempStudent = this.student;
      if (tempStudent) {
        const firstName = tempStudent.firstName || '';
        const lastName = tempStudent.lastName || '';
        const full = `${firstName} ${lastName}`.trim();
        return full;
      }
      return '';
    },
    assignedPsychologistFullName() {
      if (this.student && this.student.assignedPsychologist) {
        const psychologist = this.student.assignedPsychologist;
        const firstName = psychologist.firstName || '';
        const lastName = psychologist.lastName || '';
        const full = `${firstName} ${lastName}`.trim();
        return full;
      }
      return '';
    },

    ideationRiskLevel() {
      const ideationType = this.ideationType;
      const frequency = this.assessment.ideationIntensity.frequency;
      if (ideationType === null || frequency === null) {
        return 'MODERADO';
      }

      if( frequency === 1 ){
        const trueRisk = (this.ideationType + frequency) / 2;
        if(trueRisk === 1) return 'MODERADO-BAJO'
        if(trueRisk === 1.5) return 'ALTO'
        if(trueRisk === 2) return 'MUY-ALTO'
        if(trueRisk === 2.5) return 'EXTREMO'
        if(trueRisk === 3) return 'PELIGRO'
        
      }else{
        const trueRisk2 = (this.ideationType + frequency) / 2;
        if(trueRisk2 === 0.5) return 'BAJO'
        if(trueRisk2 === 1) return 'MODERADO-BAJO'
        if(trueRisk2 === 1.5) return 'ALTO'
        if(trueRisk2 === 2) return 'MUY-ALTO'
        if(trueRisk2 === 2.5) return 'EXTREMO'

      }
      
      return 'BAJO';
    }, ideationType() {
      if (this.assessment.activeSuicidalIdeationWithPlan.present) {
        return 5;
      } else if (this.assessment.activeSuicidalIdeationWithIntent.present) {
        return 4;
      } else if (this.assessment.activeSuicidalIdeationWithMethods.present) {
        return 3;
      } else if (this.assessment.nonSpecificActiveSuicidalThoughts.present) {
        return 2;
      } else if (this.assessment.deathWish.present) {
        return 1;
      }
      return null;
    },
    progress() {
      if (this.isAssessmentSaved) {
        return 100;
      }
      const completedSteps = this.currentStep - 1;
      const totalStepsToComplete = this.totalSteps;
      return Math.round((completedSteps / totalStepsToComplete) * 100);
    },
    currentStepTitle() {
      return this.stepTitles[this.currentStep] || 'Resultados y Conclusión';
    },
  },
  watch: {
    'assessment.ideationIntensity.frequencyLabel': {
      immediate: true,
      handler(newLabel) {
        // Obtenemos el valor 0 o 1 del mapa
        const numericValue = this.labelToValueMap[newLabel];
        
        // Actualizamos el campo que el backend espera
        if (numericValue !== undefined) {
          this.assessment.ideationIntensity.frequency = numericValue;
        }
      }},
    ideationType: {
      handler(newVal) {
        if (newVal !== null) {
          this.assessment.ideationIntensity.mostSeriousIdeationType = newVal;
        }
      },
      immediate: true, // Esto hace que se ejecute al iniciar el componente
    },
    'currentStep': 'updateRiskLevel',
    'assessment.deathWish.present': 'updateRiskLevel',
    'assessment.nonSpecificActiveSuicidalThoughts.present': 'updateRiskLevel',
    'assessment.activeSuicidalIdeationWithMethods.present': 'updateRiskLevel',
    'assessment.activeSuicidalIdeationWithIntent.present': 'updateRiskLevel',
    'assessment.activeSuicidalIdeationWithPlan.present': 'updateRiskLevel',
    'assessment.actualAttempt.present': 'updateRiskLevel',
    'assessment.nonSuicidalSelfInjury.present': 'updateRiskLevel',
    'assessment.interruptedAttempt.present': 'updateRiskLevel',
    'assessment.abortedAttempt.present': 'updateRiskLevel',
    'assessment.preparatoryActs.present': 'updateRiskLevel', 'currentStep': 'updateRiskLevel',
    'assessment.deathWish.present': 'updateRiskLevel',
    'assessment.nonSpecificActiveSuicidalThoughts.present': 'updateRiskLevel',
    'assessment.activeSuicidalIdeationWithMethods.present': 'updateRiskLevel',
    'assessment.activeSuicidalIdeationWithIntent.present': 'updateRiskLevel',
    'assessment.activeSuicidalIdeationWithPlan.present': 'updateRiskLevel',
    'assessment.actualAttempt.present': 'updateRiskLevel',
    'assessment.nonSuicidalSelfInjury.present': 'updateRiskLevel',
    'assessment.interruptedAttempt.present': 'updateRiskLevel',
    'assessment.abortedAttempt.present': 'updateRiskLevel',
    'assessment.preparatoryActs.present': 'updateRiskLevel',
    'currentStep': 'updateRiskLevel', // Eliminar
    'assessment.deathWish.present': 'updateRiskLevel', // Eliminar
    'assessment.nonSpecificActiveSuicidalThoughts.present': 'updateRiskLevel',

  },

  setup() {

    return {
      UserIcon,
      FileTextIcon,
      BrainIcon,
      ActivityIcon,
      AlertTriangleIcon,
      CheckCircleIcon,
      ChevronLeftIcon,
      ChevronRightIcon,
    };
  },
};
</script>

<style>
/* Custom form styles */
.form-input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors;
}

.form-input:disabled,
.form-textarea:disabled {
  cursor: not-allowed;
  @apply bg-gray-100 text-gray-500;
}


.form-textarea {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors min-h-[100px] resize-y;
}

.form-radio {
  @apply w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500;
}

.btn-primary {
  @apply px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium;
}

.btn-secondary {
  @apply px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium;
}

.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200;
}

.alert-success {
  @apply bg-green-50 border border-green-200 text-green-800 rounded-lg p-4;
}

.alert-warning {
  @apply bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4;
}

.alert-danger {
  @apply bg-red-50 border border-red-200 text-red-800 rounded-lg p-4;
}

.alert-info {
  @apply bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4;
}

/* Clases para impresión, ocultar la barra de progreso y botones */
@media print {
  .print-hidden {
    display: none !important;
  }
}

.risk-low {
    color: green;
}
.risk-mod-low {
    color: orange;
}
.risk-high {
    color: darkorange; /* Naranja fuerte */
}
.risk-very-high {
    color: indianred; /* Rojo bajo */
}
.risk-extreme {
    color: red;
}
.risk-danger {
    color: black;
    background-color: red;
    font-weight: bold;
    padding: 2px 4px;
}
</style>