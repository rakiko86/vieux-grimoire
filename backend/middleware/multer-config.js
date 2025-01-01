const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Types MIME autorisés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'image/webp': 'webp'
};

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = 'images';
    // Vérifie si le répertoire existe, sinon le crée
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    // Nettoie le nom de fichier
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('_')
      .replace(/[^a-z0-9_\-\.]/gi, ''); // Supprime les caractères spéciaux

    // Détermine l'extension
    const extension = MIME_TYPES[file.mimetype];
    if (!extension) {
      return callback(new Error('Type de fichier non autorisé'), false);
    }

    // Génère un nom unique
    callback(null, `${name}_${Date.now()}.${extension}`);
  }
});

// Middleware multer avec filtre de type de fichier
const fileFilter = (req, file, callback) => {
  if (MIME_TYPES[file.mimetype]) {
    callback(null, true);
  } else {
    callback(new Error('Type de fichier non supporté'), false);
  }
};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite la taille à 5 Mo
}).single('image');
