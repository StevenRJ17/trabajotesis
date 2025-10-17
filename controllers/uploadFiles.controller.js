const { response, request } = require('express');
const cloudinary = require('../helpers/cloudinary'); // Importa el objeto configurado de Cloudinary

const uploadImages = async (req = request, res = response) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Solo ADMIN o PSYCHOLOGIST pueden actualizar sus imágenes
        if (!['ADMIN', 'PSYCHOLOGIST'].includes(user.role)) {
            return res.status(403).json({ msg: 'Este usuario no puede tener imágenes personalizadas' });
        }

        let updateFields = {};

        // Función auxiliar para subir y eliminar la imagen anterior
        const processUpload = async (file, currentPublicId, folder) => {
            // file.path es la propiedad donde Multer-Storage-Disk guarda el archivo temporalmente
            const pathToFile = file[0].path; 

            // 1. Opcional: Eliminar la imagen anterior de Cloudinary para liberar espacio.
            if (currentPublicId) {
                // Obtener el Public ID del path completo
                const publicId = currentPublicId.split('/').pop().split('.')[0]; 
                await cloudinary.uploader.destroy(`${folder}/${publicId}`);
            }

            // 2. Subir el nuevo archivo a Cloudinary
            const result = await cloudinary.uploader.upload(pathToFile, {
                folder: `users/${folder}`, // Define una carpeta específica en Cloudinary (ej: users/profile)
            });

            // 3. Importante: Eliminar el archivo local creado por Multer
            // El archivo se crea en tu carpeta /uploads, que ahora solo usas como paso intermedio
            const fs = require('fs');
            fs.unlinkSync(pathToFile); 

            // 4. Devolver la URL completa y persistente
            return result.secure_url;
        };


        // --- PROCESAR IMAGEN DE PERFIL (img) ---
        if (req.files?.profileImage) {
            // El 'file' del Multer ahora está en el sistema de archivos local (ej: /uploads/users/...)
            const folderName = 'profile'; // Carpeta en Cloudinary
            const secure_url = await processUpload(req.files.profileImage, user.img, folderName);
            
            // Guardamos la URL COMPLETA que nos da Cloudinary
            updateFields.img = secure_url;
        }

        // --- PROCESAR IMAGEN DE PORTADA (coverImage) ---
        if (req.files?.coverImage) {
            const folderName = 'cover'; // Carpeta en Cloudinary
            const secure_url = await processUpload(req.files.coverImage, user.coverImage, folderName);
            
            // Guardamos la URL COMPLETA que nos da Cloudinary
            updateFields.coverImage = secure_url;
        }

        // 5. Actualizar el usuario en la BD con las URLs de Cloudinary
        Object.assign(user, updateFields);
        await user.save();

        res.json({
            msg: 'Imágenes actualizadas correctamente (usando Cloudinary)',
            user
        });

    } catch (error) {
        console.error('Cloudinary Error:', error);
        res.status(500).json({
            msg: 'Error al subir imágenes. Revisa el log del servidor.'
        });
    }
};
