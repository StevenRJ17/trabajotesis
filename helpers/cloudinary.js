const cloudinary = require('cloudinary').v2;

// Configura Cloudinary usando variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Usa HTTPS para la entrega de activos
});

module.exports = cloudinary;