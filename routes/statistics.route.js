const { Router } = require('express');
const { getAllAssessments,
     getIdeationRiskStats,
      getAssessmentTimeline, 
      getRiskByCareerStats,
      getRiskByGenderStats, 
      getRiskByAgeStats,
    getIdeationFrequencyStats,
    getBehaviorFrequencyStats,
    getEvaluationsByPsychologistStats
} = require('../controllers/statistics.controller');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdmin } = require('../middlewares/validate-roles');

const router = Router();

// Obtener estadísticas 
router.get('/all-assessments', [
    validateJWT,
    getAllAssessments
], );
router.get('/riskLevelStatic', [validateJWT,
    getIdeationRiskStats
], );
router.get('/timeEvaluatiomStatic', [validateJWT,
    getAssessmentTimeline
], );
router.get('/carrerRiskStatics', [validateJWT,
    getRiskByCareerStats
], );
router.get('/genderRiskStatics', [validateJWT,
    getRiskByGenderStats
], );
router.get('/ageRiskLevelStatics', [validateJWT,
    getRiskByAgeStats
], );
router.get('/questionsFrecuencyStatics', [validateJWT,
    getIdeationFrequencyStats
], );
router.get('/questionsBehaviorFrecuencyStatics', [validateJWT,
    getBehaviorFrequencyStats
], );
router.get('/psycologistEvaluations', [
    validateJWT,
    getEvaluationsByPsychologistStats
], );

module.exports = router;
