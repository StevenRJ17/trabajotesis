const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs'); // Necesario para hashear la contraseña

const UserSchema = Schema({
    firstName: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es requerido']
    },
    email:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    img:{ // Imagen de perfil
        type: String,
        default: ''
    },
    coverImage: { // Imagen de portada
        type: String,
        default: ''
    },
    role:{
        type: String, 
        required: true,
        enum: ['ADMIN', 'PSYCHOLOGIST', 'STUDENT'],
    },
    status:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    },
    createdAt: {
        timestamps: true,
        type: Date,
        default: Date.now
    },
    resetPasswordToken: { // Almacena el token de restablecimiento
        type: String,
        default: null
    },
    resetPasswordExpires: { // Almacena la fecha de caducidad del token (ej: 1 hora)
        type: Date,
        default: null
    }
});

// Método para transformar el objeto a JSON (ocultando password y __v, agregando uid y name)
UserSchema.methods.toJSON = function(){
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    user.name = `${this.firstName} ${this.lastName}`; 
    return user;
}

const User = model('User', UserSchema);

/**
 * Función que verifica si existe algún usuario en la DB. 
 * Si no existe, crea un usuario ADMINISTRADOR con credenciales por defecto.
 */
const initializeAdminUser = async () => {
    // Credenciales del administrador por defecto
    const defaultAdmin = {
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@system.com',
        // Utiliza una variable de entorno en producción: process.env.DEFAULT_ADMIN_PASSWORD
        password: 'password_seguro_default_123', 
        role: 'ADMIN'
    };

    try {
        console.log('\n======================================================');
        console.log('--- Proceso de Inicialización de Administrador ---');

        // 1. Verificar si ya existe algún usuario en la base de datos
        const userCount = await User.countDocuments();
        
        if (userCount === 0) {
            console.log('🚨 ¡ADVERTENCIA! No se encontraron usuarios. Iniciando creación de ADMIN por defecto.');

            // 2. Hashear la contraseña (CRUCIAL para seguridad)
            const salt = bcrypt.genSaltSync();
            const hashedPassword = bcrypt.hashSync(defaultAdmin.password, salt);
            
            // 3. Crear y guardar el nuevo usuario administrador
            const adminUser = new User({
                ...defaultAdmin,
                password: hashedPassword // Usar la contraseña hasheada
            });

            await adminUser.save();
            
            console.log(`✅ ¡ÉXITO! Usuario Administrador por defecto creado y guardado en DB.`);
            console.log(`   Email: ${defaultAdmin.email}`);
            console.log(`   Rol: ${defaultAdmin.role}`);
            console.log(`   Contraseña por defecto (PLANA): ${defaultAdmin.password}`);
            console.log('   *** ¡RECUERDE CAMBIAR ESTA CONTRASEÑA DE INMEDIATO! ***');
        } else {
            // Si hay usuarios, se omite la creación
            console.log(`✅ Base de datos inicializada. Total de usuarios encontrados: ${userCount}.`);
            console.log('   La creación automática del administrador fue omitida.');
        }

        console.log('--- Proceso de Inicialización Finalizado ---');
        console.log('======================================================\n');

    } catch (error) {
        console.error('❌ ERROR CRÍTICO en la inicialización de administrador:', error);
    }
};

module.exports = {
    User, // Exporta el modelo para usarlo en controladores y rutas
    initializeAdminUser // Exporta la función para llamarla al iniciar el servidor
};