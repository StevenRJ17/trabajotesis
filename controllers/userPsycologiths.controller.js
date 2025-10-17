const { response, request } = require('express');
const {User} = require('../models/user');




const getPsicologits= async(req = request, res = response) => {
    try {
        const latestPsychologist  = await User.find({ role: 'PSYCHOLOGIST' })
        .sort({ createdAt: -1 }) 
            .select('-password'); // Excluimos la contraseña de la respuesta

        if (!latestPsychologist ) {
            return res.status(404).json({
                msg: 'No se encontró ningún PSYCHOLOGIST'
            });
        }

        res.json({
            psychologists: latestPsychologist 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener datos del psicologo'
        });
    }
};

const updatePsicologo = async (req = request, res = response) => {
    // 1. Obtener el ID del psicólogo a actualizar.
    const { id } = req.params;
    
    // 2. Extraer el email y la contraseña específicamente, y el resto de datos con '...data'.
    const { email, password, ...data } = req.body; 
    
    // Objeto temporal para construir la actualización.
    let updateData = { ...data };

    try {
        // 3. Verificar que el psicólogo existe y obtener sus datos actuales.
        const psychologist = await User.findById(id);

        if (!psychologist) {
            return res.status(404).json({
                msg: 'Psicólogo no encontrado'
            });
        }
        
        // **********************************************
        // 4. VALIDACIÓN DE EMAIL ÚNICO (Basado en tu lógica de estudiante)
        // **********************************************
        if (email && email !== psychologist.email) {
            // Si el email se envió Y es diferente al email actual del usuario,
            // verificamos si ya existe en la base de datos (en el modelo User).
            
            // Usamos 'User' ya que el psicólogo es un User.
            const emailExists = await User.findOne({ email }); 
            
            // Verificamos que el email no esté ya tomado por CUALQUIER otro User.
            if (emailExists) {
                return res.status(400).json({
                    msg: 'El correo ya está registrado por otro usuario'
                });
            }
            
            // Si es único, agregamos el email a los datos a actualizar.
            updateData.email = email;
        }

        // **********************************************
        // 5. HASHING DE CONTRASEÑA (Si se incluyó)
        // **********************************************
        if (password) {
            const salt = bcrypt.genSaltSync();
            updateData.password = bcrypt.hashSync(password, salt);
        }

        // 6. Actualizar el psicólogo (User)
        // Pasamos el objeto 'updateData' que puede contener {firstName, lastName, email, password}
        const updatedPsychologist = await User.findByIdAndUpdate(id, updateData, { new: true })
            .select('-password'); // Excluimos la contraseña de la respuesta

        res.json({
            msg: 'Psicólogo actualizado exitosamente',
            psychologist: updatedPsychologist
        });

    } catch (error) {
        console.log(error);
        // Manejar errores de Mongoose (ej. validaciones de esquema)
        res.status(500).json({
            msg: 'Error al actualizar datos del psicólogo'
        });
    }
};


const bcrypt = require('bcryptjs'); // Asegúrate de importar bcryptjs

const changePasswordPsicologi = async (req = request, res = response) => {
    // 1. Asumimos que el ID del psicólogo viene de la autenticación (middleware)
    // Para simplificar, lo obtendremos del parámetro, pero en producción,
    // el 'id' debería venir de req.user.id (el usuario autenticado).
    const { id } = req.params; 
    
    // 2. Obtener los campos específicos que el frontend enviaría:
    const { currentPassword, newPassword } = req.body; 

    // 3. Validación inicial de campos
    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            msg: 'Debe proporcionar la contraseña actual y la nueva contraseña.'
        });
    }

    try {
        // 4. Buscar el usuario en la base de datos, incluyendo la contraseña.
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                msg: 'Usuario no encontrado.'
            });
        }

        // 5. Verificar que la contraseña actual sea correcta.
        // bcrypt.compareSync compara el texto plano (currentPassword) con el hash guardado (user.password).
        const validPassword = bcrypt.compareSync(currentPassword, user.password);

        if (!validPassword) {
            return res.status(401).json({
                msg: 'La contraseña actual proporcionada es incorrecta.'
            });
        }
        
        // 6. Si la contraseña actual es correcta, hashear la nueva contraseña.
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        // 7. Actualizar SÓLO el campo 'password'.
        const updatedPsychologist = await User.findByIdAndUpdate(
            id, 
            { password: hashedPassword }, 
            { new: true }
        ).select('-password'); // Excluir la contraseña de la respuesta.

        // 8. Respuesta exitosa.
        res.json({
            msg: 'Contraseña actualizada exitosamente.',
            psychologist: updatedPsychologist
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno al intentar cambiar la contraseña.'
        });
    }
};

module.exports={
    updatePsicologo,
    getPsicologits,
    changePasswordPsicologi
}