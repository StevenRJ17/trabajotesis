const { Schema, model } = require('mongoose');

const suicideAssessmentSchema = Schema({
    // ... (campos existentes, sin cambios aquí)
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    psychologist: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    // Ideación Suicida
    deathWish: {
        present: {
            type: Boolean,
            required: true
        },
        description: String
    },
    nonSpecificActiveSuicidalThoughts: {
        present: {
            type: Boolean,
            required: true
        },
        description: String
    },
    activeSuicidalIdeationWithMethods: {
        present: {
            type: Boolean,
            required: function () {
                return this.nonSpecificActiveSuicidalThoughts.present === true;
            },
            default: false
        },
        description: String
    },
    activeSuicidalIdeationWithIntent: {
        present: {
            type: Boolean,
            required: function () {
                return this.nonSpecificActiveSuicidalThoughts.present === true;
            },
            default: false
        },
        description: String
    },
    activeSuicidalIdeationWithPlan: {
        present: {
            type: Boolean,
            required: function () {
                return this.nonSpecificActiveSuicidalThoughts.present === true;
            },
            default: false
        },
        description: {
            type: String,
            default: ''
        },
        frequency: {
            type: Number,
            default: 0
        },
       
    },
    // Sección de Intensidad de la Ideación
    ideationIntensity: {
        mostSeriousIdeationType: {
            type: Number,
            min: 1,
            max: 5,
            required: function () {
                return this.deathWish.present === true || this.nonSpecificActiveSuicidalThoughts.present === true;
            }
        },
        mostSeriousIdeationDescription: {
            type: String,
            required: function () {
                return this.deathWish.present === true || this.nonSpecificActiveSuicidalThoughts.present === true;
            }
        },
        frequency: { // Esta es la frecuencia que usaremos para ajustar el riesgo
            type: Number,
            enum: [0,1], // 0: No sabe/No corresponde, 1: Solo una vez, 2: Unas pocas veces, 3: Muchas, 4: Todo el tiempo
            required: function () {
                return this.deathWish.present === true || this.nonSpecificActiveSuicidalThoughts.present === true;
            }
        },
         frequencyLabel: { 
            type: String, 
            default: 'N/A', 
            required: function () {
                return this.deathWish.present === true || this.nonSpecificActiveSuicidalThoughts.present === true;
            }
        }
    },
    ideationRiskLevel: {
        type: String,
        enum: ['BAJO', 'MODERADO-BAJO', 'ALTO', 'MUY_ALTO', 'EXTREMO', 'PELIGRO'],
        required: true
    },
    behaviorRiskLevel: {
        type: String,
        enum: ['BAJO', 'MODERADO-BAJO', 'ALTO', 'MUY_ALTO'],
        required: true
    },
    observations: String,

    // Comportamiento Suicida
    actualAttempt: {
        present: {
            type: Boolean,
            required: function () {
                return this.deathWish.present === false && this.nonSpecificActiveSuicidalThoughts.present === false;
            }
        },
        description: String,
        totalAttempts: {
            type: Number,
            default: 0
        }
    },
  
    interruptedAttempt: {
        present: {
            type: Boolean,
            required: function () {
                return this.deathWish.present === false && this.nonSpecificActiveSuicidalThoughts.present === false;
            }
        },
        description: String,
        totalAttempts: {
            type: Number,
            default: 0
        }
    },
    abortedAttempt: {
        present: {
            type: Boolean,
            required: function () {
                return this.deathWish.present === false && this.nonSpecificActiveSuicidalThoughts.present === false;
            }
        },
        description: String,
        totalAttempts: {
            type: Number,
            default: 0
        }
    },
    preparatoryActs: {
        present: {
            type: Boolean,
            required: function () {
                return this.deathWish.present === false && this.nonSpecificActiveSuicidalThoughts.present === false;
            }
        },
        description: String
    },
    completedSuicide: {
        type: Boolean,
        default: false
    },
    mostLethalAttemptDate: Date,
    lethalityDegree: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    potentialLethality: {
        type: Number,
        min: 0,
        max: 2
    },
    finalRemarks: {
        type: String,
        default: ''
    }
});

// Método para validar si debe mostrar preguntas adicionales de ideación
suicideAssessmentSchema.methods.shouldShowAdditionalIdeation = function () {
    return this.nonSpecificActiveSuicidalThoughts.present === true;
};

// Método para validar si debe continuar con la evaluación de comportamiento
suicideAssessmentSchema.methods.shouldContinueAssessment = function () {
    // Solo continuar si ambas preguntas son negativas
    return this.deathWish.present === false && this.nonSpecificActiveSuicidalThoughts.present === false;
};

// Método para calcular automáticamente el nivel de riesgo
suicideAssessmentSchema.methods.calculateRiskLevel = function () {
    let ideationRiskLevel = 'BAJO';
    let behaviorRiskLevel = 'BAJO';
    if (this.actualAttempt.present === true) {
        behaviorRiskLevel = 'MUY_ALTO';
    }
    if (this.interruptedAttempt.present === true) {
        behaviorRiskLevel = 'ALTO';
    }
    if (this.abortedAttempt.present === true) {
        behaviorRiskLevel = 'MODERADO-BAJO';
    }
    if (this.preparatoryActs.present === true) {
        behaviorRiskLevel = 'BAJO';
    }

    const ideationType = this.ideationIntensity.mostSeriousIdeationType;
    const frequency = this.ideationIntensity.frequency;

    if (ideationType) {
        const trueRisk = (ideationType + frequency) / 2;
        if (trueRisk <= 1.5) {
            ideationRiskLevel = 'BAJO';
        } else if (trueRisk <= 2.5) {
            ideationRiskLevel = 'MODERADO-BAJO';
        } else if (trueRisk <= 3.5) {
            ideationRiskLevel = 'MODERADO';
        } else if (trueRisk <= 4) {
            ideationRiskLevel = 'ALTO';
        } else {
            ideationRiskLevel = 'MUY_ALTO';
        }
    }

    // const trueRisk = (ideationType + frequency) / 2;

    // // Mapea el valor de 'trueRisk' a los niveles de riesgo definidos
    // if (trueRisk <= 1.5) { // Por ejemplo, (1+0)/2 = 0.5, (1+1)/2 = 1, (2+0)/2 = 1, (2+1)/2 = 1.5
    //     ideationRiskLevel  = 'BAJO';
    // } else if (trueRisk <= 2.5) { // Por ejemplo, (2+2)/2 = 2, (3+1)/2 = 2, (3+2)/2 = 2.5
    //     ideationRiskLevel  = 'MODERADO-BAJO';
    // } else if (trueRisk <= 3.5) { // Por ejemplo, (3+3)/2 = 3, (4+2)/2 = 3, (4+3)/2 = 3.5
    //     ideationRiskLevel  = 'MODERADO';
    // } else if (trueRisk <= 4) { // Por ejemplo, (4+4)/2 = 4, (5+3)/2 = 4, (5+4)/2 = 4.5
    //     ideationRiskLevel  = 'ALTO';
    // } else { // Si trueRisk es mayor a 4.5 (solo posible con 5+4 = 4.5, pero con valores flotantes podría ser 4.6, 4.7...)
    //     ideationRiskLevel  = 'MUY_ALTO'; // O 'EXTREMO' si quieres un umbral más alto para este.
    // }

    return { ideationRiskLevel, behaviorRiskLevel };
};

module.exports = model('SuicideAssessment', suicideAssessmentSchema);