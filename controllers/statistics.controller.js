const { response, request } = require('express');
const {User} = require('../models/user');
const Student = require('../models/student');
const SuicideAssessment = require('../models/suicideAssessment');
const { buildMatchStage } = require('../helpers/staticshelper');
        const mongoose = require('mongoose'); 
        const ObjectId = mongoose.Types.ObjectId;



// Controlador principal para la ruta de estadísticas
const getAllAssessments = async (req, res = response) => {
    try {
        // 🔑 PASO 1: Obtener ID y Rol del usuario autenticado
        const psychologistId = req.uid; 
        const userRole = req.role; 

        if (!psychologistId) {
             return res.status(401).json({ msg: 'ID de usuario no proporcionado. Token requerido.' });
        }
        
        // Obtenemos los filtros de la consulta (query)
        const filters = req.query;

        // Construimos la etapa de coincidencia (match stage) para los filtros de la QUERY (fecha, carrera, etc.)
        const queryMatchStage = buildMatchStage(filters);

        let pipeline = [];
        
        // 🔑 PASO 2: Insertar la etapa $match SOLO si el usuario es un PSICÓLOGO
        // Esto debe ser lo primero en el pipeline para limitar el dataset
        if (userRole === 'PSYCHOLOGIST') {
            pipeline.push({
                $match: { 
                    psychologist: new ObjectId(psychologistId) 
                }
            });
        }
        // Si es ADMIN, el pipeline es global.

        // 🔑 PASO 3: Si hay filtros de QUERY, los agregamos después del filtro de rol/global
        if (queryMatchStage) {
            pipeline.push(queryMatchStage);
        }

        // Unimos los datos de estudiantes y usuarios (psicólogos)
        pipeline.push(
            { $lookup: { from: 'students', localField: 'student', foreignField: '_id', as: 'studentInfo' } },
            { $unwind: { path: '$studentInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'psychologist', foreignField: '_id', as: 'psychologistInfo' } },
            { $unwind: { path: '$psychologistInfo', preserveNullAndEmptyArrays: true } }
        );

        // Opcional: Proyectamos solo los campos que necesitamos (sin cambios)
        pipeline.push(
            {
                $project: {
                    _id: 1,
                    date: 1,
                    ideationRiskLevel: 1,
                    behaviorRiskLevel:1,
                    deathWish: 1,
                    nonSpecificActiveSuicidalThoughts: 1,
                    activeSuicidalIdeationWithMethods: 1,
                    activeSuicidalIdeationWithIntent: 1,
                    activeSuicidalIdeationWithPlan: 1,
                    actualAttempt: 1,
                    interruptedAttempt: 1,
                    abortedAttempt: 1,
                    preparatoryActs: 1,
                    'studentInfo.career': 1,
                    'studentInfo.gender': 1,
                    'studentInfo.birthDate': 1,
                    'psychologistInfo.firstName': 1,
                    'psychologistInfo.lastName': 1,
                }
            }
        );

        // Ejecutamos la agregación con el pipeline
        const assessments = await SuicideAssessment.aggregate(pipeline);

        // Enviamos la respuesta con todas las evaluaciones
        res.json(assessments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error del servidor al obtener las evaluaciones.' });
    }
};

const getIdeationRiskStats = async (req, res) => {
    try {
        const psychologistId = req.uid; 
        const userRole = req.role; // Asumimos que el rol viene del middleware
        


        if (!psychologistId) {
            return res.status(401).json({ msg: 'ID de usuario no proporcionado. Token requerido.' });
        }
        
        const pipeline = [];
        
        // 🔑 LÓGICA CLAVE: Aplicar filtro SOLO si el rol NO es ADMIN
        if (userRole === 'PSYCHOLOGIST') {
            pipeline.push({
                $match: { 
                    psychologist: new ObjectId(psychologistId) 
                }
            });
        }
        // Si el rol es 'ADMIN' u otro, el pipeline no incluye el $match,
        // por lo que procesará *todas* las evaluaciones de la colección.

        // Continuamos el pipeline con la agregación normal
        pipeline.push(
            {
                // Agrupar por el campo 'ideationRiskLevel'
                $group: {
                    _id: '$ideationRiskLevel',
                    count: { $sum: 1 }
                }
            },
            {
                // Proyectar/Renombrar los campos
                $project: {
                    _id: 0,
                    name: '$_id',
                    y: '$count'
                }
            },
            {
                // Ordenar por conteo descendente
                $sort: { y: -1 }
            }
        );

        const stats = await SuicideAssessment.aggregate(pipeline);
        
        res.status(200).json(stats);

    } catch (error) {
        console.error('Error al obtener estadísticas de riesgo de ideación:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};


const getAssessmentTimeline = async (req, res) => {
    try {
        const { timeframe = 'month' } = req.query;
        
        // 🔑 PASO 1: Obtener ID y Rol del usuario autenticado (del middleware)
        const psychologistId = req.uid; 
        const userRole = req.role; 

        if (!psychologistId) {
             return res.status(401).json({ msg: 'ID de usuario no proporcionado. Token requerido.' });
        }

        let dateFormat;

        // ... (Lógica de switch case para dateFormat permanece sin cambios)
        switch (timeframe.toLowerCase()) {
            case 'day':
                dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
                break;
            case 'week':
                dateFormat = { 
                    $concat: [
                        { $toString: { $isoWeekYear: "$date" } }, 
                        "-W", 
                        { $toString: { $isoWeek: "$date" } }
                    ]
                };
                break;
            case 'month':
                dateFormat = { $dateToString: { format: "%Y-%m", date: "$date" } };
                break;
            case 'year':
                dateFormat = { $dateToString: { format: "%Y", date: "$date" } };
                break;
            default:
                return res.status(400).json({ msg: 'timeframe no válido. Use day, week, month o year.' });
        }

        const pipeline = [];
        
        // 🔑 PASO 2: Insertar la etapa $match SOLO si el usuario es un PSICÓLOGO
        if (userRole === 'PSYCHOLOGIST') {
            pipeline.push({
                $match: { 
                    psychologist: new ObjectId(psychologistId) 
                }
            });
        }
        // Si es ADMIN, no se agrega el $match, y el pipeline es global.


        // Continuación del pipeline original
        pipeline.push(
            {
                // Paso 3: Agrupar documentos por la unidad de tiempo definida
                $group: {
                    _id: dateFormat, 
                    count: { $sum: 1 } 
                }
            },
            {
                // Paso 4: Ordenar cronológicamente
                $sort: { _id: 1 } 
            },
            {
                // Paso 5: Proyectar y renombrar para el frontend
                $project: {
                    _id: 0,
                    dateLabel: '$_id', 
                    count: '$count' 
                }
            }
        );

        // Ejecutar el Aggregation Pipeline
        const timelineStats = await SuicideAssessment.aggregate(pipeline);

        res.status(200).json(timelineStats);

    } catch (error) {
        console.error('Error al obtener la línea de tiempo de evaluaciones:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};


const getRiskByCareerStats = async (req, res) => {
    try {
        // 🔑 PASO 1: Obtener ID y Rol del usuario autenticado
        const psychologistId = req.uid; 
        const userRole = req.role; 

        if (!psychologistId) {
             return res.status(401).json({ msg: 'ID de usuario no proporcionado. Token requerido.' });
        }
        
        const pipeline = [];

        // 🔑 PASO 2: Insertar la etapa $match SOLO si el usuario es un PSICÓLOGO
        if (userRole === 'PSYCHOLOGIST') {
            pipeline.push({
                $match: { 
                    psychologist: new ObjectId(psychologistId) 
                }
            });
        }
        // Si es ADMIN, se omite el $match, y el pipeline es global.
        
        // Continuamos con el resto del pipeline original:
        pipeline.push(
            // 3. Unir (Lookup) con la colección de estudiantes para obtener la carrera
            {
                $lookup: {
                    from: Student.collection.name, 
                    localField: 'student', 
                    foreignField: '_id', 
                    as: 'studentInfo' 
                }
            },
            // 4. Desenrollar el array studentInfo. 
            {
                $unwind: '$studentInfo'
            },
            // 5. Agrupar por Carrera Y Nivel de Riesgo
            {
                $group: {
                    _id: {
                        career: '$studentInfo.career',
                        riskLevel: '$ideationRiskLevel' 
                    },
                    count: { $sum: 1 } 
                }
            },
            // 6. Proyectar y renombrar
            {
                $project: {
                    _id: 0,
                    career: '$_id.career',
                    riskLevel: '$_id.riskLevel',
                    count: '$count'
                }
            },
            // 7. Ordenar por carrera
            {
                $sort: { career: 1 }
            }
        );

        const stats = await SuicideAssessment.aggregate(pipeline);

        res.status(200).json(stats);

    } catch (error) {
        console.error('Error al obtener estadísticas de riesgo por carrera:', error);
        res.status(500).json({ msg: 'Error interno del servidor al procesar las estadísticas.' });
    }
};


const getRiskByGenderStats = async (req, res) => {
    try {
        // 🔑 PASO 1: Obtener ID y Rol del usuario autenticado
        const psychologistId = req.uid; 
        const userRole = req.role; 

        if (!psychologistId) {
             return res.status(401).json({ msg: 'ID de usuario no proporcionado. Token requerido.' });
        }
        
        const pipeline = [];

        // 🔑 PASO 2: Insertar la etapa $match SOLO si el usuario es un PSICÓLOGO
        if (userRole === 'PSYCHOLOGIST') {
            pipeline.push({
                $match: { 
                    psychologist: new ObjectId(psychologistId) 
                }
            });
        }
        // Si es ADMIN, el pipeline es global.
        
        // Continuamos con el resto del pipeline original:
        pipeline.push(
            // 3. Unir (Lookup) con la colección de estudiantes para obtener el género
            {
                $lookup: {
                    from: Student.collection.name, 
                    localField: 'student', 
                    foreignField: '_id', 
                    as: 'studentInfo' 
                }
            },
            // 4. Desenrollar el array studentInfo.
            {
                $unwind: '$studentInfo'
            },
            // 5. Agrupar por Género Y Nivel de Riesgo
            {
                $group: {
                    _id: {
                        gender: '$studentInfo.gender', 
                        riskLevel: '$ideationRiskLevel' 
                    },
                    count: { $sum: 1 }
                }
            },
            // 6. Proyectar y renombrar
            {
                $project: {
                    _id: 0,
                    gender: '$_id.gender',
                    riskLevel: '$_id.riskLevel',
                    count: '$count'
                }
            },
            // 7. Ordenar
            {
                $sort: { gender: 1, riskLevel: -1 }
            }
        );

        const stats = await SuicideAssessment.aggregate(pipeline);

        res.status(200).json(stats);

    } catch (error) {
        console.error('Error al obtener estadísticas de riesgo por género:', error);
        res.status(500).json({ msg: 'Error interno del servidor al procesar las estadísticas.' });
    }
};

const getRiskByAgeStats = async (req, res) => {
    try {
        const { ageRange } = req.query; 

        // 🔑 PASO 1: Obtener ID y Rol del usuario autenticado
        const psychologistId = req.uid; 
        const userRole = req.role; 

        if (!psychologistId) {
             return res.status(401).json({ msg: 'ID de usuario no proporcionado. Token requerido.' });
        }
        
        const pipeline = [];

        // 🔑 PASO 2: Insertar la etapa $match SOLO si el usuario es un PSICÓLOGO
        if (userRole === 'PSYCHOLOGIST') {
            pipeline.push({
                $match: { 
                    psychologist: new ObjectId(psychologistId) 
                }
            });
        }
        // Si es ADMIN, el pipeline es global.
        
        // Continuamos con el resto del pipeline original, comenzando con el $lookup
        pipeline.push(
            // 3. Unir (Lookup) con la colección de estudiantes para obtener la edad
            {
                $lookup: {
                    from: Student.collection.name,
                    localField: 'student',
                    foreignField: '_id',
                    as: 'studentInfo'
                }
            },
            { $unwind: '$studentInfo' },

            // 4. Clasificar la edad en rangos usando $switch
            {
                $addFields: {
                    ageGroup: {
                        $switch: {
                            branches: [
                                { case: { $in: ['$studentInfo.age', [17, 18, 19]] }, then: '17-19 Años' },
                                { case: { $in: ['$studentInfo.age', [20, 21, 22]] }, then: '20-22 Años' },
                                { case: { $gte: ['$studentInfo.age', 23] }, then: '+23 Años' },
                            ],
                            default: 'Sin Clasificar'
                        }
                    }
                }
            }
        );

        // 5. Aplicar filtro opcional ageRange (si existe)
        if (ageRange) {
            let ageGroupFilter;
            
            switch (ageRange) {
                case '17-19': ageGroupFilter = '17-19 Años'; break;
                case '20-22': ageGroupFilter = '20-22 Años'; break;
                case '23+': ageGroupFilter = '+23 Años'; break;
                default:
                    console.warn(`Rango de edad no válido: ${ageRange}`);
            }
            
            if (ageGroupFilter) {
                pipeline.push({
                    $match: {
                        ageGroup: ageGroupFilter
                    }
                });
            }
        }

        // 6. Agrupar por Rango de Edad Y Nivel de Riesgo
        pipeline.push(
            {
                $group: {
                    _id: {
                        ageGroup: '$ageGroup', 
                        riskLevel: '$ideationRiskLevel'
                    },
                    count: { $sum: 1 }
                }
            },
            // 7. Proyectar y ordenar
            {
                $project: {
                    _id: 0,
                    ageGroup: '$_id.ageGroup',
                    riskLevel: '$_id.riskLevel',
                    count: '$count'
                }
            },
            {
                $sort: { ageGroup: 1 }
            }
        );

        const stats = await SuicideAssessment.aggregate(pipeline);
        
        res.status(200).json(stats);

    } catch (error) {
        console.error('Error al obtener estadísticas de riesgo por edad:', error);
        res.status(500).json({ msg: 'Error interno del servidor al procesar las estadísticas.' });
    }
};



/**
 * @route GET /api/suicide-assessments/stats/ideation-frequency
 * @desc Obtiene el conteo de respuestas positivas para 5 preguntas clave de ideación.
 * @access Private
 */
const getIdeationFrequencyStats = async (req, res) => {
    try {
        // 🔑 PASO 1: Obtener ID y Rol del usuario autenticado
        const psychologistId = req.uid; 
        const userRole = req.role; 

        if (!psychologistId) {
             return res.status(401).json({ msg: 'ID de usuario no proporcionado. Token requerido.' });
        }
        
        const pipeline = [];

        // 🔑 PASO 2: Insertar la etapa $match SOLO si el usuario es un PSICÓLOGO
        if (userRole === 'PSYCHOLOGIST') {
            pipeline.push({
                $match: { 
                    psychologist: new ObjectId(psychologistId) 
                }
            });
        }
        // Si es ADMIN, el pipeline es global.
        
        // Continuamos con el resto del pipeline original
        pipeline.push(
            {
                $group: {
                    // Solo necesitamos un grupo para contar todas las evaluaciones
                    _id: null, 
                    
                    // Contamos las respuestas TRUE para cada campo:
                    
                    // 1. Deseo de Muerte (deathWish.present)
                    deathWishCount: {
                        $sum: {
                            $cond: [{ $eq: ['$deathWish.present', true] }, 1, 0]
                        }
                    },
                    
                    // 2. Pensamientos Suicidas No Específicos (nonSpecificActiveSuicidalThoughts.present)
                    nonSpecificCount: {
                        $sum: {
                            $cond: [{ $eq: ['$nonSpecificActiveSuicidalThoughts.present', true] }, 1, 0]
                        }
                    },
                    
                    // 3. Ideación Activa con Métodos (activeSuicidalIdeationWithMethods.present)
                    methodsCount: {
                        $sum: {
                            $cond: [{ $eq: ['$activeSuicidalIdeationWithMethods.present', true] }, 1, 0]
                        }
                    },
                    
                    // 4. Ideación Activa con Intención (activeSuicidalIdeationWithIntent.present)
                    intentCount: {
                        $sum: {
                            $cond: [{ $eq: ['$activeSuicidalIdeationWithIntent.present', true] }, 1, 0]
                        }
                    },
                    
                    // 5. Ideación Activa con Plan (activeSuicidalIdeationWithPlan.present)
                    planCount: {
                        $sum: {
                            $cond: [{ $eq: ['$activeSuicidalIdeationWithPlan.present', true] }, 1, 0]
                        }
                    },
                }
            },
            // 6. Proyectar y reformatear el resultado si es necesario
            {
                $project: {
                    _id: 0,
                    deathWishCount: 1,
                    nonSpecificCount: 1,
                    methodsCount: 1,
                    intentCount: 1,
                    planCount: 1,
                }
            }
        );

        const stats = await SuicideAssessment.aggregate(pipeline);
        
        res.status(200).json(stats);

    } catch (error) {
        console.error('Error al obtener estadísticas de frecuencia de ideación:', error);
        res.status(500).json({ msg: 'Error interno del servidor al procesar las estadísticas.' });
    }
};
const getBehaviorFrequencyStats = async (req, res) => {
    try {
        // 🔑 PASO 1: Obtener ID y Rol del usuario autenticado
        const psychologistId = req.uid; 
        const userRole = req.role; 

        if (!psychologistId) {
             return res.status(401).json({ msg: 'ID de usuario no proporcionado. Token requerido.' });
        }
        
        const pipeline = [];

        // 🔑 PASO 2: Insertar la etapa $match SOLO si el usuario es un PSICÓLOGO
        if (userRole === 'PSYCHOLOGIST') {
            pipeline.push({
                $match: { 
                    psychologist: new ObjectId(psychologistId) 
                }
            });
        }
        // Si es ADMIN, el pipeline es global.
        
        // Continuamos con el resto del pipeline original
        pipeline.push(
            {
                $group: {
                    // Agrupamos en un solo documento
                    _id: null, 
                    
                    // Contamos las respuestas TRUE para cada campo:
                    
                    // 1. Intento Actual (actualAttempt.present)
                    actualAttemptCount: {
                        $sum: {
                            $cond: [{ $eq: ['$actualAttempt.present', true] }, 1, 0]
                        }
                    },
                    
                    // 2. Intento Interrumpido (interruptedAttempt.present)
                    interruptedAttemptCount: {
                        $sum: {
                            $cond: [{ $eq: ['$interruptedAttempt.present', true] }, 1, 0]
                        }
                    },
                    
                    // 3. Intento Abortado (abortedAttempt.present)
                    abortedAttemptCount: {
                        $sum: {
                            $cond: [{ $eq: ['$abortedAttempt.present', true] }, 1, 0]
                        }
                    },
                    
                    // 4. Actos Preparatorios (preparatoryActs.present)
                    preparatoryActsCount: {
                        $sum: {
                            $cond: [{ $eq: ['$preparatoryActs.present', true] }, 1, 0]
                        }
                    },
                }
            },
            // 5. Proyectar y reformatear el resultado
            {
                $project: {
                    _id: 0,
                    actualAttemptCount: 1,
                    interruptedAttemptCount: 1,
                    abortedAttemptCount: 1,
                    preparatoryActsCount: 1,
                }
            }
        );

        const stats = await SuicideAssessment.aggregate(pipeline);
        
        res.status(200).json(stats);

    } catch (error) {
        console.error('Error al obtener estadísticas de frecuencia de comportamiento:', error);
        res.status(500).json({ msg: 'Error interno del servidor al procesar las estadísticas.' });
    }
};
const getEvaluationsByPsychologistStats = async (req, res) => {
    try {
        const { period } = req.query;
        let startDate;
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Establecer a medianoche de hoy

        // Lógica para determinar la fecha de inicio del período de tiempo
        switch (period) {
            case 'day':
                startDate = now;
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - now.getDay())); // Inicio de la semana (domingo)
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Inicio del mes
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1); // Inicio del año
                break;
            default:
                // Si no hay filtro (o es inválido), se muestra todo el historial (no se aplica filtro de fecha)
                startDate = null; 
        }

        const pipeline = [];

        // 1. Aplicar filtro de fecha si existe
        if (startDate) {
            pipeline.push({
                $match: {
                    date: { $gte: startDate }
                }
            });
        }
        
        // 2. Agrupar por el ID del psicólogo y contar
        pipeline.push({
            $group: {
                _id: '$psychologist',
                count: { $sum: 1 }
            }
        });
        
        // 3. Unir (Lookup) con la colección de usuarios para obtener el nombre del psicólogo
        pipeline.push({
            $lookup: {
                from: User.collection.name, // Nombre de la colección de User (ej. 'users')
                localField: '_id',
                foreignField: '_id',
                as: 'psychologistInfo'
            }
        });

        // 4. Desenrollar el array (debería ser un solo objeto)
        pipeline.push({ $unwind: '$psychologistInfo' });

        // 5. Proyectar y reformatear el resultado
        pipeline.push({
            $project: {
                _id: 0,
                psychologistId: '$_id',
                psychologistName: { $concat: ['$psychologistInfo.firstName', ' ', '$psychologistInfo.lastName'] },
                count: 1
            }
        });

        // 6. Ordenar por conteo descendente
        pipeline.push({
            $sort: { count: -1 }
        });

        const stats = await SuicideAssessment.aggregate(pipeline);
        
        res.status(200).json(stats);

    } catch (error) {
        console.error('Error al obtener estadísticas de evaluaciones por psicólogo:', error);
        res.status(500).json({ msg: 'Error interno del servidor al procesar las estadísticas.' });
    }
};
module.exports = {
    getAllAssessments,
    getIdeationRiskStats,
    getAssessmentTimeline,
    getRiskByCareerStats,
    getRiskByGenderStats,
    getRiskByAgeStats,
    getIdeationFrequencyStats,
    getBehaviorFrequencyStats,
    getEvaluationsByPsychologistStats
    
};
