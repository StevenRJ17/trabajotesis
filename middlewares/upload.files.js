const multer = require('multer');
const path = require('path');
// const fs = require('fs'); // No es necesario si la carpeta 'uploads/users' ya existe

// --- CAMBIOS CLAVE ---
// 1. Mantenemos diskStorage para que el archivo tenga un .path
// 2. Simplificamos la lógica de destino asumiendo que el directorio existe
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // La carpeta debe existir. Si no existe, es mejor crearla en la inicialización del servidor,
        // no en cada subida, para simplificar.
        cb(null, 'uploads/users'); 
    },
    filename: (req, file, cb) => {
        // El nombre de archivo es necesario para el .path
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + file.fieldname + ext;
        cb(null, uniqueSuffix);
    }
});
// ---------------------

const fileFilter = (req, file, cb) => {
    const allowedExt = ['.jpg', '.jpeg', '.png']; // Agregué png, ya que es común
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) {
        return cb(new Error('Solo se permiten imágenes JPG, JPEG o PNG'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limitar a 5MB para Cloudinary Free
    }
});

module.exports = upload;