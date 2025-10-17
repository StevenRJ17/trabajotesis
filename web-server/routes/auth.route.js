const { Router } = require('express');
const {check} = require('express-validator');
const { login, validateToken,forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();


// Ruta para validar el token y obtener información del usuario
router.get('/', validateJWT, validateToken);

router.post('/login',[
    check('email', 'the email is not valid').isEmail(),
    check('password', 'the password is not valid').not().isEmpty(),
    validateFields
] ,login)
router.get('/me', validateJWT, async (req, res) => {
    res.json({ user: req.user });
  });

  // Ruta para enviar el correo de restablecimiento
router.post('/forgot-password', forgotPassword);

// Ruta para restablecer la contraseña (recibe el token como parámetro de URL)
router.post('/reset-password', resetPassword);
module.exports = router;
 