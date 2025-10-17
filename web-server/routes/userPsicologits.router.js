const { Router } = require('express');
const { check } = require('express-validator');

const { getPsicologits, updatePsicologo,changePasswordPsicologi  } = require('../controllers/userPsycologiths.controller');
const { validateJWT } = require('../middlewares/vlaidate-jwt');
const { esEmailValid } = require('../helpers/db-validator');


const router = Router();

router.get('/getPsicologo', [
    validateJWT
], getPsicologits)
router.put('/updatePsicologi/:id', [
    validateJWT,
    check('email').custom(esEmailValid)
], updatePsicologo)
router.put('/:id/changePasswordPsicologi', [
    validateJWT
], changePasswordPsicologi)


module.exports = router; 