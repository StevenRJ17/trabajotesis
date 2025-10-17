const { request, response } = require('express');
const {User}  = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const nodemailer = require('nodemailer'); // Asegúrate de tenerlo importado
const jwt = require('jsonwebtoken');

const validateToken = async (req = request, res = response) => {
    try {
        // El usuario ya está validado por el middleware validateJWT
        const user = req.user;

        res.json({
            ok: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log('Error en validateToken:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        });
    }
}

const login = async (req, res= response) => {

    const { email, password } = req.body;
    
    try {
        // 1. Verificar si el usuario existe y está activo
        const user = await User.findOne({ email, status: true });
        if (!user) {
            return res.status(400).json({
                msg: "Usuario/contraseña no válidos"
            });
        }

        // 2. Verificar la contraseña
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario/contraseña no válidos"
            });
        }

        // 3. Generar el JWT
        const token = await generateJWT(user.id);

        // 4. Devolver respuesta
        res.json({
            msg: 'Login exitoso',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.log('Error en login:', error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail', // Usa tu proveedor (ej. 'sendgrid', 'smtp')
    auth: {
        user: process.env.EMAIL_USER, // Variable de .env
        pass: process.env.EMAIL_PASS  // Variable de .env (Contraseña de Aplicación)
    }
})

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        // 1. Verificar existencia y rol (Admin/Psychologist)
        if (!user || (user.role !== 'ADMIN' && user.role !== 'PSYCHOLOGIST')) {
            // Respuesta genérica de éxito para evitar la enumeración de usuarios
            return res.json({
                ok: true,
                msg: 'Si la dirección de correo electrónico es válida, recibirás un enlace de restablecimiento de contraseña.'
            });
        }
        
        // 2. Generar Token (usando JWT, puedes usar un UUID o crypto también)
        // Usaremos el ID del usuario como payload.
        const token = jwt.sign({ uid: user.id }, process.env.SECRETORPRIVATEKEY, { expiresIn: '1h' });
        
        // 3. Almacenar Token y Caducidad en DB
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        // 4. Enviar Correo
        // ⚠️ Nota: Reemplaza 'http://tu-frontend.com' con tu URL real
        const resetURL = `http://localhost:5173/reset-password/${token}`; 

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Restablecimiento de Contraseña',
            html: `<p>Has solicitado el restablecimiento de tu contraseña.</p>
                   <p>Haz clic en el siguiente enlace, o pégalo en tu navegador, para completar el proceso:</p>
                   <a href="${resetURL}">Restablecer Contraseña</a>
                   <p>Este enlace caducará en 1 hora.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.json({
            ok: true,
            msg: 'Se ha enviado un correo electrónico con el enlace de restablecimiento.'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error del servidor al intentar restablecer la contraseña.'
        });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // 1. Verificar el Token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        } catch (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Token de restablecimiento no válido o ha expirado.'
            });
        }

        const user = await User.findOne({ 
            _id: decoded.uid,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // $gt: greater than (mayor que)
        });

        // 2. Verificar Usuario y Expiración
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'El enlace de restablecimiento no es válido o ya ha expirado.'
            });
        }
        
        // 3. Hashear y Actualizar la Contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(newPassword, salt);
        
        // 4. Limpiar el token de la DB para invalidarlo
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // 🔑 CAMBIO CLAVE AQUÍ: Asegurar que el estado HTTP sea 200
        return res.status(200).json({ 
            ok: true,
            msg: 'Contraseña restablecida con éxito.'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error del servidor al intentar cambiar la contraseña.'
        });
    }
};
module.exports = { login, validateToken, forgotPassword, resetPassword }