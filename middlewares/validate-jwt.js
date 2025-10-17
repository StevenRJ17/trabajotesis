const jwt = require('jsonwebtoken');
const {User} = require('../models/user');

const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid, role } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        // Leer el usuario que corresponde al uid
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido - usuario no existe en DB'
            });
        }

        // Verificar si el usuario está activo
        if (!user.status) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido - usuario con estado false'
            });
        }

        req.user = user;
        req.uid = uid;
        // 🔑 CAMBIO CLAVE: Adjuntar el rol del usuario a la petición
        req.role = user.role; // Usamos el rol del usuario encontrado en la DB (más seguro)
        
        // Alternativamente, puedes usar el rol que viene directamente del token:
        // req.role = role; 
        
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validateJWT
};
