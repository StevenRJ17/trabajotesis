// src/config/questions.js

export const defaultSubPreguntas = {
  deseos_de_morir: {
    pregunta_principal_texto: '¿Ha deseado morir o que sería mejor estar muerto?',
    sub_preguntas: [
      { id: '1', texto: '¿Con qué frecuencia piensa en esto?' },
      // ... otras sub-preguntas si las hay para esta sección
    ]
  },
  pensamientos_suicidas_no_especificos: {
    pregunta_principal_texto: '¿Ha tenido pensamientos suicidas activos sin un plan específico para actuar?',
    sub_preguntas: [
      { id: '1', texto: '¿Pensamientos de suicidarse? (Por ejemplo: "Quiero suicidarme")' },
      { id: '2', texto: '¿Con qué frecuencia piensa en suicidarse?' },
      // ...
    ]
  },
  ideacion_con_metodo_sin_plan_ni_intencion: {
    pregunta_principal_texto: '¿Ha tenido pensamientos suicidas activos con un método específico (sin plan ni intención de actuar)?',
    sub_preguntas: [
      // ... sub preguntas específicas para esta sección
    ]
  },
  ideacion_con_intencion_sin_plan_especifico: {
    pregunta_principal_texto: '¿Ha tenido pensamientos suicidas activos con cierta intención de actuar (sin un plan específico)?',
    sub_preguntas: [
      // ...
    ]
  },
  ideacion_con_plan_e_intencion: {
    pregunta_principal_texto: '¿Ha tenido pensamientos suicidas activos con un plan específico e intención de actuar?',
    sub_preguntas: [
      // ...
    ]
  },
  comportamiento_suicida: {
    intento_real: {
      pregunta_principal_texto: '¿Ha habido un intento real de suicidio?',
      sub_preguntas: [
        { id: 'a', texto: '¿Estaba la persona tratando de hacerse daño (por ejemplo, quemarse, cortarse, golpearse la cabeza, tirarse del cabello, etc.)?' },
        { id: 'b', texto: '¿Fue el intento potencialmente letal (por ejemplo, tomar una sobredosis de medicamentos, saltar desde una altura, ahorcarse, etc.)?' },
        // ... otras sub-preguntas
      ]
    },
    intento_interrumpido: {
      pregunta_principal_texto: '¿Ha habido un intento de suicidio interrumpido por un tercero o una circunstancia externa?',
      sub_preguntas: [
        { id: 'a', texto: '¿Estaba la persona tratando de hacerse daño?' },
        { id: 'b', texto: '¿Fue el intento potencialmente letal?' },
        // ...
      ]
    },
    intento_abortado: {
      pregunta_principal_texto: '¿Ha habido un intento de suicidio abortado por la propia persona antes de que se hiciera daño?',
      sub_preguntas: [
        { id: 'a', texto: '¿Estaba la persona tratando de hacerse daño?' },
        { id: 'b', texto: '¿Fue el intento potencialmente letal?' },
        // ...
      ]
    },
    actos_preparatorios: {
      pregunta_principal_texto: '¿Ha realizado actos preparatorios o se ha comportado de manera inusual en preparación para un intento de suicidio?',
      sub_preguntas: [
        { id: 'a', texto: '¿La persona ha escrito una nota de suicidio?' },
        { id: 'b', texto: '¿La persona se ha despedido de alguien?' },
        // ...
      ]
    }
  }
};

// initializeSectionSubQuestions no es estrictamente necesario en ReportPDF,
// pero si lo usas para la estructura inicial del 'assessmentData' por defecto,
// entonces es útil mantenerlo.
export function initializeSectionSubQuestions(sectionKey) {
  // Asegúrate de que defaultSubPreguntas esté bien definido para todas las claves.
  // Aquí asumo que la estructura es similar a `defaultSubPreguntas[sectionKey]`
  // o `defaultSubPreguntas.comportamiento_suicida[sectionKey]`
  let sectionConfig = defaultSubPreguntas[sectionKey];

  if (sectionKey === 'comportamiento_suicida') {
    // Para comportamiento_suicida, inicializa cada sub-sección
    const behaviorSections = {};
    for (const subKey in defaultSubPreguntas.comportamiento_suicida) {
      behaviorSections[subKey] = {
        pregunta_principal_texto: defaultSubPreguntas.comportamiento_suicida[subKey].pregunta_principal_texto,
        respuesta_seccion: null,
        descripcion_seccion: null,
        numero_de_intentos: (subKey !== 'actos_preparatorios') ? 0 : null, // Solo si aplica
        sub_preguntas: defaultSubPreguntas.comportamiento_suicida[subKey].sub_preguntas.map(q => ({
          id: q.id,
          texto: q.texto,
          respuesta: null,
          descripcion: null,
        })),
      };
    }
    return behaviorSections;
  } else if (sectionConfig) {
    // Para otras secciones
    return {
      pregunta_principal_texto: sectionConfig.pregunta_principal_texto,
      respuesta_seccion: null,
      descripcion_seccion: null,
      sub_preguntas: sectionConfig.sub_preguntas.map(q => ({
        id: q.id,
        texto: q.texto,
        respuesta: null,
        descripcion: null,
      })),
    };
  }
  return {}; // Retorna un objeto vacío si la sección no se encuentra
}