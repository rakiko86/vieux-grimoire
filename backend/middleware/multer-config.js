const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, name + Date.now() + '.webp');
    }
});

// Filtrage des fichiers pour accepter uniquement les images
const filter = (req, file, callback) => {
    if (file.mimetype.split("/")[0] === 'image') {
        callback(null, true);
    } else {
        callback(new Error("Les fichiers ne peuvent être que des images"));
    }
};

// Middleware pour l'upload de l'image
const upload = multer({ storage: storage, fileFilter: filter }).single('image');

// Optimisation de l'image
const optimize = (req, res, next) => {
    if (req.file) {
        const filePath = req.file.path; // Chemin de l'ancienne image
        const output = path.join('images', `opt_${req.file.filename}`); // Nouveau nom pour l'image optimisée

        sharp(filePath)
            .resize({ width: null, height: 568, fit: 'cover', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .webp()
            .toFile(output) // Écrire l'optimisée avec un nouveau nom
            .then(() => {
                // Supprimer l'ancienne image après avoir réussi à créer l'image optimisée
                fs.unlink(filePath, (err) => {
                    if (err) {
                        return next(err);
                    }
                    console.log('Ancienne image supprimée :', filePath);
                    req.file.path = output; // Met à jour le chemin vers l'image optimisée
                    next();
                });
            })
            .catch(err => next(err));
    } else {
        return next();
    }
};
module.exports = {
    upload,
    optimize,
};